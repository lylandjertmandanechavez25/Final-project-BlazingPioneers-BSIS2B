const map = L.map("miniMap").setView([13.2970, 123.4860], 17);
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors"
}).addTo(map);

let marker = null;
map.on("click", (e) => {
  if (marker) marker.setLatLng(e.latlng); else marker = L.marker(e.latlng).addTo(map);
  document.getElementById("pinLat").value = e.latlng.lat;
  document.getElementById("pinLng").value = e.latlng.lng;
  document.getElementById("pinText").textContent =
    `Pin: ${e.latlng.lat.toFixed(5)}, ${e.latlng.lng.toFixed(5)}`;
});

// ---- Show "stored at" only for Found items ----
document.querySelectorAll('input[name="type"]').forEach((r) =>
  r.addEventListener("change", () => {
    document.getElementById("storedAtGroup").style.display =
      document.getElementById("typeFound").checked ? "block" : "none";
  })
);

// ---- Image picker with preview ----
const imageInput = document.getElementById("image");
const preview = document.getElementById("imagePreview");
const removeBtn = document.getElementById("removeImageBtn");
const addBtn = document.getElementById("addImageBtn");
const MAX_SIZE = 2 * 1024 * 1024;

addBtn.addEventListener("click", () => imageInput.click());
removeBtn.addEventListener("click", clearImage);

imageInput.addEventListener("change", () => {
  const file = imageInput.files[0];
  if (!file) return;
  if (!file.type.startsWith("image/")) { clearImage(); return showAlert("Please choose an image file.", "warning"); }
  if (file.size > MAX_SIZE) { clearImage(); return showAlert("Image is too large. Choose one under 2 MB.", "warning"); }
  document.getElementById("alertBox").innerHTML = "";
  preview.src = URL.createObjectURL(file);
  preview.hidden = false;
  removeBtn.hidden = false;
  addBtn.textContent = "Change image";
});

function clearImage() {
  imageInput.value = "";
  preview.hidden = true;
  preview.removeAttribute("src");
  removeBtn.hidden = true;
  addBtn.textContent = "Add image";
}

function showAlert(msg, type) {
  document.getElementById("alertBox").innerHTML = `<div class="alert alert-${type}">${msg}</div>`;
}

// ---- Submit (placeholder) ----
document.getElementById("reportForm").addEventListener("submit", (e) => {
  e.preventDefault();
  if (!document.getElementById("pinLat").value) {
    return showAlert("Click the map to pin the location.", "warning");
  }
  // TODO (backend integration): send the form data to the API, e.g.
  // fetch("http://localhost:3000/api/items", { method: "POST", ... })
  showAlert("Form is ready. API connection will be added during backend integration.", "info");
});