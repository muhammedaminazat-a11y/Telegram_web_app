from fastapi import APIRouter
from routes.tasks import get_tasks_count
from routes.pomodoro import get_pomodoro_progress
from routes.click import get_click_glasses
from routes.games import get_games_glasses


router = APIRouter(
    prefix="/home",
    tags=["home"]
    )

# эндпоинт приветственное сообщение
@router.get("/", summary="Главная страница", description="Приветствие и краткая статистика")
def read_root(user_id: int = 1): # user_id: - параметр, int - должны быть только целые числа 
    # | Если user_id не будет передан, то всегда будет = 1 |
    return {"message": "Привет, это главная страница!",
            "tasks_count": get_tasks_count(),
            "pomodoro_progress": get_pomodoro_progress(),
            "click_glasses": get_click_glasses(user_id),
            "games_glasses": get_games_glasses(user_id)
            }

# эндпоинт приветствие и краткая статистика
@router.get("/about")
def read_about(user_id: int = 1): 
    return {
        "service": "Приложение для повышения производительности",
        "description": "Количество задач, Метод Pomodoro, игры и кликер",
        "stats": {
            "tasks_count": get_tasks_count(),
            "pomodoro_progress": get_pomodoro_progress(),
            "click_glasses": get_click_glasses(user_id),
            "games_glasses": get_games_glasses(user_id)
        }
    }