// Shared helpers used by every page
const API = (location.port === '3000' || location.port === '') ? '/api' : 'http://localhost:3000/api';

const Auth = {
  get token() { return localStorage.getItem('lf_token'); },
  get user() { try { return JSON.parse(localStorage.getItem('lf_user')); } catch { return null; } },
  save(token, user) { localStorage.setItem('lf_token', token); localStorage.setItem('lf_user', JSON.stringify(user)); },
  clear() { localStorage.removeItem('lf_token'); localStorage.removeItem('lf_user'); }
};

// fetch wrapper: adds JSON headers + token, throws Error(message) on failure
async function api(path, options = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (Auth.token) headers.Authorization = 'Bearer ' + Auth.token;
  const res = await fetch(API + path, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined
  });
  let data = null;
  try { data = await res.json(); } catch { /* empty body */ }
  if (!res.ok) {
    if (res.status === 401 && Auth.token) { Auth.clear(); }
    throw new Error((data && data.message) || 'Request failed (' + res.status + ')');
  }
  return data;
}

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fmtDate = d => new Date(d).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });

function showToast(message, type = 'success') {
  let box = document.getElementById('toastBox');
  if (!box) {
    box = document.createElement('div');
    box.id = 'toastBox';
    box.className = 'toast-container position-fixed top-0 end-0 p-3';
    document.body.appendChild(box);
  }
  const el = document.createElement('div');
  el.className = `toast align-items-center text-bg-${type} border-0`;
  el.innerHTML = `<div class="d-flex"><div class="toast-body">${esc(message)}</div><button class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button></div>`;
  box.appendChild(el);
  const t = new bootstrap.Toast(el, { delay: 3500 });
  t.show();
  el.addEventListener('hidden.bs.toast', () => el.remove());
}

function renderNavbar(active) {
  const u = Auth.user;
  const link = (href, key, label) => `<li class="nav-item"><a class="nav-link ${active === key ? 'active' : ''}" href="${href}">${label}</a></li>`;
  const html = `
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary sticky-top">
    <div class="container">
      <a class="navbar-brand fw-bold" href="index.html"><i class="bi bi-search-heart"></i> iBULFAS</a>
      <button class="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#navMenu"><span class="navbar-toggler-icon"></span></button>
      <div class="collapse navbar-collapse" id="navMenu">
        <ul class="navbar-nav me-auto">
          ${link('index.html', 'home', 'Home')}
          ${link('dashboard.html', 'dashboard', 'Browse Items')}
          ${u ? link('report.html', 'report', 'Report Item') : ''}
          ${u ? link('claims.html', 'claims', 'Claims') : ''}
          ${u && u.role === 'admin' ? link('admin.html', 'admin', 'Admin') : ''}
        </ul>
        <ul class="navbar-nav">
          ${u ? `<li class="nav-item"><a class="nav-link ${active === 'profile' ? 'active' : ''}" href="profile.html"><i class="bi bi-person-circle"></i> ${esc(u.name)}</a></li>
                 <li class="nav-item"><a class="nav-link" href="#" id="logoutBtn">Logout</a></li>`
               : `${link('login.html', 'login', 'Login')}${link('register.html', 'register', 'Register')}`}
        </ul>
      </div>
    </div>
  </nav>`;
  document.getElementById('nav').innerHTML = html;
  const out = document.getElementById('logoutBtn');
  if (out) out.addEventListener('click', e => { e.preventDefault(); Auth.clear(); location.href = 'login.html'; });
}

// Redirect to login if not signed in (or not admin when admin=true)
function requireAuth(admin = false) {
  if (!Auth.token || !Auth.user) { location.href = 'login.html'; return false; }
  if (admin && Auth.user.role !== 'admin') { location.href = 'dashboard.html'; return false; }
  return true;
}

function statusBadge(status) {
  const map = { open: 'success', claimed: 'secondary', returned: 'info', pending: 'warning', approved: 'success', rejected: 'danger' };
  return `<span class="badge text-bg-${map[status] || 'secondary'}">${esc(status)}</span>`;
}
