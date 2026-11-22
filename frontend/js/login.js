renderNavbar('login');
if (Auth.token) location.href = 'dashboard.html';

document.getElementById('loginForm').addEventListener('submit', async e => {
  e.preventDefault();
  const msg = document.getElementById('msg');
  const btn = document.getElementById('submitBtn');
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  if (!email || !password) { msg.innerHTML = '<div class="alert alert-danger">Please fill in all fields.</div>'; return; }
  btn.disabled = true;
  try {
    const data = await api('/auth/login', { method: 'POST', body: { email, password } });
    Auth.save(data.token, data.user);
    location.href = 'dashboard.html';
  } catch (err) {
    msg.innerHTML = `<div class="alert alert-danger">${esc(err.message)}</div>`;
  } finally { btn.disabled = false; }
});
