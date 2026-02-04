from fastapi import APIRouter

router = APIRouter(
    prefix="/pomodoro",
    tags=["pomodoro"]
    )

# эндпоинт получения таймера (заглушка)
@router.get("/")
def get_pomodoro():
    return {"message": "Таймер"}

# эндпоинт создание таймера (заглушка)
@router.post("/")
def create_pomodoro():
    return {"message": "Таймер создан"}

# эндпоинт обновления таймера (заглушка)
@router.put("/{pomodoro_id}")
def update_pomodoro(pomodoro_id: int):
    return {"message": f"Таймер {pomodoro_id} обновлен"}

# эндпоинт удаление таймера (заглушка)
@router.delete("/{pomodoro_id}")
def delete_pomodoro(pomodoro_id: int):
    return {"message": f"Таймер {pomodoro_id} удален"}