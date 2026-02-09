from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routes.ai import router as ai_router

app = FastAPI(title="AI Service API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # локально ок. В проде сузим.
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ai_router)

@app.get("/health")
def health():
    return {"status": "ai-ok"}
