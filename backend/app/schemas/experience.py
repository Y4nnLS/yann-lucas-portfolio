from datetime import date, datetime
from uuid import UUID

from pydantic import BaseModel

from app.schemas.common import BaseSchema
from app.schemas.technology import TechnologyResponse


class ExperienceCreate(BaseModel):
    role: str
    organization: str
    experience_type: str
    location: str | None = None
    start_date: date | None = None
    end_date: date | None = None
    is_current: bool = False
    description: str | None = None
    sort_order: int = 0
    is_visible: bool = True
    technology_ids: list[UUID] = []


class ExperienceUpdate(BaseModel):
    role: str | None = None
    organization: str | None = None
    experience_type: str | None = None
    location: str | None = None
    start_date: date | None = None
    end_date: date | None = None
    is_current: bool | None = None
    description: str | None = None
    sort_order: int | None = None
    is_visible: bool | None = None
    technology_ids: list[UUID] | None = None


class ExperienceResponse(BaseSchema):
    id: UUID
    role: str
    organization: str
    experience_type: str
    location: str | None
    start_date: date | None
    end_date: date | None
    is_current: bool
    description: str | None
    sort_order: int
    is_visible: bool
    technologies: list[TechnologyResponse]
    created_at: datetime
    updated_at: datetime

