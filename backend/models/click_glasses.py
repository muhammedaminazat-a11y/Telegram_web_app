from sqlalchemy import Column, Integer, ForeignKey
from backend.utils.database import Base

class ClickGlasses(Base):
    __tablename__ = "click_glasses"
    id = Column(Integer, primary_key=True, index=True)
    click_id = Column(Integer, ForeignKey("clicks.id", ondelete="CASCADE"), nullable=False) # ondelete="CASCADE" → если клик удалён, связанные очки тоже удаляются.
    glasses = Column(Integer, default=0)