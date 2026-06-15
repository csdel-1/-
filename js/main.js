/* ==========================================
   법률사무소 웹사이트 - 메인 JavaScript
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. 헤더 스크롤 효과 ── */
  const header = document.getElementById('site-header');
  const handleScroll = () => {
    if (window.scrollY > 80) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });

  /* ── 2. 모바일 햄버거 메뉴 ── */
  const hamburger = document.getElementById('hamburger');
  const navMenu   = document.getElementById('nav-menu');

  hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navMenu.classList.toggle('open');
    document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
  });

  // 모바일 드롭다운 토글
  document.querySelectorAll('.nav-item.has-dropdown > a').forEach(link => {
    link.addEventListener('click', (e) => {
      if (window.innerWidth <= 900) {
        e.preventDefault();
        const parent = link.closest('.nav-item');
        parent.classList.toggle('open');
      }
    });
  });

  // 메뉴 바깥 클릭 시 닫기
  document.addEventListener('click', (e) => {
    if (navMenu?.classList.contains('open') && !header.contains(e.target)) {
      navMenu.classList.remove('open');
      hamburger?.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  /* ── 3. 히어로 슬라이더 ── */
  const slides  = document.querySelectorAll('.hero-slide');
  const dots    = document.querySelectorAll('.hero-dot');
  let currentSlide = 0;
  let sliderInterval;

  // 첫 슬라이드 즉시 active (CSS :first-child와 중복 적용으로 확실히 표시)
  if (slides.length > 0) {
    slides[0].classList.add('active');
    dots[0]?.classList.add('active');
  }

  const goToSlide = (index) => {
    slides[currentSlide]?.classList.remove('active');
    dots[currentSlide]?.classList.remove('active');
    currentSlide = (index + slides.length) % slides.length;
    slides[currentSlide]?.classList.add('active');
    dots[currentSlide]?.classList.add('active');
  };

  const startSlider = () => {
    sliderInterval = setInterval(() => goToSlide(currentSlide + 1), 5000);
  };

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      clearInterval(sliderInterval);
      goToSlide(i);
      startSlider();
    });
  });

  if (slides.length > 1) startSlider();

  /* ── 4. 숫자 카운트 업 애니메이션 ── */
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  let statsAnimated = false;

  const animateStats = () => {
    if (statsAnimated) return;
    const whySection = document.getElementById('why-us');
    if (!whySection) return;
    const rect = whySection.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.85) {
      statsAnimated = true;
      statNumbers.forEach(el => {
        const target  = parseFloat(el.dataset.target);
        const isFloat = target % 1 !== 0;
        const duration = 2000;
        const start = performance.now();
        const update = (time) => {
          const elapsed = time - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
          const value = eased * target;
          el.textContent = isFloat ? value.toFixed(1) : Math.floor(value).toLocaleString();
          if (progress < 1) requestAnimationFrame(update);
        };
        requestAnimationFrame(update);
      });
    }
  };
  window.addEventListener('scroll', animateStats, { passive: true });

  /* ── 5. 리뷰 슬라이더 ── */
  const reviewTrack = document.getElementById('reviews-track');
  const reviewPrev  = document.getElementById('review-prev');
  const reviewNext  = document.getElementById('review-next');

  if (reviewTrack) {
    let reviewIndex = 0;
    const reviewCards = reviewTrack.querySelectorAll('.review-card');
    let cardsPerView = getCardsPerView();

    function getCardsPerView() {
      return window.innerWidth <= 640 ? 1 : window.innerWidth <= 900 ? 1 : 3;
    }
    const maxIndex = () => Math.max(0, reviewCards.length - cardsPerView);

    const updateReviewSlider = () => {
      cardsPerView = getCardsPerView();
      const cardWidth = reviewCards[0]?.offsetWidth + 24 || 0;
      reviewTrack.style.transform = `translateX(-${reviewIndex * cardWidth}px)`;
    };

    reviewPrev?.addEventListener('click', () => {
      if (reviewIndex > 0) { reviewIndex--; updateReviewSlider(); }
    });
    reviewNext?.addEventListener('click', () => {
      if (reviewIndex < maxIndex()) { reviewIndex++; updateReviewSlider(); }
    });
    window.addEventListener('resize', updateReviewSlider, { passive: true });
  }

  /* ── 6. FAQ 아코디언 ── */
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const isActive = btn.classList.contains('active');
      // 모두 닫기
      document.querySelectorAll('.faq-question').forEach(b => {
        b.classList.remove('active');
        b.nextElementSibling?.classList.remove('open');
      });
      // 현재 항목 토글
      if (!isActive) {
        btn.classList.add('active');
        btn.nextElementSibling?.classList.add('open');
      }
    });
  });

  /* ── 7. 스크롤 탑 버튼 ── */
  const scrollTopBtn = document.getElementById('scroll-top');
  const toggleScrollTop = () => {
    scrollTopBtn?.classList.toggle('visible', window.scrollY > 400);
  };
  window.addEventListener('scroll', toggleScrollTop, { passive: true });
  scrollTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ── 8. 스크롤 페이드-업 애니메이션 ── */
  const fadeEls = document.querySelectorAll(
    '.service-card, .why-card, .case-card, .review-card, .process-step, .stat-item, .fade-up'
  );

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0, rootMargin: '0px 0px -20px 0px' });

  fadeEls.forEach(el => {
    el.classList.add('fade-up');
    // 이미 뷰포트 안에 있는 요소는 즉시 표시
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      el.classList.add('visible');
    } else {
      observer.observe(el);
    }
  });

  /* ── 9. 현재 페이지 네비 활성화 ── */
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-item > a').forEach(a => {
    const href = a.getAttribute('href')?.split('#')[0];
    if (href && href !== '#' && href.includes(path)) {
      a.classList.add('active');
    }
  });

});
