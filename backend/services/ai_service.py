from fastapi import HTTPException
from backend.schemas.ai import AIRequest, AIResponse

ai_history: list[dict] = []

# Работа с ИИ API
# Входные данные (Запрос к API)
def ask_ai(request: AIRequest) -> AIResponse: #-> return (вернуть)
    if not request.prompt.strip():
        raise HTTPException(status_code=400, detail="Запрос не может быть пустым")
    
    # Иммитация ответа
    reply = f"AI ответил: {request.prompt[::-1]}"
    ai_history.append({"user": request.prompt, "AI": reply})

    return AIResponse(answer=reply)

# Ответ для AI 
def get_history() -> list[dict]:
    return ai_history