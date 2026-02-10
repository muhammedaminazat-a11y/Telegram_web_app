// frontend/js/pages/task.js
import { TasksAPI } from "../api/tasks.js";

export function initTask() {
  // === поменяй здесь, если у тебя другие id ===
  const listEl = document.getElementById("taskList");
  const inputEl = document.getElementById("taskTitle");
  const addBtn = document.getElementById("taskAddBtn");

  if (!listEl) {
    console.warn("taskList не найден в task.html");
    return;
  }

  // Чтобы не падало, если input/button нет — всё равно покажем список
  async function refresh() {
    try {
      const tasks = await TasksAPI.list();
      render(tasks);
    } catch (e) {
      console.error(e);
      listEl.innerHTML = `
        <li class="task">
          <div class="task__body">
            <div class="task__title">Ошибка загрузки задач</div>
            <div class="task__meta">${escapeHtml(String(e.message || e))}</div>
          </div>
        </li>
      `;
    }
  }

  function render(tasks) {
    if (!Array.isArray(tasks)) tasks = [];

    listEl.innerHTML = tasks
      .map(
        (t) => `
      <li class="task" data-id="${t.id}">
        <label class="chk">
          <input type="checkbox" ${t.done ? "checked" : ""} />
          <span class="chk__ui"></span>
        </label>

        <div class="task__body">
          <div class="task__title">${escapeHtml(t.title)}</div>
          <div class="task__meta">${formatDate(t.created_at)}</div>
        </div>

        <span class="pill ${t.done ? "pill-soft" : ""}">
          ${t.done ? "done" : "todo"}
        </span>

        <button class="btn btn-ghost" type="button" data-del="1">🗑</button>
      </li>
    `
      )
      .join("");
  }

  // Добавление
  addBtn?.addEventListener("click", async () => {
    const title = (inputEl?.value || "").trim();
    if (!title) return;

    addBtn.disabled = true;
    try {
      await TasksAPI.create(title);
      if (inputEl) inputEl.value = "";
      await refresh();
    } catch (e) {
      console.error(e);
      alert(`Не удалось создать задачу: ${e.message || e}`);
    } finally {
      addBtn.disabled = false;
    }
  });

  // Enter в инпуте
  inputEl?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") addBtn?.click();
  });

  // Удаление (делегирование)
  listEl.addEventListener("click", async (e) => {
    const li = e.target.closest(".task");
    if (!li) return;

    const id = Number(li.dataset.id);
    if (!Number.isFinite(id)) return;

    if (e.target.closest("[data-del]")) {
      try {
        await TasksAPI.remove(id);
        await refresh();
      } catch (err) {
        console.error(err);
        alert(`Не удалось удалить: ${err.message || err}`);
      }
    }
  });

  // done toggle
  listEl.addEventListener("change", async (e) => {
    const li = e.target.closest(".task");
    if (!li) return;

    const id = Number(li.dataset.id);
    if (!Number.isFinite(id)) return;

    if (e.target.matches('input[type="checkbox"]')) {
      const done = e.target.checked;

      try {
        await TasksAPI.patch(id, { done });
        await refresh();
      } catch (err) {
        console.error(err);
        alert(`Не удалось обновить: ${err.message || err}`);
      }
    }
  });

  // старт
  refresh();
}

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function formatDate(iso) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return String(iso);
  }
}
