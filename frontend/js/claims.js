function showAlert(msg, type = "info") {
  const box = document.getElementById("alertBox");
  if (box) box.innerHTML = `<div class="alert alert-${type}">${msg}</div>`;
}

// Collects the form data and logs it. Backend integration: replace the TODO with a call to api() from api.js.
function bindForm(id, endpoint, check) {
  const form = document.getElementById(id);
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    const problem = check && check(data);
    if (problem) return showAlert(problem, "warning");
    console.log(endpoint, data);
    // TODO: await api("<path>", { method: "POST", body: JSON.stringify(data) });
    showAlert(`Form captured. ${endpoint} will be connected during backend integration.`);
    const modalEl = form.closest(".modal");
    if (modalEl) bootstrap.Modal.getInstance(modalEl)?.hide();
  });
}

bindForm("claimForm", "POST /api/claims");
bindForm("reviewForm", "PUT /api/claims/:id");
bindForm("inventoryForm", "PUT /api/items/:id");
bindForm("roleForm", "PUT /api/users/:id/role");
bindForm("locationForm", "POST /api/locations");
bindForm("editItemForm", "PUT /api/items/:id");
