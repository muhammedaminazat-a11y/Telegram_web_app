export function initClick() {
  const els = {
    coinsUi: document.getElementById("coinsUi"),
    cpcUi: document.getElementById("cpcUi"),
    cphUi: document.getElementById("cphUi"),
    energyUi: document.getElementById("energyUi"),
    energyFill: document.querySelector(".energy-bar__fill"),
    tapBtn: document.getElementById("tapBtn"),
    resetBtn: document.getElementById("clickResetBtn"),
  };

  if (!els.tapBtn || !els.coinsUi) return;

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
  const energyRegenPerSec = 0.8;

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? { ...defaults, ...JSON.parse(raw) } : { ...defaults };
    } catch {
      return { ...defaults };
    }
  }
  function save(s) { localStorage.setItem(KEY, JSON.stringify(s)); }

  function applyTick(s) {
    const now = Date.now();
    const dtSec = Math.max(0, (now - s.lastTick) / 1000);

    if (s.coinsPerHour > 0) s.coins += s.coinsPerHour * (dtSec / 3600);
    s.energy = Math.min(s.energyMax, s.energy + energyRegenPerSec * dtSec);

    s.lastTick = now;
    return s;
  }

  function render(s) {
    els.coinsUi.textContent = Math.floor(s.coins).toLocaleString("ru-RU");
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
  });

  els.resetBtn?.addEventListener("click", () => {
    state = { ...defaults, lastTick: Date.now() };
    save(state);
    render(state);
  });
}
