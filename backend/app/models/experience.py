import uuid
from datetime import date

from sqlalchemy import Boolean, Column, Date, ForeignKey, Integer, String, Table, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import GUID, Base, TimestampMixin

experience_technology_table = Table(
    "experience_technologies",
    Base.metadata,
    Column("experience_id", GUID(), ForeignKey("experiences.id", ondelete="CASCADE"), primary_key=True),
    Column("technology_id", GUID(), ForeignKey("technologies.id", ondelete="CASCADE"), primary_key=True),
)


class Experience(TimestampMixin, Base):
    __tablename__ = "experiences"

    id: Mapped[uuid.UUID] = mapped_column(GUID(), primary_key=True, default=uuid.uuid4)
    role: Mapped[str] = mapped_column(String(255), nullable=False)
    organization: Mapped[str] = mapped_column(String(255), nullable=False)
    experience_type: Mapped[str] = mapped_column(String(120), nullable=False)
    location: Mapped[str | None] = mapped_column(String(255), nullable=True)
    start_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    end_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    is_current: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    is_visible: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    technologies = relationship("Technology", secondary=experience_technology_table, lazy="selectin")
