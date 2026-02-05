// js/app.js

document.addEventListener("DOMContentLoaded", () => {
  const content = document.getElementById("app-content");
  const buttons = document.querySelectorAll(".nav-btn");

  if (!content) {
    console.error("Не найден #app-content");
    return;
  }

  // ---- Дата в шапке (не упадёт, если элемента нет)
  const todayEl = document.getElementById("todayText");
  if (todayEl) {
    const d = new Date();
    const opts = { weekday: "short", day: "2-digit", month: "short" };
    todayEl.textContent = d.toLocaleDateString("ru-RU", opts);
  }

  // ---- путь к экрану (файлы лежат в screens/*.html)
  function screenUrl(name) {
    return `screens/${name}.html?v=2`; // важно: без ведущего "/"
  }

  async function loadScreen(name) {
    try {
      const url = screenUrl(name);
      const res = await fetch(url, { cache: "no-store" });

      console.log("Loading:", url, "Status:", res.status);

      if (!res.ok) {
        content.innerHTML = `
          <div style="padding:16px; font-family:sans-serif;">
            <h3>Экран не найден</h3>
            <p>name: <b>${name}</b></p>
            <p>url: <code>${url}</code></p>
            <p>HTTP: ${res.status}</p>
          </div>
        `;
        return;
      }

      content.innerHTML = await res.text();

      // init после вставки HTML
      if (name === "home") initHome();
      if (name === "pomodoro") initPomodoro();
      if (name === "tasks") initTasks();
      // click/profile пока без JS
    } catch (e) {
      console.error(e);
      content.innerHTML = `
        <div style="padding:16px; font-family:sans-serif;">
          <h3>Ошибка загрузки экрана</h3>
          <p>Открой Console (F12).</p>
        </div>
      `;
    }
  }

  function setActive(target) {
    buttons.forEach((b) =>
      b.classList.toggle("is-active", b.dataset.target === target)
    );

    loadScreen(target);
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
      console.warn("На экране pomodoro нет #timerText");
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
  function initTasks() {}

  // старт
  setActive("home");
});
