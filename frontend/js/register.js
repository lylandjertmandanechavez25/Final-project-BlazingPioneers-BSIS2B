renderNavbar('register');

document.getElementById('registerForm').addEventListener('submit', async e => {
  e.preventDefault();
  const msg = document.getElementById('msg');
  const btn = document.getElementById('submitBtn');
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const confirm = document.getElementById('confirm').value;

  // Client-side validation (Phase 4)
  if (!name || !email || !password) return msg.innerHTML = '<div class="alert alert-danger">All fields are required.</div>';
  if (!/^\S+@\S+\.\S+$/.test(email)) return msg.innerHTML = '<div class="alert alert-danger">Enter a valid email address.</div>';
  if (password.length < 6) return msg.innerHTML = '<div class="alert alert-danger">Password must be at least 6 characters.</div>';
  if (password !== confirm) return msg.innerHTML = '<div class="alert alert-danger">Passwords do not match.</div>';

  btn.disabled = true;
  try {
    const data = await api('/auth/register', { method: 'POST', body: { name, email, password } });
    Auth.save(data.token, data.user);
    location.href = 'dashboard.html';
  } catch (err) {
    msg.innerHTML = `<div class="alert alert-danger">${esc(err.message)}</div>`;
  } finally { btn.disabled = false; }
});
