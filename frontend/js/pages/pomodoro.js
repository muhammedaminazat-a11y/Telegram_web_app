export function initPomodoro() {
  let timer = null;
  let totalSec = 25 * 60;
  let remaining = totalSec;

  const timerText = document.getElementById("timerText");
  const startBtn = document.getElementById("startTimerBtn");
  const resetBtn = document.getElementById("resetTimerBtn");

  if (!timerText) return;

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
