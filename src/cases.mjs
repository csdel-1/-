import {kakao, external} from './parts.mjs';
import {existingCases} from './cases-data.mjs';
import {render2026CaseCards, caseNote2026} from './cases-2026.mjs';

const esc = value => String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const label = type => type === 'rehab' ? '개인회생' : '개인파산·면책';

export function renderCases() {

  return `<section class="section case-section" aria-labelledby="case-list-title"><div class="container" data-case-browser>
    <div class="section-head"><div><h2 id="case-list-title">개인회생·개인파산 사례</h2></div><p>채무가 생긴 배경과 진행 결과를 함께 살펴보세요. 직업·채무 유형별로 풀어 쓴 글은 사건 자료를 당사자 관점으로 재구성했습니다.</p></div>
    <div class="case-filters" role="group" aria-label="성공사례 종류" hidden>${[['all','전체'],['rehab','개인회생'],['bankruptcy','개인파산·면책']].map(([type,name]) => `<button type="button" data-case-filter="${type}" aria-pressed="${type === 'all'}" aria-controls="case-list">${name}</button>`).join('')}</div>
    <div class="case-list-heading"><p class="case-count" role="status" aria-live="polite">전체 사례</p></div>
    <div class="case-grid case-narrative-grid" id="case-list">${[...existingCases].reverse().map(c => `<article class="case-card case-narrative-card" id="${esc(c.id)}" data-case-type="${esc(c.type)}">
      <div class="case-meta"><span class="case-category">${label(c.type)}</span><span>${esc(c.date)}</span></div>
      <h3>${esc(c.title)}</h3>
      <div class="case-narrative-story"><p>${esc(c.story)}</p></div>
      <p class="case-author">${esc(c.author)} <br><span>${esc(c.region)}${c.status ? ' · '+esc(c.status) : ''}</span></p>
      <dl class="case-narrative-facts"><div><dt>${esc(c.debtBeforeLabel)}</dt><dd>${esc(c.debtBefore)}</dd></div><div><dt>${esc(c.resultLabel)}</dt><dd>${esc(c.result)}</dd></div></dl>
    </article>`).join('')}${render2026CaseCards()}</div>
    <p class="note case-result-note">기존 홈페이지에 게재된 사례입니다. 개인정보 보호를 위해 이름은 비실명으로 표시합니다. 사례별 결과는 해당 사건의 사정에 따른 것으로, 다른 사건에서 같은 결과를 보장하지 않습니다.</p>
    ${caseNote2026}
    <div class="case-next-step"><div><h2>내 상황에서는 어떤 절차가 맞을까요?</h2><p>채무 규모뿐 아니라 소득·재산·생활 여건을 함께 확인합니다.</p></div><a class="button primary" href="${kakao}" ${external}>카카오톡 문의하기 <span aria-hidden="true">↗</span></a></div>
  </div></section>`;
}
