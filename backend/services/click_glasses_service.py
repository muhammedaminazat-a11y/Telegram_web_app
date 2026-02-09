from sqlalchemy.orm import Session
from backend.models.click_glasses import ClickGlasses
from backend.schemas.click_glasses import ClickGlassesCreate, ClickGlassesUpdate

def create_click_glasses(db: Session, data: ClickGlassesCreate) -> ClickGlasses:
    glasses = ClickGlasses(**data.dict())
    db.add(glasses)
    db.commit()
    db.refresh(glasses)
    return glasses

def get_glasses(db: Session, glasses_id: int) -> ClickGlasses | None: # id
    return db.query(ClickGlasses).filter(ClickGlasses.id == glasses_id).first()

def get_glasses_by_click_id(db: Session, click_id: int) -> ClickGlasses | None: # click_id
    return db.query(ClickGlasses).filter(ClickGlasses.click_id == click_id).all()

def update_glasses_endpoint(db: Session, glasses_id: int, data: ClickGlassesUpdate) -> ClickGlasses | None:
    glasses= get_glasses(db, glasses_id)
    if not glasses:
        return None # возвращается ничего
    for field, value in data.dict(exclude_unset=True).items(): # цикл получает словарь ключ:значение
        # exclude_unset=True включить только те поля, которые реально были переданы в запросе
        setattr(glasses, field, value) # setattr обновляет атрибут
    db.commit()
    db.refresh(glasses)
    return glasses

def delete_glasses(db: Session, glasses_id: int) -> ClickGlasses | None:
    glasses = get_glasses(db, glasses_id)
    if not glasses:
        return None
    db.delete(glasses)
    db.commit()
    return glasses    