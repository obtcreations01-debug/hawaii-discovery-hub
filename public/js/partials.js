/* Inject the shared nav and footer into placeholders on every page. */

const NAV_HTML = `
  <header class="nav">
    <a href="/index.html" class="brand">Hawaii Discovery <span>Hub</span></a>
    <nav>
      <a href="/directory.html">Directory</a>
      <a href="/for-businesses.html">For businesses</a>
      <a id="navAuthLink" href="/login.html">Log in</a>
      <a id="navCtaLink" class="cta" href="/register.html">Sign up</a>
    </nav>
  </header>
`;

const FOOTER_HTML = `
  <footer class="footer">
    <div>&copy; ${new Date().getFullYear()} Hawaii Discovery Hub. Aloha from every island.</div>
  </footer>
`;

function mountPartial(id, html) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', () => {
  mountPartial('nav-placeholder', NAV_HTML);
  mountPartial('footer-placeholder', FOOTER_HTML);

  // Swap log-in CTA for a logout/dashboard link when authenticated
  const u = (window.currentUser && window.currentUser());
  if (u && u.id) {
    const auth = document.getElementById('navAuthLink');
    const cta = document.getElementById('navCtaLink');
    if (auth) { auth.href = '/dashboard.html'; auth.textContent = 'Dashboard'; }
    if (cta)  { cta.textContent = 'Log out'; cta.href = '#'; cta.onclick = (e) => { e.preventDefault(); window.logout(); }; }
  }
});
