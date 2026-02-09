from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.utils.database import get_db
from backend.services import click_glasses_service
from backend.schemas.click_glasses import (
    ClickGlassesCreate, 
    ClickGlassesUpdate,
    ClickGlassesOut,
)

router = APIRouter(
    prefix="/click_glasses",
    tags=["click_glasses"]
    )

# эндпоинт создание кликера очков
@router.post("/", response_model=ClickGlassesOut)
def create_click_glasses(click_glasses: ClickGlassesCreate, db: Session = Depends(get_db)):
    return click_glasses_service.create_click_glasses(db, click_glasses)

# эндпоинт получения кликера (клик) очков
@router.get("/{glasses_id}", response_model=ClickGlassesOut)
def get_glasses(glasses_id: int, db: Session = Depends(get_db)):
    glasses = click_glasses_service.get_glasses(db, glasses_id)
    if not glasses:
        raise HTTPException(status_code=404, detail="Очки не найдены")
    return glasses

# эндпоинт получения одного клика очков
@router.get("/by_click_id/{click_id}", response_model=list[ClickGlassesOut])
def get_glasses_by_click_id(click_id: int, db: Session = Depends(get_db)):
    glasses = click_glasses_service.get_glasses_by_click_id(db, click_id)
    if not glasses:
        raise HTTPException(status_code=404, detail="Очки для этого клика не найдены")
    return glasses

# эндпоинт обновления кликера очков
@router.put("/{glassed_id}", response_model=ClickGlassesOut)
def update_glasses(glasses_id: int, glasses: ClickGlassesUpdate, db: Session = Depends(get_db)):
    updated = click_glasses_service.update_glasses(db, glasses_id, glasses)
    if not updated:
        raise HTTPException(status_code=404, detail="Очки не найдены")
    return updated

# эндпоинт удаление кликера очков
@router.delete("/{glassed_id}", response_model=ClickGlassesOut)
def delete_glasses(glasses_id: int, db: Session = Depends(get_db)):
    deleted = click_glasses_service.delete_glasses(db, glasses_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Очки не найдены")
    return deleted