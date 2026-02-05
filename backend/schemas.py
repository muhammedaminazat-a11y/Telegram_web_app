from pydantic import BaseModel, Field
from typing import Optional, Dict

# ---- Pydantic схемы для Tasks (задачи) ----

# --- Создание задачи ---
class TaskBase(BaseModel):
    # -- Расширенная валидация данных -- 
    title: str = Field(..., min_length=3, max_length=50, description="Название задачи") # ..., обязательное поле 
    description: str | None = Field(None, min_length=3, max_length=100, description="Описание задачи") 
    done: bool = Field(False, description="Статус задачи") # по умолчанию задача не выполнена

# --- Создание задачи ---
class TaskCreate(TaskBase):
    # Пример ввода задач
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
    id: int = Field(..., gt=0, description="Уникальный идентификатор задачи")
    # id: gt=0 задачи создаются от 1 и далее (id не может быть 0 и отрицательным числом) 
     
# --- Ответ при удалении --- 
class TaskDeleteResponse(BaseModel):
     message: str
     task: TaskOut

# ---- Pydantic схемы для Profile ---- (профиль пользователя)
class ProfileBase(BaseModel):
    # Расширенная валидация данных
    name: str = Field(..., min_length=3, max_length=50, description="Имя пользователя") # ..., обязательное поле 
    avatar_url: str | None  = Field(None, description="Ссылка на аватар пользователя") # None ввод от пользователя отсутствует ссылка
    settings: dict[str, str] | None = Field(None, description="Настройки пользователя") # настройки (п) находится через словарь [str, str]

class ProfileCreate(BaseModel):
    telegram_id: int = Field(..., gt=0, description="Уникальный идентификатор пользователя")
    name: str = Field(..., min_length=3, max_length=50, description="Имя пользователя") 
    avatar_url: str | None = Field(None, description="Ссылка на аватар пользователя") # None ввод от пользователя отсутствует ссылка
    settings: dict[str, str] | None = Field(None, description="Настройки пользователя") # настройки (п) находится через словарь [str, str]

    # Пример ввода профиля
    class Config:
        json_schema_extra = {
            "example": {
                "telegram_id": 123456789,
                "name": "John Doe",
                "avatar_url": "https://example.com/avatar.jpg",
                "settings": {"theme": "dark", "language": "kz"}
            }
        }

# --- Обновление профиля ---
class ProfileUpdate(BaseModel):
    # -- Расширенная валидация данных -- 
    name: str | None = Field(None, min_length=3, max_length=50, description="Имя пользователя") # None поле необязательное
    avatar_url: str | None = Field(None, description="Ссылка на аватар пользователя")
    settings: dict[str, str] | None = Field(None, description="Настройки пользователя")

# --- Ответ сервера ---
class ProfileOut(ProfileBase):
    id: int = Field(gt=0, description="Уникальный id в базе данных")
    telegram_id: int = Field(gt=0, description="Telegram id пользователя")

# --- Ответ при удалении ---
class ProfileDeleteResponse(BaseModel):
    message: str
    profile: ProfileOut 