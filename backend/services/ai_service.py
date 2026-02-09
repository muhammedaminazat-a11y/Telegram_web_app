import os
from fastapi import HTTPException
from openai import OpenAI
from backend.schemas.ai import AIRequest, AIResponse

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def ask_ai(request: AIRequest) -> AIResponse:
    prompt = request.prompt.strip()
    if not prompt:
        raise HTTPException(status_code=400, detail="Запрос не может быть пустым")

    try:
        resp = client.responses.create(
            model="gpt-5.2-mini",
            input=prompt,
        )
        text = resp.output_text or ""
        return AIResponse(answer=text if text else "Пустой ответ")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OpenAI error: {e}")
