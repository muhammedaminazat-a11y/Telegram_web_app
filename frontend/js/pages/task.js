import { apiTasks } from "../api.js";

export function initTask() {
  const list = document.getElementById("tasksList");
  const addBtn = document.getElementById("addTaskBtn");
  const filters = document.getElementById("taskFilters");

  if (!list || !addBtn || !filters) return;

  let allTasks = [];
  let activeFilter = "all";

  function setActiveFilter(next) {
    activeFilter = next;
    filters.querySelectorAll(".filter").forEach((b) => {
      b.classList.toggle("is-active", b.dataset.filter === next);
    });
    render();
  }

  function filterTasks(tasks) {
    if (activeFilter === "done") return tasks.filter((t) => t.done);

    if (activeFilter === "today") {
      // если у задач нет даты — просто показываем НЕ выполненные как "на сегодня"
      return tasks.filter((t) => !t.done);
    }

    return tasks; // all
  }

  function render() {
    const tasks = filterTasks(allTasks);

    list.innerHTML = "";

    if (!tasks.length) {
      list.innerHTML = `<li class="task muted">Пока пусто</li>`;
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

        <button class="btn btn-ghost btn-sm" data-del type="button">🗑</button>
      `;

      li.querySelector(".task__title").textContent = t.title ?? "Без названия";
      li.querySelector(".task__meta").textContent = t.description ?? "";

      // toggle done
      li.querySelector(".task__check").addEventListener("change", async (e) => {
        try {
          await apiTasks.update(t.id, { done: e.target.checked });
          await load();
        } catch (err) {
          console.error(err);
          alert("Не удалось обновить задачу");
        }
      });

      // delete
      li.querySelector("[data-del]").addEventListener("click", async () => {
        if (!confirm("Удалить задачу?")) return;
        try {
          await apiTasks.remove(t.id);
          await load();
        } catch (err) {
          console.error(err);
          alert("Не удалось удалить задачу");
        }
      });

      list.appendChild(li);
    }
  }

  async function load() {
    list.innerHTML = `<li class="task">Загрузка…</li>`;
    try {
      allTasks = await apiTasks.getAll();
      render();
    } catch (err) {
      console.error(err);
      list.innerHTML = `<li class="task">API недоступен</li>`;
    }
  }

  // add task
  addBtn.addEventListener("click", async () => {
    const title = prompt("Название задачи:");
    if (!title) return;

    const description = prompt("Описание (необязательно):") || "";

    try {
      await apiTasks.create({ title, description, done: false });
      await load();
    } catch (err) {
      console.error(err);
      alert("Не удалось создать задачу");
    }
  });

  // filters click
  filters.addEventListener("click", (e) => {
    const btn = e.target.closest(".filter");
    if (!btn) return;
    setActiveFilter(btn.dataset.filter);
  });

  setActiveFilter("all");
  load();
}
