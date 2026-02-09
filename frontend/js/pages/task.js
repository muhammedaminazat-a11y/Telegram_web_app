import { apiTasks } from "../api.js";

export function initTask() {
  const list = document.getElementById("tasksList");
  const addBtn = document.getElementById("addTaskBtn");

  if (!list || !addBtn) return;

  function renderLoading() {
    list.innerHTML = `<li class="task">Загрузка…</li>`;
  }

  function renderError(msg) {
    list.innerHTML = `<li class="task">${msg}</li>`;
  }

  function render(tasks) {
    list.innerHTML = "";

    if (!tasks.length) {
      list.innerHTML = `<li class="task muted">Задач пока нет</li>`;
      return;
    }

    for (const t of tasks) {
      const li = document.createElement("li");
      li.className = "task";

      li.innerHTML = `
        <label class="chk">
          <input type="checkbox" class="task__check" ${t.done ? "checked" : ""}/>
          <span class="chk__ui"></span>
        </label>

        <div class="task__body">
          <div class="task__title"></div>
          <div class="task__meta"></div>
        </div>

        <button class="btn btn-ghost btn-sm" data-del>🗑</button>
      `;

      li.querySelector(".task__title").textContent = t.title;
      li.querySelector(".task__meta").textContent = t.description || "";

      li.querySelector(".task__check").addEventListener("change", async (e) => {
        try {
          await apiTasks.update(t.id, { done: e.target.checked });
          load();
        } catch {
          alert("Не удалось обновить задачу");
        }
      });

      li.querySelector("[data-del]").addEventListener("click", async () => {
        if (!confirm("Удалить задачу?")) return;
        try {
          await apiTasks.remove(t.id);
          load();
        } catch {
          alert("Не удалось удалить задачу");
        }
      });

      list.appendChild(li);
    }
  }

  async function load() {
    renderLoading();
    try {
      const tasks = await apiTasks.getAll();
      render(tasks);
    } catch {
      renderError("API недоступен");
    }
  }

  addBtn.addEventListener("click", async () => {
    const title = prompt("Название задачи:");
    if (!title) return;

    const description = prompt("Описание (необязательно):") || "";

    try {
      await apiTasks.create({ title, description, done: false });
      load();
    } catch {
      alert("Не удалось создать задачу");
    }
  });

  load();
}
  
const hint = document.getElementById("taskHint");

function showHint(text) {
  if (!hint) return;
  hint.style.display = "block";
  hint.textContent = text;
}

function hideHint() {
  if (!hint) return;
  hint.style.display = "none";
  hint.textContent = "";
}
async function load() {
  renderLoading();
  hideHint();
  try {
    const tasks = await apiTasks.getAll();
    render(tasks);
  } catch (e) {
    console.error(e);
    showHint("Сервер недоступен. Работаем в режиме демо.");
    renderError("API недоступен");
  }
}
