from sqlalchemy.orm import Session
from fastapi import HTTPException
from backend.models.task import Task
from backend.models.task_log import TaskLog
from backend.services import task_log_service
from backend.schemas.task import (
    TaskCreate,
    TaskUpdate,
    TaskOut,
)

def get_tasks(db: Session):
    return db.query(Task).all() # db.query - запрос к таблице

def get_tasks_count(db: Session) -> int:
    return db.query(Task).count()

def get_task(db: Session, task_id: int) -> TaskOut:
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Задача не найдена")
    return task

def create_task(db: Session, task: TaskCreate):
    new_task= Task(**task.dict())
    db.add(new_task)
    db.commit()
    db.refresh(new_task)

    # логирование операций
    task_log_service.create_log(db, new_task.id, "CREATE")
    return new_task

def update_task(db: Session, task_id: int, task: TaskUpdate):
    db_task = db.query(Task).filter(Task.id == task_id).first()
    if not db_task: 
        raise HTTPException(status_code=404, detail="Задача не найдена")
    
    for key, value in task.dict(exclude_unset=True).items():
         setattr(db_task, key, value)

    db.commit()
    db.refresh(db_task)

    # логирование операций
    task_log_service.create_log(db, db_task.id, "UPDATE")
    return db_task

def delete_task(db: Session, task_id: int):
    db_task = db.query(Task).filter(Task.id == task_id).first()
    if not db_task:
         raise HTTPException(status_code=404, detail="Задача не найдена")

    task_log_service.create_log(db, task_id, "DELETE")

    db.query(TaskLog).filter(TaskLog.task_id == task_id).delete()

    db.delete(db_task)
    db.commit()

    return db_task