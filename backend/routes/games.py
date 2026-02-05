from fastapi import APIRouter

router = APIRouter(
    prefix="/games",
    tags=["games"]
    )

# эндпоинт получения игр (заглушка)
@router.get("/")
def get_games():
    return {"message": "Список игр"}

# эндпоинт создание игр (заглушка)
@router.post("/")
def create_game():
    return {"message": "Игра создана"}

# эндпоинт обновления игр (заглушка)
@router.put("/{game_id}")
def update_game(game_id: int):
    return {"message": f"Игра {game_id} обновлена"}

# эндпоинт удаление игр (заглушка)
@router.delete("/{game_id}")
def delete_game(game_id: int):
    return {"message": f"Игра {game_id} удалена"}

def get_games_glasses(user_id: int):
    # Заглушка: пока возвращаем 0
    return 0
