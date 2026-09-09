// === Portfolio Page Effects & Animations ===

// ─── 1. Scroll-reveal Observer (.scroll-reveal, .timeline-heading) ─────────
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.scroll-reveal, .timeline-heading');
  if (!revealElements.length) return;

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -10% 0px',
    threshold: 0.08,
  });

  revealElements.forEach((el) => revealObserver.observe(el));
}

// ─── 2. Footer Cursor Glow + Nav Theme Switcher ────────────────────────────
function initFooterEffects() {
  const footer = document.querySelector('.contact-footer');
  const cursorEffect = document.querySelector('.cursor-effects');
  const root = document.documentElement;

  if (footer && cursorEffect) {
    footer.addEventListener('mouseenter', () => {
      cursorEffect.style.opacity = '1';
      cursorEffect.style.transform = 'scale(1)';
    });
    footer.addEventListener('mouseleave', () => {
      cursorEffect.style.opacity = '0';
      cursorEffect.style.transform = 'scale(0)';
    });
    footer.addEventListener('mousemove', (e) => {
      const rect = footer.getBoundingClientRect();
      cursorEffect.style.left = `${e.clientX - rect.left - cursorEffect.offsetWidth / 2}px`;
      cursorEffect.style.top  = `${e.clientY - rect.top  - cursorEffect.offsetHeight / 2}px`;
    });
  }

  if (footer) {
    const defaultTheme = { '--nav-link-bg': 'transparent', '--nav-hover-fill': '#bb304b', '--hamburger-hover-bg': '#bb304b' };
    const footerTheme  = { '--nav-link-bg': '#bb304b',     '--nav-hover-fill': '#fff7f4', '--hamburger-hover-bg': '#fff7f4' };

    const applyNavTheme = (theme) => {
      for (const [key, value] of Object.entries(theme)) root.style.setProperty(key, value);
    };

    new IntersectionObserver((entries) => {
      entries.forEach((entry) => applyNavTheme(entry.isIntersecting ? footerTheme : defaultTheme));
    }, { rootMargin: '0px 0px -95% 0px', threshold: 0 }).observe(footer);
  }
}

// ─── 3. Nav glass on scroll ────────────────────────────────────────────────
function initNavScrollEffect() {
  const nav = document.querySelector('nav');
  if (!nav) return;
  const update = () => nav.classList.toggle('scrolled', window.scrollY > 60);
  window.addEventListener('scroll', update, { passive: true });
  update();
}

// ─── 4. Magnetic hover for CTA buttons ────────────────────────────────────
function initMagneticButtons() {
  document.querySelectorAll('.footer-cta-button, .resume-btn, .submit-button').forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const r = btn.getBoundingClientRect();
      const dx = ((e.clientX - r.left) / r.width  - 0.5) * 2;
      const dy = ((e.clientY - r.top)  / r.height - 0.5) * 2;
      btn.style.transform = `translate(${dx * 8}px, ${dy * 8}px) scale(1.04)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
      btn.style.transform = '';
      setTimeout(() => { btn.style.transition = ''; }, 500);
    });
  });
}

// ─── 5. Active nav link highlight ─────────────────────────────────────────
function initActiveNavLink() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link a, .sidebar li:not(:first-child) a').forEach((link) => {
    const href = (link.getAttribute('href') || '').split('#')[0];
    if (href === page) link.closest('li')?.classList.add('active');
  });
}

// ─── 6. 3-D parallax tilt on overview cards ───────────────────────────────
function initCardParallax() {
  document.querySelectorAll('.overview-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width  - 0.5) * 2;
      const y = ((e.clientY - r.top)  / r.height - 0.5) * 2;
      card.style.transform = `translateY(-10px) scale(1.02) perspective(800px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.55s cubic-bezier(0.175,0.885,0.32,1.275), border-color 0.4s ease, box-shadow 0.4s ease, background 0.4s ease';
      card.style.transform = '';
      setTimeout(() => { card.style.transition = ''; }, 560);
    });
  });
}

// ─── Initialize ────────────────────────────────────────────────────────────
function init() {
  initScrollReveal();
  initFooterEffects();
  initNavScrollEffect();
  initMagneticButtons();
  initActiveNavLink();
  initCardParallax();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}