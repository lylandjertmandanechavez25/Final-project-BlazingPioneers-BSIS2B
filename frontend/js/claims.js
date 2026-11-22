if (requireAuth()) {
  renderNavbar('claims');
  const me = Auth.user;
  const rows = document.getElementById('claimRows');

  async function load() {
    try {
      const claims = await api('/claims');
      if (!claims.length) { rows.innerHTML = '<tr><td colspan="6" class="text-center text-muted py-4">No claims yet.</td></tr>'; return; }
      rows.innerHTML = claims.map(c => {
        const itemOwner = c.item && c.item.reportedBy === me.id;
        const manage = (me.role === 'admin' || itemOwner) && c.status === 'pending';
        const del = me.role === 'admin' || (c.claimant && c.claimant._id === me.id);
        return `<tr>
          <td>${esc(c.item?.title || '(deleted item)')}</td>
          <td>${esc(c.claimant?.name)}<br><small class="text-muted">${esc(c.claimant?.email)}</small></td>
          <td style="max-width:260px">${esc(c.message)}</td>
          <td>${fmtDate(c.createdAt)}</td>
          <td>${statusBadge(c.status)}</td>
          <td class="text-end">
            ${manage ? `<button class="btn btn-sm btn-success" data-act="approved" data-id="${c._id}">Approve</button>
                        <button class="btn btn-sm btn-outline-danger" data-act="rejected" data-id="${c._id}">Reject</button>` : ''}
            ${del ? `<button class="btn btn-sm btn-danger" data-act="delete" data-id="${c._id}"><i class="bi bi-trash"></i></button>` : ''}
          </td></tr>`;
      }).join('');
    } catch (err) {
      rows.innerHTML = `<tr><td colspan="6"><div class="alert alert-danger m-3">${esc(err.message)}</div></td></tr>`;
    }
  }

  rows.addEventListener('click', async e => {
    const btn = e.target.closest('button[data-act]');
    if (!btn) return;
    const { act, id } = btn.dataset;
    try {
      if (act === 'delete') {
        if (!confirm('Delete this claim?')) return;
        await api('/claims/' + id, { method: 'DELETE' });
        showToast('Claim deleted');
      } else {
        await api(`/claims/${id}/status`, { method: 'PUT', body: { status: act } });
        showToast('Claim ' + act);
      }
      load();
    } catch (err) { showToast(err.message, 'danger'); }
  });

  load();
}
