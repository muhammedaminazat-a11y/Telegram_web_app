import { apiTasks } from "../api.js";

export function initTask() {
  const tg = window.Telegram?.WebApp;
  if (tg) tg.ready();

  const addBtn = document.getElementById("addTaskBtn");
  const taskForm = document.getElementById("taskForm");
  const tasksList = document.getElementById("tasksList");

  if (!addBtn || !taskForm) return;

  // Используем onclick вместо addEventListener, чтобы избежать дублей в SPA
  addBtn.onclick = () => {
    taskForm.style.display = "flex";
    document.getElementById("title").focus(); // Автофокус на поле ввода
  };

  // Закрытие формы при клике на темный фон (вне самой модалки)
  taskForm.onclick = (e) => {
    if (e.target === taskForm) {
      taskForm.style.display = "none";
    }
  };

  taskForm.onsubmit = async (e) => {
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
      if (tg?.showAlert) {
        tg.showAlert("Не удалось создать задачу. Проверь сеть или длину названия (мин. 3 символа).");
      } else {
        alert("Ошибка создания задачи. Проверьте название.");
      }
    }
  };

  async function loadTasks(filter = "all") {
    if (!tasksList) return;
    
    try {
      const tasks = await apiTasks.getAll();
      tasksList.innerHTML = "";

      tasks.forEach(task => {
        const isDone = task.done;
        
        // Логика фильтрации
        if (filter === "done" && !isDone) return;
        if (filter === "today") {
           // Для Junior: пока просто имитируем, что новые задачи — это "сегодня"
           // Если в БД появится поле date, здесь будет сравнение дат
        }
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
          e.stopPropagation();
          const confirmMsg = "Удалить эту задачу?";

          const performDelete = async () => {
            try {
              await apiTasks.delete(task.id);
              await loadTasks(filter);
            } catch (err) {
              console.error("Ошибка удаления:", err);
              if (tg?.showAlert) tg.showAlert("Не удалось удалить задачу.");
              else alert("Не удалось удалить задачу.");
            }
          };

          // Проверяем версию WebApp: showConfirm стабильно работает с версии 6.1
          // Если версия ниже 6.1, используем window.confirm
          const isWebAppVersionSupported = tg && tg.version && parseFloat(tg.version) >= 6.1;

          if (isWebAppVersionSupported && typeof tg.showConfirm === 'function') {
            tg.showConfirm(confirmMsg, (confirmed) => {
              if (confirmed) performDelete();
            });
          } else {
            if (window.confirm(confirmMsg)) {
              performDelete();
            }
          }
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