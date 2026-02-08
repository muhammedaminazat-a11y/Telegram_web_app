from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routes import ai, click, home, pomodoro, profile, task, task_log

# создания экземпляра приложения FastAPI
app = FastAPI(title="Telegram Mini App To Do List API")

# подключение к CORS (чтобы работать на разных доменах frontend и backend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# подключение роутера для задач
app.include_router(ai.router)
app.include_router(click.router)
app.include_router(home.router)
app.include_router(pomodoro.router)
app.include_router(profile.router)
app.include_router(task.router)
app.include_router(task_log.router)

# health-check эндпоинт
@app.get("/health")
def health_check():
    return {"status": "ok"} # возвращает словарь dict() ({})

# корневой эндпоинт
@app.get("/")
def root():
    return {"message": "Добро пожаловать в API!"} # возвращает словарь dict() ({})