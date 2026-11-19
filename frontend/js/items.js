const sampleItems = [
  { _id: "1", itemName: "Black umbrella", category: "Other",  type: "lost",  status: "reported", description: "Folding umbrella with a red handle." },
  { _id: "2", itemName: "Student ID",     category: "ID",     type: "found", status: "found",    description: "BSIS student ID, name not readable." },
  { _id: "3", itemName: "Blue backpack",  category: "Bag",    type: "found", status: "claimed",  description: "Has a laptop sleeve inside." }
];

const statusColor = { reported: "secondary", found: "success", claimed: "primary" };

function render() {
  const q = document.getElementById("search").value.toLowerCase();
  const cat = document.getElementById("filterCategory").value;
  const type = document.getElementById("filterType").value;
  const status = document.getElementById("filterStatus").value;

  const list = sampleItems.filter((i) =>
    (!q || (i.itemName + " " + i.description).toLowerCase().includes(q)) &&
    (!cat || i.category === cat) && (!type || i.type === type) && (!status || i.status === status));

  const grid = document.getElementById("itemGrid");
  if (!list.length) { grid.innerHTML = `<p class="text-muted">No items match your filters.</p>`; return; }

  grid.innerHTML = list.map((i) => `
    <div class="col-sm-6 col-lg-4">
      <div class="card h-100 shadow-sm">
        <div class="card-body">
          <div class="d-flex justify-content-between mb-2">
            <span class="badge text-bg-${i.type === "lost" ? "danger" : "success"}">${i.type}</span>
            <span class="badge text-bg-${statusColor[i.status]}">${i.status}</span>
          </div>
          <h2 class="h6">${i.itemName}</h2>
          <p class="small text-muted mb-2">${i.category}</p>
          <p class="small">${i.description}</p>
        </div>
        <div class="card-footer bg-white border-0 d-flex gap-2">
          <a href="item-details.html?id=${i._id}" class="btn btn-outline-primary btn-sm flex-fill">View details</a>
          <button type="button" class="btn btn-outline-danger btn-sm" data-name="${i.itemName}"
                  data-bs-toggle="modal" data-bs-target="#deleteModal">Delete</button>
        </div>
      </div>
    </div>`).join("");
}

document.getElementById("deleteModal").addEventListener("show.bs.modal", (e) => {
  document.getElementById("deleteName").textContent = e.relatedTarget.dataset.name;
});
document.getElementById("filterForm").addEventListener("submit", (e) => e.preventDefault());
["search", "filterCategory", "filterType", "filterStatus"].forEach((id) =>
  document.getElementById(id).addEventListener("input", render));

render();