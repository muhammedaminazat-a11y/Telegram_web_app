from fastapi import FastAPI

app = FastAPI()

@app.get("/health")
def health_check():
    return {"status": "ok"} # вернуть словарь dict(ключ: значение)

@app.get("/")
def root():
    return {"message": "Добро пожаловать в API!"} # вернуть словарь dict(ключ: значение)
