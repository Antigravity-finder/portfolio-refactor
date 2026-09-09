// === Portfolio Page Effects & Animations ===

// Universal Scroll Reveal Observer
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.scroll-reveal, .timeline-heading');
  if (!revealElements.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -12% 0px',
    threshold: 0.12,
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

// Footer Cursor Glow Effect & Nav Theme Switcher
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
      '--nav-hover-fill': '#F5A045',
      '--hamburger-hover-bg': '#F5A045',
    };

    const footerTheme = {
      '--nav-link-bg': '#F5A045',
      '--nav-hover-fill': '#fff',
      '--hamburger-hover-bg': '#fff',
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

// Initialize on DOM Ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initScrollReveal();
    initFooterEffects();
  });
} else {
  initScrollReveal();
  initFooterEffects();
}