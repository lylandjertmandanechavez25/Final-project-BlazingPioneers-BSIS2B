renderNavbar('home');
(async function () {
  try {
    const s = await api('/items/stats');
    document.getElementById('statLost').textContent = s.lost;
    document.getElementById('statFound').textContent = s.found;
    document.getElementById('statResolved').textContent = s.resolved;
    const d = await api('/items?limit=3');
    const box = document.getElementById('recent');
    box.innerHTML = d.items.length ? d.items.map(i => `
      <div class="col-md-4"><div class="card item-card">
        ${i.imageUrl ? `<img class="thumb" src="${esc(i.imageUrl)}" alt="">` : '<div class="thumb-placeholder"><i class="bi bi-box-seam"></i></div>'}
        <div class="card-body">
          <span class="badge text-bg-${i.type === 'lost' ? 'danger' : 'success'} mb-2">${i.type.toUpperCase()}</span>
          <h5 class="card-title">${esc(i.title)}</h5>
          <p class="text-muted small mb-0"><i class="bi bi-geo-alt"></i> ${esc(i.location)} &middot; ${fmtDate(i.dateOccurred)}</p>
        </div></div></div>`).join('')
      : '<div class="text-muted">No reports yet. Be the first to <a href="report.html">report an item</a>.</div>';
  } catch (e) {
    document.getElementById('recent').innerHTML = `<div class="alert alert-warning">Could not load data: ${esc(e.message)}. Is the backend running?</div>`;
  }
})();
