import {kakao, external} from './parts.mjs';
import {existingCases} from './cases-data.mjs';
import {render2026Cases} from './cases-2026.mjs';

const esc = value => String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const label = type => type === 'rehab' ? '개인회생' : '개인파산·면책';

export function renderCases() {
  const counts = {all:existingCases.length,rehab:existingCases.filter(c => c.type === 'rehab').length,bankruptcy:existingCases.filter(c => c.type === 'bankruptcy').length};
  return render2026Cases() + `<section class="section case-section"><div class="container" data-case-browser>
    <div class="section-head"><div><h2>다시 시작한 이야기</h2></div><p>기존 홈페이지에 소개한 사례 ${counts.all}건입니다. <br>채무가 생긴 배경과 진행 결과를 함께 살펴보세요.</p></div>
    <div class="case-filters" role="group" aria-label="성공사례 종류" hidden>${[['all','전체'],['rehab','개인회생'],['bankruptcy','개인파산·면책']].map(([type,name]) => `<button type="button" data-case-filter="${type}" aria-pressed="${type === 'all'}" aria-controls="case-list">${name}<span>${counts[type]}</span></button>`).join('')}</div>
    <div class="case-list-heading"><p class="case-count" role="status" aria-live="polite">전체 ${counts.all}건</p><p>최근 사례부터 표시합니다.</p></div>
    <div class="case-grid" id="case-list">${[...existingCases].reverse().map(c => `<article class="case-card" id="${esc(c.id)}" data-case-type="${esc(c.type)}">
      <div class="case-meta"><span class="case-category">${label(c.type)}</span><span>${esc(c.date)}</span></div>
      <h3>${esc(c.title)}</h3>
      <dl class="case-outcome"><div><dt>${esc(c.debtBeforeLabel)}</dt><dd>${esc(c.debtBefore)}</dd></div><div><dt>${esc(c.resultLabel)}</dt><dd>${esc(c.result)}</dd></div></dl>
      <details class="case-details"><summary>사례 자세히 보기<span aria-hidden="true">＋</span></summary><div class="case-story"><p>${esc(c.story)}</p><p class="case-author">${esc(c.author)} <br><span>${esc(c.region)}${c.status ? ' · '+esc(c.status) : ''}</span></p></div></details>
    </article>`).join('')}</div>
    <p class="note case-result-note">기존 홈페이지에 게재된 사례입니다. 개인정보 보호를 위해 이름은 비실명으로 표시합니다. 사례별 결과는 해당 사건의 사정에 따른 것으로, 다른 사건에서 같은 결과를 보장하지 않습니다.</p>
    <div class="case-next-step"><div><h2>내 상황에서는 어떤 절차가 맞을까요?</h2><p>채무 규모뿐 아니라 소득·재산·생활 여건을 함께 확인합니다.</p></div><a class="button primary" href="${kakao}" ${external}>카카오톡 문의하기 <span aria-hidden="true">↗</span></a></div>
  </div></section>`;
}
