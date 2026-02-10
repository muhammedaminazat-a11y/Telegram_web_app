import os
import httpx

USE_MOCK = os.getenv("USE_MOCK_LLM", "1") == "1"

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
GROQ_BASE_URL = os.getenv("GROQ_BASE_URL", "https://api.groq.com/openai/v1")
GROQ_MODEL = os.getenv("GROQ_MODEL", "llama-3.1-8b-instant")


async def ask_ai(message: str) -> str:
    # Мок-режим (без внешнего API)
    if USE_MOCK:
        return f"🤖 Локальный AI ответил: {message}"

    # Если ключ не задан — сообщаем нормально (без 500)
    if not GROQ_API_KEY:
        return "❌ GROQ_API_KEY не задан в .env"

    payload = {
        "model": GROQ_MODEL,
        "messages": [
            {"role": "system", "content": "Ты полезный ассистент. Отвечай кратко и по делу."},
            {"role": "user", "content": message},
        ],
        "temperature": 0.7,
    }

    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json",
    }

    async with httpx.AsyncClient(timeout=60) as client:
        r = await client.post(
            f"{GROQ_BASE_URL}/chat/completions",
            json=payload,
            headers=headers,
        )

        # Чтобы ты видел причину, если что-то не так
        if r.status_code != 200:
            return f"❌ Groq error {r.status_code}: {r.text[:400]}"

        data = r.json()

    # OpenAI-compatible parsing
    return (data["choices"][0]["message"]["content"] or "").strip()
