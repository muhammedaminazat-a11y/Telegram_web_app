export function initPomodoro() {
  const ring = document.getElementById("pomRing");
  const timerText = document.getElementById("timerText");
  const startBtn = document.getElementById("startTimerBtn");
  const resetBtn = document.getElementById("resetTimerBtn");
  const statusEl = document.getElementById("pomStatus");
  const subEl = document.getElementById("pomSub");

  if (!ring || !timerText || !startBtn || !resetBtn) return;

  // Telegram haptic (если открыто в Telegram)
  const tg = window.Telegram?.WebApp;
  const haptic = tg?.HapticFeedback;

  const KEY = "pomodoro_v2";

  let tick = null;

  const defaults = {
    minutes: 25,
    // totalSec — длительность режима (25/45/50) в сек.
    totalSec: 25 * 60,
    // remainingSec — остаток (для паузы)
    remainingSec: 25 * 60,
    running: false,
    // endAt нужен только когда running=true
    endAt: null,
  };

  function loadState() {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? { ...defaults, ...JSON.parse(raw) } : { ...defaults };
    } catch {
      return { ...defaults };
    }
  }

  function saveState() {
    localStorage.setItem(KEY, JSON.stringify(state));
  }

  let state = loadState();

  function format(sec) {
    const m = String(Math.floor(sec / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${m}:${s}`;
  }

  function getRemaining() {
    if (!state.running || !state.endAt) return state.remainingSec;
    const now = Date.now();
    return Math.max(0, Math.ceil((state.endAt - now) / 1000));
  }

  function setProgress(remainingSec) {
    const done = state.totalSec - remainingSec;
    const pct = state.totalSec > 0 ? (done / state.totalSec) * 100 : 0;
    ring.style.setProperty("--p", `${Math.min(100, Math.max(0, pct))}%`);
  }

  function setStatus(text, sub = "осталось") {
    if (statusEl) statusEl.textContent = text;
    if (subEl) subEl.textContent = sub;
  }

  function render() {
    const remaining = getRemaining();
    timerText.textContent = format(remaining);
    setProgress(remaining);

    if (state.running) {
      startBtn.textContent = "Пауза";
      setStatus("Фокус идёт…", "осталось");
    } else {
      startBtn.textContent = "Старт";
      // если осталось меньше total — значит пауза
      if (state.remainingSec < state.totalSec) {
        setStatus("Пауза • нажми Старт чтобы продолжить", "осталось");
      } else {
        setStatus("Фокус • выбери режим и нажми Старт", "осталось");
      }
    }
  }

  function stopTick() {
    if (tick) clearInterval(tick);
    tick = null;
  }

  function startTick() {
    stopTick();
    tick = setInterval(() => {
      const remaining = getRemaining();

      // если бежит — обновим remainingSec, чтобы сохранялось
      if (state.running) {
        state.remainingSec = remaining;
        saveState();
      }

      render();

      if (state.running && remaining <= 0) {
        // finish
        stopTick();
        state.running = false;
        state.endAt = null;
        state.remainingSec = 0;
        saveState();

        haptic?.notificationOccurred?.("success");
        setStatus("Готово ✅", "фокус завершён");
        startBtn.textContent = "Старт";

        // Автосброс в исходный режим через 1 сек (можно убрать если не надо)
        setTimeout(() => {
          state.remainingSec = state.totalSec;
          saveState();
          render();
        }, 1000);

        alert("Фокус завершён. Перерыв 5 минут 🙂");
      }
    }, 300);
  }

  function start() {
    const remaining = getRemaining();
    if (remaining <= 0) {
      state.remainingSec = state.totalSec;
    }
    state.running = true;
    state.endAt = Date.now() + state.remainingSec * 1000;
    saveState();

    haptic?.impactOccurred?.("light");
    startTick();
    render();
  }

  function pause() {
    state.remainingSec = getRemaining();
    state.running = false;
    state.endAt = null;
    saveState();

    haptic?.impactOccurred?.("light");
    stopTick();
    render();
  }

  function reset() {
    state.running = false;
    state.endAt = null;
    state.remainingSec = state.totalSec;
    saveState();

    haptic?.impactOccurred?.("medium");
    stopTick();
    render();
  }

  // Кнопки
  startBtn.addEventListener("click", () => {
    if (state.running) pause();
    else start();
  });

  resetBtn.addEventListener("click", reset);

  // Сегменты 25/45/50
  document.querySelectorAll(".seg").forEach((seg) => {
    seg.addEventListener("click", () => {
      document.querySelectorAll(".seg").forEach((s) => s.classList.remove("is-active"));
      seg.classList.add("is-active");

      const min = Number(seg.dataset.min);
      if (!Number.isFinite(min) || min <= 0) return;

      state.minutes = min;
      state.totalSec = min * 60;
      state.running = false;
      state.endAt = null;
      state.remainingSec = state.totalSec;
      saveState();

      stopTick();
      render();
      haptic?.impactOccurred?.("light");
    });
  });

  // Подсветить нужный сегмент при загрузке
  document.querySelectorAll(".seg").forEach((seg) => {
    seg.classList.toggle("is-active", Number(seg.dataset.min) === state.minutes);
  });

  // Если ранее был запущен — продолжим
  if (state.running && state.endAt) startTick();

  render();
}
