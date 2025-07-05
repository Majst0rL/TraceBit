#C:\UNI\DProject\tracebit\TraceBit\backend\routers\auth.py

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, EmailStr
from supabase import create_client, Client
from fastapi.responses import StreamingResponse
import os
import jwt
import bcrypt
import pyotp
import qrcode
import qrcode.image.svg
from datetime import datetime, timedelta
from io import BytesIO
from dotenv import load_dotenv
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from urllib.parse import urlencode

load_dotenv()

router = APIRouter()

# Supabase configuration
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
JWT_SECRET = os.getenv("JWT_SECRET", "supersecret")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Email configuration
MAIL_USERNAME = os.getenv("MAIL_USERNAME")
MAIL_PASSWORD = os.getenv("MAIL_PASSWORD")
MAIL_FROM = os.getenv("MAIL_FROM")
MAIL_SERVER = os.getenv("MAIL_SERVER")
MAIL_PORT = int(os.getenv("MAIL_PORT", 587))

conf = ConnectionConfig(
    MAIL_USERNAME=MAIL_USERNAME,
    MAIL_PASSWORD=MAIL_PASSWORD,
    MAIL_FROM=MAIL_FROM,
    MAIL_PORT=MAIL_PORT,
    MAIL_SERVER=MAIL_SERVER,
    MAIL_STARTTLS=os.getenv("MAIL_STARTTLS") == "True",
    MAIL_SSL_TLS=os.getenv("MAIL_SSL_TLS") == "True",
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True
)

# === Pydantic models ===
class LoginInput(BaseModel):
    email: EmailStr
    password: str
    twofa_code: str

class RegisterInput(BaseModel):
    email: EmailStr
    password: str
    password_confirm: str
    full_name: str
    username: str

class ResetPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordVerify(BaseModel):
    email: EmailStr
    code: str

class ResetPasswordConfirm(BaseModel):
    email: EmailStr
    code: str
    new_password: str

# === Register route ===
@router.post("/register")
async def register(data: RegisterInput):
    if data.password != data.password_confirm:
        raise HTTPException(status_code=400, detail="Passwords do not match.")

    existing_user = supabase.table("users").select("id").eq("email", data.email).execute().data
    if existing_user:
        raise HTTPException(status_code=409, detail="A user with this email already exists.")

    secret = pyotp.random_base32()
    password_hash = bcrypt.hashpw(data.password.encode(), bcrypt.gensalt()).decode()

    supabase.table("users").insert({
        "email": data.email,
        "password_hash": password_hash,
        "full_name": data.full_name,
        "username": data.username,
        "role": "user",
        "email_confirmed": False,
        "twofa_secret": secret
    }).execute()

    # Send email confirmation
    token = jwt.encode({"email": data.email, "exp": datetime.utcnow() + timedelta(hours=1)}, JWT_SECRET, algorithm="HS256")
    confirm_link = f"{FRONTEND_URL}/confirm-email?{urlencode({'token': token})}"
    message = MessageSchema(
        subject="Confirm your TraceBit account",
        recipients=[data.email],
        body=f"Click the link to confirm your email: {confirm_link}",
        subtype="plain"
    )
    fm = FastMail(conf)
    await fm.send_message(message)

    return {"message": "Registration successful. Please confirm your email and set up 2FA before logging in."}

# === Confirm email ===
@router.get("/confirm-email")
def confirm_email(token: str):
    try:
        decoded = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        email = decoded.get("email")
        if not email:
            raise HTTPException(status_code=400, detail="Invalid token.")
        supabase.table("users").update({"email_confirmed": True}).eq("email", email).execute()
        return {"message": "Email confirmed successfully."}
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=400, detail="Token has expired.")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=400, detail="Invalid token.")

