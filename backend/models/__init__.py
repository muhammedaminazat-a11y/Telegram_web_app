# __init__.py специальный файл Python делает папку модулем (пакетом)
from backend.utils.database import Base
from backend.models.click import Click
from backend.models.click_glasses import ClickGlasses
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
