from fastapi import HTTPException
from datetime import datetime, timedelta
from backend.services import pomodoro_service
from backend.schemas.pomodoro import PomodoroCreate, PomodoroUpdate, PomodoroOut, PomodoroProgress

# временное хранилище (имитация базы данных)
pomodoros: dict[int, PomodoroOut] = {}

def create(data: PomodoroCreate) -> PomodoroOut:
    new_id = len(pomodoros) + 1
    started_at = datetime.now()
    finished_at = started_at + timedelta(minutes=data.duration_minutes)

    pomodoro = PomodoroOut(
        id=new_id,
        task_name=data.task_name,
        duration_minutes=data.duration_minutes,
        is_completed=False,
        started_at=started_at,
        finished_at=finished_at
    )
    pomodoros[new_id] = pomodoro
    return pomodoro

def get(pomodoro_id: int) -> PomodoroOut:
    if pomodoro_id not in pomodoros:
        raise HTTPException(status_code=404, detail="Таймер не найден")
    return pomodoros[pomodoro_id]

def update(pomodoro_id: int, data: PomodoroUpdate) -> PomodoroOut:
    if pomodoro_id not in pomodoros:
        raise HTTPException(status_code=404, detail="Таймер не найден")

    updated = pomodoros[pomodoro_id].copy(update=data.dict(exclude_unset=True))
    if updated.is_completed and updated.finished_at is None:
        updated.finished_at = datetime.now()

    pomodoros[pomodoro_id] = updated
    return updated

def delete(pomodoro_id: int) -> bool:
    if pomodoro_id in pomodoros:
        del pomodoros[pomodoro_id]
        return True
    return False

def progress(pomodoro_id: int) -> PomodoroProgress:
    if pomodoro_id not in pomodoros:
        raise HTTPException(status_code=404, detail="Таймер не найден")
    pomodoro = pomodoros[pomodoro_id]
    elapsed = (datetime.now() - pomodoro.started_at).seconds // 60
    return PomodoroProgress(elapsed=elapsed, total=pomodoro.duration_minutes)