const API_URL = "http://localhost:3000/api";

function getToken() { return localStorage.getItem("token"); }
function getUser() { return JSON.parse(localStorage.getItem("user") || "null"); }

async function api(path, options = {}) {
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  if (getToken()) headers["Authorization"] = "Bearer " + getToken();
  const res = await fetch(API_URL + path, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Something went wrong");
  return data;
}

// Ilagay sa taas ng mga protected page. Halimbawa: requireLogin(["admin","staff"])
function requireLogin(allowedRoles) {
  const user = getUser();
  if (!getToken() || !user) { window.location.href = "login.html"; return; }
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    window.location.href = "dashboard.html";
  }
}

function logout() { localStorage.clear(); window.location.href = "login.html"; }