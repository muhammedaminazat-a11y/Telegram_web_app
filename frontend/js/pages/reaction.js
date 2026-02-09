export function initReaction() {
  const box = document.getElementById("reactionBox");
  const text = document.getElementById("reactionText");
  const btn = document.getElementById("reactionBtn");
  const result = document.getElementById("reactionResult");
  const hint = document.getElementById("reactionHint");
  const bestMsEl = document.getElementById("bestMs");
  const bestResetBtn = document.getElementById("bestResetBtn");

  if (!box || !btn || !text) return;

  const KEY_BEST = "reaction_best_ms_v1";

  let timeout = null;
  let startTime = 0;
  let state = "idle"; // idle | waiting | ready

  const tg = window.Telegram?.WebApp;
  const haptic = tg?.HapticFeedback;

  function getBest() {
    const v = Number(localStorage.getItem(KEY_BEST));
    return Number.isFinite(v) && v > 0 ? v : null;
  }

  function setBest(ms) {
    localStorage.setItem(KEY_BEST, String(ms));
    renderBest();
  }

  function renderBest() {
    const best = getBest();
    bestMsEl.textContent = best ? `${best} ms` : "—";
  }

  function resetUI() {
    clearTimeout(timeout);
    timeout = null;
    state = "idle";

    box.className = "reaction-box";
    text.textContent = "Готов?";
    btn.textContent = "Старт";
    hint.textContent = "Нажми «Старт» и жди зелёного";
  }

  function startWaiting() {
    state = "waiting";
    result.textContent = "";
    btn.textContent = "Жди…";
    hint.textContent = "Не нажимай раньше!";
    box.classList.add("waiting");
    text.textContent = "ЖДИ";

    const delay = 900 + Math.random() * 2600; // 0.9–3.5 сек
    timeout = setTimeout(() => {
      state = "ready";
      box.classList.remove("waiting");
      box.classList.add("ready");
      text.textContent = "ЖМИ!";
      hint.textContent = "Нажми как можно быстрее";
      startTime = performance.now();
      haptic?.impactOccurred?.("light");
    }, delay);
  }

  btn.addEventListener("click", () => {
    if (state === "idle") startWaiting();
  });

  box.addEventListener("click", () => {
    if (state === "idle") return;

    if (state === "waiting") {
      clearTimeout(timeout);
      timeout = null;
      result.textContent = "❌ Слишком рано!";
      haptic?.notificationOccurred?.("error");
      resetUI();
      return;
    }

    if (state === "ready") {
      const ms = Math.max(1, Math.round(performance.now() - startTime));
      const best = getBest();

      result.textContent = `⚡ ${ms} ms`;

      if (!best || ms < best) {
        setBest(ms);
        result.textContent += " • ✅ Новый рекорд!";
        haptic?.notificationOccurred?.("success");
      } else {
        haptic?.impactOccurred?.("medium");
      }

      resetUI();
    }
  });

  bestResetBtn?.addEventListener("click", () => {
    localStorage.removeItem(KEY_BEST);
    renderBest();
    result.textContent = "Рекорд сброшен";
  });

  renderBest();
  resetUI();
}
