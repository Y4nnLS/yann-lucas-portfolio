from datetime import datetime
from uuid import UUID

from pydantic import BaseModel

from app.models.enums import TechnologyCategory
from app.schemas.common import BaseSchema


class TechnologyCreate(BaseModel):
    name: str
    slug: str | None = None
    category: TechnologyCategory
    sort_order: int = 0
    is_active: bool = True


class TechnologyUpdate(BaseModel):
    name: str | None = None
    slug: str | None = None
    category: TechnologyCategory | None = None
    sort_order: int | None = None
    is_active: bool | None = None


class TechnologyResponse(BaseSchema):
    id: UUID
    name: str
    slug: str
    category: TechnologyCategory
    sort_order: int
    is_active: bool
    created_at: datetime
    updated_at: datetime

