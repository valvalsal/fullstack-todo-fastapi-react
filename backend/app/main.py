import os

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

from .core.config import settings
from .routes import todos, auth, users

app = FastAPI()

if settings.all_cors_origins:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.all_cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"]
    )

app.include_router(todos.router)
app.include_router(auth.router)
app.include_router(users.router)

os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

app.mount("/static", StaticFiles(directory=settings.UPLOAD_DIR), name="static")

@app.get("/")
def root():
    return {"message": "Hello World!"}
