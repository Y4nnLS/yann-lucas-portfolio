from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, EmailStr, Field, HttpUrl

from app.schemas.common import BaseSchema


class SiteSettingsPublic(BaseSchema):
    id: UUID
    full_name: str
    professional_title: str
    hero_title: str
    hero_subtitle: str
    introduction: str
    about: str
    email: EmailStr | None
    location: str | None
    github_username: str | None
    github_url: HttpUrl | None
    linkedin_url: HttpUrl | None
    availability: str | None
    resume_url: str | None
    default_seo_title: str | None
    default_seo_description: str | None
    default_social_image_url: str | None
    created_at: datetime
    updated_at: datetime


class SiteSettingsUpdate(BaseModel):
    full_name: str
    professional_title: str
    hero_title: str
    hero_subtitle: str
    introduction: str
    about: str
    email: EmailStr | None = None
    location: str | None = None
    github_username: str | None = None
    github_url: HttpUrl | None = None
    linkedin_url: HttpUrl | None = None
    availability: str | None = None
    default_seo_title: str | None = None
    default_seo_description: str | None = None
    default_social_image_url: str | None = None


class ResumeResponse(BaseModel):
    resume_url: str | None
    has_resume: bool
    summary_html: str | None = None
    experiences: list[dict[str, object]] = Field(default_factory=list)
    technologies: list[dict[str, object]] = Field(default_factory=list)
    projects: list[dict[str, object]] = Field(default_factory=list)
