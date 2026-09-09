from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core.errors import ApiError
from app.models import FeaturedRepository
from app.schemas.common import PaginatedResponse
from app.schemas.featured_repository import FeaturedRepositoryResponse
from app.services.utils import build_pagination


def list_featured_repositories(db: Session, *, page: int, page_size: int) -> PaginatedResponse[FeaturedRepositoryResponse]:
    total = db.scalar(select(func.count()).select_from(FeaturedRepository)) or 0
    items = db.scalars(
        select(FeaturedRepository)
        .order_by(FeaturedRepository.sort_order.asc(), FeaturedRepository.updated_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
    ).all()
    return PaginatedResponse[FeaturedRepositoryResponse](items=items, pagination=build_pagination(page, page_size, total))


def get_featured_repository_or_404(db: Session, repository_id: UUID) -> FeaturedRepository:
    item = db.get(FeaturedRepository, repository_id)
    if not item:
        raise ApiError(status_code=404, code="repository_not_found", message="Repository configuration was not found.")
    return item


def create_featured_repository(db: Session, data: dict[str, object]) -> FeaturedRepository:
    owner = str(data["owner"]).strip()
    repository_name = str(data["repository_name"]).strip()
    existing = db.scalar(
        select(FeaturedRepository).where(
            FeaturedRepository.owner == owner,
            FeaturedRepository.repository_name == repository_name,
        )
    )
    if existing:
        raise ApiError(status_code=409, code="repository_conflict", message="Repository is already configured.")
    item = FeaturedRepository(**data)
    db.add(item)
    db.flush()
    return item


def update_featured_repository(item: FeaturedRepository, data: dict[str, object]) -> FeaturedRepository:
    for field, value in data.items():
        setattr(item, field, value)
    return item


def delete_featured_repository(db: Session, item: FeaturedRepository) -> None:
    db.delete(item)
