import { apiTasks } from "../pages/api.js";
const tg = window.Telegram.WebApp;
tg.ready();

// показать форму
document.getElementById("addTaskBtn").addEventListener("click", () => {
  document.getElementById("taskForm").style.display = "block";
});

// отправка формы
  document.getElementById("taskForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = {
      title: document.getElementById("title").value,
      description: document.getElementById("description").value,
      done: false
    };

    await apiTasks.create(data);

    document.getElementById("taskForm").reset();
    document.getElementById("taskForm").style.display = "none";

    await loadTasks();
    tg.close(); // закрыть Mini App после сохранения
  });

  // проверка даты
  function isToday(dateString) {
    const d = new Date(dateString);
    const today = new Date();
    return d.getDate() === today.getDate() &&
           d.getMonth() === today.getMonth() &&
           d.getFullYear() === today.getFullYear();
  }

  // загрузка задач
  async function loadTasks(filter = "all") {
    const tasks = await apiTasks.getAll();
    const list = document.getElementById("tasksList");
    list.innerHTML = "";

    tasks.forEach(task => {
      if (filter === "done" && !task.done) return;
      if (filter === "today" && !isToday(task.created_at)) return;

      const li = document.createElement("li");
      li.className = "task";
      li.textContent = task.title + (task.done ? " ✅" : "");
      list.appendChild(li);
    });
  }

  // фильтры
  document.querySelectorAll(".filter").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter").forEach(b => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      document.getElementById("activeFilterText").textContent = btn.textContent;
      loadTasks(btn.dataset.filter);
    });
  });

  window.onload = () => loadTasks();