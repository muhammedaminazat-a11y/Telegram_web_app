from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.utils.database import SessionLocal
from backend.services import ai_service
from backend.schemas.ai import (
    AIRequest, 
    AIResponse,
)

router = APIRouter(
    prefix="/ai",
    tags=["ai"]
)

def get_db():
    db = SessionLocal()
    try:
         yield db
    finally:
        db.close()


@router.post("/chat", response_model=AIResponse)
def ai_chat(request: AIRequest, db: Session = Depends(get_db)):
    return ai_service.ask_ai(db, request)

@router.get("/history", response_model=list[AIResponse])
def get_history(db: Session = Depends(get_db)):
    return ai_service.get_history(db)