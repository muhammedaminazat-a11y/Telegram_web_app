from pydantic import BaseModel, Field

# ---- Pydantic-схема для ClickGlasses ---- (кликера очков)
class ClickGlassesBase(BaseModel):
    click_id: int = Field(..., gt=0, description="ID клика")
    glasses: int = Field(ge=0, description="Количество очков")

class ClickGlassesCreate(ClickGlassesBase):
   pass # (не заглушка используется, чтобы сделать код чище, если будут добавляться новые поля,
         # то можно будет использовать в этом классе по необходимости)
# создание нового объекта ClickGlasses использует все поля из базовой схемы ClickGlassesBase без изменений

class ClickGlassesUpdate(BaseModel):
    glasses: int | None = Field(None, ge=0) # число 0 принимается
 
class ClickGlassesOut(ClickGlassesBase):
    id: int = Field(..., gt=0, description="Уникальный идентификатор записи очков")

    class Config:
        from_attributes = True  