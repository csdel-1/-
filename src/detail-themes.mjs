// Existing symbolic still-life assets, not photographs of staff or the office.
export const detailThemes = {
  'services.html': {image:'legal-hero-v2',alt:'황동 저울과 법률 서적',tags:[{label:'개인회생',href:'/personal-rehabilitation.html'},{label:'개인파산·면책',href:'/personal-bankruptcy.html'},{label:'채무조정 비교',href:'/debt-adjustment.html'}],note:'나에게 맞는 절차, 정확한 이해에서 시작합니다.'},
  'personal-rehabilitation.html': {image:'legal-preparation-v2',alt:'법률 서류 준비를 상징하는 노트와 펜, 저울',tags:[{label:'신청 요건',href:'#guide-2'},{label:'소득·생계비',href:'#guide-4'},{label:'변제계획',href:'/rehabilitation-process.html'}],note:'지금의 생활과 앞으로의 변제를 함께 살펴봅니다.'},
  'personal-bankruptcy.html': {image:'legal-hero-v2',alt:'차분한 남색 배경의 저울과 법률 서적',tags:[{label:'상환 능력',href:'#guide-2'},{label:'재산·채무',href:'#guide-3'},{label:'면책 검토',href:'/bankruptcy-discharge.html'}],note:'파산과 면책의 차이부터 분명하게 안내합니다.'},
  'consult.html': {image:'legal-preparation-v2',alt:'상담 준비를 상징하는 서류와 필기구',tags:[{label:'전화 상담',href:'tel:01064294797'},{label:'카카오톡 문의',href:'https://open.kakao.com/o/swmhzizg',newWindow:true},{label:'방문 일정 확인',href:'tel:01064294797',ariaLabel:'방문 일정 확인, 전화 010-6429-4797'}],note:'편한 방식으로, 필요한 이야기부터 들려주세요.'}
};

const esc=value=>String(value).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
export const renderHeroLinks=theme=>theme.tags.map(tag=>`<a class="detail-hero-link" href="${esc(tag.href)}"${tag.newWindow?' target="_blank" rel="noopener noreferrer"':''}${tag.ariaLabel?` aria-label="${esc(tag.ariaLabel)}"`:''}>${esc(tag.label)}<span aria-hidden="true">${tag.href.startsWith('#')?'↓':'↗'}</span></a>`).join('');
