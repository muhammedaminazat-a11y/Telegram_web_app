// Если бек на другом порту — укажи явно:
const API_BASE = "http://10.171.7.173:8000";
// Если фронт и бек на одном домене — оставь ""

async function request(path, options = {})  {
  const res = await fetch(API_BASE + path, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text}`);
  }
  return res.json();
}

export const apiTasks = {
  getAll: () => request("/task/"),
  create: (data) => request("/task/", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) => request(`/task/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  remove: (id) => request(`/task/${id}`, { method: "DELETE" }),
};
