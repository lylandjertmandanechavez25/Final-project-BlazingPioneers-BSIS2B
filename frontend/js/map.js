const mapEl = document.getElementById("miniMap");
if (mapEl) {
  const lat = parseFloat(mapEl.dataset.lat), lng = parseFloat(mapEl.dataset.lng);
  const map = L.map(mapEl).setView([lat, lng], 17);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: "&copy; OpenStreetMap contributors" }).addTo(map);
  L.marker([lat, lng]).addTo(map);
}
