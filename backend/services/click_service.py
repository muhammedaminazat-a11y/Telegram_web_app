from fastapi import HTTPException
from backend.schemas.click import ClickCreate, ClickUpdate, ClickOut, ClickGlasses

# временное хранилище
_clicks: dict[int, ClickOut] = {}
_glasses: dict[int, int] = {}

# получить список кликов
def get_clicks() -> list[ClickOut]:
    return list(_clicks.values())

# получить один клик
def get_click(click_id: int) -> ClickOut:
    if click_id not in _clicks:
        raise HTTPException(status_code=404, detail="Click не найден")
    return _clicks[click_id]

# создать клик
def create_click(click: ClickCreate) -> ClickOut:
    click_id = len(_clicks) + 1
    new_click = ClickOut(id=click_id, **click.dict())
    _clicks[click_id] = new_click
    return new_click


# обновить клик
def update_click(click_id: int, click: ClickUpdate) -> ClickOut:
    if click_id not in _clicks:
        raise HTTPException(status_code=404, detail="Click не найден")
    updated = _clicks[click_id].copy(update=click.dict(exclude_unset=True))
    _clicks[click_id] = updated
    return updated

# удалить клик
def delete_click(click_id: int) -> dict:
    if click_id not in _clicks:
        raise HTTPException(status_code=404, detail="Click не найден")
    deleted = _clicks.pop(click_id)
    return {"message": f"Клик {click_id} удален", "click": deleted}

# получить очки (glasses)
def get_click_glasses(user_id: int) -> ClickGlasses:
    glasses = _glasses.get(user_id, 0)
    return ClickGlasses(profile_id=user_id, glasses=glasses)

# увеличить счётчик очков
def increment_click(user_id: int, amount: int = 1) -> ClickGlasses:
    current = _glasses.get(user_id, 0)
    _glasses[user_id] = current + amount
    return ClickGlasses(profile_id=user_id, glasses=_glasses[user_id])