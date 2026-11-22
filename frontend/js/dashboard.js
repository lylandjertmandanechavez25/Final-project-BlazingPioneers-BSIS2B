renderNavbar('dashboard');

let page = 1;
let items = [];
let categories = [];
const user = Auth.user;
const $ = id => document.getElementById(id);
const viewModal = new bootstrap.Modal($('viewModal'));
const editModal = new bootstrap.Modal($('editModal'));

const canManage = i => user && (user.role === 'admin' || (i.reportedBy && i.reportedBy._id === user.id));

// ---------- Render (reusable card template) ----------
function itemCard(i) {
  const manage = canManage(i) ? `
    <button class="btn btn-sm btn-warning edit-btn" data-id="${i._id}"><i class="bi bi-pencil"></i> Edit</button>
    <button class="btn btn-sm btn-danger delete-btn" data-id="${i._id}"><i class="bi bi-trash"></i> Delete</button>` : '';
  return `
  <div class="col-md-6 col-lg-4"><div class="card item-card">
    ${i.imageUrl ? `<img class="thumb" src="${esc(i.imageUrl)}" alt="" onerror="this.outerHTML='<div class=&quot;thumb-placeholder&quot;><i class=&quot;bi bi-image&quot;></i></div>'">`
                 : '<div class="thumb-placeholder"><i class="bi bi-box-seam"></i></div>'}
    <div class="card-body d-flex flex-column">
      <div class="mb-2"><span class="badge text-bg-${i.type === 'lost' ? 'danger' : 'success'}">${i.type.toUpperCase()}</span> ${statusBadge(i.status)}
        <span class="badge text-bg-light border">${esc(i.category?.name || 'Uncategorized')}</span></div>
      <h5 class="card-title">${esc(i.title)}</h5>
      <p class="text-muted small mb-2"><i class="bi bi-geo-alt"></i> ${esc(i.location)}<br><i class="bi bi-calendar3"></i> ${fmtDate(i.dateOccurred)}</p>
      <div class="mt-auto d-flex flex-wrap gap-1">
        <button class="btn btn-sm btn-primary view-btn" data-id="${i._id}"><i class="bi bi-eye"></i> View</button>${manage}
      </div>
    </div></div></div>`;
}

function renderPager(pages) {
  if (pages <= 1) { $('pager').innerHTML = ''; return; }
  let h = `<li class="page-item ${page === 1 ? 'disabled' : ''}"><a class="page-link" href="#" data-p="${page - 1}">Previous</a></li>`;
  for (let p = 1; p <= pages; p++) h += `<li class="page-item ${p === page ? 'active' : ''}"><a class="page-link" href="#" data-p="${p}">${p}</a></li>`;
  h += `<li class="page-item ${page === pages ? 'disabled' : ''}"><a class="page-link" href="#" data-p="${page + 1}">Next</a></li>`;
  $('pager').innerHTML = h;
}

// ---------- Load (GET) ----------
async function load() {
  const p = new URLSearchParams({ page, limit: 6 });
  if ($('fSearch').value.trim()) p.set('q', $('fSearch').value.trim());
  if ($('fType').value) p.set('type', $('fType').value);
  if ($('fCategory').value) p.set('category', $('fCategory').value);
  if ($('fStatus').value) p.set('status', $('fStatus').value);
  if ($('fMine').checked && user) p.set('reportedBy', user.id);
  $('itemList').innerHTML = '<div class="text-center text-muted py-5">Loading...</div>';
  try {
    const d = await api('/items?' + p);
    items = d.items;
    $('itemList').innerHTML = items.length ? items.map(itemCard).join('')
      : '<div class="col-12"><div class="alert alert-info text-center">No items found. Try changing the filters.</div></div>';
    renderPager(d.pages);
  } catch (err) {
    $('itemList').innerHTML = `<div class="col-12"><div class="alert alert-danger">Failed to load items: ${esc(err.message)}</div></div>`;
    $('pager').innerHTML = '';
  }
}

