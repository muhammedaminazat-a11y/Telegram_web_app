// frontend/js/api/tasks.js

// Сервер друга (можешь поменять 1 строкой)
// Можно переопределить в браузере: localStorage.setItem("TASKS_BASE", "http://10.171.7.173:8000/api")
export const TASKS_BASE =
  localStorage.getItem("TASKS_BASE") || "http://10.171.7.173:8000/api";

async function apiFetch(path, options = {}) {
  const url = `${TASKS_BASE}${path}`;

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`TASKS API ${res.status} ${res.statusText} | ${url} | ${text}`);
  }

  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) return res.json();
  return null;
}

export const TasksAPI = {
  list() {
    return apiFetch("/tasks");
  },
  create(title) {
    return apiFetch("/tasks", {
      method: "POST",
      body: JSON.stringify({ title }),
    });
  },
  patch(id, data) {
    return apiFetch(`/tasks/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },
  remove(id) {
    return apiFetch(`/tasks/${id}`, {
      method: "DELETE",
    });
  },
};
