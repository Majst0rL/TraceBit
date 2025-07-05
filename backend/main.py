#C:\UNI\DProject\tracebit\TraceBit\backend\main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.fingerprint import router as fingerprint_router
from routers import admin as admin_router
from routers import auth as auth_router
from dotenv import load_dotenv
import os

load_dotenv()
app = FastAPI()

# Frontend URL for CORS
cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True
)

# 👇 Registracija routerjev
app.include_router(fingerprint_router, prefix="/api")
app.include_router(admin_router.router, prefix="/api/admin")
app.include_router(auth_router.router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "TraceBit API is running."}
