from pydantic import BaseModel
import datetime

class TaskLogBase(BaseModel):
    task_id: int
    action: str

class TaskLogOut(TaskLogBase):
    id: int | None
    timestamp: datetime.datetime

    class Config:
        from_attributes = True 
