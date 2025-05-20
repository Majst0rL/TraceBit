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
    fingerprint_hash = generate_fingerprint_hash(data)
    unique = is_fingerprint_unique(fingerprint_hash)

    if unique:
        save_fingerprint(data, fingerprint_hash)

    return {
        "status": "ok",
        "unique": unique,
        "hash": fingerprint_hash
    }
