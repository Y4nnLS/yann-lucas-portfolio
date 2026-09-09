from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core.errors import ApiError
from app.models import Technology
from app.schemas.common import PaginatedResponse
from app.schemas.technology import TechnologyCreate, TechnologyResponse, TechnologyUpdate
from app.services.utils import build_pagination, slugify


def _ensure_unique_slug(db: Session, slug: str, *, exclude_id: UUID | None = None) -> str:
    query = select(Technology).where(func.lower(Technology.slug) == slug.lower())
    if exclude_id:
        query = query.where(Technology.id != exclude_id)
    if db.scalar(query):
        raise ApiError(status_code=409, code="technology_slug_conflict", message="Technology slug already exists.")
    return slug


def list_public_technologies(db: Session) -> list[Technology]:
    return db.scalars(
        select(Technology)
        .where(Technology.is_active.is_(True))
        .order_by(Technology.sort_order.asc(), Technology.name.asc())
    ).all()


def list_admin_technologies(db: Session, *, page: int, page_size: int) -> PaginatedResponse[TechnologyResponse]:
    total = db.scalar(select(func.count()).select_from(Technology)) or 0
    items = db.scalars(
        select(Technology)
        .order_by(Technology.sort_order.asc(), Technology.name.asc())
        .offset((page - 1) * page_size)
        .limit(page_size)
    ).all()
    return PaginatedResponse[TechnologyResponse](items=items, pagination=build_pagination(page, page_size, total))


def get_technology_or_404(db: Session, technology_id: UUID) -> Technology:
    technology = db.get(Technology, technology_id)
    if not technology:
        raise ApiError(status_code=404, code="technology_not_found", message="Technology was not found.")
    return technology


def get_technologies_by_ids(db: Session, technology_ids: list[UUID]) -> list[Technology]:
    if not technology_ids:
        return []
    items = db.scalars(select(Technology).where(Technology.id.in_(technology_ids))).all()
    if len(items) != len(set(technology_ids)):
        raise ApiError(status_code=404, code="technology_not_found", message="One or more technologies were not found.")
    return items


def create_technology(db: Session, payload: TechnologyCreate) -> Technology:
    slug = _ensure_unique_slug(db, payload.slug or slugify(payload.name))
    if db.scalar(select(Technology).where(func.lower(Technology.name) == payload.name.lower())):
        raise ApiError(status_code=409, code="technology_name_conflict", message="Technology name already exists.")
    technology = Technology(**payload.model_dump(exclude={"slug"}), slug=slug)
    db.add(technology)
    db.flush()
    return technology


def update_technology(db: Session, technology: Technology, payload: TechnologyUpdate) -> Technology:
    data = payload.model_dump(exclude_unset=True, mode="json")
    if "slug" in data and data["slug"]:
        data["slug"] = _ensure_unique_slug(db, data["slug"], exclude_id=technology.id)
    elif "name" in data and data["name"]:
        data["slug"] = _ensure_unique_slug(db, slugify(data["name"]), exclude_id=technology.id)
    for field, value in data.items():
        setattr(technology, field, value)
    db.flush()
    return technology


def delete_technology(db: Session, technology: Technology) -> None:
    db.delete(technology)

