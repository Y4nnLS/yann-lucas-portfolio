from fastapi import APIRouter, Depends, Request, Response
from sqlalchemy.orm import Session

from app.api.deps import CurrentAdmin, RefreshAdmin
from app.core.config import Settings, get_settings
from app.core.errors import ApiError
from app.core.security import clear_auth_cookies, issue_auth_tokens, set_auth_cookies
from app.db.session import get_db
from app.schemas.auth import AuthSessionResponse, LoginRequest
from app.schemas.common import MessageResponse
from app.services.auth import (
    authenticate_admin,
    get_rate_limit_key,
    login_rate_limiter,
    logout_admin,
)

router = APIRouter()


@router.post("/login", response_model=AuthSessionResponse)
def login(
    payload: LoginRequest,
    request: Request,
    response: Response,
    db: Session = Depends(get_db),
    settings: Settings = Depends(get_settings),
) -> AuthSessionResponse:
    key = get_rate_limit_key(request, payload.email)
    if login_rate_limiter.is_limited(key):
        raise ApiError(status_code=429, code="too_many_attempts", message="Too many login attempts. Try again later.")

    admin = authenticate_admin(db, email=payload.email, password=payload.password)
    if not admin:
        login_rate_limiter.register_failure(key)
        raise ApiError(status_code=401, code="invalid_credentials", message="Invalid login credentials.")

    login_rate_limiter.reset(key)
    tokens = issue_auth_tokens(subject=str(admin.id), token_version=admin.token_version, settings=settings)
    set_auth_cookies(response, tokens, settings)
    db.commit()
    db.refresh(admin)
    return AuthSessionResponse(user=admin, message="Login successful.")


@router.post("/refresh", response_model=AuthSessionResponse)
def refresh_session(
    response: Response,
    admin: RefreshAdmin,
    settings: Settings = Depends(get_settings),
) -> AuthSessionResponse:
    tokens = issue_auth_tokens(subject=str(admin.id), token_version=admin.token_version, settings=settings)
    set_auth_cookies(response, tokens, settings)
    return AuthSessionResponse(user=admin, message="Session refreshed.")


@router.post("/logout", response_model=MessageResponse)
def logout(response: Response, admin: CurrentAdmin, db: Session = Depends(get_db)) -> MessageResponse:
    logout_admin(admin)
    clear_auth_cookies(response)
    db.commit()
    return MessageResponse(message="Logout successful.")


@router.get("/me", response_model=AuthSessionResponse)
def me(admin: CurrentAdmin) -> AuthSessionResponse:
    return AuthSessionResponse(user=admin)
