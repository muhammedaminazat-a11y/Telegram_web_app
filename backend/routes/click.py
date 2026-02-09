from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.utils.database import get_db
from backend.services import click_service
from backend.schemas.click import (
    ClickCreate, 
    ClickUpdate,
    ClickOut,
    ClickDeleteResponse
)

router = APIRouter(
    prefix="/click",
    tags=["click"]
    )

# эндпоинт создание кликера
@router.post("/", response_model=ClickOut)
def create_click(click: ClickCreate, db: Session = Depends(get_db)):
    return click_service.create_click(db, click)

# эндпоинт получения кликера (клик)
@router.get("/", response_model=list[ClickOut])
def get_clicks(db: Session = Depends(get_db)):
    return click_service.get_clicks(db)

# эндпоинт получения одного клика
@router.get("/{click_id}", response_model=ClickOut)
def get_click(click_id: int, db: Session = Depends(get_db)):
    click = click_service.get_click(db, click_id)
    if not click:
        raise HTTPException(status_code=404, detail="Клик не найден")
    return click

# эндпоинт обновления кликера
@router.put("/{click_id}", response_model=ClickOut)
def update_click(click_id: int, click: ClickUpdate, db: Session = Depends(get_db)):
   updated = click_service.update_click(db, click_id, click)
   if not updated:
       raise HTTPException(status_code=404, detail="Клик не найден")
   return updated

# эндпоинт удаление кликера 
@router.delete("/{click_id}", response_model=ClickDeleteResponse)
def delete_click(click_id: int, db: Session = Depends(get_db)):
    deleted = click_service.delete_click(db, click_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Клик не найден")
    return {
        "message": "Клик успешно удалён",
        "deleted_click": deleted
    }

# эндпоинт получения количества "очков" (glasses) для пользователя
@router.get("/glasses/{click_id}")
def get_click_glasses(click_id: int):
    return click_service.get_click_glasses(click_id)

# эндпоинт увеличения счётчика кликов
@router.patch("/{click_id}/increment", response_model=ClickOut)
def increment_click(click_id: int, db: Session = Depends(get_db)):
    updated = click_service.increment_click(db, click_id)
    if not updated:
        raise HTTPException(status_code=404, detail="Клик не найден")
    return updated