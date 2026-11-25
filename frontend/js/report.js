if (requireAuth()) {
  renderNavbar('report');
  const today = new Date().toISOString().split('T')[0];
  const dateInput = document.getElementById('dateOccurred');
  dateInput.max = today; dateInput.value = today;

  api('/categories').then(cats => {
    document.getElementById('category').innerHTML = '<option value="">Choose...</option>' + cats.map(c => `<option value="${c._id}">${esc(c.name)}</option>`).join('');
  }).catch(err => showToast(err.message, 'danger'));

  document.getElementById('reportForm').addEventListener('submit', async e => {
    e.preventDefault();
    const msg = document.getElementById('msg');
    const btn = document.getElementById('submitBtn');
    const body = {
      type: document.querySelector('input[name="type"]:checked').value,
      title: document.getElementById('title').value.trim(),
      category: document.getElementById('category').value,
      description: document.getElementById('description').value.trim(),
      location: document.getElementById('location').value.trim(),
      dateOccurred: dateInput.value,
      contact: document.getElementById('contact').value.trim(),
      imageUrl: document.getElementById('imageUrl').value.trim()
    };
    if (!body.title || !body.category || !body.location || !body.dateOccurred)
      return msg.innerHTML = '<div class="alert alert-danger">Item name, category, location and date are required.</div>';
    btn.disabled = true;
    try {
      await api('/items', { method: 'POST', body });
      showToast('Report submitted successfully!');
      setTimeout(() => location.href = 'dashboard.html', 900);
    } catch (err) {
      msg.innerHTML = `<div class="alert alert-danger">${esc(err.message)}</div>`;
      btn.disabled = false;
    }
  });
}
