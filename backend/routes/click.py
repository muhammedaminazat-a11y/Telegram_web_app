from fastapi import APIRouter, HTTPException
from backend.schemas import (
    ClickCreate, 
    ClickUpdate,
    ClickOut,
)

router = APIRouter(
    prefix="/click",
    tags=["click"]
    )

# временное хранилище словарь (замена на PostgreSQL)
clicks = {}

# эндпоинт получения кликера (клик)
@router.get("/", response_model=list[ClickOut])
def get_clicks():
    return list(clicks.values())

# эндпоинт получения одного клика
@router.get("/{click_id}", response_model=ClickOut)
def get_click(click_id: int):
    if click_id not in clicks:
        return clicks[click_id]
    raise HTTPException(status_code=404, detail="Click не найден")

# эндпоинт создание кликера
@router.post("/", response_model=ClickOut)
def create_click(click: ClickCreate):
    click_id = len(clicks) + 1 # при создании id увеличивается на 1
    clicks[click_id] = {"id": click_id, **click.dict()} # ** (dict: ключ: значение)
    return clicks[click_id]

# эндпоинт обновления кликера
@router.put("/{click_id}", response_model=ClickOut)
def update_click(click_id: int, click: ClickUpdate):
    if click_id not in clicks:
        raise HTTPException(status_code=404, detail="Click не найден")
    clicks[click_id].update(click.dict(exclude_unset=True))
    return clicks[click_id]

# эндпоинт удаление кликера 
@router.delete("/{click_id}")
def delete_click(click_id: int):
    if click_id not in clicks:
       raise HTTPException(status_code=404, detail="Click не найден")
    deleted = clicks.pop(click_id)
    return {"message": f"Клик {click_id} удален", "click": deleted}

# эндпоинт получения количества "очков" (glasses) для пользователя
@router.get("/glasses/{click_id}")
def get_click_glasses(click_id: int):
    if click_id not in clicks:
       raise HTTPException(status_code=404, detail="Click не найден")
    # допустим, glasses = count * 10 (примерная логика)
    glasses = clicks[click_id]["count"] * 10
    return {"profile_id": click_id, "glasses": glasses}

# эндпоинт увеличения счётчика кликов
@router.patch("/{click_id}/increment", response_model=ClickOut)
def increment_click(click_id: int):
    if click_id not in clicks:
        raise HTTPException(status_code=404, detail="Click не найден")
    clicks[click_id]["count"] += 1
    return clicks[click_id]
