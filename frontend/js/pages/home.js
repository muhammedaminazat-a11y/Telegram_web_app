import { apiTasks } from "../api.js";

export function initHome(setActive) {
  // ---- Profile mini
  const nameEl = document.getElementById("homeName");
  const userEl = document.getElementById("homeUsername");
  const idEl = document.getElementById("homeId");
  const avatarEl = document.getElementById("homeAvatar");
  const goProfileBtn = document.getElementById("goProfileFromHome");

  function setText(el, text) {
    if (el) el.textContent = text;
  }

  const tg = window.Telegram?.WebApp;
  if (tg?.initDataUnsafe?.user) {
    const u = tg.initDataUnsafe.user;
    const fullName = [u.first_name, u.last_name].filter(Boolean).join(" ").trim();
    const username = u.username ? `@${u.username}` : "(без username)";
    setText(nameEl, fullName || "Пользователь");
    setText(userEl, username);
    setText(idEl, String(u.id));

    // аватар Telegram SDK напрямую не даёт url, оставляем дефолт
  } else {
    setText(nameEl, "Не в Telegram");
    setText(userEl, "Открой через Telegram Mini App");
    setText(idEl, "—");
    if (avatarEl) avatarEl.src = "frontend/image/profile.svg";
  }

  goProfileBtn?.addEventListener("click", () => setActive("profile"));

  // ---- Today tasks
  const list = document.getElementById("homeTaskList");
  const hint = document.getElementById("homeTaskHint");
  const openTasksBtn = document.getElementById("openTasksFromHome");
  const addBtn = document.getElementById("addQuickTaskBtn");

  openTasksBtn?.addEventListener("click", () => setActive("task"));

  function showHint(text) {
    if (hint) hint.textContent = text;
  }

  function isTodayTask(t) {
    // Пока у задач нет даты — считаем “все = сегодня”
    // Позже можно добавить поле due_date и фильтровать реально.
    return true;
  }

  function render(tasks) {
    if (!list) return;
    list.innerHTML = "";

    const today = tasks.filter(isTodayTask).slice(0, 5);

    if (!today.length) {
      showHint("Сегодня задач нет. Добавь первую 👇");
      return;
    }

    showHint(`Показано ${today.length} задач`);

    for (const t of today) {
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
      `;

      li.querySelector(".task__title").textContent = t.title;
      li.querySelector(".task__meta").textContent = t.description || "";

      li.querySelector(".task__check").addEventListener("change", async (e) => {
        try {
          await apiTasks.update(t.id, { done: e.target.checked });
          load();
        } catch {
          alert("Не удалось обновить задачу (API)");
          e.target.checked = !e.target.checked;
        }
      });

      list.appendChild(li);
    }
  }

  async function load() {
    showHint("Загружаю задачи…");
    try {
      const tasks = await apiTasks.getAll();
      render(tasks);
    } catch (e) {
      console.error(e);
      showHint("API недоступен. Проверь, запущен ли backend.");
      if (list) list.innerHTML = "";
    }
  }

  addBtn?.addEventListener("click", async () => {
    const title = prompt("Название задачи:");
    if (!title) return;
    const description = prompt("Описание (необязательно):") || "";

    try {
      await apiTasks.create({ title, description, done: false });
      load();
    } catch (e) {
      console.error(e);
      alert("Не удалось создать задачу (API недоступен?)");
    }
  });

// ---- Games
  document.getElementById("goClickGame")
      ?.addEventListener("click", () => setActive("click"));

  document.getElementById("goSnakeGame")
      ?.addEventListener("click", () => setActive("snake"));

  document.getElementById("goReactionGame")
      ?.addEventListener("click", () => setActive("reaction"));



  // стартовая загрузка
  load();
}
