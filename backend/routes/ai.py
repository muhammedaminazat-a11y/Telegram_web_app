from fastapi import APIRouter, HTTPException
from backend.schemas.ai import AIRequest, AIResponse
from backend.services.ai_service import ask_ai

router = APIRouter(prefix="/api", tags=["AI"])

@router.post("/ai", response_model=AIResponse)
async def ai_chat(req: AIRequest):
    text = req.message.strip()
    if not text:
        raise HTTPException(status_code=400, detail="Empty message")

    reply = await ask_ai(text)
    return AIResponse(reply=reply)
