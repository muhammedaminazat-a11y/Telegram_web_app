from sqlalchemy.orm import Session
from backend.models.click import Click
from backend.schemas.click import ClickCreate, ClickUpdate

def create_click(db: Session, data: ClickCreate) -> Click:
    click = Click(**data.dict())
    db.add(click)
    db.commit()
    db.refresh(click)
    return click

def get_clicks(db: Session) -> list[Click]:
    return db.query(Click).all()

def get_click(db: Session, click_id: int) -> Click | None:
    return db.query(Click).filter(Click.id == click_id).first()

def update_click(db: Session, click_id: int, data: ClickUpdate) -> Click | None:
    click = get_click(db, click_id)
    if not click:
        return None
    for field, value in data.dict(exclude_unset=True).items():
        setattr(click, field, value)
    db.commit()
    db.refresh(click)
    return click

def delete_click(db: Session, click_id: int) -> Click | None:
    click = get_click(db, click_id)
    if not click:
        return None
    db.delete(click)
    db.commit()
    return click

def get_click_glasses(db: Session, click_id: int) -> int | None:
    click = get_click(db, click_id)
    if not click:
        return None
    return click.count

def increment_click(db: Session, click_id: int) -> Click | None:
    click = get_click(db, click_id)
    if not click:
        return None
    click.count += 1
    db.commit()
    db.refresh(click)
    return click