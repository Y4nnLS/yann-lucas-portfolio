from uuid import UUID

from fastapi import APIRouter, Depends, File, Form, Query, UploadFile

from app.api.deps import AppSettings, DbSession, get_current_admin
from app.core.errors import ApiError
from app.models import ProjectMedia
from app.models.enums import MediaType, ProjectStatus
from app.schemas.common import MessageResponse, PaginatedResponse
from app.schemas.experience import ExperienceCreate, ExperienceResponse, ExperienceUpdate
from app.schemas.featured_repository import (
    FeaturedRepositoryCreate,
    FeaturedRepositoryResponse,
    FeaturedRepositoryUpdate,
)
from app.schemas.project import (
    ProjectCreate,
    ProjectDetailResponse,
    ProjectMediaResponse,
    ProjectSummaryResponse,
    ProjectUpdate,
)
from app.schemas.site import SiteSettingsPublic, SiteSettingsUpdate
from app.schemas.technology import TechnologyCreate, TechnologyResponse, TechnologyUpdate
from app.services import experiences, projects, repositories, site, storage, technologies

router = APIRouter(dependencies=[Depends(get_current_admin)])


@router.get("/projects", response_model=PaginatedResponse[ProjectSummaryResponse])
def list_projects(
    db: DbSession,
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=10, ge=1, le=50),
    status: ProjectStatus | None = Query(default=None),
    search: str | None = Query(default=None),
) -> PaginatedResponse[ProjectSummaryResponse]:
    return projects.list_admin_projects(db, page=page, page_size=page_size, status=status, search=search)


@router.post("/projects", response_model=ProjectSummaryResponse, status_code=201)
def create_project(payload: ProjectCreate, db: DbSession) -> ProjectSummaryResponse:
    project = projects.create_project(db, payload)
    db.commit()
    db.refresh(project)
    return project


@router.get("/projects/{project_id}", response_model=ProjectDetailResponse)
def get_project(project_id: UUID, db: DbSession) -> ProjectDetailResponse:
    return projects.serialize_project_detail(projects.get_project_or_404(db, project_id))


@router.patch("/projects/{project_id}", response_model=ProjectSummaryResponse)
def update_project(project_id: UUID, payload: ProjectUpdate, db: DbSession) -> ProjectSummaryResponse:
    project = projects.get_project_or_404(db, project_id)
    updated = projects.update_project(db, project, payload)
    db.commit()
    db.refresh(updated)
    return updated


@router.delete("/projects/{project_id}", response_model=MessageResponse)
def delete_project(project_id: UUID, db: DbSession, settings: AppSettings) -> MessageResponse:
    project = projects.get_project_or_404(db, project_id)
    storage_paths = projects.delete_project(db, project)
    db.commit()
    file_storage = storage.LocalStorage(settings)
    for storage_path in storage_paths:
        file_storage.delete(storage_path)
    return MessageResponse(message="Project deleted.")


@router.post("/projects/{project_id}/publish", response_model=ProjectSummaryResponse)
def publish_project(project_id: UUID, db: DbSession) -> ProjectSummaryResponse:
    project = projects.get_project_or_404(db, project_id)
    updated = projects.publish_project(project)
    db.commit()
    db.refresh(updated)
    return updated


@router.post("/projects/{project_id}/unpublish", response_model=ProjectSummaryResponse)
def unpublish_project(project_id: UUID, db: DbSession) -> ProjectSummaryResponse:
    project = projects.get_project_or_404(db, project_id)
    updated = projects.unpublish_project(project)
    db.commit()
    db.refresh(updated)
    return updated


@router.get("/technologies", response_model=PaginatedResponse[TechnologyResponse])
def list_technologies(
    db: DbSession,
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=50),
) -> PaginatedResponse[TechnologyResponse]:
    return technologies.list_admin_technologies(db, page=page, page_size=page_size)


@router.post("/technologies", response_model=TechnologyResponse, status_code=201)
def create_technology(payload: TechnologyCreate, db: DbSession) -> TechnologyResponse:
    technology = technologies.create_technology(db, payload)
    db.commit()
    db.refresh(technology)
    return technology


@router.patch("/technologies/{technology_id}", response_model=TechnologyResponse)
def update_technology(technology_id: UUID, payload: TechnologyUpdate, db: DbSession) -> TechnologyResponse:
    technology = technologies.get_technology_or_404(db, technology_id)
    updated = technologies.update_technology(db, technology, payload)
    db.commit()
    db.refresh(updated)
    return updated


@router.delete("/technologies/{technology_id}", response_model=MessageResponse)
def delete_technology(technology_id: UUID, db: DbSession) -> MessageResponse:
    technology = technologies.get_technology_or_404(db, technology_id)
    technologies.delete_technology(db, technology)
    db.commit()
    return MessageResponse(message="Technology deleted.")


@router.get("/experiences", response_model=PaginatedResponse[ExperienceResponse])
def list_experiences(
    db: DbSession,
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=50),
) -> PaginatedResponse[ExperienceResponse]:
    return experiences.list_admin_experiences(db, page=page, page_size=page_size)


