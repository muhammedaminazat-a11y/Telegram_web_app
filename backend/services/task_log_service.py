from sqlalchemy.orm import Session
from backend.models.task_log import TaskLog

def create_log(db: Session, task_id: int, action: str) -> TaskLog:
    log = TaskLog(task_id=task_id, action=action)
    db.add(log)
    db.commit()
    db.refresh(log)
    return log

def get_logs(db: Session) -> list[TaskLog]:
    return db.query(TaskLog).all()

def get_logs_by_task(db, task_id: int) -> list[TaskLog]:
    return db.query(TaskLog).filter(TaskLog.task_id == task_id).all()