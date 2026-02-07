from backend.services import task_service, profile_service, pomodoro_service

def get_home_data(user_id: int):
    # Получаем задачи пользователя (из словаря task_service)
    tasks = task_service.get_tasks()

    # Получаем последний таймер (из словаря pomodoro_service)
    # pomodoro = pomodoro_service.get_last_timer(user_id)

    # Получаем профиль (из словаря profile_service)
    profile = profile_service.get_profile(user_id)

    # Собираем дашборд
    return {
        "profile": profile,
        "tasks": tasks,
        # "pomodoro": pomodoro,
        "stats": {
            "tasks_count": len(tasks),
            # "active_pomodoro": bool(pomodoro)
        }
    }