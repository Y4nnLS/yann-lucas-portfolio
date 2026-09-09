from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.config import Settings, get_settings
from app.db.session import get_db
from app.schemas.common import PaginatedResponse
from app.schemas.experience import ExperienceResponse
from app.schemas.github import GitHubProfileResponse, GitHubRepositoryListResponse
from app.schemas.project import ProjectDetailResponse, ProjectSummaryResponse
from app.schemas.site import ResumeResponse, SiteSettingsPublic
from app.schemas.technology import TechnologyResponse
from app.services import experiences, github, projects, site, technologies

router = APIRouter()


@router.get("/site", response_model=SiteSettingsPublic)
def get_site(db: Session = Depends(get_db), settings: Settings = Depends(get_settings)) -> SiteSettingsPublic:
    return site.get_site_settings(db, settings)


@router.get("/projects", response_model=PaginatedResponse[ProjectSummaryResponse])
def get_projects(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=9, ge=1, le=30),
    featured: bool | None = Query(default=None),
    technology: str | None = Query(default=None),
    db: Session = Depends(get_db),
) -> PaginatedResponse[ProjectSummaryResponse]:
    return projects.list_public_projects(
        db,
        page=page,
        page_size=page_size,
        featured=featured,
        technology=technology,
    )


@router.get("/projects/{slug}", response_model=ProjectDetailResponse)
def get_project(slug: str, db: Session = Depends(get_db)) -> ProjectDetailResponse:
    return projects.get_public_project_or_404(db, slug)


@router.get("/technologies", response_model=list[TechnologyResponse])
def get_technologies(db: Session = Depends(get_db)) -> list[TechnologyResponse]:
    return technologies.list_public_technologies(db)


@router.get("/experiences", response_model=list[ExperienceResponse])
def get_experiences(db: Session = Depends(get_db)) -> list[ExperienceResponse]:
    return experiences.list_public_experiences(db)


@router.get("/github/profile", response_model=GitHubProfileResponse)
def get_github_profile(db: Session = Depends(get_db), settings: Settings = Depends(get_settings)) -> GitHubProfileResponse:
    return github.get_github_profile(db, settings)


@router.get("/github/repositories", response_model=GitHubRepositoryListResponse)
def get_github_repositories(db: Session = Depends(get_db), settings: Settings = Depends(get_settings)) -> GitHubRepositoryListResponse:
    return github.get_github_repositories(db, settings)


@router.get("/resume", response_model=ResumeResponse)
def get_resume(db: Session = Depends(get_db)) -> ResumeResponse:
    return site.get_resume_payload(db)

