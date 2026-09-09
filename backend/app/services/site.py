from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import Settings
from app.models import Experience, Project, SiteSettings, Technology
from app.models.enums import ProjectStatus
from app.schemas.site import ResumeResponse, SiteSettingsUpdate
from app.services.utils import text_to_html

DEFAULT_SITE_SETTINGS = {
    "full_name": "Nome para configurar no painel",
    "professional_title": "Desenvolvedor Full-Stack",
    "hero_title": "Desenvolvedor Full-Stack com foco em React, TypeScript e Python",
    "hero_subtitle": (
        "Desenvolvo aplicações web completas, da construção de interfaces e componentes "
        "reutilizáveis à criação de APIs, regras de negócio e integração com bancos de dados."
    ),
    "introduction": (
        "Desenvolvo aplicações web completas, da construção de interfaces e componentes "
        "reutilizáveis à criação de APIs, regras de negócio e integração com bancos de dados."
    ),
    "about": (
        "Atuo no desenvolvimento de aplicações web utilizando JavaScript, TypeScript e Python. "
        "Tenho experiência com interfaces responsivas, integração com APIs, desenvolvimento de "
        "back-end, bancos de dados e correção de problemas em sistemas existentes."
    ),
    "email": None,
    "location": None,
    "github_username": None,
    "github_url": None,
    "linkedin_url": None,
    "availability": None,
    "resume_url": None,
    "default_seo_title": "Portfólio Full-Stack",
    "default_seo_description": "Portfólio profissional com projetos, experiências e painel administrativo.",
    "default_social_image_url": None,
}


def get_site_settings(db: Session, settings: Settings | None = None) -> SiteSettings:
    site_settings = db.scalar(select(SiteSettings).limit(1))
    if site_settings:
        return site_settings

    site_settings = SiteSettings(**DEFAULT_SITE_SETTINGS)
    if settings and settings.github_username:
        site_settings.github_username = settings.github_username
        site_settings.github_url = f"https://github.com/{settings.github_username}"
    db.add(site_settings)
    db.flush()
    return site_settings


def update_site_settings(db: Session, payload: SiteSettingsUpdate) -> SiteSettings:
    site_settings = get_site_settings(db)
    for field, value in payload.model_dump(exclude_unset=True, mode="json").items():
        setattr(site_settings, field, value)
    db.flush()
    return site_settings


def get_resume_payload(db: Session) -> ResumeResponse:
    site_settings = get_site_settings(db)
    experiences = db.scalars(
        select(Experience).where(Experience.is_visible.is_(True)).order_by(Experience.sort_order.asc())
    ).all()
    technologies = db.scalars(
        select(Technology).where(Technology.is_active.is_(True)).order_by(Technology.sort_order.asc(), Technology.name.asc())
    ).all()
    projects = db.scalars(
        select(Project)
        .where(Project.status == ProjectStatus.PUBLISHED)
        .order_by(Project.featured.desc(), Project.sort_order.asc(), Project.updated_at.desc())
        .limit(4)
    ).all()

    return ResumeResponse(
        resume_url=site_settings.resume_url,
        has_resume=bool(site_settings.resume_url),
        summary_html=text_to_html(site_settings.introduction),
        experiences=[
            {
                "id": str(experience.id),
                "role": experience.role,
                "organization": experience.organization,
                "experience_type": experience.experience_type,
                "description": experience.description,
            }
            for experience in experiences
        ],
        technologies=[
            {
                "id": str(technology.id),
                "name": technology.name,
                "category": technology.category,
            }
            for technology in technologies
        ],
        projects=[
            {
                "id": str(project.id),
                "name": project.name,
                "slug": project.slug,
                "short_description": project.short_description,
            }
            for project in projects
        ],
    )

