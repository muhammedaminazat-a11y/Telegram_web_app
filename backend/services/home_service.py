from fastapi import HTTPException
from backend.services import pomodoro_service
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

def get_pomodoro_progress_percent(user_id: int) -> int:
    try:
        progress = pomodoro_service.progress(user_id)
        # если progress — словарь
        total = progress.get("total", 0)
        elapsed = progress.get("elapsed", 0)
        if total == 0:
            return 0
        return int(elapsed / total * 100)
    except HTTPException:
        return 0


def get_home_root(user_id: int) -> HomeRootResponse:   
    return HomeRootResponse(
        message=home_data["message"],
        tasks_count=home_data["tasks_count"],
        pomodoro_progress=home_data["pomodoro_progress"],
        click_glasses=ClickGlasses(**home_data["click_glasses"])
    )

def get_home_about(user_id: int = 1) -> HomeAboutResponse:
    return HomeAboutResponse(
        service=home_data["service"],
        description=home_data["description"],
        stats=Stats(
            tasks_count=home_data["tasks_count"],
            pomodoro_progress=home_data["pomodoro_progress"],
            click_glasses=ClickGlasses(**home_data["click_glasses"])
        )
    )