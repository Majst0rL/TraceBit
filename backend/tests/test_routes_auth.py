# C:\UNI\DProject\tracebit\TraceBit\backend\tests\test_routes_auth.py

import pytest

# 1. Register – password mismatch
def test_register_password_mismatch(client):
    response = client.post("/api/register", json={
        "email": "test@example.com",
        "password": "abc123",
        "password_confirm": "xyz999",
        "full_name": "Test User",
        "username": "testuser"
    })
    assert response.status_code == 400
    assert response.json()["detail"] == "Passwords do not match."


# 2. Login – incorrect password
def test_login_invalid_password(client, mocker):
    # Mock user with correct password hash
    mock_user = {
        "email": "test@example.com",
        "password_hash": "$2b$12$KIXIDZ7pXsdHIKMO9nFxM.BA9bwDAttUFTYmA1eV2S2NDvMLfA1ga",  # hash for "correct-password"
        "email_confirmed": True,
        "twofa_secret": "JBSWY3DPEHPK3PXP"
    }

    # Mock Supabase query result
    mock_result = mocker.MagicMock()
    mock_result.data = [mock_user]

    # Chain .select().eq().limit().execute() to return mock_result
    mock_table = mocker.MagicMock()
    (
        mock_table.select.return_value
        .eq.return_value
        .limit.return_value
        .execute.return_value
    ) = mock_result

    mocker.patch("routers.auth.supabase.table", return_value=mock_table)

    # Send login request with wrong password
    response = client.post("/api/login", json={
        "email": "test@example.com",
        "password": "wrong-password",
        "twofa_code": "123456"
    })

    assert response.status_code == 401
    assert response.json()["detail"] == "Incorrect email or password."


# 3. Confirm email – invalid token
def test_confirm_email_invalid_token(client):
    response = client.get("/api/confirm-email", params={"token": "invalid_token"})
    assert response.status_code == 400
    assert response.json()["detail"] == "Invalid token."


# 4. Reset password request – user not found
def test_reset_password_request_user_not_found(client, mocker):
    # Mock no user found in Supabase
    mock_result = mocker.MagicMock()
    mock_result.data = []

    mock_table = mocker.MagicMock()
    mock_table.select.return_value.eq.return_value.limit.return_value.execute.return_value = mock_result
    mocker.patch("routers.auth.supabase.table", return_value=mock_table)

    response = client.post("/api/reset-password/request", json={
        "email": "notfound@gmail.com"
    })

    assert response.status_code == 404
    assert response.json()["detail"] == "User not found."


# 5. Reset password verify – wrong code
def test_reset_password_verify_invalid_code(client, mocker):
    # Mock user with a valid reset code
    user = {
        "reset_code": "ABC123",
        "reset_code_expires": "2999-01-01T00:00:00"
    }

    mock_result = mocker.MagicMock()
    mock_result.data = [user]

    mock_table = mocker.MagicMock()
    mock_table.select.return_value.eq.return_value.limit.return_value.execute.return_value = mock_result
    mocker.patch("routers.auth.supabase.table", return_value=mock_table)

    # Send wrong reset code
    response = client.post("/api/reset-password/verify", json={
        "email": "test@example.com",
        "code": "WRONGCODE"
    })

    assert response.status_code == 400
    assert response.json()["detail"] == "Invalid reset code."


# 6. Reset password confirm – invalid or expired code
def test_reset_password_confirm_invalid_code(client, mocker):
    # Mock user with a valid reset code
    user = {
        "reset_code": "REAL123",
        "reset_code_expires": "2999-01-01T00:00:00"
    }

    mock_result = mocker.MagicMock()
    mock_result.data = [user]

    mock_table = mocker.MagicMock()
    mock_table.select.return_value.eq.return_value.limit.return_value.execute.return_value = mock_result
    mocker.patch("routers.auth.supabase.table", return_value=mock_table)

    # Send wrong confirmation code
    response = client.post("/api/reset-password/confirm", json={
        "email": "test@example.com",
        "code": "BAD456",
        "new_password": "newpass123"
    })

    assert response.status_code == 400
    assert response.json()["detail"] == "Invalid or expired reset code."
