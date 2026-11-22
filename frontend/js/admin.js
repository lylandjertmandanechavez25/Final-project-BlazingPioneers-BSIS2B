if (requireAuth(true)) {
  renderNavbar('admin');
  let users = [];
  const rows = document.getElementById('userRows');
  const modal = new bootstrap.Modal(document.getElementById('editModal'));
  const $ = id => document.getElementById(id);

  function draw() {
    const q = $('userSearch').value.toLowerCase();
    const list = users.filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
    rows.innerHTML = list.length ? list.map(u => `<tr>
      <td>${esc(u.name)}</td><td>${esc(u.email)}</td>
      <td><span class="badge text-bg-${u.role === 'admin' ? 'primary' : 'secondary'}">${u.role}</span></td>
      <td>${fmtDate(u.createdAt)}</td>
      <td class="text-end">
        <button class="btn btn-sm btn-warning edit-btn" data-id="${u._id}">Edit</button>
        <button class="btn btn-sm btn-danger delete-btn" data-id="${u._id}">Delete</button>
      </td></tr>`).join('') : '<tr><td colspan="5" class="text-center text-muted py-4">No users found.</td></tr>';
  }

  async function load() {
    try { users = await api('/users'); draw(); }
    catch (err) { rows.innerHTML = `<tr><td colspan="5"><div class="alert alert-danger m-3">${esc(err.message)}</div></td></tr>`; }
  }

  rows.addEventListener('click', async e => {
    const btn = e.target.closest('button[data-id]');
    if (!btn) return;
    const u = users.find(x => x._id === btn.dataset.id);
    if (btn.classList.contains('edit-btn')) {
      $('editId').value = u._id; $('editName').value = u.name; $('editEmail').value = u.email; $('editRole').value = u.role;
      modal.show();
    } else if (confirm(`Delete ${u.name}? Their reports and claims will be removed too.`)) {
      try { await api('/users/' + u._id, { method: 'DELETE' }); showToast('User deleted'); load(); }
      catch (err) { showToast(err.message, 'danger'); }
    }
  });

  $('editForm').addEventListener('submit', async e => {
    e.preventDefault();
    try {
      await api('/users/' + $('editId').value, { method: 'PUT', body: { name: $('editName').value.trim(), role: $('editRole').value } });
      modal.hide(); showToast('User updated'); load();
    } catch (err) { showToast(err.message, 'danger'); }
  });

  $('userSearch').addEventListener('input', draw);
  load();
}
