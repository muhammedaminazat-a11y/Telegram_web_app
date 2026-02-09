const API_BASE = window.AI_API_BASE || "http://localhost:8001";

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}/api/ai`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ message: text }),
  });


  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text}`);
  }

  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return res.json();
  }
  return null;
}

export const apiTasks = {
  getAll: () => request("/task/"),
  create: (data) =>
    request("/task/", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) =>
    request(`/task/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  remove: (id) =>
    request(`/task/${id}`, { method: "DELETE" }),
};
