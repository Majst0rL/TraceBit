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
    reasons = []
    score = 0

    ua = (new_fp.get("user_agent") or "").lower()
    browser = (new_fp.get("browser_name") or "").lower()
    os_name = (new_fp.get("os_name") or "").lower()
    resolution = (new_fp.get("screen_resolution") or "").lower()
    renderer = (new_fp.get("gpu_renderer") or "").lower()
    fonts = new_fp.get("fonts") or []
    features = new_fp.get("features", {})
    refresh_rate = new_fp.get("screen_refresh_rate")

    # === Blacklist: GPU / UA keywords ===
    blacklist_keywords = ["llvmpipe", "swiftshader", "software", "mesa", "basic render", 
                          "phantomjs", "headless", "selenium", "puppeteer", 
                          "vmware", "virtualbox", "vbox", "xen", "qemu"]

    if any(x in ua for x in blacklist_keywords):
        reasons.append("Blacklisted keyword in user agent")
        score += 2
    if any(x in renderer for x in blacklist_keywords):
        reasons.append("Blacklisted GPU renderer")
        score += 2

    # === Implausible resolution ===
    try:
        w, h = map(int, resolution.split("x"))
        if w < 300 or h < 200 or w > 8000 or h > 8000:
            reasons.append("Unrealistic screen resolution")
            score += 2
    except Exception:
        reasons.append("Invalid screen resolution format")
        score += 1

    # === Unusual OS-browser combos ===
    if ("windows" in os_name and "safari" in browser) or ("linux" in os_name and "edge" in browser):
        reasons.append("Unusual OS and browser combination")
        score += 2

    # === Refresh rate anomalies ===
    if refresh_rate is not None:
        if refresh_rate < 30 or refresh_rate > 240:
            reasons.append("Unusual screen refresh rate")
            score += 1

    # === Fonts missing or too few ===
    if isinstance(fonts, list) and len(fonts) == 0:
        reasons.append("No fonts detected")
        score += 1
    elif len(fonts) < 3:
        reasons.append("Very few fonts detected")
        score += 0.5

    # === Empty or minimal features ===
    if isinstance(features, dict):
        if len(features) == 0:
            reasons.append("No browser capabilities reported")
            score += 1
        elif len(features) < 3:
            reasons.append("Very few capabilities present")
            score += 0.5

    # === WebGL Renderer generic or software ===
    if "microsoft" in renderer or "gdi" in renderer or "basic" in renderer:
        reasons.append("Renderer suggests software rendering")
        score += 2

    # === Changes compared to own previous fingerprints ===
    # (if fingerprint has same user_id)
    user_id = new_fp.get("user_id")
    if user_id:
        user_fps = [fp for fp in all_fps if fp.get("user_id") == user_id]
        if user_fps:
            last_fp = user_fps[-1]  # Assuming sorted by time elsewhere
            change_count = 0
            for key in ["browser_name", "os_name", "gpu_renderer", "screen_resolution"]:
                if last_fp.get(key) != new_fp.get(key):
                    change_count += 1

            if change_count >= 3:
                reasons.append(f"Drastic fingerprint change compared to previous ({change_count} fields)")
                score += 2
            elif change_count > 0:
                reasons.append(f"Minor fingerprint changes detected ({change_count})")
                score += 1

    # === Final decision ===
    is_suspicious = score >= 3  # Threshold (adjustable)
    reason_str = "; ".join(reasons) if reasons else "No anomalies detected"

    return is_suspicious, reason_str


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
