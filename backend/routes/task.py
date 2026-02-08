from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.utils.database import SessionLocal
from backend.services import task_service
from backend.schemas.task import (
    TaskCreate, 
    TaskUpdate,
    TaskOut
)

router = APIRouter(
    prefix="/task",
    tags=["task"]
    )

def get_db():
    db = SessionLocal()
    try:
         yield db
    finally:
        db.close()

# эндпоинт получения списка задач
@router.get("/", response_model=list[TaskOut])
def get_tasks(db: Session = Depends(get_db)):
    return task_service.get_tasks(db)

# эндпоинт получения одной задачи
@router.get("/{task_id}", response_model=TaskOut)
def get_task(task_id: int, db: Session = Depends(get_db)):
    return task_service.get_task(db, task_id)

# эндпоинт создание задачи
@router.post("/", response_model=TaskOut)
def create_task(task: TaskCreate, db: Session = Depends(get_db)):
    return task_service.create_task(db, task)

# эндпоинт обновления задачи
@router.put("/{task_id}", response_model=TaskOut)
def update_task(task_id: int, task: TaskUpdate, db: Session = Depends(get_db)):
    return task_service.update_task(db, task_id, task)

# эндпоинт удаление задачи
@router.delete("/{task_id}", response_model=TaskOut)
def delete_task(task_id: int, db: Session = Depends(get_db)):
    return task_service.delete_task(db, task_id)