@router.post("/experiences", response_model=ExperienceResponse, status_code=201)
def create_experience(payload: ExperienceCreate, db: DbSession) -> ExperienceResponse:
    experience = experiences.create_experience(db, payload)
    db.commit()
    db.refresh(experience)
    return experience


@router.patch("/experiences/{experience_id}", response_model=ExperienceResponse)
def update_experience(experience_id: UUID, payload: ExperienceUpdate, db: DbSession) -> ExperienceResponse:
    experience = experiences.get_experience_or_404(db, experience_id)
    updated = experiences.update_experience(db, experience, payload)
    db.commit()
    db.refresh(updated)
    return updated


@router.delete("/experiences/{experience_id}", response_model=MessageResponse)
def delete_experience(experience_id: UUID, db: DbSession) -> MessageResponse:
    experience = experiences.get_experience_or_404(db, experience_id)
    experiences.delete_experience(db, experience)
    db.commit()
    return MessageResponse(message="Experience deleted.")


@router.get("/site-settings", response_model=SiteSettingsPublic)
def get_site_settings(db: DbSession, settings: AppSettings) -> SiteSettingsPublic:
    return site.get_site_settings(db, settings)


@router.patch("/site-settings", response_model=SiteSettingsPublic)
def update_site_settings(payload: SiteSettingsUpdate, db: DbSession) -> SiteSettingsPublic:
    site_settings = site.update_site_settings(db, payload)
    db.commit()
    db.refresh(site_settings)
    return site_settings


@router.get("/featured-repositories", response_model=PaginatedResponse[FeaturedRepositoryResponse])
def list_featured_repositories(
    db: DbSession,
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=50),
) -> PaginatedResponse[FeaturedRepositoryResponse]:
    return repositories.list_featured_repositories(db, page=page, page_size=page_size)


@router.post("/featured-repositories", response_model=FeaturedRepositoryResponse, status_code=201)
def create_featured_repository(payload: FeaturedRepositoryCreate, db: DbSession) -> FeaturedRepositoryResponse:
    item = repositories.create_featured_repository(db, payload.model_dump(mode="json"))
    db.commit()
    db.refresh(item)
    return item


@router.patch("/featured-repositories/{repository_id}", response_model=FeaturedRepositoryResponse)
def update_featured_repository(repository_id: UUID, payload: FeaturedRepositoryUpdate, db: DbSession) -> FeaturedRepositoryResponse:
    item = repositories.get_featured_repository_or_404(db, repository_id)
    updated = repositories.update_featured_repository(item, payload.model_dump(exclude_unset=True, mode="json"))
    db.commit()
    db.refresh(updated)
    return updated


@router.delete("/featured-repositories/{repository_id}", response_model=MessageResponse)
def delete_featured_repository(repository_id: UUID, db: DbSession) -> MessageResponse:
    item = repositories.get_featured_repository_or_404(db, repository_id)
    repositories.delete_featured_repository(db, item)
    db.commit()
    return MessageResponse(message="Featured repository deleted.")


@router.post("/uploads/images", response_model=ProjectMediaResponse, status_code=201)
async def upload_project_image(
    db: DbSession,
    settings: AppSettings,
    project_id: UUID = Form(...),
    media_type: MediaType = Form(...),
    alt_text: str = Form(...),
    caption: str | None = Form(default=None),
    sort_order: int = Form(default=0),
    file: UploadFile = File(...),
) -> ProjectMediaResponse:
    if not alt_text.strip():
        raise ApiError(status_code=400, code="missing_alt_text", message="Alt text is required for project images.")
    project = projects.get_project_or_404(db, project_id)
    file_storage = storage.LocalStorage(settings)
    storage_path, file_url = await storage.save_image_upload(file_storage, file, subdirectory=f"projects/{project.id}")
    media = ProjectMedia(
        project=project,
        media_type=media_type,
        file_url=file_url,
        storage_path=storage_path,
        alt_text=alt_text.strip(),
        caption=caption,
        sort_order=sort_order,
    )
    db.add(media)
    db.commit()
    db.refresh(media)
    return media


@router.post("/uploads/resume", response_model=SiteSettingsPublic)
async def upload_resume(
    db: DbSession,
    settings: AppSettings,
    file: UploadFile = File(...),
) -> SiteSettingsPublic:
    file_storage = storage.LocalStorage(settings)
    site_settings = site.get_site_settings(db, settings)
    previous_path = file_storage.storage_path_from_url(site_settings.resume_url)
    storage_path, file_url = await storage.save_pdf_upload(file_storage, file, subdirectory="resume")
    site_settings.resume_url = file_url
    db.commit()
    db.refresh(site_settings)
    if previous_path:
        file_storage.delete(previous_path)
    return site_settings


@router.delete("/uploads/{media_id}", response_model=MessageResponse)
def delete_upload(media_id: UUID, db: DbSession, settings: AppSettings) -> MessageResponse:
    media = projects.get_project_media_or_404(db, media_id)
    file_storage = storage.LocalStorage(settings)
    file_storage.delete(media.storage_path)
    db.delete(media)
    db.commit()
    return MessageResponse(message="Upload deleted.")
