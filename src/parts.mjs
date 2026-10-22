// Shared building blocks for page bodies (content.mjs, guides.mjs).
export const tel = 'tel:01064294797';
export const kakao = 'https://open.kakao.com/o/swmhzizg';
export const external = 'target="_blank" rel="noopener noreferrer"';
export const courtR = 'https://slb.scourt.go.kr/rel/guide/personal_r/index.jsp';
export const courtB = 'https://slb.scourt.go.kr/rel/guide/personal_b/index.jsp';
export const section = (html, extra = '') => `<section class="section ${extra}"><div class="container">${html}</div></section>`;
// The first argument used to print an English eyebrow above each heading; it is kept only as a readable label in the source.
export const head = (label, title, text = '') => `<div class="section-head"><div><h2>${title}</h2></div>${text ? `<p>${text}</p>` : ''}</div>`;
export const card = (num, title, text, href = '', label = '자세히 알아보기') => `<article class="card"><span class="card-no">${num}</span><h3>${title}</h3><p>${text}</p>${href ? `<a class="text-link" href="${href}">${label} <span aria-hidden="true">↗</span></a>` : ''}</article>`;
export const faq = (items) => `<div class="faq-list">${items.map(([q, a]) => `<details><summary>${q}</summary><div><p>${a}</p></div></details>`).join('')}</div>`;
export const related = (links) => `<div class="guide-related" aria-label="함께 보면 좋은 안내"><span>함께 보면 좋은 안내</span>${links.map(([href, label]) => `<a href="${href}">${label} <span aria-hidden="true">↗</span></a>`).join('')}</div>`;
export const note = '<p class="note">이 페이지는 제도에 관한 일반 안내입니다. 신청 가능 여부, 변제금, 소요 기간과 결과는 개별 사정 및 법원의 판단에 따라 달라집니다.</p>';
export const source = (url, label, checkedDate = '') => `<p class="note">공식 제도 안내: <a href="${url}" ${external}>${label} <span aria-hidden="true">↗</span></a>${checkedDate ? ` · 출처 확인 <time datetime="${checkedDate}">${checkedDate.replaceAll('-', '.')}</time>` : ''} · 실제 신청 시 최신 기준과 관할 법원의 안내를 확인합니다.</p>`;
