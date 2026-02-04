from fastapi import FastAPI
from backend.routes import tasks, profile, games, pomodoro, clicker

# создания экземпляра приложения FastAPI
app = FastAPI(title="Telegram Mini App To Do List API")

# подключение роутера для задач
app.include_router(tasks.router)
app.include_router(profile.router)
app.include_router(games.router) 
app.include_router(pomodoro.router)
app.include_router(clicker.router)

# health-check эндпоинт
@app.get("/health")
def health_check():
    return {"status": "ok"} # возвращает словарь dict() ({})

# корневой эндпоинт
@app.get("/")
def root():
    return {"message": "Добро пожаловать в API!"} # возвращает словарь dict() ({})