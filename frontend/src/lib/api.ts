const API_URL = import.meta.env.VITE_BACKEND_URL;

export async function apiGet<T = any>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`);
  if (!res.ok) throw new Error(`HTTP ERROR ${res.status}`);
  return res.json() as Promise<T>;
}

export async function apiPost<T = any>(path: string, body: any): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`HTTP ERROR ${res.status}`);
  return res.json() as Promise<T>;
}

export async function apiDelete<T = any>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error(`HTTP ERROR ${res.status}`);
  return res.json() as Promise<T>;
}

export function apiOpen(path: string) {
  window.open(`${API_URL}${path}`, "_blank");
}
