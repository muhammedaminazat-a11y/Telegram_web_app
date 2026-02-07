from fastapi import HTTPException
from backend.schemas.ai import AIRequest, AIResponse

ai_history = {}

# Работа с ИИ API
# Входные данные (Запрос к API)
def ask_ai(request: AIRequest) -> AIResponse: #-> return (вернуть)
    if not request.message.strip():
        raise HTTPException(status_code=400, detail="Запрос не может быть пустым")
    
    # Иммитация ответа
    reply = f"AI ответил: {request.message[::-1]}"
    ai_history.append({"user:", request.message, "AI:", reply})

    return AIResponse(reply=reply)

# Ответ для AI 
def get_history() -> list[dict]:
    return ai_history