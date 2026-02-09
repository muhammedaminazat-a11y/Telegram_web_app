from sqlalchemy import Column, Integer, String
from backend.utils.database import Base

class AI(Base):
    __tablename__ = "ai"

    id = Column(Integer, primary_key=True, index=True)
    prompt = Column(String, nullable=False)
    answer = Column(String, nullable=True)