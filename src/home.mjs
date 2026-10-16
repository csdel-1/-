import {officeMap, naverDirections} from './maps.mjs';

const drawings = {
  plan: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V2h6v2M9 9h6M9 13h6M9 17h3"/>',
  sunrise: '<path d="M3 17h18M5 21h14M7 17a5 5 0 0 1 10 0M12 3v3M4.2 8.2l2.1 2.1M19.8 8.2l-2.1 2.1"/>',
  compare: '<path d="M12 3v18M7 21h10M3 7h18M5 7l-3 7h6L5 7ZM19 7l-3 7h6l-3-7Z"/>',
  chat: '<path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5H5l-3 2v-8.5A8.5 8.5 0 0 1 10.5 5H13"/><path d="M16 3h5v5M21 3l-9 9"/>',
  debt: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18M7 15h4M16 15h1"/>',
  business: '<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V4h8v3M3 12a20 20 0 0 0 18 0M10 13h4v3h-4z"/>',
  time: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  route: '<circle cx="6" cy="5" r="2"/><circle cx="18" cy="19" r="2"/><path d="M6 7v9a3 3 0 0 0 6 0V8a3 3 0 0 1 6 0v9"/>',
  listen: '<path d="M4 13v-2a8 8 0 0 1 16 0v2M4 12H2v7h4v-7H4ZM20 12h2v7h-4v-7h2ZM20 19v1a2 2 0 0 1-2 2h-4"/>',
  explain: '<path d="M4 4h16v12H9l-5 4V4ZM8 8h8M8 12h5"/>',
  document: '<path d="M6 2h8l4 4v16H6V2ZM14 2v5h4M9 11h6M9 15h6M9 19h4"/>',
  check: '<path d="M12 2l8 3v6c0 5-5 9-8 11-3-2-8-6-8-11V5l8-3Z"/><path d="M8 12l3 3 5-6"/>',
  pin: '<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
  phone: '<path d="M8 3l3 5-3 2a15 15 0 0 0 6 6l2-3 5 3-1 4c-1 3-7 0-12-5S0 4 3 3l5-1Z"/>'
};
const icon = name => `<svg class="ref-icon" viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.45" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${drawings[name] || drawings.check}</svg>`;

