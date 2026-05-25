const API_BASE = (window.API_BASE || "http://localhost:8000") + "/task";

export const apiTasks = {
  getAll: async () => {
    try {
      // Добавляем timestamp, чтобы браузер (и Telegram) всегда запрашивали свежие данные
      const cacheBuster = `?t=${new Date().getTime()}`;
      const res = await fetch(API_BASE + cacheBuster);
      if (!res.ok) throw new Error(`Ошибка: ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error("Сетевая ошибка API:", err);
      throw err;
    }
  },
  create: async (data) => {
    const res = await fetch(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error(`Ошибка создания: ${res.status}`);
    return res.json();
  },
  update: async (id, data) => {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error(`Ошибка обновления: ${res.status}`);
    return res.json();
  },
  delete: async (id) => {
    const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error(`Ошибка удаления: ${res.status}`);
    return true;
  }
};