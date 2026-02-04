from pydantic import BaseModel, Field

# --- Создание задачи ---
class TaskBase(BaseModel):
    # -- Расширенная валидация данных -- 
    title: str = Field(..., min_length=3, max_length=50, description="Название задачи") # ..., обязательное поле 
    description: str | None = Field(None, min_length=3, max_length=100, description="Описание задачи") 
    done: bool = Field(False, description="Статус задачи") # по умолчанию задача не выполнена

# --- Создание задачи ---
class TaskCreate(TaskBase):
    class Config:
        json_schema_extra = { 
            "example": {
                "title": "Учить FastAPI",
                "description": "Разобраться с CRUD эндпоинтами",
                "done": False 
            }
        }
# --- Обновление задачи ---
class TaskUpdate(BaseModel):
    # -- Расширенная валидация данных -- 
   title: str | None = Field(None, min_length=3, max_length=50)
   description: str | None = Field(None, max_length=100)
   done: bool | None = None


# --- Ответ сервера ---
class TaskOut(TaskBase):
    id: int = Field(..., gt=0, description="Уникальный идентификатор задачи") # ..., обязательное поле
    # id: gt=0 задачи создаются от 1 и далее (id не может быть 0 и отрицательным числом) 
     
# --- Ответ при удалении --- 
class TaskDeleteResponse(BaseModel):
     message: str
     task: TaskOut