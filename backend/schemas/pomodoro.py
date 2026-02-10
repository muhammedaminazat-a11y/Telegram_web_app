from pydantic import BaseModel, Field
from typing import Literal
from datetime import datetime

# ---- Pydantic схемы для Pomodoro (таймер) ----
# --- Создание таймера ---
class PomodoroCreate(BaseModel):
    task_name: str = Field(..., min_length=3, max_length=100, description="Название задачи для Pomodoro", example="Написать отчёт")
    duration_minutes: Literal[25, 45, 50] = Field(..., description="Длительность таймера (только 25, 45 или 50 минут)", example=25)

# --- Обновление таймера ---
class PomodoroUpdate(BaseModel):
    duration_minutes: Literal[25, 45, 50] | None = Field(None, description="Новая длительность таймера")
    is_completed: bool = Field(False, description="Флаг завершения задачи")

# --- Ответ сервера ---
class PomodoroOut(BaseModel):
    id: int
    task_name: str
    duration_minutes: int
    is_completed: bool
    started_at: datetime
    finished_at: datetime

# --- Прогресс таймера ---
class PomodoroProgress(BaseModel):
    elapsed: int = Field(..., description="Прошедшее время в минутах")
    total: int = Field(..., description="Общее время таймера в минутах")

class PomodoroDeleteResponse(BaseModel):
    message: str = Field(..., description="Сообщение об успешном удалении таймера")
    pomodoro: PomodoroOut