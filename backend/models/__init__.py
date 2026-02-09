# __init__.py специальный файл Python делает папку модулем (пакетом)
from backend.utils.database import Base
from backend.models.ai import AI
# from backend.models.click import Click
# from backend.models.home import Home
# from backend.models.pomodoro import Pomodoro
# from backend.models.profile import Profile
from backend.models.task_log import TaskLog
from backend.models.task import Task

# Список всех моделей, чтобы Alembic видел их при автогенерации миграций
__all__ = ["Base",
            "AI",
            "Click",
            "Home",
            "Pomodoro",
            "Profile",
            "TaskLog",
            "Task",
            ]
