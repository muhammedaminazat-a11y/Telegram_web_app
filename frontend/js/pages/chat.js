export function initChat() {
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

  let history = loadHistory();

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
      const res = await fetch("/ai/chat", {
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
