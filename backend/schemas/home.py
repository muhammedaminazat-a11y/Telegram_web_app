from pydantic import BaseModel, Field

# Схема для click_glasses
class ClickGlasses(BaseModel):
    profile_id: int = Field(..., gt=0, description="ID профиля, должен быть > 0")
    glasses: int = Field(..., ge=0, description="Количество очков, не может быть отрицательным")

# Схема для games_glasses
class GamesGlasses(BaseModel):
    profile_id: int = Field(..., gt=0, description="ID профиля, должен быть > 0")
    glasses: int = Field(..., ge=0, description="Количество очков, не может быть отрицательным")

# Схема для главной страницы (read_root)
class HomeRootResponse(BaseModel):
    message: str = Field(..., min_length=3, max_length=100, description="Приветственное сообщение")
    tasks_count: int = Field(..., ge=0, description="Количество задач, минимум 0")
    pomodoro_progress: int = Field(..., ge=0, le=100, description="Прогресс Pomodoro в процентах (0-100)") # le число <= 100
    click_glasses: ClickGlasses
    games_glasses: GamesGlasses

# Вложенная схема для статистики (используется в read_about)
class Stats(BaseModel):
    tasks_count: int = Field(..., ge=0, description="Количество задач, минимум 0")
    pomodoro_progress: int = Field(..., ge=0, le=100, description="Прогресс Pomodoro в процентах (0-100)")
    click_glasses: ClickGlasses
    games_glasses: GamesGlasses

# Схема для страницы "about"
class HomeAboutResponse(BaseModel):
    service: str = Field(..., min_length=5, max_length=200, description="Название сервиса")
    description: str = Field(..., min_length=10, description="Описание сервиса, минимум 10 символов")
    stats: Stats
