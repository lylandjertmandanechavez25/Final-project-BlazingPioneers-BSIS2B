if (requireAuth()) {
  renderNavbar('profile');
  const u = Auth.user;
  document.getElementById('name').value = u.name;
  document.getElementById('email').value = u.email;
  document.getElementById('role').value = u.role;
  document.getElementById('profileForm').addEventListener('submit', async e => {
    e.preventDefault();
    const body = { name: document.getElementById('name').value.trim() };
    const pw = document.getElementById('password').value;
    if (pw) body.password = pw;
    try {
      const updated = await api('/auth/me', { method: 'PUT', body });
      Auth.save(Auth.token, updated);
      document.getElementById('password').value = '';
      renderNavbar('profile');
      showToast('Profile updated');
    } catch (err) { document.getElementById('msg').innerHTML = `<div class="alert alert-danger">${esc(err.message)}</div>`; }
  });
}
