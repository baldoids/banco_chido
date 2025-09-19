export const API_BASE = "http://localhost:3000";

export async function apiGet(path) {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) throw new Error(`GET ${path} -> ${res.status}`);
  return res.json();
}
export async function apiPost(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error(`POST ${path} -> ${res.status}`);
  return res.json();
}
export function saveSession(user){ sessionStorage.setItem("bbva_user", JSON.stringify(user)); }
export function getSession(){ const r = sessionStorage.getItem("bbva_user"); return r? JSON.parse(r): null; }
export function clearSession(){ sessionStorage.removeItem("bbva_user"); }
