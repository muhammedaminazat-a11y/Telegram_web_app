import os
import httpx

USE_MOCK = os.getenv("USE_MOCK_LLM", "1") == "1"

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
OPENAI_BASE_URL = os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1")
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4o-mini")


async def ask_ai(message: str) -> str:
    if USE_MOCK or not OPENAI_API_KEY:
        return f"Мок-ответ: {message}"

    payload = {
        "model": OPENAI_MODEL,
        "messages": [
            {"role": "system", "content": "Ты полезный ассистент."},
            {"role": "user", "content": message},
        ],
        "temperature": 0.7,
    }

    headers = {
        "Authorization": f"Bearer {OPENAI_API_KEY}"
    }

    async with httpx.AsyncClient(timeout=60) as client:
        r = await client.post(
            f"{OPENAI_BASE_URL}/chat/completions",
            json=payload,
            headers=headers
        )
        r.raise_for_status()
        data = r.json()

    return data["choices"][0]["message"]["content"].strip()
