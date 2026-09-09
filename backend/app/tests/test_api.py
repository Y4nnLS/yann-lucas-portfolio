
from app.models import Technology
from app.services.auth import ensure_admin_user


def login(client):
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "admin@example.com", "password": "admin12345"},
    )
    assert response.status_code == 200
    return response


def test_health_check(client):
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json()["checks"]["database"] == "ok"


def test_admin_creation_is_idempotent(db_session):
    from app.core.config import get_settings

    admin, created = ensure_admin_user(db_session, get_settings())
    same_admin, created_again = ensure_admin_user(db_session, get_settings())

    assert created is False
    assert created_again is False
    assert admin.id == same_admin.id


def test_login_valid_and_invalid(client):
    valid_response = client.post(
        "/api/v1/auth/login",
        json={"email": "admin@example.com", "password": "admin12345"},
    )
    invalid_response = client.post(
        "/api/v1/auth/login",
        json={"email": "admin@example.com", "password": "wrong-password"},
    )

    assert valid_response.status_code == 200
    assert invalid_response.status_code == 401


def test_protected_endpoint_requires_auth(client):
    response = client.get("/api/v1/admin/projects")

    assert response.status_code == 401


def test_project_crud_publish_and_delete(client, db_session):
    login(client)
    technology = db_session.query(Technology).first()
    assert technology is not None

    create_response = client.post(
        "/api/v1/admin/projects",
        json={
            "name": "Projeto Teste",
            "short_description": "Resumo inicial",
            "responsibilities": "Implementação end-to-end.",
            "technology_ids": [str(technology.id)],
            "status": "DRAFT",
            "featured": False,
            "sort_order": 2,
        },
    )
    assert create_response.status_code == 201
    project_id = create_response.json()["id"]

    update_response = client.patch(
        f"/api/v1/admin/projects/{project_id}",
        json={"short_description": "Resumo atualizado", "featured": True},
    )
    assert update_response.status_code == 200
    assert update_response.json()["featured"] is True

    publish_response = client.post(f"/api/v1/admin/projects/{project_id}/publish")
    assert publish_response.status_code == 200
    assert publish_response.json()["status"] == "PUBLISHED"

    public_projects = client.get("/api/v1/projects").json()["items"]
    assert any(project["id"] == project_id for project in public_projects)

    delete_response = client.delete(f"/api/v1/admin/projects/{project_id}")
    assert delete_response.status_code == 200
    remaining_projects = client.get("/api/v1/admin/projects").json()["items"]
    assert not any(project["id"] == project_id for project in remaining_projects)


def test_public_projects_return_only_published(client):
    login(client)
    response = client.post(
        "/api/v1/admin/projects",
        json={"name": "Projeto Privado", "status": "DRAFT", "featured": False, "sort_order": 20},
    )
    assert response.status_code == 201
    draft_slug = response.json()["slug"]

    public_projects = client.get("/api/v1/projects").json()["items"]

    assert all(project["slug"] != draft_slug for project in public_projects)


def test_slug_is_unique(client):
    login(client)
    first = client.post(
        "/api/v1/admin/projects",
        json={"name": "Projeto Repetido", "status": "DRAFT", "featured": False, "sort_order": 1},
    )
    second = client.post(
        "/api/v1/admin/projects",
        json={"name": "Projeto Repetido", "status": "DRAFT", "featured": False, "sort_order": 2},
    )

    assert first.status_code == 201
    assert second.status_code == 201
    assert first.json()["slug"] != second.json()["slug"]


def test_invalid_resume_upload_is_rejected(client):
    login(client)
    response = client.post(
        "/api/v1/admin/uploads/resume",
        files={"file": ("resume.txt", b"plain-text", "text/plain")},
    )

    assert response.status_code == 400


def test_site_settings_update(client):
    login(client)
    response = client.patch(
        "/api/v1/admin/site-settings",
        json={
            "full_name": "Nome Atualizado",
            "professional_title": "Desenvolvedor Full-Stack",
            "hero_title": "Novo título",
            "hero_subtitle": "Novo subtítulo suficiente para o teste.",
            "introduction": "Introdução atualizada suficiente para o teste.",
            "about": "Texto sobre atualizado suficiente para o teste.",
            "email": "novo@email.com",
            "location": "Remoto",
            "github_username": "usuario",
            "github_url": "https://github.com/usuario",
            "linkedin_url": "https://linkedin.com/in/usuario",
            "availability": "Disponível",
            "default_seo_title": "SEO Title",
            "default_seo_description": "SEO Description",
            "default_social_image_url": "https://example.com/image.png",
        },
    )

    assert response.status_code == 200
    assert response.json()["full_name"] == "Nome Atualizado"
