from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.fingerprint import router as fingerprint_router

app = FastAPI()

# 🌐 Dovoli CORS za frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# 👇 Registracija fingerprint routerja
app.include_router(fingerprint_router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "TraceBit API is running."}
