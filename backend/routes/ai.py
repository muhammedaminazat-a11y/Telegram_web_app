from fastapi import APIRouter, HTTPException
from backend.schemas.ai import (
    AiCreate, 
    AiUpdate,
    AiOut,
)

router = APIRouter(
    prefix="/ai",
    tags=["ai"]
    )
