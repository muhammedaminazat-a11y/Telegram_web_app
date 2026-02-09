from sqlalchemy import Column, Integer, String
from backend.utils.database import Base

class Click(Base):
    __tablename__ = "clicks"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), nullable=False)
    count = Column(Integer, default=0)