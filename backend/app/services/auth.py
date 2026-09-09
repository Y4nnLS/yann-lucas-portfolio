import uuid
from datetime import UTC, datetime

from fastapi import Request
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import Settings
from app.core.errors import ApiError
from app.core.rate_limiter import LoginRateLimiter
from app.core.security import (
    ACCESS_COOKIE_NAME,
    REFRESH_COOKIE_NAME,
    decode_token,
    hash_password,
    verify_password,
)
from app.models import AdminUser

login_rate_limiter = LoginRateLimiter()


def normalize_email(email: str) -> str:
    return email.strip().lower()


def ensure_admin_user(db: Session, settings: Settings) -> tuple[AdminUser, bool]:
    email = normalize_email(settings.admin_email)
    admin = db.scalar(select(AdminUser).where(AdminUser.email == email))
    if admin:
        return admin, False

    admin = AdminUser(
        email=email,
        password_hash=hash_password(settings.admin_password),
        is_active=True,
    )
    db.add(admin)
    db.flush()
    return admin, True


def authenticate_admin(db: Session, *, email: str, password: str) -> AdminUser | None:
    admin = db.scalar(select(AdminUser).where(AdminUser.email == normalize_email(email)))
    if not admin:
        return None
    if not verify_password(password, admin.password_hash):
        return None
    if not admin.is_active:
        raise ApiError(status_code=403, code="inactive_admin", message="Administrator access is disabled.")
    admin.last_login_at = datetime.now(UTC)
    db.flush()
    return admin


def get_rate_limit_key(request: Request, email: str) -> str:
    host = request.client.host if request.client else "anonymous"
    return f"{host}:{normalize_email(email)}"


def _extract_token_from_request(request: Request, token_type: str) -> str:
    cookie_name = ACCESS_COOKIE_NAME if token_type == "access" else REFRESH_COOKIE_NAME
    token = request.cookies.get(cookie_name)
    if token:
        return token
    authorization = request.headers.get("Authorization")
    if authorization and authorization.startswith("Bearer "):
        return authorization.removeprefix("Bearer ").strip()
    raise ApiError(status_code=401, code="missing_token", message="Authentication is required.")


def get_admin_from_request(db: Session, request: Request, settings: Settings, *, token_type: str = "access") -> AdminUser:
    token = _extract_token_from_request(request, token_type)
    payload = decode_token(token, settings)
    if payload.token_type != token_type:
        raise ApiError(status_code=401, code="invalid_token_type", message="Authentication token is invalid.")

    try:
        admin_id = uuid.UUID(payload.sub)
    except ValueError as exc:
        raise ApiError(status_code=401, code="invalid_token", message="Authentication token is invalid.") from exc

    admin = db.get(AdminUser, admin_id)
    if not admin or not admin.is_active:
        raise ApiError(status_code=401, code="unauthorized", message="Authentication is required.")
    if admin.token_version != payload.token_version:
        raise ApiError(status_code=401, code="stale_token", message="Authentication token has expired.")
    return admin


def logout_admin(admin: AdminUser) -> None:
    admin.token_version += 1

