import { toggleTheme } from "../theme.js";

export function initProfile() {
  const nameEl = document.getElementById("tgName");
  const userEl = document.getElementById("tgUsername");
  const idEl = document.getElementById("tgId");
  const hintEl = document.getElementById("tgEnvHint");
  const copyBtn = document.getElementById("copyTgIdBtn");

  function setText(el, text) {
    if (el) el.textContent = text;
  }

  setupThemeRow();

  // ====== 1) Telegram окружение? ======
  const tg = window.Telegram?.WebApp;

  // будем использовать один id для копирования
  let currentId = "—";

  // ====== 2) Если НЕ Telegram — делаем локального пользователя ======
  if (!tg) {
    const local = getOrCreateLocalUser();

    setText(nameEl, local.name);
    setText(userEl, local.username);
    setText(idEl, local.id);
    setText(
      hintEl,
      "Браузерный режим: Telegram ID недоступен. Используется локальный ID проекта."
    );

    currentId = local.id;
    bindCopy(copyBtn, () => currentId);

    // если нужно — оставь dropdown
    setupSettingsDropdown();
    return;
  }

  // ====== 3) Telegram режим ======
  tg.ready();
  tg.expand?.();

  const user = tg.initDataUnsafe?.user;

  if (!user) {
    setText(nameEl, "Нет данных пользователя");
    setText(userEl, "initDataUnsafe.user пустой");
    setText(idEl, "—");
    setText(
      hintEl,
      "Если это Telegram — возможно данные не передались. Проверь запуск Mini App."
    );
    if (copyBtn) copyBtn.disabled = true;

    setupSettingsDropdown();
    return;
  }

  const fullName = [user.first_name, user.last_name].filter(Boolean).join(" ").trim();
  const username = user.username ? `@${user.username}` : "(без username)";
  const id = String(user.id);

  setText(nameEl, fullName || "Пользователь");
  setText(userEl, username);
  setText(idEl, id);

  const platform = tg.platform || "unknown";
  const version = tg.version || "";
  setText(hintEl, `Telegram WebApp: ${platform} ${version}`.trim());

  currentId = id;
  bindCopy(copyBtn, () => currentId);

  setupSettingsDropdown();

  // -----------------------------
  // helpers

  function setupThemeRow() {
    const themeBtn = document.getElementById("themeBtn");
    if (!themeBtn) return;

    syncThemeIcon();

    themeBtn.addEventListener("click", () => {
      toggleTheme();
      syncThemeIcon();
    });
  }

  function syncThemeIcon() {
    const themeBtn = document.getElementById("themeBtn");
    if (!themeBtn) return;

    const leftIcon = themeBtn.querySelector(".p-row__left");
    if (!leftIcon) return;

    const isDark = document.documentElement.classList.contains("dark");
    leftIcon.textContent = isDark ? "🌙" : "☀️";
  }

  function setupSettingsDropdown() {
    const toggle = document.getElementById("settingsToggle");
    const dropdown = document.getElementById("settingsDropdown");
    const arrow = document.getElementById("settingsArrow");

    if (!toggle || !dropdown) return;

    toggle.addEventListener("click", () => {
      const opened = dropdown.classList.toggle("is-open");
      if (arrow) arrow.textContent = opened ? "⌃" : "⌄";
    });
  }
}

/* =========================
   Helper functions (outside export ok)
   ========================= */

function getOrCreateLocalUser() {
  const KEY = "local_user_v1";
  const saved = localStorage.getItem(KEY);
  if (saved) {
    try { return JSON.parse(saved); } catch {}
  }

  // стабильный локальный id (не Telegram)
  const id = "local-" + cryptoRandomId(10);

  const user = {
    id,
    name: "Пользователь",
    username: "@local"
  };

  localStorage.setItem(KEY, JSON.stringify(user));
  return user;
}

function cryptoRandomId(len = 10) {
  // работает в современных браузерах
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  const arr = new Uint8Array(len);
  crypto.getRandomValues(arr);
  return Array.from(arr, n => chars[n % chars.length]).join("");
}

function bindCopy(btn, getText) {
  if (!btn) return;

  btn.disabled = false;

  btn.addEventListener("click", async () => {
    const text = String(getText() ?? "");
    if (!text || text === "—") return;

    try {
      await navigator.clipboard.writeText(text);
      btn.textContent = "✅ ID скопирован";
      setTimeout(() => (btn.textContent = "📋 Скопировать ID"), 1200);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);

      btn.textContent = "✅ ID скопирован";
      setTimeout(() => (btn.textContent = "📋 Скопировать ID"), 1200);
    }
  });
}
