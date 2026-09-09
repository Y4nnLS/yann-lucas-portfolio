from dataclasses import dataclass
from datetime import UTC, datetime, timedelta
from typing import Any

import jwt
from fastapi import Response
from jwt import InvalidTokenError
from passlib.context import CryptContext

from app.core.config import Settings
from app.core.errors import ApiError

ACCESS_COOKIE_NAME = "portfolio_access_token"
REFRESH_COOKIE_NAME = "portfolio_refresh_token"
JWT_ALGORITHM = "HS256"

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")


@dataclass(slots=True)
class TokenPayload:
    sub: str
    token_type: str
    token_version: int


@dataclass(slots=True)
class AuthTokens:
    access_token: str
    refresh_token: str


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(password: str, password_hash: str) -> bool:
    return pwd_context.verify(password, password_hash)


def _create_token(
    *,
    subject: str,
    token_type: str,
    token_version: int,
    secret_key: str,
    expires_delta: timedelta,
) -> str:
    now = datetime.now(UTC)
    payload = {
        "sub": subject,
        "type": token_type,
        "token_version": token_version,
        "iat": now,
        "exp": now + expires_delta,
    }
    return jwt.encode(payload, secret_key, algorithm=JWT_ALGORITHM)


def issue_auth_tokens(*, subject: str, token_version: int, settings: Settings) -> AuthTokens:
    access_token = _create_token(
        subject=subject,
        token_type="access",
        token_version=token_version,
        secret_key=settings.jwt_secret_key,
        expires_delta=timedelta(minutes=settings.access_token_expire_minutes),
    )
    refresh_token = _create_token(
        subject=subject,
        token_type="refresh",
        token_version=token_version,
        secret_key=settings.jwt_secret_key,
        expires_delta=timedelta(days=settings.refresh_token_expire_days),
    )
    return AuthTokens(access_token=access_token, refresh_token=refresh_token)


def decode_token(token: str, settings: Settings) -> TokenPayload:
    try:
        payload: dict[str, Any] = jwt.decode(token, settings.jwt_secret_key, algorithms=[JWT_ALGORITHM])
    except InvalidTokenError as exc:
        raise ApiError(status_code=401, code="invalid_token", message="Authentication token is invalid.") from exc

    subject = payload.get("sub")
    token_type = payload.get("type")
    token_version = payload.get("token_version")
    if not subject or token_type not in {"access", "refresh"} or not isinstance(token_version, int):
        raise ApiError(status_code=401, code="invalid_token", message="Authentication token is invalid.")

    return TokenPayload(sub=subject, token_type=token_type, token_version=token_version)


def set_auth_cookies(response: Response, tokens: AuthTokens, settings: Settings) -> None:
    secure = settings.is_production
    response.set_cookie(
        ACCESS_COOKIE_NAME,
        tokens.access_token,
        httponly=True,
        secure=secure,
        samesite="lax",
        max_age=settings.access_token_expire_minutes * 60,
        path="/",
    )
    response.set_cookie(
        REFRESH_COOKIE_NAME,
        tokens.refresh_token,
        httponly=True,
        secure=secure,
        samesite="lax",
        max_age=settings.refresh_token_expire_days * 24 * 60 * 60,
        path="/",
    )


def clear_auth_cookies(response: Response) -> None:
    response.delete_cookie(ACCESS_COOKIE_NAME, path="/")
    response.delete_cookie(REFRESH_COOKIE_NAME, path="/")
