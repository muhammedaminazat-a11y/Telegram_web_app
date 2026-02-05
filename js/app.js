// js/app.js

document.addEventListener("DOMContentLoaded", () => {
  const content = document.getElementById("app-content");
  const buttons = document.querySelectorAll(".nav-btn");

  if (!content) {
    console.error('Не найден элемент #app-content');
    return;
  }

  // ---- Дата в шапке (без падения, если элемента нет)
  const todayEl = document.getElementById("todayText");
  if (todayEl) {
    const d = new Date();
    const opts = { weekday: "short", day: "2-digit", month: "short" };
    todayEl.textContent = d.toLocaleDateString("ru-RU", opts);
  }

  // ---- Карта путей (папка -> index.html)
  function screenUrl(name) {
    // ВАЖНО: без ведущего "/"
    return `screens/${name}/index.html?v=2`;
  }

  async function loadScreen(name) {
    try {
      const url = screenUrl(name);
      const res = await fetch(url, { cache: "no-store" });

      console.log("Loading:", url, "Status:", res.status);

      if (!res.ok) {
        content.innerHTML = `
          <div style="padding:16px; font-family: sans-serif;">
            <h3>Экран не найден</h3>
            <p><b>${name}</b></p>
            <p>Путь: <code>${url}</code></p>
            <p>HTTP: ${res.status}</p>
          </div>
        `;
        return;
      }

      const html = await res.text();
      content.innerHTML = html;

      // Инициализация логики конкретного экрана
      if (name === "home") initHome();
      if (name === "pomodoro") initPomodoro();
      if (name === "tasks") initTasks();
      // click/profile пока без JS
    } catch (err) {
      console.error(err);
      content.innerHTML = `
        <div style="padding:16px; font-family: sans-serif;">
          <h3>Ошибка загрузки</h3>
          <p>Экран: <b>${name}</b></p>
          <p>Смотри Console (F12) для деталей.</p>
        </div>
      `;
    }
  }

  function setActive(target) {
    buttons.forEach((b) =>
      b.classList.toggle("is-active", b.dataset.target === target)
    );

    loadScreen(target);

    // прокрутка наверх
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  // клики по нижней навигации
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.target;
      if (!target) return;
      setActive(target);
    });
  });

  // --- HOME handlers
  function initHome() {
    const goPomodoro = document.getElementById("goPomodoro");
    const openTasks = document.getElementById("openTasksFromHome");

    if (goPomodoro) goPomodoro.addEventListener("click", () => setActive("pomodoro"));
    if (openTasks) openTasks.addEventListener("click", () => setActive("tasks"));
  }

  // --- POMODORO handlers
  function initPomodoro() {
    let timer = null;
    let totalSec = 25 * 60;
    let remaining = totalSec;

    const timerText = document.getElementById("timerText");
    const startBtn = document.getElementById("startTimerBtn");
    const resetBtn = document.getElementById("resetTimerBtn");

    if (!timerText) {
      console.warn("Не найден #timerText на экране pomodoro");
      return;
    }

    function renderTime(sec) {
      const m = String(Math.floor(sec / 60)).padStart(2, "0");
      const s = String(sec % 60).padStart(2, "0");
      timerText.textContent = `${m}:${s}`;
    }

    function stopTimer() {
      if (timer) clearInterval(timer);
      timer = null;
    }

    renderTime(remaining);

    startBtn?.addEventListener("click", () => {
      if (timer) return;

      timer = setInterval(() => {
        remaining -= 1;
        renderTime(remaining);

        if (remaining <= 0) {
          stopTimer();
          remaining = totalSec;
          renderTime(remaining);
          alert("Фокус завершён. Перерыв 5 минут 🙂");
        }
      }, 1000);
    });

    resetBtn?.addEventListener("click", () => {
      stopTimer();
      remaining = totalSec;
      renderTime(remaining);
    });

    document.querySelectorAll(".seg").forEach((seg) => {
      seg.addEventListener("click", () => {
        document.querySelectorAll(".seg").forEach((s) => s.classList.remove("is-active"));
        seg.classList.add("is-active");

        const min = Number(seg.dataset.min);
        if (!Number.isFinite(min) || min <= 0) return;

        totalSec = min * 60;
        remaining = totalSec;
        renderTime(remaining);
        stopTimer();
      });
    });
  }

  // --- TASKS handlers (заглушка)
  function initTasks() {
    // позже добавишь логику задач
  }

  // стартовый экран
  setActive("home");
});
