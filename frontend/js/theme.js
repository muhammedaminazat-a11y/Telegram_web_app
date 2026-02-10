
export function applyTheme(theme) {
  const root = document.documentElement; // <html>
  const isDark = theme === "dark";
  root.classList.toggle("dark", isDark);
  localStorage.setItem("theme", isDark ? "dark" : "light");
}

export function initTheme() {
  const saved = localStorage.getItem("theme");
  if (saved) {
    applyTheme(saved);
    return;
  }

  const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)")?.matches;
  applyTheme(prefersDark ? "dark" : "light");
}

export function toggleTheme() {
  const isDarkNow = document.documentElement.classList.contains("dark");
  applyTheme(isDarkNow ? "light" : "dark");
}
