const content = document.getElementById("app-content");
const buttons = document.querySelectorAll(".nav-btn");

// дата в шапке
const d = new Date();
const opts = { weekday: "short", day: "2-digit", month: "short" };
document.getElementById("todayText").textContent = d.toLocaleDateString("ru-RU", opts);

async function loadScreen(name) {
  const res = await fetch(`screens/${name}.html?v=2`);
  const html = await res.text();
  content.innerHTML = html;

  // после подгрузки нужно подключить обработчики конкретного экрана
  if (name === "home") initHome();
  if (name === "pomodoro") initPomodoro();
  if (name === "tasks") initTasks();
  // click/profile пока не требуют JS
}

function setActive(target) {
  buttons.forEach(b => b.classList.toggle("is-active", b.dataset.target === target));
  loadScreen(target);
  window.scrollTo({ top: 0, behavior: "instant" });
}

buttons.forEach(btn => btn.addEventListener("click", () => setActive(btn.dataset.target)));

// --- HOME handlers
function initHome(){
  const goPomodoro = document.getElementById("goPomodoro");
  const openTasks = document.getElementById("openTasksFromHome");

  if (goPomodoro) goPomodoro.addEventListener("click", () => setActive("pomodoro"));
  if (openTasks) openTasks.addEventListener("click", () => setActive("tasks"));
}

// --- POMODORO handlers
function initPomodoro(){
  let timer = null;
  let totalSec = 25 * 60;
  let remaining = totalSec;

  const timerText = document.getElementById("timerText");
  const startBtn = document.getElementById("startTimerBtn");
  const resetBtn = document.getElementById("resetTimerBtn");

  function renderTime(sec){
    const m = String(Math.floor(sec / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    timerText.textContent = `${m}:${s}`;
  }

  function stopTimer(){
    if (timer) clearInterval(timer);
    timer = null;
  }

  renderTime(remaining);

  startBtn?.addEventListener("click", () => {
    if (timer) return;
    timer = setInterval(() => {
      remaining -= 1;
      renderTime(remaining);
      if (remaining <= 0){
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

  document.querySelectorAll(".seg").forEach(seg => {
    seg.addEventListener("click", () => {
      document.querySelectorAll(".seg").forEach(s => s.classList.remove("is-active"));
      seg.classList.add("is-active");
      const min = Number(seg.dataset.min);
      totalSec = min * 60;
      remaining = totalSec;
      renderTime(remaining);
      stopTimer();
    });
  });
}

// --- TASKS handlers (заглушка на будущее)
function initTasks(){
  // сюда потом добавим добавление/фильтры/сохранение
}

// старт
loadScreen("home");
