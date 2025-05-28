#C:\UNI\DProject\tracebit\TraceBit\backend\main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.fingerprint import router as fingerprint_router
from routers import admin as admin_router
from routers import auth as auth_router
from dotenv import load_dotenv

load_dotenv()
app = FastAPI()

# 🌐 Dovoli CORS za frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://tracebit.onrender.com"],
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
