from datetime import date, datetime
from uuid import UUID

from pydantic import BaseModel, HttpUrl

from app.models.enums import MediaType, ProjectStatus
from app.schemas.common import BaseSchema
from app.schemas.technology import TechnologyResponse


class ProjectMediaResponse(BaseSchema):
    id: UUID
    media_type: MediaType
    file_url: str
    alt_text: str
    caption: str | None
    sort_order: int
    created_at: datetime


class ProjectCreate(BaseModel):
    name: str
    slug: str | None = None
    project_type: str | None = None
    short_description: str | None = None
    context: str | None = None
    problem: str | None = None
    responsibilities: str | None = None
    architecture: str | None = None
    features: str | None = None
    challenges: str | None = None
    decisions: str | None = None
    results: str | None = None
    learnings: str | None = None
    future_improvements: str | None = None
    project_url: HttpUrl | None = None
    repository_url: HttpUrl | None = None
    start_date: date | None = None
    end_date: date | None = None
    status: ProjectStatus = ProjectStatus.DRAFT
    featured: bool = False
    sort_order: int = 0
    seo_title: str | None = None
    seo_description: str | None = None
    technology_ids: list[UUID] = []


class ProjectUpdate(BaseModel):
    name: str | None = None
    slug: str | None = None
    project_type: str | None = None
    short_description: str | None = None
    context: str | None = None
    problem: str | None = None
    responsibilities: str | None = None
    architecture: str | None = None
    features: str | None = None
    challenges: str | None = None
    decisions: str | None = None
    results: str | None = None
    learnings: str | None = None
    future_improvements: str | None = None
    project_url: HttpUrl | None = None
    repository_url: HttpUrl | None = None
    start_date: date | None = None
    end_date: date | None = None
    status: ProjectStatus | None = None
    featured: bool | None = None
    sort_order: int | None = None
    seo_title: str | None = None
    seo_description: str | None = None
    technology_ids: list[UUID] | None = None


class ProjectSummaryResponse(BaseSchema):
    id: UUID
    name: str
    slug: str
    project_type: str | None
    short_description: str | None
    responsibilities: str | None
    status: ProjectStatus
    featured: bool
    sort_order: int
    published_at: datetime | None
    created_at: datetime
    updated_at: datetime
    technologies: list[TechnologyResponse]
    media: list[ProjectMediaResponse]


class AdjacentProjectResponse(BaseModel):
    name: str
    slug: str


class ProjectDetailResponse(ProjectSummaryResponse):
    context: str | None
    problem: str | None
    architecture: str | None
    features: str | None
    challenges: str | None
    decisions: str | None
    results: str | None
    learnings: str | None
    future_improvements: str | None
    project_url: HttpUrl | None
    repository_url: HttpUrl | None
    start_date: date | None
    end_date: date | None
    seo_title: str | None
    seo_description: str | None
    previous_project: AdjacentProjectResponse | None = None
    next_project: AdjacentProjectResponse | None = None

