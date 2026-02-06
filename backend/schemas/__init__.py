# __init__.py специальный файл Python делает папку модулем (пакетом)
# Пример .task import TaskCreate, TaskUpdate, TaskOut - относительный импорт позволяет писать коротко импорт файлов
from .tasks import TaskCreate, TaskUpdate, TaskOut
from .click import ClickCreate, ClickUpdate, ClickOut
from .profile import ProfileCreate, ProfileOut
# from .pomodoro import PomodoroCreate, PomodoroOut
# from .games import GameCreate, GameOut

__all__ = [
    "TaskCreate", "TaskUpdate", "TaskOut",
    "ClickCreate", "ClickUpdate", "ClickOut",
    "ProfileCreate", "ProfileUpdate", "ProfileOut",
    "PomodoroCreate", "PomodoroOut",
    "GameCreate", "GameOut",
]