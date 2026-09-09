import uuid

from sqlalchemy import String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import GUID, Base, TimestampMixin


class SiteSettings(TimestampMixin, Base):
    __tablename__ = "site_settings"

    id: Mapped[uuid.UUID] = mapped_column(GUID(), primary_key=True, default=uuid.uuid4)
    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    professional_title: Mapped[str] = mapped_column(String(255), nullable=False)
    hero_title: Mapped[str] = mapped_column(String(255), nullable=False)
    hero_subtitle: Mapped[str] = mapped_column(Text, nullable=False)
    introduction: Mapped[str] = mapped_column(Text, nullable=False)
    about: Mapped[str] = mapped_column(Text, nullable=False)
    email: Mapped[str | None] = mapped_column(String(320), nullable=True)
    location: Mapped[str | None] = mapped_column(String(255), nullable=True)
    github_username: Mapped[str | None] = mapped_column(String(255), nullable=True)
    github_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    linkedin_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    availability: Mapped[str | None] = mapped_column(String(255), nullable=True)
    resume_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    default_seo_title: Mapped[str | None] = mapped_column(String(255), nullable=True)
    default_seo_description: Mapped[str | None] = mapped_column(Text, nullable=True)
    default_social_image_url: Mapped[str | None] = mapped_column(String(500), nullable=True)

