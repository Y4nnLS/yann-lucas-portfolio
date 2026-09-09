from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, EmailStr

from app.schemas.common import BaseSchema


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class AdminUserResponse(BaseSchema):
    id: UUID
    email: EmailStr
    is_active: bool
    last_login_at: datetime | None
    created_at: datetime
    updated_at: datetime


class AuthSessionResponse(BaseModel):
    user: AdminUserResponse
    message: str = "Authenticated."

