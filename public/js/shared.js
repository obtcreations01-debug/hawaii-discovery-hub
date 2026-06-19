/**
 * UnBox Locals – Hawaii Discovery Hub
 * Shared JavaScript utilities
 * OBT Consultants | Outside the Box Thinkers
 */

// ---- Mobile Nav Toggle ----
function initMobileNav() {
  const toggle = document.getElementById('navToggle');
  const mobileNav = document.getElementById('mobileNav');
  if (!toggle || !mobileNav) return;
  toggle.addEventListener('click', () => {
    mobileNav.classList.toggle('open');
    const isOpen = mobileNav.classList.contains('open');
    toggle.setAttribute('aria-expanded', isOpen);
  });
  document.addEventListener('click', (e) => {
    if (!toggle.contains(e.target) && !mobileNav.contains(e.target)) {
      mobileNav.classList.remove('open');
    }
  });
}

// ---- Back to Top ----
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ---- Toast Notifications ----
function showToast(message, type = 'success', duration = 4000) {
  let toast = document.getElementById('globalToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'globalToast';
    toast.className = 'toast';
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'polite');
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.className = `toast ${type}`;
  setTimeout(() => toast.classList.add('show'), 10);
  clearTimeout(toast._hideTimeout);
  toast._hideTimeout = setTimeout(() => toast.classList.remove('show'), duration);
}

// ---- FAQ Accordion ----
function initFAQ() {
  document.querySelectorAll('.faq-question').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.closest('.faq-item');
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });
}

// ---- Scroll Animations ----
function initScrollAnimations() {
  const els = document.querySelectorAll('[data-animate]');
  if (!('IntersectionObserver' in window)) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity = '1';
        e.target.style.transform = 'translateY(0)';
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  els.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
    obs.observe(el);
  });
}

// ---- Active Nav Link ----
function setActiveNav() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html') || (page === 'index.html' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

// ---- Init All ----
// Exposed as window.__sharedInit so partials.js can call it
// AFTER nav/footer HTML is injected into the DOM.
// This prevents the race condition where shared.js fires DOMContentLoaded
// before partials.js has finished injecting #navToggle, #backToTop, etc.
window.__sharedInit = function () {
  initMobileNav();
  initBackToTop();
  initFAQ();
  initScrollAnimations();
  setActiveNav();
};

// Fallback: if partials.js is not loaded (e.g. standalone page), init normally
document.addEventListener('DOMContentLoaded', () => {
  if (!document.getElementById('nav-placeholder') &&
      !document.getElementById('footer-placeholder')) {
    window.__sharedInit();
  }
});
