# C:\UNI\DProject\tracebit\TraceBit\backend\routers\fingerprint.py

from fastapi import APIRouter, Request
from services.fingerprint_service import (
    generate_fingerprint_hash,
    is_fingerprint_unique,
    save_fingerprint
)

router = APIRouter()

@router.post("/fingerprint")
async def fingerprint_handler(request: Request):
    data = await request.json()
    user_id = data.get("user_id")  # Extract user id from request

    fingerprint_hash = generate_fingerprint_hash(data)
    unique = is_fingerprint_unique(fingerprint_hash)

    if unique:
        save_fingerprint(data, fingerprint_hash, user_id)

    return {
        "status": "ok",
        "unique": unique,
        "hash": fingerprint_hash
    }
