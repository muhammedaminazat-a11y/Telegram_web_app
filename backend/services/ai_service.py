from sqlalchemy.orm import Session
from fastapi import HTTPException
from backend.models.ai import AI
from backend.schemas.ai import AIRequest, AIResponse

ai_history: list[dict] = []

# Работа с ИИ API
# Входные данные (Запрос к API)
def ask_ai(db: Session, request: AIRequest) -> AIResponse: #-> return (вернуть)
    if not request.prompt.strip():
        raise HTTPException(status_code=400, detail="Запрос не может быть пустым")
    
    reply = f"AI ответил: {request.prompt[::-1]}"
    
    # Иммитация ответа
    ai_entry = AI(prompt=request.prompt, answer=reply)
    db.add(ai_entry)
    db.commit()
    db.refresh(ai_entry)
    


    return AIResponse(answer=reply)

# Ответ для AI 
def get_history(db: Session) -> list[AI]:
    return db.query(AI).all()