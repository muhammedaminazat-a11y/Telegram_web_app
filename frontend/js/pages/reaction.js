export function initReaction() {
  const box = document.getElementById("reactionBox");
  const text = document.getElementById("reactionText");
  const btn = document.getElementById("reactionBtn");
  const result = document.getElementById("reactionResult");
  const hint = document.getElementById("reactionHint");

  const bestMsEl = document.getElementById("bestMs");
  const avg5MsEl = document.getElementById("avg5Ms");
  const triesCountEl = document.getElementById("triesCount");
  const historyClearBtn = document.getElementById("historyClearBtn");
  const topList = document.getElementById("topList");

  if (!box || !btn || !text) return;

  const KEY = "reaction_history_v1";
  const LIMIT = 50; // можно хранить больше, топ-5 всё равно

  let timeout = null;
  let startTime = 0;
  let state = "idle"; // idle | waiting | ready

  const tg = window.Telegram?.WebApp;
  const haptic = tg?.HapticFeedback;

  function loadHistory() {
    try {
      const raw = localStorage.getItem(KEY);
      const arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr : [];
    } catch {
      return [];
    }
  }

  function saveHistory(arr) {
    localStorage.setItem(KEY, JSON.stringify(arr));
  }

  let history = loadHistory(); // [{ms, ts}...]

  function bestMs() {
    if (!history.length) return null;
    return Math.min(...history.map(x => x.ms));
  }

  function avgLast5() {
    const last = history.slice(0, 5);
    if (!last.length) return null;
    const sum = last.reduce((a, x) => a + x.ms, 0);
    return Math.round(sum / last.length);
  }

  function fmtTime(ts) {
    const d = new Date(ts);
    return d.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
  }

  function renderStats() {
    const best = bestMs();
    const avg5 = avgLast5();

    if (bestMsEl) bestMsEl.textContent = best != null ? `${best} ms` : "—";
    if (avg5MsEl) avg5MsEl.textContent = avg5 != null ? `${avg5} ms` : "—";
    if (triesCountEl) triesCountEl.textContent = String(history.length);
  }

  function renderTop5() {
    if (!topList) return;

    topList.innerHTML = "";

    if (!history.length) {
      topList.innerHTML = `<li class="muted">Пока нет результатов</li>`;
      return;
    }

    const top = [...history]
      .sort((a, b) => a.ms - b.ms || a.ts - b.ts)
      .slice(0, 5);

    for (let i = 0; i < top.length; i++) {
      const item = top[i];
      const li = document.createElement("li");
      li.className = "top-item" + (i === 0 ? " is-best" : "");

      li.innerHTML = `
        <span class="top-meta">#${i + 1} • ${fmtTime(item.ts)}</span>
        <span class="top-ms">${item.ms} ms</span>
      `;

      topList.appendChild(li);
    }
  }

  function pushResult(ms) {
    history.unshift({ ms, ts: Date.now() }); // новые сверху
    history = history.slice(0, LIMIT);
    saveHistory(history);
    renderStats();
    renderTop5();
  }

  function resetUI() {
    clearTimeout(timeout);
    timeout = null;
    state = "idle";

    box.className = "reaction-box";
    text.textContent = "Готов?";
    btn.textContent = "Старт";
    if (hint) hint.textContent = "Нажми «Старт» и жди зелёного";
  }

  function startWaiting() {
    state = "waiting";
    if (result) result.textContent = "";
    btn.textContent = "Жди…";
    if (hint) hint.textContent = "Не нажимай раньше!";
    box.classList.add("waiting");
    text.textContent = "ЖДИ";

    const delay = 900 + Math.random() * 2600;
    timeout = setTimeout(() => {
      state = "ready";
      box.classList.remove("waiting");
      box.classList.add("ready");
      text.textContent = "ЖМИ!";
      if (hint) hint.textContent = "Нажми как можно быстрее";
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
      if (result) result.textContent = "❌ Слишком рано!";
      haptic?.notificationOccurred?.("error");
      resetUI();
      return;
    }

    if (state === "ready") {
      const ms = Math.max(1, Math.round(performance.now() - startTime));

      const prevBest = bestMs();
      pushResult(ms);

      if (result) {
        result.textContent = `⚡ ${ms} ms`;
        if (prevBest == null || ms < prevBest) result.textContent += " • ✅ Новый рекорд!";
      }

      if (prevBest == null || ms < prevBest) haptic?.notificationOccurred?.("success");
      else haptic?.impactOccurred?.("medium");

      resetUI();
    }
  });

  historyClearBtn?.addEventListener("click", () => {
    history = [];
    saveHistory(history);
    renderStats();
    renderTop5();
    if (result) result.textContent = "История очищена";
  });

  renderStats();
  renderTop5();
  resetUI();
}
