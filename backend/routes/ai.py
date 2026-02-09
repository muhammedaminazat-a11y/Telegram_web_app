from fastapi import APIRouter
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
    return ai_service.ask_ai(request)

@router.get("/history", response_model=list[dict])
def get_history():
    return ai_service.get_history()