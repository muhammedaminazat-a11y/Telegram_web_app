from sqlalchemy.orm import Session
from fastapi import HTTPException
from backend.services import pomodoro_service, task_service
from backend.schemas.home import HomeRootResponse, HomeAboutResponse, Stats, ClickGlasses

# временные данные (словари)
home_data = {
    "message": "Привет, это главная страница!",
    "service": "Приложение для повышения производительности",
    "description": "Количество задач, Метод Pomodoro, игры и кликер",
    "tasks_count": 5,
    "pomodoro_progress": 40,
    "click_glasses": {
        "profile_id": 1,
        "glasses": 12
    }
}

def get_pomodoro_progress_percent(pomodoro_id: int) -> int:
    """
    Получает процент прогресса для конкретного таймера.
    Если таймер не найден, возвращает 0.
    """
    try:
        progress = pomodoro_service.progress(pomodoro_id)
        if progress.total == 0:
            return 0
        return int(progress.elapsed / progress.total * 100)
    except HTTPException:
        return 0


def get_home_root(db: Session, user_id: int) -> HomeRootResponse:
    tasks_count = task_service.get_tasks_count(db)
    return HomeRootResponse(
        message=home_data["message"],
        tasks_count=tasks_count,
        pomodoro_progress=home_data["pomodoro_progress"],
        click_glasses=ClickGlasses(**home_data["click_glasses"])
    )

def get_home_about(db: Session, user_id: int = 1) -> HomeAboutResponse:
    tasks_count = task_service.get_tasks_count(db)
    return HomeAboutResponse(
        service=home_data["service"],
        description=home_data["description"],
        stats=Stats(
            tasks_count=tasks_count,
            pomodoro_progress=home_data["pomodoro_progress"],
            click_glasses=ClickGlasses(**home_data["click_glasses"])
        )
    )