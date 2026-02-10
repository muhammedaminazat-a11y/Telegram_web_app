from fastapi import APIRouter, HTTPException
from backend.services import pomodoro_service
from backend.schemas.pomodoro import (
    PomodoroCreate,
    PomodoroUpdate,
    PomodoroOut,
    PomodoroProgress,
    PomodoroDeleteResponse
)

router = APIRouter(
    prefix="/pomodoro",
    tags=["pomodoro"]
    )

@router.post("/", response_model=PomodoroOut)
def create_pomodoro(data: PomodoroCreate):
    return pomodoro_service.create(data)

@router.get("/{pomodoro_id}", response_model=PomodoroOut)
def get_pomodoro(pomodoro_id: int):
    return pomodoro_service.get(pomodoro_id)

@router.put("/{pomodoro_id}", response_model=PomodoroOut)
def update_pomodoro(pomodoro_id: int, data: PomodoroUpdate):
    return pomodoro_service.update(pomodoro_id, data)

@router.delete("/{pomodoro_id}", response_model=PomodoroDeleteResponse)
def delete_pomodoro(pomodoro_id: int):
    deleted = pomodoro_service.delete(pomodoro_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Таймер не найден")
    return {"message": "Удалено", "pomodoro": deleted}

@router.get("/{pomodoro_id}/progress", response_model=PomodoroProgress)
def get_pomodoro_progress(pomodoro_id: int):
    return pomodoro_service.progress(pomodoro_id)