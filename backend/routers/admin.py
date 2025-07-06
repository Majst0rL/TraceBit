# C:\UNI\DProject\tracebit\TraceBit\backend\routers\admin.py

from fastapi import APIRouter, Header, HTTPException
from fastapi.responses import StreamingResponse
from supabase import create_client, Client
from typing import Optional
import os
import jwt
from dotenv import load_dotenv
from io import StringIO
import csv
from datetime import datetime, timedelta, timezone

load_dotenv()

# --- Supabase init ---
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise RuntimeError("Supabase environment variables not set")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# --- JWT verifier ---
def verify_user_token(authorization: Optional[str]) -> str:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid Authorization header")
    token = authorization.replace("Bearer ", "")
    try:
        decoded = jwt.decode(token, options={"verify_signature": False})
        email = decoded.get("email")
        if not email:
            raise HTTPException(status_code=401, detail="Email not found in token")
        result = supabase.table("users").select("id").eq("email", email).limit(1).execute()
        if not result.data:
            raise HTTPException(status_code=403, detail="User not authorized")
        return email
    except Exception as e:
        print("JWT error:", e)
        raise HTTPException(status_code=401, detail="Invalid or expired token")

router = APIRouter()

# --- 1. STATISTICS endpoint ---
@router.get("/stats")
def get_stats(authorization: Optional[str] = Header(None)):
    user_email = verify_user_token(authorization)
    fingerprints = supabase.table("fingerprints").select("id, fingerprint_hash, suspicious").execute().data

    total_fingerprints = len(fingerprints)
    unique_hashes = len(set(f.get("fingerprint_hash") for f in fingerprints if f.get("fingerprint_hash")))

    def is_suspicious(val):
        # Robust handling of booleans, ints, str "true"/"1"/"t"/"yes"
        if val is True or val == 1:
            return True
        if isinstance(val, str) and val.strip().lower() in ["true", "1", "t", "yes"]:
            return True
        return False
    anomalies = sum(1 for f in fingerprints if is_suspicious(f.get("suspicious")))

    return {
        "total_fingerprints": total_fingerprints,
        "unique_hashes": unique_hashes,
        "anomalies": anomalies
    }

# --- 2. RECENT FINGERPRINTS (LIMIT 10) endpoint ---
@router.get("/fingerprints")
def get_fingerprints(authorization: Optional[str] = Header(None)):
    user_email = verify_user_token(authorization)
    result = supabase.table("fingerprints") \
        .select("fingerprint_hash, browser_name, os_name, gpu_renderer, screen_resolution, suspicious, suspicious_reason, timestamp") \
        .order("timestamp", desc=True) \
        .limit(10) \
        .execute()
    return result.data

# --- 3. EXPORT ALL FINGERPRINTS AS CSV ---
@router.get("/fingerprints/download")
def download_fingerprints(authorization: Optional[str] = Header(None)):
    user_email = verify_user_token(authorization)
    result = supabase.table("fingerprints").select("*").execute()
    fingerprints = result.data
    if not fingerprints:
        raise HTTPException(status_code=404, detail="No fingerprints found.")
    csv_buffer = StringIO()
    writer = csv.DictWriter(csv_buffer, fieldnames=fingerprints[0].keys())
    writer.writeheader()
    for row in fingerprints:
        writer.writerow(row)
    csv_buffer.seek(0)
    filename = f"tracebit_fingerprints_{datetime.now(timezone.utc).strftime('%Y%m%d%H%M')}.csv"
    return StreamingResponse(
        csv_buffer,
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )

# --- 4. ANOMALIES BY DAY FOR LAST MONTH (for chart) ---
@router.get("/anomalies/month")
def anomalies_last_month(authorization: Optional[str] = Header(None)):
    user_email = verify_user_token(authorization)
    # Always use UTC!
    utc_now = datetime.utcnow()
    today = utc_now.date()
    # Generate 31 days, including today (from 30 days ago to today)
    days = [(today - timedelta(days=i)).isoformat() for i in reversed(range(31))]
    one_month_ago = (utc_now - timedelta(days=30)).replace(hour=0, minute=0, second=0, microsecond=0).isoformat()

    # Query all suspicious fingerprints in this range
    result = supabase.table("fingerprints") \
        .select("timestamp, suspicious") \
        .gte("timestamp", one_month_ago) \
        .execute()
    data = result.data

    daily = {}
    def is_suspicious(val):
        if val is True or val == 1:
            return True
        if isinstance(val, str) and val.strip().lower() in ["true", "1", "t", "yes"]:
            return True
        return False

    for row in data:
        if not is_suspicious(row.get("suspicious")):
            continue
        try:
            date_part = row.get("timestamp")[:10]
        except Exception:
            continue
        daily[date_part] = daily.get(date_part, 0) + 1

    chart = [{"date": d, "anomalies": daily.get(d, 0)} for d in days]
    return chart
