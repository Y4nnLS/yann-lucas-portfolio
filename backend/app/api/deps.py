from typing import Annotated

from fastapi import Depends, Request
from sqlalchemy.orm import Session

from app.core.config import Settings, get_settings
from app.db.session import get_db
from app.models import AdminUser
from app.services.auth import get_admin_from_request

DbSession = Annotated[Session, Depends(get_db)]
AppSettings = Annotated[Settings, Depends(get_settings)]


def get_current_admin(request: Request, db: DbSession, settings: AppSettings) -> AdminUser:
    return get_admin_from_request(db, request, settings, token_type="access")


def get_refresh_admin(request: Request, db: DbSession, settings: AppSettings) -> AdminUser:
    return get_admin_from_request(db, request, settings, token_type="refresh")


CurrentAdmin = Annotated[AdminUser, Depends(get_current_admin)]
RefreshAdmin = Annotated[AdminUser, Depends(get_refresh_admin)]

