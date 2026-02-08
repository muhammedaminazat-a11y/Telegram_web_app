from fastapi import APIRouter
from backend.services import click_service
from backend.schemas.click import (
    ClickCreate, 
    ClickUpdate,
    ClickOut,
    ClickDeleteResponse,
)

router = APIRouter(
    prefix="/click",
    tags=["click"]
    )

# временное хранилище словарь (замена на PostgreSQL)
clicks = {}

# эндпоинт получения кликера (клик)
@router.get("/", response_model=list[ClickOut])
def get_clicks():
    return list(clicks.values())

# эндпоинт получения одного клика
@router.get("/{click_id}", response_model=ClickOut)
def get_click(click_id: int):
    return click_service.get_click(click_id)

# эндпоинт создание кликера
@router.post("/", response_model=ClickOut)
def create_click(click: ClickCreate):
    return click_service.create_click(click)

# эндпоинт обновления кликера
@router.put("/{click_id}", response_model=ClickOut)
def update_click(click_id: int, click: ClickUpdate):
   return click_service.update_click(click_id, click)

# эндпоинт удаление кликера 
@router.delete("/{click_id}", response_model=ClickDeleteResponse)
def delete_click(click_id: int):
    return click_service.delete_click(click_id)

# эндпоинт получения количества "очков" (glasses) для пользователя
@router.get("/glasses/{click_id}")
def get_click_glasses(click_id: int):
    return click_service.get_click_glasses(click_id)

# эндпоинт увеличения счётчика кликов
@router.patch("/{click_id}/increment", response_model=ClickOut)
def increment_click(click_id: int):
    return click_service.increment_click(click_id)