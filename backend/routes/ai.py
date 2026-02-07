from fastapi import APIRouter, HTTPException
from backend.services import ai_service
from backend.schemas.ai import (
    AIRequest, 
    AIResponse
)

router = APIRouter(
    prefix="/ai",
    tags=["ai"]
)

@router.post("/chat", response_model=AIResponse)
def ai_chat(request: AIRequest):
    try:
        answer = ai_service.ask_ai(request.prompt)
        return AIResponse(answer=answer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))