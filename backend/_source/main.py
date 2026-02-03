from fastapi import FastAPI
from routes import tasks

app = FastAPI()
app.include_router(tasks.router)

@app.get("/health")
def health_check():
    return {"status": "ok"} # вернуть словарь dict(ключ: значение)

@app.get("/")
def root():
    return {"message": "Добро пожаловать в API!"} # вернуть словарь dict(ключ: значение)

tasks = {}