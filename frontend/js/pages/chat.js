const API_BASE = "http://localhost:8000";

export function initChat() {
  const box = document.getElementById("chatBox");
  const form = document.getElementById("chatForm");
  const input = document.getElementById("chatInput");
  const sendBtn = document.getElementById("chatSendBtn");
  const clearBtn = document.getElementById("chatClearBtn");

  if (!box || !form || !input || !sendBtn) return;

  function addMessage(role, text) {
    const row = document.createElement("div");
    row.className = `msg-row ${role === "user" ? "user" : "bot"}`;

    const bubble = document.createElement("div");
    bubble.className = `bubble ${role === "user" ? "user" : "bot"}`;
    bubble.textContent = text;

    row.appendChild(bubble);
    box.appendChild(row);
    box.scrollTop = box.scrollHeight;

    return bubble;
  }

  async function sendMessage(text) {
    addMessage("user", text);

    const botBubble = addMessage("assistant", "Печатает…");

    sendBtn.disabled = true;
    input.disabled = true;

    try {
      // ВАЖНО: endpoint и формат совпадает с backend: POST /api/ai {message} -> {reply}
      const res = await fetch(`${API_BASE}/api/ai`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      if (!res.ok) {
        const errText = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status}: ${errText}`);
      }

      const data = await res.json();
      const reply = data?.reply ?? "Нет ответа";
      botBubble.textContent = reply;
    } catch (e) {
      console.error(e);
      botBubble.textContent = "Ошибка: сервер недоступен или не отвечает.";
    } finally {
      sendBtn.disabled = false;
      input.disabled = false;
      input.focus();
    }
  }

  clearBtn?.addEventListener("click", () => {
    box.innerHTML = ""; // просто очищаем экран, без localStorage
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    input.value = "";
    sendMessage(text);
  });
}
