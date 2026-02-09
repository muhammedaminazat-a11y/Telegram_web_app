from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routes.ai import router as ai_router

app = FastAPI(title="AI Only API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ai_router)

@app.get("/health")
def health():
    return {"status": "ok"}