// ---------- View + Claim ----------
function openView(i) {
  $('viewTitle').textContent = i.title;
  const claimBox = !user ? '<div class="alert alert-secondary mb-0">Please <a href="login.html">login</a> to claim this item.</div>'
    : (i.status === 'open' && i.reportedBy?._id !== user.id) ? `
      <hr><h6>Is this yours? Send a claim</h6>
      <form id="claimForm"><textarea id="claimMsg" class="form-control mb-2" rows="3" placeholder="Describe proof of ownership (unique marks, contents, when/where you lost it)" required></textarea>
      <button class="btn btn-success" type="submit"><i class="bi bi-hand-thumbs-up"></i> Submit claim</button></form>` : '';
  $('viewBody').innerHTML = `
    <div class="row g-3">
      <div class="col-md-5">${i.imageUrl ? `<img src="${esc(i.imageUrl)}" class="img-fluid rounded" alt="">` : '<div class="thumb-placeholder rounded"><i class="bi bi-box-seam"></i></div>'}</div>
      <div class="col-md-7">
        <span class="badge text-bg-${i.type === 'lost' ? 'danger' : 'success'}">${i.type.toUpperCase()}</span> ${statusBadge(i.status)}
        <p class="mt-2">${esc(i.description) || '<em class="text-muted">No description.</em>'}</p>
        <ul class="list-unstyled small mb-0">
          <li><strong>Category:</strong> ${esc(i.category?.name)}</li>
          <li><strong>Location:</strong> ${esc(i.location)}</li>
          <li><strong>Date:</strong> ${fmtDate(i.dateOccurred)}</li>
          <li><strong>Reported by:</strong> ${esc(i.reportedBy?.name)}</li>
          ${i.contact ? `<li><strong>Contact:</strong> ${esc(i.contact)}</li>` : ''}
        </ul>
      </div>
    </div>${claimBox}`;
  const form = $('claimForm');
  if (form) form.addEventListener('submit', async e => {
    e.preventDefault();
    try {
      await api('/claims', { method: 'POST', body: { item: i._id, message: $('claimMsg').value.trim() } });
      viewModal.hide();
      showToast('Claim submitted! The finder/admin will review it.');
    } catch (err) { showToast(err.message, 'danger'); }
  });
  viewModal.show();
}

// ---------- Edit (PUT) ----------
function openEdit(i) {
  $('editId').value = i._id;
  $('editTitle').value = i.title;
  $('editType').value = i.type;
  $('editStatus').value = i.status;
  $('editCategory').value = i.category?._id || '';
  $('editDate').value = new Date(i.dateOccurred).toISOString().split('T')[0];
  $('editLocation').value = i.location;
  $('editDescription').value = i.description || '';
  $('editContact').value = i.contact || '';
  $('editImage').value = i.imageUrl || '';
  editModal.show();
}

$('editForm').addEventListener('submit', async e => {
  e.preventDefault();
  const id = $('editId').value;
  const body = {
    title: $('editTitle').value.trim(), type: $('editType').value, status: $('editStatus').value,
    category: $('editCategory').value, dateOccurred: $('editDate').value, location: $('editLocation').value.trim(),
    description: $('editDescription').value.trim(), contact: $('editContact').value.trim(), imageUrl: $('editImage').value.trim()
  };
  try {
    await api('/items/' + id, { method: 'PUT', body });
    editModal.hide();
    showToast('Report updated!');
    load();
  } catch (err) { showToast(err.message, 'danger'); }
});

// ---------- Delete ----------
async function deleteItem(id) {
  if (!confirm('Are you sure you want to delete this report? This cannot be undone.')) return;
  try {
    await api('/items/' + id, { method: 'DELETE' });
    showToast('Report deleted');
    load();
  } catch (err) { showToast(err.message, 'danger'); }
}

// ---------- Events ----------
$('itemList').addEventListener('click', e => {
  const btn = e.target.closest('button[data-id]');
  if (!btn) return;
  const id = btn.dataset.id;
  const item = items.find(x => x._id === id);
  if (btn.classList.contains('view-btn')) openView(item);
  else if (btn.classList.contains('edit-btn')) openEdit(item);
  else if (btn.classList.contains('delete-btn')) deleteItem(id);
});
$('pager').addEventListener('click', e => {
  const a = e.target.closest('a[data-p]');
  if (!a) return;
  e.preventDefault();
  page = parseInt(a.dataset.p);
  load();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
let timer;
$('fSearch').addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(() => { page = 1; load(); }, 350); });
['fType', 'fCategory', 'fStatus', 'fMine'].forEach(id => $(id).addEventListener('change', () => { page = 1; load(); }));
if (!user) $('fMine').closest('.col-6').style.display = 'none';

(async function init() {
  try {
    categories = await api('/categories');
    const opts = categories.map(c => `<option value="${c._id}">${esc(c.name)}</option>`).join('');
    $('fCategory').innerHTML = '<option value="">All</option>' + opts;
    $('editCategory').innerHTML = opts;
  } catch (err) { showToast('Could not load categories: ' + err.message, 'danger'); }
  load();
})();
