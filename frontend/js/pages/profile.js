export function initProfile() {
  const nameEl = document.getElementById("tgName");
  const userEl = document.getElementById("tgUsername");
  const idEl = document.getElementById("tgId");
  const hintEl = document.getElementById("tgEnvHint");
  const copyBtn = document.getElementById("copyTgIdBtn");

  function setText(el, text) {
    if (el) el.textContent = text;
  }

  // 1) Проверка окружения
  const tg = window.Telegram?.WebApp;
  if (!tg) {
    setText(nameEl, "Не в Telegram");
    setText(userEl, "Открой через Telegram Mini App");
    setText(idEl, "—");
    setText(
      hintEl,
      "Подсказка: профиль заполняется только внутри Telegram (WebApp SDK недоступен в обычном браузере)."
    );
    if (copyBtn) copyBtn.disabled = true;

    // всё равно включаем dropdown (работает и в браузере)
    setupSettingsDropdown();
    return;
  }

  // 2) Сообщаем Telegram что всё готово
  tg.ready();
  tg.expand?.();

  // 3) Берём пользователя из initDataUnsafe
  const user = tg.initDataUnsafe?.user;

  if (!user) {
    setText(nameEl, "Нет данных пользователя");
    setText(userEl, "initDataUnsafe.user пустой");
    setText(idEl, "—");
    setText(
      hintEl,
      "Если это в Telegram — возможно Mini App запущено без user (редко) или данные не передались."
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

  // 4) Инфо-подсказка
  const platform = tg.platform || "unknown";
  const version = tg.version || "";
  setText(hintEl, `Telegram WebApp: ${platform} ${version}`.trim());

  // 5) Копирование ID
  copyBtn?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(id);
      copyBtn.textContent = "✅ ID скопирован";
      setTimeout(() => (copyBtn.textContent = "📋 Скопировать ID"), 1200);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = id;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);

      copyBtn.textContent = "✅ ID скопирован";
      setTimeout(() => (copyBtn.textContent = "📋 Скопировать ID"), 1200);
    }
  });

  setupSettingsDropdown();

  // -----------------------------
  // helpers
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
