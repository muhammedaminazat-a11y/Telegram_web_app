import { apiTasks } from "../api.js";

export function initTask() {
  const tg = window.Telegram?.WebApp;
  if (tg) tg.ready();

  const addBtn = document.getElementById("addTaskBtn");
  const taskForm = document.getElementById("taskForm");
  const tasksList = document.getElementById("tasksList");

  if (!addBtn || !taskForm) return;

  addBtn.addEventListener("click", () => {
    taskForm.style.display = "flex";
  });

  taskForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = {
      title: document.getElementById("title").value,
      description: document.getElementById("description").value,
      done: false
    };

    try {
      await apiTasks.create(data);
      taskForm.reset();
      taskForm.style.display = "none";
      await loadTasks();
    } catch (err) {
      console.error("Ошибка при создании задачи:", err);
    }
  });

  async function loadTasks(filter = "all") {
    if (!tasksList) return;
    
    try {
      const tasks = await apiTasks.getAll();
      tasksList.innerHTML = "";

      tasks.forEach(task => {
        const isDone = task.done;
        if (filter === "done" && !isDone) return;
        if (filter === "active" && isDone) return;

        const li = document.createElement("li");
        li.className = "task";
        if (isDone) li.style.opacity = "0.7";
        
        // Контейнер для текста (клик по нему меняет статус задачи)
        const infoDiv = document.createElement("div");
        infoDiv.style.flex = "1";
        infoDiv.style.cursor = "pointer";
        infoDiv.onclick = async () => {
          await apiTasks.update(task.id, { done: !isDone });
          await loadTasks(filter);
        };

        const titleDiv = document.createElement("div");
        titleDiv.className = "task__title";
        titleDiv.textContent = `${task.title} ${isDone ? "✅" : ""}`;
        
        const descSmall = document.createElement("small");
        descSmall.className = "muted";
        descSmall.textContent = task.description || "";

        infoDiv.appendChild(titleDiv);
        infoDiv.appendChild(descSmall);

        // Кнопка удаления
        const delBtn = document.createElement("button");
        delBtn.innerHTML = "🗑️";
        delBtn.style.border = "none";
        delBtn.style.background = "none";
        delBtn.style.cursor = "pointer";
        delBtn.style.fontSize = "1.2em";
        delBtn.onclick = async (e) => {
          e.stopPropagation(); // Чтобы не срабатывал клик по infoDiv
          tg.showConfirm("Удалить эту задачу?", async (confirmed) => {
        if (confirmed) {
        await apiTasks.delete(task.id);
        await loadTasks(filter);
      }
    });
        };

        li.appendChild(infoDiv);
        li.appendChild(delBtn);
        tasksList.appendChild(li);
      });

      if (tasksList.innerHTML === "") {
        tasksList.innerHTML = "<li class='muted'>Задач не найдено</li>";
      }
    } catch (err) {
      console.error("Ошибка загрузки задач:", err);
      tasksList.innerHTML = "<li class='muted'>Ошибка загрузки</li>";
    }
  }

  document.querySelectorAll(".filter").forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll(".filter").forEach(b => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      const filterText = document.getElementById("activeFilterText");
      if (filterText) filterText.textContent = btn.textContent;
      loadTasks(btn.dataset.filter);
    };
  });

  loadTasks();
}