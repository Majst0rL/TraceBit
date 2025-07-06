#C:\UNI\DProject\tracebit\TraceBit\backend\services\fingerprint_service.py

import os
import hashlib
import json
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def generate_fingerprint_hash(data: dict) -> str:
    raw = json.dumps(data, sort_keys=True)
    return hashlib.sha256(raw.encode()).hexdigest()

def is_fingerprint_unique(fingerprint_hash: str) -> bool:
    result = supabase.table("fingerprints").select("id").eq("fingerprint_hash", fingerprint_hash).execute()
    return len(result.data) == 0

def is_fingerprint_suspicious(new_fp: dict, all_fps: list[dict]) -> (bool, str):
    # Heuristics for suspicious fingerprints

    unusual_combo = (
        (new_fp.get("os_name", "").startswith("Windows") and "Safari" in (new_fp.get("browser_name") or "")) or
        (new_fp.get("os_name", "").startswith("Linux") and "Edge" in (new_fp.get("browser_name") or ""))
    )
    if unusual_combo:
        return True, "Unusual OS/Browser combination"

    ua = (new_fp.get("user_agent") or "").lower()
    if any(x in ua for x in ["headless", "phantomjs", "selenium", "puppeteer"]):
        return True, "Automation detected in user agent"

    if new_fp.get("screen_resolution") in ["0x0", "1x1", "10000x10000"]:
        return True, "Impossible or rare screen resolution"

    count_same = sum(1 for fp in all_fps if fp.get("fingerprint_hash") == new_fp["fingerprint_hash"])
    if count_same == 0:
        return True, "Unique fingerprint never seen before"

    renderer = (new_fp.get("gpu_renderer") or "").lower()
    if any(x in renderer for x in ["llvmpipe", "swiftshader", "software"]):
        return True, "Suspicious GPU renderer (VM/Emulator detected)"

    return False, ""

def save_fingerprint(data: dict, fingerprint_hash: str, user_id: int | None = None):
    """
    Save a new fingerprint to the database, if unique.
    Returns: (suspicious: bool, suspicious_reason: str)
    """
    # Check if fingerprint already exists in DB
    if not is_fingerprint_unique(fingerprint_hash):
        # Get existing suspicious fields if needed (for already existing fingerprint)
        result = supabase.table("fingerprints").select("suspicious, suspicious_reason").eq("fingerprint_hash", fingerprint_hash).execute()
        if result.data:
            suspicious = result.data[0].get("suspicious", False)
            suspicious_reason = result.data[0].get("suspicious_reason", "")
        else:
            suspicious, suspicious_reason = False, ""
        return suspicious, suspicious_reason

    # Prepare new entry
    resolution = data.get("screen", {})
    prepared = {
        "fingerprint_hash": fingerprint_hash,
        "user_agent": data.get("parsedUserAgent", {}).get("fullUserAgent"),
        "browser_name": data.get("parsedUserAgent", {}).get("browser"),
        "os_name": data.get("parsedUserAgent", {}).get("os"),
        "gpu_renderer": data.get("webGL", {}).get("renderer"),
        "screen_resolution": f"{resolution.get('width')}x{resolution.get('height')}",
        "features": json.dumps(data.get("capabilities", {})),
        "user_id": user_id,
    }
    all_fps = supabase.table("fingerprints").select("*").execute().data
    suspicious, reason = is_fingerprint_suspicious(prepared, all_fps)
    prepared["suspicious"] = suspicious
    prepared["suspicious_reason"] = reason

    # Insert to DB
    supabase.table("fingerprints").insert(prepared).execute()
    return suspicious, reason
