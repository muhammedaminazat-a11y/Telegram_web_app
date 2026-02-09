from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.utils.database import SessionLocal
from backend.schemas.task_log import TaskLogOut, TaskLogBase
from backend.services import task_log_service

router = APIRouter(
    prefix="/task_log",
    tags=["task_log"]
    )

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=TaskLogOut)
def create_task_log(log: TaskLogBase, db: Session = Depends(get_db)):
    return task_log_service.create_log(db, log.task_id, log.action)

@router.get("/task_logs", response_model=list[TaskLogOut])
def read_logs(db: Session = Depends(get_db)):
    return task_log_service.get_logs(db)

@router.get("/task_logs/{task_id}", response_model=list[TaskLogOut])
def read_logs_by_task(task_id: int, db: Session = Depends(get_db)):
    return task_log_service.get_logs_by_task(db, task_id)