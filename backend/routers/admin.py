#C:\UNI\DProject\tracebit\TraceBit\backend\routers\admin.py

from fastapi import APIRouter, Header, HTTPException
from supabase import create_client, Client
from typing import Optional
import os
import jwt
from dotenv import load_dotenv

load_dotenv()

# === Inicializacija Supabase klienta ===
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise RuntimeError("Supabase okoljski spremenljivki nista nastavljeni")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# === Funkcija za preverjanje JWT tokena ===
def verify_user_token(authorization: Optional[str]) -> str:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Manjkajoč ali neveljaven Authorization header")

    token = authorization.replace("Bearer ", "")
    try:
        # Dekodiranje tokena brez preverjanja podpisa (Supabase tokeni)
        decoded = jwt.decode(token, options={"verify_signature": False})
        email = decoded.get("email")

        if not email:
            raise HTTPException(status_code=401, detail="Email ni bil najden v tokenu")

        # Preverjanje obstoja uporabnika
        result = supabase.table("users").select("id").eq("email", email).limit(1).execute()
        if not result.data:
            raise HTTPException(status_code=403, detail="Uporabnik ni avtoriziran")

        return email

    except Exception as e:
        print("JWT napaka:", e)
        raise HTTPException(status_code=401, detail="Neveljaven ali potekel token")

# === Router inicializacija ===
router = APIRouter()

# === Endpoint: statistika ===
@router.get("/stats")
def get_stats(authorization: Optional[str] = Header(None)):
    user_email = verify_user_token(authorization)
    print(f"[ADMIN] Statistika dostop uporabnika: {user_email}")

    fingerprints = supabase.table("fingerprints").select("id, fingerprint_hash").execute().data
    access_logs = supabase.table("access_logs").select("id, suspicious").execute().data

    total_fingerprints = len(fingerprints)
    unique_hashes = len(set(f.get("fingerprint_hash") for f in fingerprints if f.get("fingerprint_hash")))
    anomalies = sum(1 for log in access_logs if log.get("suspicious") is True)

    return {
        "total_fingerprints": total_fingerprints,
        "unique_hashes": unique_hashes,
        "anomalies": anomalies
    }

# === Endpoint: pregled zadnjih fingerprintov ===
@router.get("/fingerprints")
def get_fingerprints(authorization: Optional[str] = Header(None)):
    user_email = verify_user_token(authorization)
    print(f"[ADMIN] Pridobivanje fingerprintov za: {user_email}")

    result = supabase.table("fingerprints") \
        .select("fingerprint_hash, browser_name, os_name, gpu_renderer, screen_resolution, timestamp") \
        .order("timestamp", desc=True) \
        .limit(50) \
        .execute()

    return result.data
