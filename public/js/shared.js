/* Shared frontend helpers: toast, currentUser, logout, escapeHtml. */

function showToast(message, type = 'info') {
  let el = document.getElementById('toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'toast';
    el.className = 'toast';
    document.body.appendChild(el);
  }
  el.className = 'toast ' + (type || '');
  el.textContent = message;
  requestAnimationFrame(() => el.classList.add('show'));
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => el.classList.remove('show'), 2800);
}

function currentUser() {
  try { return JSON.parse(localStorage.getItem('user') || 'null'); }
  catch { return null; }
}

function requireAuth(redirect = '/login.html') {
  const u = currentUser();
  if (!u || !u.id) {
    window.location.href = redirect;
    return null;
  }
  return u;
}

function logout() {
  if (window.api && api.clearTokens) api.clearTokens();
  else {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }
  window.location.href = '/index.html';
}

function escapeHtml(str) {
  return String(str ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

window.showToast = showToast;
window.currentUser = currentUser;
window.requireAuth = requireAuth;
window.logout = logout;
window.escapeHtml = escapeHtml;
