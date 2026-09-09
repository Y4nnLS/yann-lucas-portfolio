from datetime import datetime
from uuid import UUID

from pydantic import BaseModel

from app.schemas.common import BaseSchema


class FeaturedRepositoryCreate(BaseModel):
    owner: str
    repository_name: str
    sort_order: int = 0
    is_active: bool = True


class FeaturedRepositoryUpdate(BaseModel):
    owner: str | None = None
    repository_name: str | None = None
    sort_order: int | None = None
    is_active: bool | None = None


class FeaturedRepositoryResponse(BaseSchema):
    id: UUID
    owner: str
    repository_name: str
    sort_order: int
    is_active: bool
    created_at: datetime
    updated_at: datetime

