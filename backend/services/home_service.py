from fastapi import HTTPException
from backend.services import task_service, pomodoro_service
from backend.schemas.home import HomeRootResponse, HomeAboutResponse, Stats
from backend.services.click_service import get_click_glasses

def get_pomodoro_progress_percent(user_id: int) -> int:
    try:
        progress = pomodoro_service.progress(user_id)
        if progress.total == 0:
            return 0
        return int(progress.elapsed / progress.total * 100)
    except HTTPException:
        return 0


def get_home_root(user_id: int) -> HomeRootResponse:   
    return HomeRootResponse(
        message="Привет, это главная страница!",
        tasks_count=task_service.get_tasks_count(),
        pomodoro_progress=get_pomodoro_progress_percent(user_id),
        click_glasses=get_click_glasses(user_id)
    )

def get_home_about(user_id: int = 1) -> HomeAboutResponse:
    return HomeAboutResponse(
        service="Приложение для повышения производительности",
        description="Количество задач, Метод Pomodoro, игры и кликер",
        stats=Stats(
            tasks_count=task_service.get_tasks_count(),
            pomodoro_progress=get_pomodoro_progress_percent(user_id),
            click_glasses=get_click_glasses(user_id) 
        )
    )