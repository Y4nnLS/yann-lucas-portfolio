from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core.errors import ApiError
from app.models import Experience
from app.schemas.common import PaginatedResponse
from app.schemas.experience import ExperienceCreate, ExperienceResponse, ExperienceUpdate
from app.services.technologies import get_technologies_by_ids
from app.services.utils import build_pagination


def list_public_experiences(db: Session) -> list[Experience]:
    return db.scalars(
        select(Experience)
        .where(Experience.is_visible.is_(True))
        .order_by(Experience.sort_order.asc(), Experience.start_date.desc())
    ).all()


def list_admin_experiences(db: Session, *, page: int, page_size: int) -> PaginatedResponse[ExperienceResponse]:
    total = db.scalar(select(func.count()).select_from(Experience)) or 0
    items = db.scalars(
        select(Experience)
        .order_by(Experience.sort_order.asc(), Experience.start_date.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
    ).all()
    return PaginatedResponse[ExperienceResponse](items=items, pagination=build_pagination(page, page_size, total))


def get_experience_or_404(db: Session, experience_id: UUID) -> Experience:
    experience = db.get(Experience, experience_id)
    if not experience:
        raise ApiError(status_code=404, code="experience_not_found", message="Experience was not found.")
    return experience


def create_experience(db: Session, payload: ExperienceCreate) -> Experience:
    technologies = get_technologies_by_ids(db, payload.technology_ids)
    experience = Experience(**payload.model_dump(exclude={"technology_ids"}))
    experience.technologies = technologies
    db.add(experience)
    db.flush()
    return experience


def update_experience(db: Session, experience: Experience, payload: ExperienceUpdate) -> Experience:
    data = payload.model_dump(exclude_unset=True, mode="json")
    technology_ids = data.pop("technology_ids", None)
    for field, value in data.items():
        setattr(experience, field, value)
    if technology_ids is not None:
        experience.technologies = get_technologies_by_ids(db, technology_ids)
    db.flush()
    return experience


def delete_experience(db: Session, experience: Experience) -> None:
    db.delete(experience)

