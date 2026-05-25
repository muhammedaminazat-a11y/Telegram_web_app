from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.utils.database import get_db
from backend.schemas.home import HomeRootResponse, HomeAboutResponse
from backend.services.home_service import get_home_root, get_home_about

router = APIRouter(
    prefix="/home",
    tags=["home"]
    )

@router.get("/", response_model=HomeRootResponse)
def read_root(user_id: int = 1, db: Session = Depends(get_db)):
    return get_home_root(db, user_id)

@router.get("/about", response_model=HomeAboutResponse)
def read_about(user_id: int = 1, db: Session = Depends(get_db)):
    return get_home_about(db, user_id)