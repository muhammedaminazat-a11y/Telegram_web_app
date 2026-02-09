from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from backend.services.ai_service import ask_ai

router = APIRouter(prefix="/api", tags=["AI"])


class AIRequest(BaseModel):
    message: str


class AIResponse(BaseModel):
    reply: str


@router.post("/ai", response_model=AIResponse)
async def ai_chat(req: AIRequest):
    text = (req.message or "").strip()
    if not text:
        raise HTTPException(status_code=400, detail="Empty message")

    reply = await ask_ai(text)
    return AIResponse(reply=reply)