export const home = {
  file: 'index.html', label: '홈', title: '대전 개인회생·개인파산 상담 | 법무사 안상재 사무소',
  description: '대전 개인회생과 개인파산, 나에게 맞는 절차부터 차분히. 신청 조건·비용·준비 서류와 상담 안내. 대전 둔산동 봉화빌딩 402호, 법무사 안상재 사무소 010-6429-4797.',
  body: `
<section class="home-hero ref-hero" aria-labelledby="home-title">
  <div class="hero-copy"><div class="hero-copy-inner">
    <span class="kicker"><span class="gold-line"></span> 2004년부터 이어온 개인회생 실무 경험</span>
    <h1 id="home-title">빚 때문에 막막한 오늘,<br><em>다시 시작할 방법을</em><br>함께 찾겠습니다.</h1>
    <p class="hero-subtitle">대전 개인회생 · 개인파산 상담</p>
    <p class="hero-description">지금의 상황을 먼저 듣고,<br>필요한 절차와 준비를 차분히 안내합니다.</p>
    <div class="hero-actions"><a class="button primary" href="/consult.html">상담 문의 <span aria-hidden="true">↗</span></a><a class="button outline" href="tel:01064294797">010-6429-4797 <span aria-hidden="true">↗</span></a></div>
    <div class="ref-hero-flags"><span>${icon('listen')}개인별 상황 확인</span><span>${icon('pin')}대전 둔산동 상담</span><span>${icon('document')}절차·비용 안내</span></div>
  </div></div>
  <figure class="hero-visual"><img src="/assets/renewal/legal-hero-v2.webp" srcset="/assets/renewal/legal-hero-v2-768.webp 768w, /assets/renewal/legal-hero-v2.webp 1536w" sizes="(max-width:760px) 100vw, 56vw" width="1536" height="1024" fetchpriority="high" alt="짙은 남색 배경에 놓인 황동 저울과 법률 서적"></figure>
</section>

<section class="ref-quick" id="start" aria-label="빠른 업무 안내"><div class="container ref-quick-grid">
  <a href="/personal-rehabilitation.html"><span class="ref-quick-icon">${icon('plan')}</span><span class="ref-quick-copy"><small>꾸준한 수입이 있다면</small><strong>개인회생</strong></span><span class="ref-quick-arrow" aria-hidden="true">↗</span></a>
  <a href="/personal-bankruptcy.html"><span class="ref-quick-icon">${icon('sunrise')}</span><span class="ref-quick-copy"><small>갚을 여력이 부족하다면</small><strong>개인파산·면책</strong></span><span class="ref-quick-arrow" aria-hidden="true">↗</span></a>
  <a href="/debt-adjustment.html"><span class="ref-quick-icon">${icon('compare')}</span><span class="ref-quick-copy"><small>나에게 맞는 방법은</small><strong>채무조정 비교</strong></span><span class="ref-quick-arrow" aria-hidden="true">↗</span></a>
  <a href="/consult.html"><span class="ref-quick-icon">${icon('chat')}</span><span class="ref-quick-copy"><small>편한 방법으로 시작하는</small><strong>상담 안내</strong></span><span class="ref-quick-arrow" aria-hidden="true">↗</span></a>
</div></section>

<section class="section ref-concerns"><div class="container ref-concern-layout">
  <div class="ref-section-title"><span class="kicker">WE LISTEN FIRST</span><h2>이런 고민으로<br>찾아오십니다.</h2><p>상황이 다르면, 필요한 방법도 다릅니다.<br>지금 가장 걱정되는 일부터 들려주세요.</p><a class="text-link" href="/consult.html">내 상황 상담하기 <span aria-hidden="true">↗</span></a></div>
  <div class="ref-concern-grid">
    <article class="ref-concern-card">${icon('debt')}<div><h3>갚아도 줄지 않는 빚</h3><p>수입과 생활비를 함께 살펴<br>감당할 수 있는 계획을 검토합니다.</p></div></article>
    <article class="ref-concern-card">${icon('business')}<div><h3>이어가야 하는 사업과 생활</h3><p>실제 소득과 재산, 채무를 정리해<br>가능한 절차를 살펴봅니다.</p></div></article>
    <article class="ref-concern-card">${icon('time')}<div><h3>마음이 급해지는 독촉·압류</h3><p>받은 서류와 기한을 확인하고<br>먼저 검토할 일을 구분합니다.</p></div></article>
    <article class="ref-concern-card">${icon('route')}<div><h3>무엇이 맞는지 모를 때</h3><p>개인회생·파산·채무조정의<br>차이부터 이해하기 쉽게 안내합니다.</p></div></article>
  </div>
</div></section>

<section class="section ref-practice"><div class="container">
  <div class="section-head"><div><span class="kicker">OUR PRACTICE</span><h2>다시 시작하는 방법,<br>내 상황에 맞게.</h2></div><p>소득·재산·채무를 바탕으로<br>신청 요건과 절차를 함께 확인합니다.</p></div>
  <div class="ref-practice-grid">
    <article class="ref-practice-card"><div class="ref-practice-photo"><img src="/assets/renewal/legal-preparation-v2.webp" srcset="/assets/renewal/legal-preparation-v2-768.webp 768w, /assets/renewal/legal-preparation-v2.webp 1536w" sizes="(max-width:760px) 100vw, 47vw" width="1536" height="1024" loading="lazy" alt="법률 서적과 서류, 펜을 놓은 상담 준비의 상징 이미지"><div class="ref-practice-copy"><span class="ref-practice-tag">PERSONAL REHABILITATION</span><h3>개인회생</h3><p>꾸준한 수입을 바탕으로<br>생활과 변제를 함께 생각합니다.</p><a class="text-link" href="/personal-rehabilitation.html">개인회생 알아보기 <span aria-hidden="true">↗</span></a></div></div><ul class="ref-practice-features"><li>${icon('business')}<span>소득·생계비 검토</span></li><li>${icon('plan')}<span>변제계획 준비</span></li><li>${icon('document')}<span>법원 제출 서류</span></li></ul></article>
    <article class="ref-practice-card"><div class="ref-practice-photo"><img src="/assets/renewal/legal-hero-v2.webp" srcset="/assets/renewal/legal-hero-v2-768.webp 768w, /assets/renewal/legal-hero-v2.webp 1536w" sizes="(max-width:760px) 100vw, 47vw" width="1536" height="1024" loading="lazy" alt="법률 검토를 상징하는 황동 저울과 서적"><div class="ref-practice-copy"><span class="ref-practice-tag">BANKRUPTCY & DISCHARGE</span><h3>개인파산·면책</h3><p>갚기 어려운 상황에서<br>새로운 출발의 가능성을 살핍니다.</p><a class="text-link" href="/personal-bankruptcy.html">개인파산 알아보기 <span aria-hidden="true">↗</span></a></div></div><ul class="ref-practice-features"><li>${icon('compare')}<span>상환 능력 검토</span></li><li>${icon('document')}<span>재산·채무 확인</span></li><li>${icon('check')}<span>면책 쟁점 확인</span></li></ul></article>
  </div>
  <p class="note">신청 가능 여부, 변제금과 결과는 개별 사실관계 및 법원의 판단에 따라 달라집니다.</p>
</div></section>

<section class="section ref-process"><div class="container">
  <div class="section-head"><div><span class="kicker">STEP BY STEP</span><h2>첫 연락부터, 차근차근.</h2></div><a class="text-link" href="/rehabilitation-process.html">개인회생 절차 보기 <span aria-hidden="true">↗</span></a></div>
  <ol class="ref-process-grid">
    <li><span class="ref-step-no">01</span><h3>현재 상황 상담</h3><p>채무·소득·재산과<br>급한 문제를 확인합니다.</p></li>
    <li><span class="ref-step-no">02</span><h3>제도·자료 검토</h3><p>적합한 절차와 필요한 자료,<br>비용·업무 범위를 안내합니다.</p></li>
    <li><span class="ref-step-no">03</span><h3>서류 준비·신청</h3><p>위임한 업무 범위에 따라<br>신청서류를 준비합니다.</p></li>
    <li><span class="ref-step-no">04</span><h3>심사·후속 안내</h3><p>법원의 보정과 결정,<br>이후 필요한 절차를 확인합니다.</p></li>
  </ol>
</div></section>

<section class="ref-experience" aria-label="업무 경력 안내"><div class="container"><div><span class="kicker">EXPERIENCE SINCE 2004</span><strong>20년<small>이상의 경험</small></strong></div><h2>개인회생제도 시행 때부터,<br>오랜 실무 경험으로 함께합니다.</h2><p>2004년부터 쌓아온 개인회생 업무 경험을 바탕으로<br>지금의 상황에 필요한 준비를 안내합니다.</p></div></section>

<section class="section ref-promise"><div class="container">
  <div class="ref-promise-layout"><div class="ref-section-title"><span class="kicker">OUR COMMITMENT</span><h2>큰 약속보다,<br>꼼꼼한 설명과 준비.</h2><p>법무사 안상재 사무소는<br>정확한 이해에서 시작하겠습니다.</p></div><div class="ref-promise-grid">
    <article>${icon('listen')}<h3>먼저 듣는 상담</h3><p>채무가 생긴 사정과<br>현재의 생활을 살핍니다.</p></article>
    <article>${icon('explain')}<h3>이해하기 쉬운 설명</h3><p>어려운 법률 절차를<br>알기 쉬운 말로 안내합니다.</p></article>
    <article>${icon('document')}<h3>분명한 업무 범위</h3><p>진행할 업무와 비용을<br>구분해 설명합니다.</p></article>
    <article>${icon('check')}<h3>사실에 근거한 안내</h3><p>확인한 자료를 바탕으로<br>가능성과 유의점을 설명합니다.</p></article>
  </div></div>
  <div class="ref-guide-links" aria-label="상담 전 미리 알아보기"><span>미리 알아보세요</span><a href="/rehabilitation-cost.html">개인회생 비용 <span aria-hidden="true">↗</span></a><a href="/rehabilitation-documents.html">개인회생 준비서류 <span aria-hidden="true">↗</span></a><a href="/bankruptcy-discharge.html">파산과 면책의 차이 <span aria-hidden="true">↗</span></a></div>
</div></section>

<section class="section ref-faq"><div class="container ref-faq-layout"><div class="ref-section-title"><span class="kicker">BEFORE WE TALK</span><h2>상담 전,<br>이런 점이 궁금하셨나요?</h2><p>복잡한 절차를 알아보는 첫걸음.<br>자주 묻는 질문부터 정리했습니다.</p></div><div class="faq-list"><details><summary>개인회생과 개인파산은 어떻게 다른가요?</summary><p>계속적인 수입으로 변제계획을 이행할 수 있는지, 현재 채무를 갚을 수 없는 상태인지 등을 함께 살펴야 합니다. 소득뿐 아니라 생활비·재산·채무의 성격도 검토합니다. <a href="/debt-adjustment.html">세 가지 제도 비교하기</a></p></details><details><summary>신청하면 독촉이나 압류가 바로 멈추나요?</summary><p>신청만으로 모든 추심과 강제집행이 자동으로 중단되는 것은 아닙니다. 금지명령·중지명령 등 법원의 결정과 개별 절차에 따라 달라집니다.</p></details><details><summary>첫 상담 전에 서류를 전부 준비해야 하나요?</summary><p>처음부터 모든 서류를 준비하실 필요는 없습니다. 대략적인 채무 규모와 수입·재산, 진행 중인 압류나 소송을 먼저 알려주시면 필요한 자료를 안내합니다. <a href="/rehabilitation-documents.html">준비자료 확인하기</a></p></details></div></div></section>

<section class="home-location"><div class="container office-map-layout">
  <div class="office-map-copy"><span class="kicker">VISIT OUR OFFICE</span><h2>대전 둔산동에서<br>뵙겠습니다.</h2><p class="location-address">대전 서구 둔산중로78번길 40<br><strong>봉화빌딩 402호</strong></p><a class="location-phone" href="tel:01064294797">010-6429-4797</a><p class="office-hours">평일 09:00–18:00 · 토요일 09:00–14:00<br>방문 전 전화로 상담 일정을 확인해 주세요.</p><div class="map-actions"><a class="button primary" href="${naverDirections}" target="_blank" rel="noopener noreferrer">네이버 길찾기 <span aria-hidden="true">↗</span></a><a class="text-link" href="/location.html">오시는 길 안내 <span aria-hidden="true">↗</span></a></div><button class="address-copy" type="button" data-copy-address>사무소 주소 복사</button><p id="copy-status" role="status" class="note"></p></div>
  ${officeMap('office-map')}
</div></section>`
};
