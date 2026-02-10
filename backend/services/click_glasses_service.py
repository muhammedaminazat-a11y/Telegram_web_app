from sqlalchemy.orm import Session
from backend.models.click_glasses import ClickGlasses
from backend.schemas.click_glasses import ClickGlassesCreate, ClickGlassesUpdate
from backend.services.click_service import get_click
from fastapi import HTTPException


# Создание записи очков
def create_click_glasses(db: Session, data: ClickGlassesCreate) -> ClickGlasses:
    if not get_click(db, data.click_id):
         raise HTTPException(status_code=400, detail="Клик с таким ID не существует")
    glasses = ClickGlasses(**data.dict())  # создаём объект ORM из Pydantic-схемы
    db.add(glasses)
    db.commit()
    db.refresh(glasses)  # обновляем объект из базы (чтобы получить id)
    return glasses

# Получение записи очков по её id
def get_glasses(db: Session, glasses_id: int) -> ClickGlasses | None:
    return db.query(ClickGlasses).filter(ClickGlasses.id == glasses_id).first()

# Получение всех очков по click_id
def get_glasses_by_click_id(db: Session, click_id: int) -> list[ClickGlasses]:
    return db.query(ClickGlasses).filter(ClickGlasses.click_id == click_id).all()

# Обновление записи очков
def update_glasses(db: Session, glasses_id: int, data: ClickGlassesUpdate) -> ClickGlasses | None:
    glasses = get_glasses(db, glasses_id)
    if not glasses:
        return None
    # обновляем только те поля, которые переданы
    for field, value in data.dict(exclude_unset=True).items():
        setattr(glasses, field, value)
    db.commit()
    db.refresh(glasses)
    return glasses

# Удаление записи очков
def delete_glasses(db: Session, glasses_id: int) -> ClickGlasses | None:
    glasses = get_glasses(db, glasses_id)
    if not glasses:
        return None
    db.delete(glasses)
    db.commit()
    return glasses
