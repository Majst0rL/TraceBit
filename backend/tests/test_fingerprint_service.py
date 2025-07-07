#C:\UNI\DProject\tracebit\TraceBit\backend\tests\test_fingerprint_service.py

from services.fingerprint_service import generate_fingerprint_hash

def test_generate_fingerprint_hash_consistency():
    data = {"browser": "Chrome", "os": "Windows"}
    hash1 = generate_fingerprint_hash(data)
    hash2 = generate_fingerprint_hash(data)
    assert hash1 == hash2
    assert isinstance(hash1, str)
    assert len(hash1) == 64
