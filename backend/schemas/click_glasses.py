from pydantic import BaseModel, Field

# Базовая схема: общие поля для ClickGlasses
class ClickGlassesBase(BaseModel):
    click_id: int = Field(..., gt=0, description="ID клика (связь с таблицей Click)")
    glasses: int = Field(ge=0, description="Количество очков")

# Схема для создания записи
class ClickGlassesCreate(ClickGlassesBase):
    pass  # наследует все поля из ClickGlassesBase

# Схема для обновления записи
class ClickGlassesUpdate(BaseModel):
    glasses: int | None = Field(None, ge=0, description="Новое количество очков")

# Схема для возврата данных наружу (в ответах API)
class ClickGlassesOut(ClickGlassesBase):
    id: int = Field(..., gt=0, description="Уникальный идентификатор записи очков")

    class Config:
        from_attributes = True  # Pydantic v2: позволяет работать напрямую с ORM-моделью
