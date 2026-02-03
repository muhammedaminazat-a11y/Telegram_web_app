from pydantic import BaseModel, Field

# --- Создание задачи ---
class TaskCreate(BaseModel):
    title: str = Field(None, min_length=3, max_length=50, description="Название задачи") 
    description: str | None = Field(None, min_length=3, max_length=100, description="Описание задачи")
    done: bool = Field(False, description="Статус задачи")

# --- Обновление задачи ---
class TaskUpdate(BaseModel):
    title: str | None = Field(None, min_length=3, max_length=50) 
    description: str | None = Field(None, max_length=100)
    done: bool | None = None

# --- Ответ сервера ---
class TaskOut(BaseModel):
    id: int
    title: str
    description: str | None
    done: bool 