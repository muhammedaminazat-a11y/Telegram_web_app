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
      if (name === "click") initClick();
      // profile пока без JS
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

  // --- CLICKER (Hamster-like) handlers
  function initClick() {
    const els = {
      coinsText: document.getElementById("coinsText"),
      energyText: document.getElementById("energyText"),
      energyMaxText: document.getElementById("energyMaxText"),
      tapPowerText: document.getElementById("tapPowerText"),
      incomeText: document.getElementById("incomeText"),
      tapPriceText: document.getElementById("tapPriceText"),
      incomePriceText: document.getElementById("incomePriceText"),
      tapBtn: document.getElementById("tapBtn"),
      buyTapBtn: document.getElementById("buyTapBtn"),
      buyIncomeBtn: document.getElementById("buyIncomeBtn"),
    };

    // если click.html ещё старый и элементов нет — выходим
    if (!els.tapBtn) {
      console.warn("Clicker: не найден #tapBtn (проверь click.html)");
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
      tapPower: 1,
      incomePerHour: 0,

      energy: 100,
      energyMax: 100,

      tapLevel: 0,
      incomeLevel: 0,

      lastTick: Date.now(),
    };

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

    // Экономика
    const priceTapBase = 20;
    const priceIncomeBase = 50;

    // энергия: +0.8 в секунду (≈48/мин)
    const energyRegenPerSec = 0.8;

    let state = load();

    function calcTapPrice(s) {
      return Math.floor(priceTapBase * Math.pow(1.15, s.tapLevel));
    }

    function calcIncomePrice(s) {
      return Math.floor(priceIncomeBase * Math.pow(1.17, s.incomeLevel));
    }

    function applyTick(s) {
      const now = Date.now();
      const dtSec = Math.max(0, (now - s.lastTick) / 1000);

      // пассив
      if (s.incomePerHour > 0) {
        s.coins += s.incomePerHour * (dtSec / 3600);
      }

      // реген энергии
      s.energy = Math.min(s.energyMax, s.energy + energyRegenPerSec * dtSec);

      s.lastTick = now;
      return s;
    }

    function formatCoins(x) {
      const v = Math.floor(x);
      return v.toLocaleString("ru-RU");
    }

    function render(s) {
      els.coinsText.textContent = formatCoins(s.coins);
      els.energyText.textContent = Math.floor(s.energy);
      els.energyMaxText.textContent = s.energyMax;
      els.tapPowerText.textContent = s.tapPower;
      els.incomeText.textContent = Math.floor(s.incomePerHour);

      els.tapPriceText.textContent = calcTapPrice(s).toLocaleString("ru-RU");
      els.incomePriceText.textContent = calcIncomePrice(s).toLocaleString("ru-RU");

      const noEnergy = Math.floor(s.energy) <= 0;
      els.tapBtn.disabled = noEnergy;
      els.tapBtn.classList.toggle("is-disabled", noEnergy);
    }

    // применяем оффлайн-тик
    state = applyTick(state);
    save(state);
    render(state);

    // интервал тика
    window.__clickerTimer = setInterval(() => {
      state = applyTick(state);
      save(state);
      render(state);
    }, 1000);

    // TAP
    els.tapBtn.addEventListener("click", () => {
      if (Math.floor(state.energy) <= 0) return;

      state.energy -= 1;
      state.coins += state.tapPower;

      save(state);
      render(state);

      // микро-анимация
      els.tapBtn.classList.remove("tap-anim");
      void els.tapBtn.offsetWidth;
      els.tapBtn.classList.add("tap-anim");
    });

    // Upgrade tap
    els.buyTapBtn.addEventListener("click", () => {
      const price = calcTapPrice(state);
      if (state.coins < price) return;

      state.coins -= price;
      state.tapLevel += 1;
      state.tapPower += 1;

      save(state);
      render(state);
    });

    // Upgrade passive income
    els.buyIncomeBtn.addEventListener("click", () => {
      const price = calcIncomePrice(state);
      if (state.coins < price) return;

      state.coins -= price;
      state.incomeLevel += 1;
      state.incomePerHour += 30;

      save(state);
      render(state);
    });
  }

  // старт
  setActive("home");
});
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

  let history = loadHistory(); // массив объектов: {role:"user"|"assistant", content:"..."}

  function addMessage(role, text) {
    const el = document.createElement("div");
    el.className = `msg ${role === "user" ? "user" : "bot"}`;
    el.textContent = text;
    box.appendChild(el);
    box.scrollTop = box.scrollHeight;
  }

  function renderAll() {
    box.innerHTML = "";
    for (const m of history) {
      addMessage(m.role, m.content);
    }
  }

  async function sendMessage(text) {
    // UI: покажем сообщение пользователя
    history.push({ role: "user", content: text });
    saveHistory(history);
    addMessage("user", text);

    // UI: временный "typing"
    const typingEl = document.createElement("div");
    typingEl.className = "msg bot";
    typingEl.textContent = "Печатает…";
    box.appendChild(typingEl);
    box.scrollTop = box.scrollHeight;

    sendBtn.disabled = true;
    input.disabled = true;

    try {
      // ВАЖНО: этот эндпоинт должен быть на твоём сервере
      const res = await fetch("api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: history.slice(-12) // отправляем последние 12 сообщений
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json(); // ожидаем { reply: "..." }
      const reply = data.reply ?? "Нет ответа";

      // заменить typing на ответ
      typingEl.textContent = reply;

      history.push({ role: "assistant", content: reply });
      saveHistory(history);
    } catch (e) {
      console.error(e);
      typingEl.textContent = "Ошибка: сервер недоступен или эндпоинт /api/chat не настроен.";
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
