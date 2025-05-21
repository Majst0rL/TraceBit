import hashlib
import json
from supabase import create_client, Client

SUPABASE_URL = "https://wmzgrhamqifekgyngytd.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndtemdyaGFtcWlmZWtneW5neXRkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzE1NTI3NCwiZXhwIjoyMDYyNzMxMjc0fQ.uXVgtJs9_2jFdTX2sKCcnfKRYtODvaUXXFrHils3HNI"

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def generate_fingerprint_hash(data: dict) -> str:
    raw = json.dumps(data, sort_keys=True)
    return hashlib.sha256(raw.encode()).hexdigest()

def is_fingerprint_unique(fingerprint_hash: str) -> bool:
    result = supabase.table("fingerprints").select("id").eq("fingerprint_hash", fingerprint_hash).execute()
    return len(result.data) == 0

def save_fingerprint(data: dict, fingerprint_hash: str):
    resolution = data.get("screen", {})
    prepared = {
        "fingerprint_hash": fingerprint_hash,
        "user_agent": data.get("parsedUserAgent", {}).get("fullUserAgent"),
        "browser_name": data.get("parsedUserAgent", {}).get("browser"),
        "os_name": data.get("parsedUserAgent", {}).get("os"),
        "gpu_renderer": data.get("webGL", {}).get("renderer"),
        "screen_resolution": f"{resolution.get('width')}x{resolution.get('height')}",
        "features": json.dumps(data.get("capabilities", {})),
    }
    supabase.table("fingerprints").insert(prepared).execute()
