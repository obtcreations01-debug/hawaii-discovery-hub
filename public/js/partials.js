/**
 * UnBox Locals – Hawaii Discovery Hub
 * Shared HTML partials: nav and footer
 * OBT Consultants | Outside the Box Thinkers
 */

const NAV_HTML = `
<nav class="nav" role="navigation" aria-label="Main navigation">
  <div class="nav-inner">
    <a href="index.html" class="nav-brand" aria-label="UnBox Locals Hawaii Discovery Hub – Home">
      <div class="nav-brand-icon" aria-hidden="true">
        <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 2L4 9v14l12 7 12-7V9L16 2zm0 3.1l9.2 5.3-3.2 1.9L16 9.7l-6 3.6-3.2-1.9L16 5.1zm-10 8.4l3.2 1.9v7.5L6 20.6V13.5zm4.8 2.8L16 12.8l5.2 3v6L16 25l-5.2-3v-5.7zm11.2-0.9l3.2-1.9v7.1l-3.2 2.3V15.4z"/>
        </svg>
      </div>
      <div class="nav-brand-text">
        <span class="nav-brand-name">UnBox Locals</span>
        <span class="nav-brand-sub">Hawaii Discovery Hub</span>
      </div>
    </a>
    <div class="nav-links" role="menubar">
      <a href="index.html" class="nav-link" role="menuitem">Home</a>
      <a href="directory.html" class="nav-link" role="menuitem">Browse Directory</a>
      <a href="for-businesses.html" class="nav-link" role="menuitem">For Businesses</a>
      <a href="about.html" class="nav-link" role="menuitem">About</a>
      <a href="contact.html" class="nav-link nav-cta" role="menuitem">Free Audit</a>
    </div>
    <button class="nav-toggle" id="navToggle" aria-label="Toggle mobile menu" aria-expanded="false" aria-controls="mobileNav">
      <span></span><span></span><span></span>
    </button>
  </div>
  <div class="nav-mobile" id="mobileNav" role="menu" aria-label="Mobile navigation">
    <a href="index.html" class="nav-link" role="menuitem">Home</a>
    <a href="directory.html" class="nav-link" role="menuitem">Browse Directory</a>
    <a href="for-businesses.html" class="nav-link" role="menuitem">For Businesses</a>
    <a href="about.html" class="nav-link" role="menuitem">About</a>
    <a href="contact.html" class="nav-link" role="menuitem">Free Audit</a>
  </div>
</nav>`;

