from fastapi import APIRouter

router = APIRouter(
    prefix="/home",
    tags=["home"]
    )

# эндпоинт получения домашней страницы (заглушка)
@router.get("/")
def get_home():
    return {"message": "Главная страница"}

# эндпоинт создание домашней страницы (заглушка)
@router.post("/")
def create_home():
    return {"message": "Главная страница создана"}

# эндпоинт обновления домашней страницы (заглушка)
@router.put("/{home_id}")
def update_home(home_id: int):
    return {"message": f"Главная страница {home_id} обновлена"}

# эндпоинт удаление домашней страницы (заглушка)
@router.delete("/{home_id}")
def delete_home(home_id: int):
    return {"message": f"Главная страница {home_id} удалена"}