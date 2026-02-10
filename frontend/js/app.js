import { initHome } from "./pages/home.js";
import { initPomodoro } from "./pages/pomodoro.js";
import { initTask } from "./pages/task.js";
import { initClick } from "./pages/click.js";
import { initChat } from "./pages/chat.js";
import { initProfile } from "./pages/profile.js";
import { initReaction } from "./pages/reaction.js";
import { initSnake } from "./pages/snake.js";
import { initTheme } from "./theme.js";

document.addEventListener("DOMContentLoaded", () => {
  initTheme();

  const content = document.getElementById("app-content");
  const buttons = document.querySelectorAll(".nav-btn");

  if (!content) {
    console.error("Не найден #app-content");
    return;
  }

  function screenUrl(name) {
    return `frontend/screens/${name}.html?v=2`;
  }

  async function loadScreen(name) {
    try {
      const url = screenUrl(name);
      const res = await fetch(url, { cache: "no-store" });

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

      if (name === "home") initHome(setActive);
      if (name === "pomodoro") initPomodoro();
      if (name === "task") initTask();
      if (name === "click") initClick();
      if (name === "ai") initChat();
      if (name === "profile") initProfile();
      if (name === "reaction") initReaction();
      if (name === "snake") initSnake();

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

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.target;
      if (!target) return;
      setActive(target);
    });
  });

  setActive("home");
});
