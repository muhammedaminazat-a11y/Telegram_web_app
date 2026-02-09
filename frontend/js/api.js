// Если бек на другом порту — укажи явно:
const API_BASE = "http://192.168.1.104:8000";
// Если фронт и бек на одном домене — оставь ""

async function request(path, options = {}) {
  const res = await fetch(API_BASE + path, {
    headers: { "Content-Type": "application/json" },
    ...options,
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