const FOOTER_HTML = `
<footer class="footer" role="contentinfo">
  <div class="footer-main">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-col">
          <div class="footer-brand-name">UnBox Locals</div>
          <div class="footer-brand-sub">Hawaii Discovery Hub</div>
          <p class="footer-desc">Your go-to guide for discovering the best local businesses across every Hawaiian island. Built for residents, visitors, and business owners alike.</p>
          <p style="font-size:0.8rem;color:rgba(255,255,255,0.45);margin-bottom:0.5rem;">Powered by</p>
          <div style="display:flex;align-items:center;gap:0.6rem;">
            <div style="width:32px;height:32px;background:var(--sunset-orange);border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:1rem;" aria-hidden="true">⬡</div>
            <div>
              <div style="font-size:0.82rem;font-weight:700;color:rgba(255,255,255,0.8);">OBT Consultants</div>
              <div style="font-size:0.72rem;color:rgba(255,255,255,0.45);">Outside the Box Thinkers</div>
            </div>
          </div>
        </div>
        <div class="footer-col">
          <h5>Explore</h5>
          <ul>
            <li><a href="directory.html">Browse Directory</a></li>
            <li><a href="directory.html?island=oahu">Oʻahu Businesses</a></li>
            <li><a href="directory.html?island=maui">Maui Businesses</a></li>
            <li><a href="directory.html?island=hawaii-island">Hawaiʻi Island</a></li>
            <li><a href="directory.html?island=kauai">Kauaʻi Businesses</a></li>
            <li><a href="directory.html?type=featured">Featured Listings</a></li>
            <li><a href="directory.html?type=free">Free Listings</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h5>For Businesses</h5>
          <ul>
            <li><a href="for-businesses.html">List Your Business</a></li>
            <li><a href="for-businesses.html#pricing">Membership Plans</a></li>
            <li><a href="contact.html">Free Marketing Audit</a></li>
            <li><a href="for-businesses.html#faq">Business FAQ</a></li>
            <li><a href="about.html">About OBT Consultants</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h5>Legal & Info</h5>
          <ul>
            <li><a href="privacy-policy.html">Privacy Policy</a></li>
            <li><a href="terms-of-service.html">Terms of Service</a></li>
            <li><a href="disclaimer.html">Disclaimer</a></li>
            <li><a href="contact.html">Contact Us</a></li>
          </ul>
          <div style="margin-top:1.25rem;">
            <p style="font-size:0.78rem;color:rgba(255,255,255,0.5);margin-bottom:0.5rem;">Islands Covered</p>
            <p style="font-size:0.8rem;color:rgba(255,255,255,0.65);line-height:1.6;">Oʻahu · Maui · Hawaiʻi Island · Kauaʻi · Molokaʻi · Lānaʻi</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  <hr class="footer-divider">
  <div class="footer-bottom">
    <div class="container">
      <div class="footer-bottom-inner">
        <div class="footer-copyright">
          <p style="margin-bottom:0.2rem;">© <span id="footerYear"></span> UnBox Locals – Hawaii Discovery Hub. All rights reserved. Operated by OBT Consultants LLC.</p>
          <p style="margin-bottom:0;">UnBox Locals™ is a brand of OBT Consultants. "Hawaii Discovery Hub" is a service mark of OBT Consultants LLC.</p>
        </div>
        <nav class="footer-legal-links" aria-label="Legal navigation">
          <a href="privacy-policy.html">Privacy Policy</a>
          <a href="terms-of-service.html">Terms of Service</a>
          <a href="disclaimer.html">Disclaimer</a>
          <a href="contact.html">Contact</a>
        </nav>
      </div>
    </div>
  </div>
  <div class="footer-disclaimer">
    <div class="container">
      <p>
        <strong>Advertising &amp; Sponsored Listings Disclosure:</strong> Some listings on this directory are paid placements. "Featured," "Sponsored," or "Premium" labels indicate a commercial relationship. Paid placements do not constitute endorsement by UnBox Locals – Hawaii Discovery Hub or OBT Consultants. All business information is provided by listing owners and is not independently verified. UnBox Locals – Hawaii Discovery Hub is not responsible for the accuracy, completeness, or reliability of any business information listed herein. Consumer reviews displayed represent the opinions of individual users and are not endorsed by UnBox Locals or OBT Consultants. Review our <a href="disclaimer.html" style="color:rgba(255,255,255,0.6);text-decoration:underline;">full disclaimer</a> and <a href="privacy-policy.html" style="color:rgba(255,255,255,0.6);text-decoration:underline;">privacy policy</a> for complete details.
      </p>
    </div>
  </div>
</footer>
<button class="back-to-top" id="backToTop" aria-label="Back to top">↑</button>`;

// Inject nav and footer, then trigger shared init
document.addEventListener('DOMContentLoaded', () => {
  // Nav
  const navPlaceholder = document.getElementById('nav-placeholder');
  if (navPlaceholder) navPlaceholder.outerHTML = NAV_HTML;

  // Footer
  const footerPlaceholder = document.getElementById('footer-placeholder');
  if (footerPlaceholder) footerPlaceholder.outerHTML = FOOTER_HTML;

  // Year
  const yearEl = document.getElementById('footerYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Fire shared init AFTER partials are in the DOM
  if (typeof window.__sharedInit === 'function') {
    window.__sharedInit();
  }
});
