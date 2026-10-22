const menuButton=document.querySelector('.menu-toggle');
const nav=document.querySelector('.main-nav');
function closeMenu(restoreFocus=false){
  if(!menuButton||!nav)return;
  nav.classList.remove('is-open');
  menuButton.setAttribute('aria-expanded','false');
  menuButton.setAttribute('aria-label','메뉴 열기');
  if(restoreFocus)menuButton.focus();
}
menuButton?.addEventListener('click',()=>{
  const open=menuButton.getAttribute('aria-expanded')!=='true';
  nav.classList.toggle('is-open',open);
  menuButton.setAttribute('aria-expanded',String(open));
  menuButton.setAttribute('aria-label',open?'메뉴 닫기':'메뉴 열기');
});
nav?.addEventListener('click',e=>{if(e.target.closest('a'))closeMenu();});
document.addEventListener('click',e=>{if(!e.target.closest('.site-header'))closeMenu();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menuButton?.getAttribute('aria-expanded')==='true')closeMenu(true);});
document.addEventListener('focusin',e=>{if(!e.target.closest('.site-header'))closeMenu();});
matchMedia('(min-width:1041px)').addEventListener('change',e=>{if(e.matches)closeMenu();});
const header=document.querySelector('.site-header');
const topButton=document.querySelector('.back-top');
let ticking=false;
function updateScroll(){header?.classList.toggle('is-scrolled',scrollY>12);topButton?.classList.toggle('visible',scrollY>600);ticking=false;}
addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(updateScroll);ticking=true;}},{passive:true});
updateScroll();
topButton?.addEventListener('click',()=>{scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'});document.querySelector('.brand')?.focus({preventScroll:true});});
document.querySelectorAll('[data-copy-address]').forEach(button=>button.addEventListener('click',async()=>{
  const status=document.querySelector('#copy-status');
  try{await navigator.clipboard.writeText('대전광역시 서구 둔산중로78번길 40 봉화빌딩 402호');if(status)status.textContent='주소를 복사했습니다.';}
  catch{if(status)status.textContent='주소: 대전광역시 서구 둔산중로78번길 40 봉화빌딩 402호';}
}));

document.querySelectorAll('[data-case-browser]').forEach(browser=>{
  const filters=browser.querySelector('.case-filters');
  const buttons=[...browser.querySelectorAll('[data-case-filter]')];
  const cards=[...browser.querySelectorAll('[data-case-type]')];
  const count=browser.querySelector('.case-count');
  filters.hidden=false;
  buttons.forEach(button=>button.addEventListener('click',()=>{
    const type=button.dataset.caseFilter;
    let shown=0;
    cards.forEach(card=>{
      card.hidden=type!=='all'&&card.dataset.caseType!==type;
      if(!card.hidden)shown++;
    });
    buttons.forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
    const name={all:'전체',rehab:'개인회생',bankruptcy:'개인파산·면책'}[type];
    count.textContent=`${name} ${shown}건`;
  }));
});
