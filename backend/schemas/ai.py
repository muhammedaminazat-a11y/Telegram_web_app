from pydantic import BaseModel, Field

# ---- Pydantic схемы для AI ----
# --- Входные данные (Запрос к AI) ---
class AIRequest(BaseModel):
    prompt: str = Field(..., min_length=1, description="Запрос к AI") # ..., обязательное поле ввода

# --- Ответ для AI ---
class AIResponse(BaseModel):
    answer: str = Field(..., description="Ответ от AI")