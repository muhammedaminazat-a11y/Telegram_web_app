from fastapi import APIRouter

router = APIRouter(
    prefix="/click",
    tags=["click"]
    )

# эндпоинт получения кликера (клик) (заглушка)
@router.get("/")
def get_click():
    return {"message": "Клик"}

# эндпоинт создание кликера (заглушка)
@router.post("/")
def create_click():
    return {"message": "Клик создан"}

# эндпоинт обновления кликера (заглушка)
@router.put("/{click_id}")
def update_click(click_id: int):
    return {"message": f"Клик {click_id} обновлен"}

# эндпоинт удаление кликера (заглушка)
@router.delete("/{click_id}")
def delete_click(click_id: int):
    return {"message": f"Клик {click_id} удален"}