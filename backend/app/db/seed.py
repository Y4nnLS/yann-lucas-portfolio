from sqlalchemy import select

from app.core.config import Settings, get_settings
from app.db.session import SessionLocal
from app.models import Project, Technology
from app.models.enums import ProjectStatus, TechnologyCategory
from app.services.auth import ensure_admin_user
from app.services.site import get_site_settings
from app.services.utils import slugify

INITIAL_TECHNOLOGIES = [
    ("JavaScript", TechnologyCategory.LANGUAGE),
    ("TypeScript", TechnologyCategory.LANGUAGE),
    ("React", TechnologyCategory.FRONTEND),
    ("Vue.js", TechnologyCategory.FRONTEND),
    ("HTML", TechnologyCategory.FRONTEND),
    ("CSS", TechnologyCategory.FRONTEND),
    ("Tailwind CSS", TechnologyCategory.FRONTEND),
    ("Python", TechnologyCategory.BACKEND),
    ("FastAPI", TechnologyCategory.BACKEND),
    ("Django", TechnologyCategory.BACKEND),
    ("Flask", TechnologyCategory.BACKEND),
    ("Java", TechnologyCategory.LANGUAGE),
    ("SQL", TechnologyCategory.DATABASE),
    ("PostgreSQL", TechnologyCategory.DATABASE),
    ("SQLite", TechnologyCategory.DATABASE),
    ("MongoDB", TechnologyCategory.DATABASE),
    ("APIs REST", TechnologyCategory.TOOL),
    ("Git", TechnologyCategory.TOOL),
]

INITIAL_PROJECT_NAME = "Aplicação Web para Reconhecimento de Emoções"


def seed_database(settings: Settings) -> None:
    with SessionLocal() as db:
        ensure_admin_user(db, settings)
        site_settings = get_site_settings(db, settings)
        if settings.github_username and not site_settings.github_username:
            site_settings.github_username = settings.github_username
            site_settings.github_url = f"https://github.com/{settings.github_username}"

        for index, (name, category) in enumerate(INITIAL_TECHNOLOGIES, start=1):
            slug = slugify(name)
            technology = db.scalar(select(Technology).where(Technology.slug == slug))
            if technology:
                continue
            db.add(
                Technology(
                    name=name,
                    slug=slug,
                    category=category,
                    sort_order=index,
                    is_active=True,
                )
            )

        project_slug = slugify(INITIAL_PROJECT_NAME)
        project = db.scalar(select(Project).where(Project.slug == project_slug))
        if not project:
            db.add(
                Project(
                    name=INITIAL_PROJECT_NAME,
                    slug=project_slug,
                    project_type="Aplicação web",
                    short_description=(
                        "Aplicação web completa desenvolvida com front-end, back-end e integração de "
                        "modelos de inteligência artificial para processamento e apresentação dos resultados."
                    ),
                    responsibilities=(
                        "Desenvolvimento da aplicação web completa, com atuação no front-end, back-end "
                        "e integração dos modelos."
                    ),
                    status=ProjectStatus.PUBLISHED,
                    featured=True,
                    sort_order=1,
                )
            )

        db.commit()


def main() -> None:
    seed_database(get_settings())


if __name__ == "__main__":
    main()

