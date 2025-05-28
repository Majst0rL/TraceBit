#C:\UNI\DProject\tracebit\TraceBit\backend\routers\auth.py

from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from supabase import create_client, Client
import os
import jwt
import bcrypt
from datetime import datetime, timedelta
from dotenv import load_dotenv
load_dotenv()

router = APIRouter()

# Supabase init
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
JWT_SECRET = os.getenv("JWT_SECRET", "supersecret")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Pydantic model
class LoginInput(BaseModel):
    email: str
    password: str

# Endpoint za prijavo
@router.post("/login")
def login(data: LoginInput):
    result = supabase.table("users").select("*").eq("email", data.email).limit(1).execute()
    user = result.data[0] if result.data else None

    if not user:
        raise HTTPException(status_code=401, detail="Napačen e-mail ali geslo")

    stored_hash = user["password_hash"]
    if not bcrypt.checkpw(data.password.encode(), stored_hash.encode()):
        raise HTTPException(status_code=401, detail="Napačen e-mail ali geslo")

    # Generacija JWT tokena
    payload = {
        "email": data.email,
        "exp": datetime.utcnow() + timedelta(hours=2)
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm="HS256")

    return {"access_token": token}
