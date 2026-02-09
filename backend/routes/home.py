from fastapi import APIRouter
from backend.schemas.home import HomeRootResponse, HomeAboutResponse
from backend.services.home_service import get_home_root, get_home_about

router = APIRouter(
    prefix="/home",
    tags=["home"]
    )

@router.get("/", response_model=HomeRootResponse)
def read_root(user_id: int = 1):
    return get_home_root(user_id)

@router.get("/about", response_model=HomeAboutResponse)
def read_about(user_id: int = 1):
    return get_home_about(user_id)