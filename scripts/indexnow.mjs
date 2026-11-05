// 배포 후 바뀐 주소를 IndexNow로 알립니다. 네이버·빙 등 참여 검색엔진이 서로 공유합니다.
//   node scripts/indexnow.mjs            → sitemap.xml의 모든 주소
//   node scripts/indexnow.mjs /a.html    → 지정한 주소만
// 키 파일(<키>.txt)은 사이트 루트에 그대로 두어야 합니다.
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {config} from '../src/site-config.mjs';

const key = 'a5c71fa9a1b77007aa2893584c051d30';
const root = resolve(import.meta.dirname, '..');
const host = new URL(config.siteUrl).host;
const args = process.argv.slice(2);
const urlList = args.length
  ? args.map(path => new URL(path, config.siteUrl).href)
  : [...(await readFile(resolve(root, 'sitemap.xml'), 'utf8')).matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
const body = JSON.stringify({host, key, keyLocation: `${config.siteUrl}/${key}.txt`, urlList});
for (const endpoint of ['https://searchadvisor.naver.com/indexnow', 'https://api.indexnow.org/indexnow']) {
  try {
    const res = await fetch(endpoint, {method: 'POST', headers: {'Content-Type': 'application/json; charset=utf-8'}, body});
    process.stdout.write(`${endpoint}: ${res.status} ${res.statusText} (${urlList.length}개 주소)\n`);
  } catch (error) {
    process.stdout.write(`${endpoint}: 전송 실패 (${error.message})\n`);
  }
}