# === Login route ===
@router.post("/login")
def login(data: LoginInput):
    result = supabase.table("users").select("*").eq("email", data.email).limit(1).execute()
    user = result.data[0] if result.data else None

    if not user or not bcrypt.checkpw(data.password.encode(), user["password_hash"].encode()):
        raise HTTPException(status_code=401, detail="Incorrect email or password.")

    if not user.get("email_confirmed", False):
        raise HTTPException(status_code=403, detail="Email address not yet confirmed.")

    secret = user.get("twofa_secret")
    if not secret:
        raise HTTPException(status_code=403, detail="2FA is not configured.")

    totp = pyotp.TOTP(secret)
    if not totp.verify(data.twofa_code, valid_window=1):
        raise HTTPException(status_code=403, detail="Invalid 2FA code.")

    payload = {
        "email": data.email,
        "role": user.get("role", "user"),
        "user_id": user.get("id"),
        "exp": datetime.utcnow() + timedelta(hours=2)
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm="HS256")

    return {
        "access_token": token,
        "role": user.get("role", "user"),
        "email": data.email
    }

# === 2FA QR Code Generation ===
@router.get("/2fa/qr")
def get_2fa_qr(email: str = Query(...)):
    result = supabase.table("users").select("twofa_secret, username").eq("email", email).limit(1).execute()
    user = result.data[0] if result.data else None

    if not user or not user.get("twofa_secret"):
        raise HTTPException(status_code=404, detail="User or 2FA secret not found.")

    secret = user["twofa_secret"]
    username = user.get("username", email)
    uri = pyotp.TOTP(secret).provisioning_uri(name=username, issuer_name="TraceBit")

    factory = qrcode.image.svg.SvgImage
    img = qrcode.make(uri, image_factory=factory)
    stream = BytesIO()
    img.save(stream)
    stream.seek(0)

    return StreamingResponse(stream, media_type="image/svg+xml")

# === Request reset code ===
@router.post("/reset-password/request")
async def send_reset_code(data: ResetPasswordRequest):
    result = supabase.table("users").select("id").eq("email", data.email).limit(1).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="User not found.")

    code = str(pyotp.random_base32())[:6]
    supabase.table("users").update({
        "reset_code": code,
        "reset_code_expires": (datetime.utcnow() + timedelta(minutes=15)).isoformat()
    }).eq("email", data.email).execute()

    message = MessageSchema(
        subject="Your password reset code",
        recipients=[data.email],
        body=f"Your TraceBit reset code is: {code}",
        subtype="plain"
    )
    fm = FastMail(conf)
    await fm.send_message(message)

    return {"message": "Reset code sent to your email."}

# === Verify reset code ===
@router.post("/reset-password/verify")
def verify_reset_code(data: ResetPasswordVerify):
    result = supabase.table("users").select("reset_code, reset_code_expires").eq("email", data.email).limit(1).execute()
    user = result.data[0] if result.data else None

    if not user or not user.get("reset_code"):
        raise HTTPException(status_code=404, detail="No reset code found.")

    if user["reset_code"] != data.code:
        raise HTTPException(status_code=400, detail="Invalid reset code.")

    expires = datetime.fromisoformat(user["reset_code_expires"])
    if datetime.utcnow() > expires:
        raise HTTPException(status_code=400, detail="Reset code has expired.")

    return {"message": "Reset code verified."}

# === Confirm new password ===
@router.post("/reset-password/confirm")
def confirm_reset_password(data: ResetPasswordConfirm):
    result = supabase.table("users").select("reset_code, reset_code_expires").eq("email", data.email).limit(1).execute()
    user = result.data[0] if result.data else None

    if not user or user["reset_code"] != data.code:
        raise HTTPException(status_code=400, detail="Invalid or expired reset code.")

    password_hash = bcrypt.hashpw(data.new_password.encode(), bcrypt.gensalt()).decode()

    supabase.table("users").update({
        "password_hash": password_hash,
        "reset_code": None,
        "reset_code_expires": None
    }).eq("email", data.email).execute()

    return {"message": "Password has been reset successfully."}
