from fastapi import FastAPI
from routes import tasks # импорт роутов из папки routes

# создания экземпляра приложения FastAPI
app = FastAPI(title="Telegram Mini App To Do List API")

# подключение роутера для задач
app.include_router(tasks.router)

# health-check эндпоинт
@app.get("/health")
def health_check():
    return {"status": "ok"} # возвращает словарь dict() ({})

# корневой эндпоинт
@app.get("/")
def root():
    return {"message": "Добро пожаловать в API!"} # возвращает словарь dict() ({})