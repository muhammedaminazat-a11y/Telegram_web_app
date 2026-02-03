from pydantic import BaseModel, Field

# --- Создание задачи ---
class TaskCreate(BaseModel):
    # -- Расширенная валидация данных -- 
    title: str = Field(..., min_length=3, max_length=50, description="Название задачи") # ... обязательное поле 
    description: str | None = Field(None, min_length=3, max_length=100, description="Описание задачи") 
    done: bool = Field(False, description="Статус задачи") # по умолчанию задача не выполнена

# --- Обновление задачи ---
class TaskUpdate(BaseModel):
    title: str | None = Field(None, min_length=3, max_length=50)
    description: str | None = Field(None, max_length=100)
    done: bool | None = None # булевое значение или отсутствует

# --- Ответ сервера ---
class TaskOut(BaseModel):
    # -- Принимает в формате --
    # целового числа, строки, строки с значением отсутствует и булевое значение 
    id: int # целое число
    title: str # строка
    description: str | None # строка и значение отсутствует
    done: bool # булевое значение true/false