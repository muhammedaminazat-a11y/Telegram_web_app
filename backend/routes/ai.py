from fastapi import APIRouter
from backend.services.ai_service import ask_ai
from backend.schemas.ai import AIRequest, AIResponse

router = APIRouter(prefix="/ai", tags=["ai"])

@router.post("/chat", response_model=AIResponse)
def ai_chat(request: AIRequest):
    return ask_ai(request)
