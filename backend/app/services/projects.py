from datetime import UTC, datetime
from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core.errors import ApiError
from app.models import Project, ProjectMedia, Technology
from app.models.enums import ProjectStatus
from app.schemas.common import PaginatedResponse
from app.schemas.project import (
    AdjacentProjectResponse,
    ProjectCreate,
    ProjectDetailResponse,
    ProjectSummaryResponse,
    ProjectUpdate,
)
from app.services.technologies import get_technologies_by_ids
from app.services.utils import build_pagination, slugify


def _base_project_query(public_only: bool = False):
    query = select(Project)
    if public_only:
        query = query.where(Project.status == ProjectStatus.PUBLISHED)
    return query


def _project_ordering(query):
    return query.order_by(Project.featured.desc(), Project.sort_order.asc(), Project.updated_at.desc())


def _unique_project_slug(db: Session, name: str, *, requested_slug: str | None = None, exclude_id: UUID | None = None) -> str:
    base_slug = slugify(requested_slug or name)
    candidate = base_slug
    index = 2
    while True:
        query = select(Project).where(func.lower(Project.slug) == candidate.lower())
        if exclude_id:
            query = query.where(Project.id != exclude_id)
        if not db.scalar(query):
            return candidate
        candidate = f"{base_slug}-{index}"
        index += 1


def _with_filters(query, *, featured: bool | None = None, technology: str | None = None, search: str | None = None, status: ProjectStatus | None = None):
    if featured is not None:
        query = query.where(Project.featured.is_(featured))
    if status is not None:
        query = query.where(Project.status == status)
    if technology:
        query = query.join(Project.technologies).where(Technology.slug == technology)
    if search:
        query = query.where(func.lower(Project.name).contains(search.lower()))
    return query


def serialize_project_detail(
    project: Project,
    *,
    previous_project: AdjacentProjectResponse | None = None,
    next_project: AdjacentProjectResponse | None = None,
) -> ProjectDetailResponse:
    return ProjectDetailResponse.model_validate(
        {
            **ProjectSummaryResponse.model_validate(project).model_dump(mode="json"),
            "context": project.context,
            "problem": project.problem,
            "architecture": project.architecture,
            "features": project.features,
            "challenges": project.challenges,
            "decisions": project.decisions,
            "results": project.results,
            "learnings": project.learnings,
            "future_improvements": project.future_improvements,
            "project_url": project.project_url,
            "repository_url": project.repository_url,
            "start_date": project.start_date,
            "end_date": project.end_date,
            "seo_title": project.seo_title,
            "seo_description": project.seo_description,
            "previous_project": previous_project.model_dump() if previous_project else None,
            "next_project": next_project.model_dump() if next_project else None,
        }
    )


def list_public_projects(
    db: Session,
    *,
    page: int,
    page_size: int,
    featured: bool | None = None,
    technology: str | None = None,
) -> PaginatedResponse[ProjectSummaryResponse]:
    query = _with_filters(_base_project_query(public_only=True), featured=featured, technology=technology)
    total = db.scalar(select(func.count()).select_from(query.subquery())) or 0
    items = db.scalars(
        _project_ordering(query.distinct())
        .offset((page - 1) * page_size)
        .limit(page_size)
    ).all()
    return PaginatedResponse[ProjectSummaryResponse](items=items, pagination=build_pagination(page, page_size, total))


def list_admin_projects(
    db: Session,
    *,
    page: int,
    page_size: int,
    status: ProjectStatus | None = None,
    search: str | None = None,
) -> PaginatedResponse[ProjectSummaryResponse]:
    query = _with_filters(_base_project_query(), status=status, search=search)
    total = db.scalar(select(func.count()).select_from(query.subquery())) or 0
    items = db.scalars(
        _project_ordering(query)
        .offset((page - 1) * page_size)
        .limit(page_size)
    ).all()
    return PaginatedResponse[ProjectSummaryResponse](items=items, pagination=build_pagination(page, page_size, total))


def get_project_or_404(db: Session, project_id: UUID) -> Project:
    project = db.get(Project, project_id)
    if not project:
        raise ApiError(status_code=404, code="project_not_found", message="Project was not found.")
    return project


def get_public_project_or_404(db: Session, slug: str) -> ProjectDetailResponse:
    project = db.scalar(select(Project).where(Project.slug == slug, Project.status == ProjectStatus.PUBLISHED))
    if not project:
        raise ApiError(status_code=404, code="project_not_found", message="Project was not found.")

    ordered = db.scalars(_project_ordering(_base_project_query(public_only=True))).all()
    previous_project = None
    next_project = None
    for index, item in enumerate(ordered):
        if item.id == project.id:
            if index > 0:
                previous = ordered[index - 1]
                previous_project = AdjacentProjectResponse(name=previous.name, slug=previous.slug)
            if index < len(ordered) - 1:
                next_item = ordered[index + 1]
                next_project = AdjacentProjectResponse(name=next_item.name, slug=next_item.slug)
            break

    return serialize_project_detail(project, previous_project=previous_project, next_project=next_project)


def create_project(db: Session, payload: ProjectCreate) -> Project:
    technologies = get_technologies_by_ids(db, payload.technology_ids)
    data = payload.model_dump(exclude={"technology_ids"}, mode="json")
    data.pop("slug", None)
    slug = _unique_project_slug(db, payload.name, requested_slug=payload.slug)
    project = Project(**data, slug=slug)
    if project.status == ProjectStatus.PUBLISHED and not project.published_at:
        project.published_at = datetime.now(UTC)
    project.technologies = technologies
    db.add(project)
    db.flush()
    return project


def update_project(db: Session, project: Project, payload: ProjectUpdate) -> Project:
    data = payload.model_dump(exclude_unset=True, mode="json")
    technology_ids = data.pop("technology_ids", None)
    if "slug" in data and data["slug"]:
        data["slug"] = _unique_project_slug(db, project.name, requested_slug=data["slug"], exclude_id=project.id)
    elif "name" in data and data["name"]:
        data["slug"] = _unique_project_slug(db, data["name"], requested_slug=None, exclude_id=project.id)

    for field, value in data.items():
        setattr(project, field, value)
    if technology_ids is not None:
        project.technologies = get_technologies_by_ids(db, technology_ids)
    if project.status == ProjectStatus.PUBLISHED and not project.published_at:
        project.published_at = datetime.now(UTC)
    if project.status == ProjectStatus.DRAFT:
        project.published_at = None
    db.flush()
    return project


def publish_project(project: Project) -> Project:
    project.status = ProjectStatus.PUBLISHED
    project.published_at = datetime.now(UTC)
    return project


def unpublish_project(project: Project) -> Project:
    project.status = ProjectStatus.DRAFT
    project.published_at = None
    return project


def delete_project(db: Session, project: Project) -> list[str]:
    storage_paths = [media.storage_path for media in project.media]
    db.delete(project)
    return storage_paths


def get_project_media_or_404(db: Session, media_id: UUID) -> ProjectMedia:
    media = db.get(ProjectMedia, media_id)
    if not media:
        raise ApiError(status_code=404, code="media_not_found", message="Uploaded media was not found.")
    return media
