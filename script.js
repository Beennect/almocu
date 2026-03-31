/* ============================================
   ALMOÇU — LANDING PAGE JS
   Minimal, purposeful, no dependencies
   ============================================ */

(function () {
  'use strict';

  /* ===========================
     1. THEME TOGGLE
  ============================ */
  const themeToggle = document.getElementById('themeToggle');
  const html = document.documentElement;

  const STORAGE_KEY = 'almoco-theme';
  const DARK = 'dark';
  const LIGHT = 'light';

  function getPreferredTheme() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? DARK : LIGHT;
  }

  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);

    const label = theme === DARK ? 'Mudar para tema claro' : 'Mudar para tema escuro';
    themeToggle.setAttribute('aria-label', label);
  }

  function toggleTheme() {
    const current = html.getAttribute('data-theme');
    const next = current === DARK ? LIGHT : DARK;

    // Rotation animation
    themeToggle.classList.add('rotating');
    setTimeout(() => themeToggle.classList.remove('rotating'), 350);

    applyTheme(next);
  }

  // Init
  applyTheme(getPreferredTheme());
  themeToggle.addEventListener('click', toggleTheme);


  /* ===========================
     2. MOBILE MENU
  ============================ */
  const menuToggle = document.getElementById('menuToggle');
  const mobileNav  = document.getElementById('mobileNav');

  menuToggle.addEventListener('click', function () {
    const isOpen = mobileNav.classList.toggle('open');
    this.setAttribute('aria-expanded', isOpen);
    mobileNav.setAttribute('aria-hidden', !isOpen);
  });

  // Close on nav link click
  mobileNav.querySelectorAll('.mobile-nav__link').forEach(function (link) {
    link.addEventListener('click', function () {
      mobileNav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
      mobileNav.setAttribute('aria-hidden', 'true');
    });
  });


  /* ===========================
     3. ACTIVE NAV LINK (scroll spy)
  ============================ */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link');

  function updateActiveLink() {
    let current = '';
    const offset = 100;

    sections.forEach(function (section) {
      const top = section.getBoundingClientRect().top;
      if (top <= offset) current = section.id;
    });

    navLinks.forEach(function (link) {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();


  /* ===========================
     4. SCROLL REVEAL
  ============================ */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    // Fallback: show all immediately
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }


  /* ===========================
     5. COUNT-UP ANIMATION
  ============================ */
  function animateCount(el) {
    const target   = parseInt(el.getAttribute('data-count'), 10);
    const prefix   = el.getAttribute('data-prefix') || '';
    const duration = 1800;
    const start    = performance.now();

    function easeOutQuart(t) {
      return 1 - Math.pow(1 - t, 4);
    }

    function step(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value    = Math.round(easeOutQuart(progress) * target);

      el.textContent = prefix + value.toLocaleString('pt-BR');

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = prefix + target.toLocaleString('pt-BR');
      }
    }

    requestAnimationFrame(step);
  }

  const countEls = document.querySelectorAll('[data-count]');

  if ('IntersectionObserver' in window) {
    const countObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          countObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    countEls.forEach(function (el) {
      countObserver.observe(el);
    });
  } else {
    countEls.forEach(function (el) {
      el.textContent = (el.getAttribute('data-prefix') || '') + parseInt(el.getAttribute('data-count'), 10);
    });
  }


  /* ===========================
     6. DASHBOARD MOCK BARS — animate heights on load
  ============================ */
  const bars = document.querySelectorAll('.mock__bar');

  bars.forEach(function (bar) {
    const targetH = bar.style.getPropertyValue('--h');
    bar.style.setProperty('--h', '0%');

    setTimeout(function () {
      bar.style.transition = 'height 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
      bar.style.setProperty('--h', targetH);
    }, 600);
  });


  /* ===========================
     7. SMOOTH ANCHOR SCROLL
     (for browsers that don't support scroll-padding-top well)
  ============================ */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;

      e.preventDefault();
      const headerH = document.getElementById('header').offsetHeight;
      const top = target.getBoundingClientRect().top + window.scrollY - headerH - 8;

      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });


  /* ===========================
     8. HEADER — scrolled state
  ============================ */
  const header = document.getElementById('header');

  function onScroll() {
    header.classList.toggle('header--scrolled', window.scrollY > 10);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

})();
