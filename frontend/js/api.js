// js/app.js

document.addEventListener("DOMContentLoaded", () => {
  const content = document.getElementById("app-content");
  const buttons = document.querySelectorAll(".nav-btn");

  if (!content) {
    console.error("Не найден #app-content");
    return;
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
          <div style="padding:16px; font-family:system-ui;">
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
      if (name === "taks") initTasks();
      if (name === "click") initClick();
      if (name === "ai") initChat();
      // profile пока без JS
    } catch (e) {
      console.error(e);
      content.innerHTML = `
        <div style="padding:16px; font-family:system-ui;">
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
    if (openTasks) openTasks.addEventListener("click", () => setActive("taks"));
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

  // --- CLICKER handlers (работает с твоим click.html: coinsUi/cpcUi/cphUi/energyUi)
  function initClick() {
    const els = {
      coinsUi: document.getElementById("coinsUi"),
      cpcUi: document.getElementById("cpcUi"),
      cphUi: document.getElementById("cphUi"),
      energyUi: document.getElementById("energyUi"),
      energyFill: document.querySelector(".energy-bar__fill"),
      tapBtn: document.getElementById("tapBtn"),
      resetBtn: document.getElementById("clickResetBtn"),
    };

    if (!els.tapBtn || !els.coinsUi) {
      console.warn("Clicker: не найден #tapBtn или #coinsUi (проверь click.html)");
      return;
    }

    // чистим прошлый таймер, чтобы не копить интервалы при переключении вкладок
    if (window.__clickerTimer) {
      clearInterval(window.__clickerTimer);
      window.__clickerTimer = null;
    }

    const KEY = "clicker_v1";

    const defaults = {
      coins: 0,
      coinsPerClick: 1,
      coinsPerHour: 0,

      energy: 100,
      energyMax: 100,

      lastTick: Date.now(),
    };

    // энергия: +0.8 в секунду (≈48/мин)
    const energyRegenPerSec = 0.8;

    function load() {
      try {
        const raw = localStorage.getItem(KEY);
        return raw ? { ...defaults, ...JSON.parse(raw) } : { ...defaults };
      } catch {
        return { ...defaults };
      }
    }

    function save(s) {
      localStorage.setItem(KEY, JSON.stringify(s));
    }

    function applyTick(s) {
      const now = Date.now();
      const dtSec = Math.max(0, (now - s.lastTick) / 1000);

      // пассивный доход
      if (s.coinsPerHour > 0) {
        s.coins += s.coinsPerHour * (dtSec / 3600);
      }

      // реген энергии
      s.energy = Math.min(s.energyMax, s.energy + energyRegenPerSec * dtSec);

      s.lastTick = now;
      return s;
    }

    function formatCoins(x) {
      return Math.floor(x).toLocaleString("ru-RU");
    }

    function render(s) {
      els.coinsUi.textContent = formatCoins(s.coins);
      if (els.cpcUi) els.cpcUi.textContent = `+${s.coinsPerClick}`;
      if (els.cphUi) els.cphUi.textContent = `+${Math.floor(s.coinsPerHour)}`;

      if (els.energyUi) {
        const e = Math.floor(s.energy);
        els.energyUi.textContent = `${e}/${s.energyMax}`;
      }

      if (els.energyFill) {
        const pct = Math.max(0, Math.min(100, (s.energy / s.energyMax) * 100));
        els.energyFill.style.width = `${pct}%`;
      }

      const noEnergy = Math.floor(s.energy) <= 0;
      els.tapBtn.disabled = noEnergy;
      els.tapBtn.classList.toggle("is-disabled", noEnergy);
    }

    let state = load();
    state = applyTick(state);
    save(state);
    render(state);

    window.__clickerTimer = setInterval(() => {
      state = applyTick(state);
      save(state);
      render(state);
    }, 1000);

    els.tapBtn.addEventListener("click", () => {
      if (Math.floor(state.energy) <= 0) return;

      state.energy -= 1;
      state.coins += state.coinsPerClick;

      save(state);
      render(state);

      // микро-анимация
      els.tapBtn.classList.remove("tap-anim");
      void els.tapBtn.offsetWidth;
      els.tapBtn.classList.add("tap-anim");
    });

    els.resetBtn?.addEventListener("click", () => {
      state = { ...defaults, lastTick: Date.now() };
      save(state);
      render(state);
    });
  }

  // --- CHAT (заглушка UI + запрос к /api/chat)
  function initChat() {
    const box = document.getElementById("chatBox");
    const form = document.getElementById("chatForm");
    const input = document.getElementById("chatInput");
    const clearBtn = document.getElementById("chatClearBtn");
    const sendBtn = document.getElementById("chatSendBtn");

    if (!box || !form || !input) return;

    const KEY = "chat_history_v1";

    function loadHistory() {
      try {
        const raw = localStorage.getItem(KEY);
        return raw ? JSON.parse(raw) : [];
      } catch {
        return [];
      }
    }

    function saveHistory(history) {
      localStorage.setItem(KEY, JSON.stringify(history));
    }

    let history = loadHistory(); // {role:"user"|"assistant", content:"..."}

    function addMessage(role, text) {
      const row = document.createElement("div");
      row.className = `msg-row ${role === "user" ? "user" : "bot"}`;

      const bubble = document.createElement("div");
      bubble.className = `bubble ${role === "user" ? "user" : "bot"}`;
      bubble.textContent = text;

      row.appendChild(bubble);
      box.appendChild(row);
      box.scrollTop = box.scrollHeight;
    }

    function renderAll() {
      box.innerHTML = "";
      for (const m of history) addMessage(m.role, m.content);
    }

    async function sendMessage(text) {
      history.push({ role: "user", content: text });
      saveHistory(history);
      addMessage("user", text);

      // typing bubble
      const row = document.createElement("div");
      row.className = "msg-row bot";
      const bubble = document.createElement("div");
      bubble.className = "bubble bot";
      bubble.textContent = "Печатает…";
      row.appendChild(bubble);
      box.appendChild(row);
      box.scrollTop = box.scrollHeight;

      sendBtn.disabled = true;
      input.disabled = true;

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: text, history: history.slice(-12) }),
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        const reply = data.reply ?? "Нет ответа";

        bubble.textContent = reply;

        history.push({ role: "assistant", content: reply });
        saveHistory(history);
      } catch (e) {
        console.error(e);
        bubble.textContent = "Ошибка: сервер недоступен или /api/chat не настроен.";
      } finally {
        sendBtn.disabled = false;
        input.disabled = false;
        input.focus();
      }
    }

    clearBtn?.addEventListener("click", () => {
      history = [];
      saveHistory(history);
      renderAll();
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const text = input.value.trim();
      if (!text) return;
      input.value = "";
      sendMessage(text);
    });

    renderAll();
  }

  // старт
  setActive("home");
});
