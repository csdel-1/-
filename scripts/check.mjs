import {readFile, readdir, stat} from 'node:fs/promises';
import {dirname, extname, resolve, relative, sep} from 'node:path';
import {fileURLToPath} from 'node:url';
import {home} from '../src/home.mjs';
import {pages} from '../src/content.mjs';
import {config} from '../src/site-config.mjs';
import {mapEmbed, naverDirections, naverSearch} from '../src/maps.mjs';
import {existingCases} from '../src/cases-data.mjs';

// Inspect generated output, including references across pages, without dependencies.
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const origin = new URL(config.siteUrl);
const indexable = [home, ...pages];
const generated = [...indexable.map(p => p.file), '404.html'];
const expectedNav = [['/services.html','업무분야'],['/personal-rehabilitation.html','개인회생'],['/personal-bankruptcy.html','개인파산'],['/cases.html','성공사례'],['/consult.html','상담안내'],['/location.html','오시는 길']];
const errors = [], docs = new Map(), scripts = new Set(), styles = new Set();
const seen = {title:new Map(), description:new Map(), canonical:new Map()};
const stats = {pages:0, indexable:0, refs:0, anchors:0, images:0, schemaNodes:0, htmlBytes:0};
let commonHeader;
const expect = (ok, file, message) => {if (!ok) errors.push(`${file}: ${message}`);};
const all = (text, re) => [...text.matchAll(re)];
const decode = text => String(text).replace(/&(?:amp|quot|apos|lt|gt|#39|#(\d+)|#x([\da-f]+));/gi, (entity,d,h) => d || h ? String.fromCodePoint(parseInt(d || h,h ? 16 : 10)) : ({'&amp;':'&','&quot;':'"','&apos;':"'",'&#39;':"'",'&lt;':'<','&gt;':'>'}[entity.toLowerCase()] || entity));
const plain = text => decode(text.replace(/<[^>]*>/g,'')).replace(/\s+/g,' ').trim();
const attrs = tag => Object.fromEntries(all(tag,/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g).map(m => [m[1].toLowerCase(),decode(m[2] ?? m[3])]));
const meta = (html,name) => all(html,/<meta\b[^>]*>/gi).map(m => attrs(m[0])).filter(a => a.name === name);
const urlFor = file => config.siteUrl + (file === 'index.html' ? '/' : '/' + file);
const unique = (type,value,file) => {expect(Boolean(value),file,`${type} 없음`);expect(!seen[type].has(value),file,`${type} 중복 (${seen[type].get(value)})`);seen[type].set(value,file);};

for (const file of generated) {
  try {
    const html = await readFile(resolve(root,file),'utf8');
    const ids = all(html,/\bid\s*=\s*(?:"([^"]+)"|'([^']+)')/g).map(m => decode(m[1] ?? m[2]));
    expect(ids.length === new Set(ids).size,file,'id 중복');
    docs.set(file,{html,ids:new Set(ids)});
  } catch (e) {errors.push(`${file}: 출력 읽기 실패 (${e.message})`);}
}

async function local(value,from,kind) {
  if (!value || /^(?:data:|blob:|tel:|mailto:)/i.test(value)) return;
  if (/^(?:javascript:|vbscript:)/i.test(value)) return expect(false,from,`실행형 ${kind}: ${value}`);
  let url;
  try {url = new URL(value,urlFor(from));} catch {return expect(false,from,`잘못된 ${kind}: ${value}`);}
  if (url.origin !== origin.origin) return;
  const path = decodeURIComponent(url.pathname);
  const target = resolve(root,'.' + path + (path.endsWith('/') ? 'index.html' : ''));
  if (!target.startsWith(root + sep)) return expect(false,from,`사이트 밖의 ${kind}: ${value}`);
  try {if (!(await stat(target)).isFile()) throw Error('not a file');} catch {return expect(false,from,`없는 로컬 ${kind}: ${value}`);}
  stats.refs++;
  if (extname(target) === '.js') scripts.add(target);
  if (extname(target) === '.css') styles.add(target);
  if (url.hash) {
    stats.anchors++;
    const name = relative(root,target).split(sep).join('/');
    const id = decodeURIComponent(url.hash.slice(1));
    expect(docs.get(name)?.ids.has(id),from,`없는 앵커: ${value}`);
  } else expect(!value.endsWith('#'),from,`빈 앵커: ${value}`);
}

for (const [file,{html,ids}] of docs) {
  stats.pages++; stats.htmlBytes += Buffer.byteLength(html);
  expect(/<html\b[^>]*\blang=["']ko["']/i.test(html),file,'lang="ko" 필요');
  expect(all(html,/<h1\b/gi).length === 1,file,'H1은 정확히 하나 필요');
  expect(/<meta\b[^>]*name="viewport"[^>]*width=device-width/i.test(html),file,'모바일 viewport 없음');
  const titleTags = all(html,/<title\b[^>]*>([\s\S]*?)<\/title>/gi);
  const descTags = meta(html,'description');
  const canonicalTags = all(html,/<link\b[^>]*>/gi).map(m => attrs(m[0])).filter(a => a.rel === 'canonical');
  expect(titleTags.length === 1 && descTags.length === 1 && canonicalTags.length === 1,file,'title/description/canonical 각각 하나 필요');
  const title = plain(titleTags[0]?.[1] || ''), description = descTags[0]?.content || '', canonical = canonicalTags[0]?.href || '';
  unique('title',title,file); unique('description',description,file); unique('canonical',canonical,file);
  expect(canonical === urlFor(file),file,'canonical 운영 도메인·페이지 경로 오류');
  const original = indexable.find(p => p.file === file);
  if (original) expect(title === original.title && description === original.description,file,'원본과 출력 불일치: build 먼저 실행');
  const robots = meta(html,'robots');
  const noindex = /(?:^|[,\s])noindex(?:$|[,\s])/i.test(robots[0]?.content || '');
  expect(robots.length === 1 && (file === '404.html' ? noindex : !noindex && /^index\b/.test(robots[0]?.content || '')),file,'페이지별 색인 지시 오류');
  if (!noindex) stats.indexable++;

  const header = html.match(/<header\b[\s\S]*?<\/header>/i)?.[0] || '';
  const normalized = header.replace(/\saria-current=["'][^"']*["']/g,'');
  if (!commonHeader) commonHeader = normalized;
  expect(Boolean(header) && normalized === commonHeader,file,'공통 헤더 불일치');
  const nav = header.match(/<nav\b[^>]*id="main-nav"[^>]*>([\s\S]*?)<\/nav>/i)?.[1] || '';
  const links = all(nav,/<a\b([^>]*)>([\s\S]*?)<\/a>/gi).map(m => ({...attrs(m[1]),label:plain(m[2])}));
  expect(JSON.stringify(links.map(a => [a.href,a.label])) === JSON.stringify(expectedNav),file,'메뉴 순서·주소·이름 불일치');
  for (const a of links) expect(a.href === '/' + file ? a['aria-current'] === 'page' : !a['aria-current'],file,`현재 메뉴 오류: ${a.href}`);
  expect(/aria-controls="main-nav"/.test(header) && /aria-expanded="false"/.test(header),file,'모바일 메뉴 접근성 속성 없음');
  expect(/class="skip-link"[^>]*href="#content"/.test(html) && ids.has('content'),file,'본문 바로가기 없음');
  for (const m of all(html,/\baria-(?:controls|labelledby|describedby)=["']([^"']+)["']/gi)) for (const id of m[1].split(/\s+/)) expect(ids.has(id),file,`없는 ARIA 대상: ${id}`);

  const schema = all(html,/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
  expect(schema.length === 1,file,'JSON-LD graph 하나 필요');
  try {
    const data = JSON.parse(schema[0]?.[1] || '{}');
    expect(data['@context'] === 'https://schema.org' && Array.isArray(data['@graph']),file,'schema graph 형식 오류');
    const graph = data['@graph'] || [], nodes = type => graph.filter(n => n['@type'] === type);
    for (const type of ['LegalService','WebSite','WebPage']) expect(nodes(type).length === 1,file,`${type} schema 하나 필요`);
    const office = nodes('LegalService')[0] || {}, site = nodes('WebSite')[0] || {}, page = nodes('WebPage')[0] || {};
    expect(office.name === '법무사 안상재 사무소' && office['@id'] === config.siteUrl + '/#office' && office.telephone === '+82-10-6429-4797',file,'사무소 schema 명칭·전화·식별자 오류');
    expect(office.address?.streetAddress === '둔산중로78번길 40, 봉화빌딩 402호' && office.address?.addressLocality === '서구' && office.address?.addressRegion === '대전광역시' && office.address?.addressCountry === 'KR',file,'사무소 schema 주소 오류');
    expect(site['@id'] === config.siteUrl + '/#website' && site.publisher?.['@id'] === office['@id'],file,'WebSite 연결 오류');
    expect(page.url === canonical && page['@id'] === canonical + '#webpage' && page.name === title && page.description === description && page.inLanguage === 'ko-KR',file,'WebPage 메타데이터 불일치');
    expect(page.isPartOf?.['@id'] === site['@id'] && page.about?.['@id'] === office['@id'],file,'WebPage graph 관계 오류');
    expect(!graph.some(n => /Review|AggregateRating/.test(n['@type'] || '') || n.aggregateRating || n.review),file,'미검증 리뷰·평점 schema 금지');
    if (file !== 'index.html') {const crumbs = nodes('BreadcrumbList')[0]?.itemListElement;expect(nodes('BreadcrumbList').length === 1 && crumbs?.length === 2 && crumbs[0].position === 1 && crumbs[0].item === config.siteUrl + '/' && crumbs[1].position === 2 && crumbs[1].item === canonical,file,'BreadcrumbList 오류');}
    stats.schemaNodes += graph.length;
  } catch (e) {errors.push(`${file}: JSON-LD 파싱 실패 (${e.message})`);}

  expect(!/<(?:form|input|textarea|select)\b/i.test(html) && !/\bonsubmit\s*=/i.test(html),file,'승인되지 않은 개인정보 접수 양식');
  expect(html.includes('tel:01064294797'),file,'실제 전화 연결 없음');
  for (const m of all(html,/<(?:a|img|source|script|link|iframe)\b[^>]*>/gi)) {
    const a = attrs(m[0]);
    if (a.href !== undefined) await local(a.href,file,'href');
    if (a.src !== undefined) await local(a.src,file,'src');
    if (a.srcset) for (const item of a.srcset.split(',')) await local(item.trim().split(/\s+/)[0],file,'srcset');
    if (/^<img\b/i.test(m[0])) {stats.images++;expect(Boolean(a.alt?.trim()),file,`이미지 설명 없음: ${a.src}`);expect(/^[1-9]\d*$/.test(a.width || '') && /^[1-9]\d*$/.test(a.height || ''),file,`이미지 고유 크기 없음: ${a.src}`);}
    if (/^<iframe\b/i.test(m[0])) expect(a.src === mapEmbed && Boolean(a.title?.includes('둔산중로78번길 40')) && a.loading === 'lazy' && a.referrerpolicy === 'no-referrer' && Number(a.width) > 0 && Number(a.height) > 0,file,'실제 지도 iframe 주소·접근성·로딩 속성 오류');
    if (a.target === '_blank') expect(/\bnoopener\b/.test(a.rel || '') && /\bnoreferrer\b/.test(a.rel || ''),file,`외부 창 보안 속성 없음: ${a.href}`);
  }
  for (const m of all(html,/<meta\b[^>]*>/gi)) {const a = attrs(m[0]);if (a.property === 'og:image') await local(a.content,file,'og:image');}
}
for (const path of scripts) {
  const js = await readFile(path,'utf8');
  expect(!/addEventListener\s*\(\s*['"]submit['"]|\.onsubmit\s*=|\b(?:localStorage|sessionStorage|indexedDB)\b|\bfetch\s*\(|\bXMLHttpRequest\b|\bsendBeacon\s*\(/.test(js),relative(root,path),'무접수·무분석 안내와 다른 저장·전송 코드 검토 필요');
}
for (const path of styles) for (const m of all(await readFile(path,'utf8'),/url\(\s*['"]?([^)'"\s]+)['"]?\s*\)/gi)) await local(m[1],relative(root,path).split(sep).join('/'),'CSS url');
try {
  const sitemap = await readFile(resolve(root,'sitemap.xml'),'utf8');
  const locs = all(sitemap,/<loc>([^<]+)<\/loc>/g).map(m => decode(m[1]));
  const expected = indexable.map(p => urlFor(p.file));
  expect(locs.length === 13 && new Set(locs).size === 13 && expected.every(u => locs.includes(u)) && locs.every(u => expected.includes(u)),'sitemap.xml','13개 색인 URL 정확히 필요: 누락·중복·404 포함 확인');
  expect(/xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9"/.test(sitemap),'sitemap.xml','네임스페이스 오류');
  const robots = await readFile(resolve(root,'robots.txt'),'utf8');
  expect(/^User-agent:\s*\*\s*$/mi.test(robots) && /^Allow:\s*\/\s*$/mi.test(robots) && !/^Disallow:\s*\/\s*$/mi.test(robots),'robots.txt','검색 로봇 공개 설정 오류');
  expect(robots.split(/\r?\n/).some(line => line.trim() === `Sitemap: ${config.siteUrl}/sitemap.xml`),'robots.txt','운영 사이트맵 주소 오류');
  expect((await readFile(resolve(root,'CNAME'),'utf8')).trim() === origin.hostname,'CNAME','운영 도메인 불일치');
} catch (e) {errors.push(`검색 설정: ${e.message}`);}
const coords = config.officeCoordinates, hasMap = Boolean(config.naverMapKeyId && coords);
expect(!config.naverMapKeyId || Boolean(coords),'src/site-config.mjs','지도 Key ID 사용 시 검증 좌표 필요');
if (hasMap) expect(Number.isFinite(coords.lat) && Number.isFinite(coords.lng) && Math.abs(coords.lat) <= 90 && Math.abs(coords.lng) <= 180,'src/site-config.mjs','유효한 숫자형 지도 좌표 필요');
for (const [file,{html}] of docs) {
  expect(/<script\b[^>]*src="\/js\/naver-map\.js"/.test(html) === (file === 'location.html' && hasMap),file,'지도 설정·어댑터 삽입 불일치');
  for (const [name,token] of [['naver-site-verification',config.naverVerification],['google-site-verification',config.googleVerification]]) {const tokens=[].concat(token).filter(Boolean),values=meta(html,name);expect(values.length===tokens.length && new Set(values.map(v=>v.content)).size===values.length && tokens.every(t=>values.some(v=>v.content===t)),file,`${name} 계정별 실제 설정과 출력 불일치`);}
}
const location = docs.get('location.html');
const caseHtml = docs.get('cases.html')?.html || '';
expect(existingCases.length === 20 && existingCases.filter(c=>c.type==='rehab').length === 12 && existingCases.filter(c=>c.type==='bankruptcy').length === 8,'cases.html','기존 사례 20건(회생12·파산8) 누락 확인');
expect(all(caseHtml, /<article\b[^>]*data-case-type=/g).length === 20,'cases.html','정적 HTML에 기존 사례 20건 필요');
const escapeCase = text=>String(text).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
for(const entry of existingCases){
  const article = caseHtml.match(new RegExp(`<article[^>]*id="${entry.id}"[^>]*>([\\s\\S]*?)</article>`))?.[1] || '';
  for(const key of ['title','story','debtBefore','result','debtBeforeLabel','resultLabel','date','author','region','status']) expect(article.includes(escapeCase(entry[key])),'cases.html',`${entry.id} 원문 ${key} 누락·변경 확인`);
}
for(const [file,{html}] of docs)expect(!/토요일|주말/.test(html),file,'사용자가 제외한 주말 안내 재등장');
expect(location?.ids.has('naver-map') && location?.ids.has('map-status') && /https:\/\/map\.naver\.com\/p\/search\//.test(location?.html || ''),'location.html','실제 네이버 주소 검색·지도 상태 영역 없음');
for (const file of ['index.html','location.html']) {
  const html = docs.get(file)?.html || '';
  const frames = all(html,/<iframe\b[^>]*>/gi).map(m => attrs(m[0]));
  expect(frames.length === 1 && frames[0].src === mapEmbed,file,'실제 OpenStreetMap 삽입 지도 하나 필요');
  const hrefs = all(html,/<a\b[^>]*>/gi).map(m => attrs(m[0]).href);
  expect(hrefs.includes(naverDirections),file,'검증된 실제 네이버 목적지 길찾기 연결 없음');
  expect(hrefs.includes('https://www.openstreetmap.org/copyright'),file,'OpenStreetMap 출처 표시 없음');
}
expect(all(location?.html || '',/<a\b[^>]*>/gi).some(m => attrs(m[0]).href === naverSearch),'location.html','실제 네이버 주소 검색 연결 불일치');
if (coords) {const marker = new URL(mapEmbed).searchParams.get('marker')?.split(',').map(Number);expect(marker?.[0] === coords.lat && marker?.[1] === coords.lng,'src/maps.mjs','검증된 건물 좌표와 삽입 지도 마커 불일치');}
const htmlFiles = (await readdir(root)).filter(name => name.endsWith('.html'));
expect(htmlFiles.length === 14 && htmlFiles.every(name => generated.includes(name)),'사이트 루트','생성 목록 밖 HTML 검토 필요');
expect(stats.pages === 14 && stats.indexable === 13,'전체 페이지','14개 출력·13개 색인 페이지 필요');
if (errors.length) {process.stderr.write(`FAIL: ${errors.length}개 문제\n${errors.map(e => '- ' + e).join('\n')}\n`);process.exitCode = 1;}
else {
  process.stdout.write(`PASS: ${stats.pages} pages (${stats.indexable} indexable + noindex 404)\n`);
  process.stdout.write(`Metadata, H1, shared navigation, ${stats.schemaNodes} schema nodes, ${stats.refs} local references, ${stats.anchors} anchors, ${stats.images} image elements verified.\n`);
  process.stdout.write(`Sitemap/robots/CNAME, privacy-safe contact flow, 2 actual OSM map embeds and Naver directions verified. Optional Naver SDK: ${hasMap ? 'configured' : 'disabled (no key)'}. HTML total: ${(stats.htmlBytes / 1024).toFixed(1)} KiB.\n`);
}
