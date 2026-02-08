from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
import datetime
from backend.utils.database import Base

class TaskLog(Base):
    __tablename__ = "task_logs"

    id = Column(Integer, primary_key=True, index=True)
    task_id = Column(Integer, ForeignKey("tasks.id", ondelete="SET NULL"), nullable=True)
    action = Column(String, nullable=False)  # CREATE, UPDATE, DELETE
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
