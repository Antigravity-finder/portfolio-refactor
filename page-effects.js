// === Portfolio Page Effects & Animations ===

// ─── 1. Scroll-reveal Observer ─────────────────────────────────────────────
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.scroll-reveal, .timeline-heading');
  if (!revealElements.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -10% 0px',
    threshold: 0.08,
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach((el) => {
    revealObserver.observe(el);
  });
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
      const cursorWidth = cursorEffect.offsetWidth;
      const cursorHeight = cursorEffect.offsetHeight;
      const x = e.clientX - rect.left - cursorWidth / 2;
      const y = e.clientY - rect.top - cursorHeight / 2;

      cursorEffect.style.left = `${x}px`;
      cursorEffect.style.top = `${y}px`;
    });
  }

  if (footer) {
    const defaultTheme = {
      '--nav-link-bg': 'transparent',
      '--nav-hover-fill': '#bb304b',
      '--hamburger-hover-bg': '#bb304b',
    };

    const footerTheme = {
      '--nav-link-bg': '#bb304b',
      '--nav-hover-fill': '#fff7f4',
      '--hamburger-hover-bg': '#fff7f4',
    };

    const applyNavTheme = (theme) => {
      for (const [key, value] of Object.entries(theme)) {
        root.style.setProperty(key, value);
      }
    };

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -95% 0px',
      threshold: 0,
    };

    const footerObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          applyNavTheme(footerTheme);
        } else {
          applyNavTheme(defaultTheme);
        }
      });
    }, observerOptions);

    footerObserver.observe(footer);
  }
}

// ─── 3. Nav Scroll Glass Effect ────────────────────────────────────────────
function initNavScrollEffect() {
  const nav = document.querySelector('nav');
  if (!nav) return;

  const SCROLL_THRESHOLD = 60;

  const handleScroll = () => {
    if (window.scrollY > SCROLL_THRESHOLD) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Run on init in case page loads mid-scroll
}

// ─── 4. Magnetic Hover Effect for CTA buttons ──────────────────────────────
function initMagneticButtons() {
  const magneticTargets = document.querySelectorAll(
    '.footer-cta-button, .resume-btn, .project-link, .submit-button'
  );

  magneticTargets.forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);

      // Gentle magnetic pull (max ±8px)
      const strength = 8;
      btn.style.transform = `translate(${dx * strength}px, ${dy * strength}px) scale(1.04)`;
    });

    btn.addEventListener('mouseleave', () => {
      // Spring back with CSS transition
      btn.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
      btn.style.transform = '';
      // Reset after animation
      setTimeout(() => {
        btn.style.transition = '';
      }, 500);
    });
  });
}

// ─── 5. Staggered entrance for project cards ───────────────────────────────
function initCardEntranceObserver() {
  const cards = document.querySelectorAll('.project-card, .gallery-item');
  if (!cards.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger based on position in the visible batch
        const delay = (i % 4) * 80;
        setTimeout(() => {
          entry.target.classList.add('card-visible', 'item-visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, {
    rootMargin: '0px 0px -8% 0px',
    threshold: 0.05,
  });

  cards.forEach((card) => observer.observe(card));
}

// ─── 6. Active nav link highlight ─────────────────────────────────────────
function initActiveNavLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link a, .sidebar a');

  navLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (href && href.split('#')[0] === currentPage) {
      link.closest('li')?.classList.add('active');
    }
  });
}

// ─── 7. Smooth page-transition fade on navigation ──────────────────────────
function initPageTransitions() {
  // Only run on non-landing pages (landing-page.js already handles its own fades)
  const isLanding = !!document.querySelector('.landing');
  if (isLanding) return;

  // Handle all internal links with a smooth fade-out
  document.querySelectorAll('a[href]').forEach((link) => {
    const href = link.getAttribute('href');
    // Skip external, anchor-only, and mailto links
    if (!href || href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto')) return;

    link.addEventListener('click', (e) => {
      // Don't intercept modifier-key clicks (new tab etc.)
      if (e.metaKey || e.ctrlKey || e.shiftKey) return;

      e.preventDefault();
      document.body.classList.add('fade-out');

      setTimeout(() => {
        window.location.href = href;
      }, 420);
    });
  });
}

// ─── 8. Parallax tilt on overview cards ───────────────────────────────────
function initCardParallax() {
  const cards = document.querySelectorAll('.overview-card');
  if (!cards.length) return;

  const MAX_TILT = 6; // degrees

  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

      const rotateY = x * MAX_TILT;
      const rotateX = -y * MAX_TILT;

      card.style.transform = `
        translateY(-10px)
        scale(1.02)
        perspective(800px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
      `;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.55s cubic-bezier(0.175, 0.885, 0.32, 1.275), border-color 0.4s ease, box-shadow 0.4s ease, background 0.4s ease';
      card.style.transform = '';
      setTimeout(() => { card.style.transition = ''; }, 550);
    });
  });
}

// ─── Initialize on DOM Ready ───────────────────────────────────────────────
function init() {
  initScrollReveal();
  initFooterEffects();
  initNavScrollEffect();
  initMagneticButtons();
  initCardEntranceObserver();
  initActiveNavLink();
  initPageTransitions();
  initCardParallax();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}