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

  // ✅ UI-инициализации ДО любых return
  setupThemeRow();
  setupAbout();              // ✅ важно: ДО tg/return
  setupSettingsDropdown();   // можно тоже заранее

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

  // -----------------------------
  // helpers (inside initProfile)

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
   OUTSIDE HELPERS
   ========================= */

function getOrCreateLocalUser() {
  const KEY = "local_user_v1";
  const saved = localStorage.getItem(KEY);
  if (saved) {
    try { return JSON.parse(saved); } catch {}
  }

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

/* =========================
   ABOUT MODAL
   Требует HTML:
   - button#aboutBtn
   - div#aboutModal
   - .modal__backdrop внутри aboutModal
   - button#aboutClose
   - (опционально) span#aboutEnv
   ========================= */

function setupAbout() {
  const btn = document.getElementById("aboutBtn");
  const modal = document.getElementById("aboutModal");
  const closeBtn = document.getElementById("aboutClose");
  const envEl = document.getElementById("aboutEnv");

  if (!btn || !modal) return;

  if (envEl) {
    envEl.textContent = window.Telegram?.WebApp ? "Telegram Mini App" : "Browser";
  }

  const backdrop = modal.querySelector(".modal__backdrop");

  function openModal() {
    modal.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modal.classList.remove("is-open");
    document.body.style.overflow = "";
  }

  btn.addEventListener("click", openModal);
  closeBtn?.addEventListener("click", closeModal);
  backdrop?.addEventListener("click", closeModal);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-open")) {
      closeModal();
    }
  });

  document.getElementById("gitbutton")?.addEventListener("click", () => {
  window.open("https://github.com/muhammedaminazat-a11y/Telegram_web_app", "_blank");
 });

}
