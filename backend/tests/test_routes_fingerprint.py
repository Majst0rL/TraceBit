#C:\UNI\DProject\tracebit\TraceBit\backend\tests\test_routes_fingerprint.py

def test_fingerprint_endpoint(client):
    sample_data = {
        "parsedUserAgent": {
            "fullUserAgent": "Mozilla/5.0",
            "browser": "Chrome",
            "os": "Windows"
        },
        "webGL": {"renderer": "Intel"},
        "screen": {"width": 1920, "height": 1080},
        "capabilities": {"cookies": True}
    }

    response = client.post("/api/fingerprint", json=sample_data)
    assert response.status_code == 200
    json_data = response.json()
    assert "hash" in json_data
    assert "unique" in json_data
    assert "suspicious" in json_data
