from fastapi import HTTPException
from backend.schemas.click import ClickCreate, ClickUpdate, ClickOut

# временное хранилище словарь (замена на PostgreSQL)
clicks = {}

# эндпоинт получения кликера (клик)
def get_clicks() -> list[ClickOut]:
    return list(clicks.values())

# эндпоинт получения одного клика
def get_click(click_id: int) -> ClickOut:
    if click_id not in clicks:
         raise HTTPException(status_code=404, detail="Click не найден")
    return clicks[click_id]

# эндпоинт создание кликера
def create_click(click: ClickCreate) -> ClickOut:
    click_id = len(clicks) + 1 # при создании id увеличивается на 1
    clicks[click_id] = {"id": click_id, **click.dict()} # ** (dict: ключ: значение)
    return clicks[click_id]

# эндпоинт обновления кликера
def update_click(click_id: int, click: ClickUpdate) -> ClickOut:
    if click_id not in clicks:
        raise HTTPException(status_code=404, detail="Click не найден")
    clicks[click_id].update(click.dict(exclude_unset=True))
    return clicks[click_id]

# эндпоинт удаление кликера 
def delete_click(click_id: int) -> dict:
    if click_id not in clicks:
       raise HTTPException(status_code=404, detail="Click не найден")
    deleted = clicks.pop(click_id)
    return {"message": f"Клик {click_id} удален", "click": deleted}

# эндпоинт получения количества "очков" (glasses) для пользователя
def get_click_glasses(click_id: int) -> ClickOut:
    if click_id not in clicks:
       raise HTTPException(status_code=404, detail="Click не найден")
    # допустим, glasses = count * 10 (примерная логика)
    glasses = clicks[click_id]["count"] * 10
    return {"profile_id": click_id, "glasses": glasses}

# эндпоинт увеличения счётчика кликов
def increment_click(click_id: int) -> ClickOut:
    if click_id not in clicks:
        raise HTTPException(status_code=404, detail="Click не найден")
    clicks[click_id]["count"] += 1
    return clicks[click_id]



