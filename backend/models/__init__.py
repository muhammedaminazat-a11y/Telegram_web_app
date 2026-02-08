# __init__.py специальный файл Python делает папку модулем (пакетом)
from backend.utils.database import Base
from backend.models.task import Task
from backend.models.task_log import TaskLog
# from backend.models.click import Click
# from backend.models.pomodoro import Pomodoro
# from backend.models.profile import Profile

# Список всех моделей, чтобы Alembic видел их при автогенерации миграций
__all__ = ["Base",
            "Task", "TaskLog",
            "Click",
            "Pomodoro",
            "Profile"]
