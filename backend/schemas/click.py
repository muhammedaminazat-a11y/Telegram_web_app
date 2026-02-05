from pydantic import BaseModel, Field

# ---- Pydantic-схема для Click ---- (кликер)
class ClickBase(BaseModel):
    # Расширенная валидация данных
    name: str = Field(..., min_length=3, max_length=50, description="Название клика") # ..., обязательное поле ввода
    count: int = Field(0, ge=0, description="Количество кликов")

class ClickCreate(ClickBase):
    name: str 
    count: int = 0
    # Пример ввода клика
    class Config:
        json_schema_extra = {
            "example": {
                "name": "Test Click",
                "count": 5
            }
        }

class ClickUpdate(BaseModel):
    name: str | None = Field(None, min_length=3, max_length=50)
    count: int | None = Field(None, ge=0)

class ClickOut(ClickBase):
    id: int = Field(..., gt=0, description="Уникальный идентификатор клика")

class ClickDeleteResponse(BaseModel):
    message: str
    click: ClickOut