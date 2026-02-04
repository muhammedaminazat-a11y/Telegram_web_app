from fastapi import APIRouter

router = APIRouter(
    prefix="/users",
    tags=["users"]
    )

# эндпоинт получения пользователей (заглушка)
@router.get("/")
def get_users():
    return {"message": "Список пользователей"}

# эндпоинт создание пользователей (заглушка)
@router.post("/")
def create_user():
    return {"message": "Пользователь создан"}

# эндпоинт обновление пользователей (заглушка)
@router.put("/{user_id}")
def update_user(user_id: int):
    return {"message": f"Пользователь {user_id} обновлен"}

# эндпоинт удаление пользователей (заглушка)
@router.delete("/{user_id}")
def delete_user(user_id: int):
    return {"message": f"Пользователь {user_id} удален"}



            
