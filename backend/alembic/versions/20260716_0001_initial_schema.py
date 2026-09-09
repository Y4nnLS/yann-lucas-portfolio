"""Initial portfolio schema.

Revision ID: 20260716_0001
Revises: None
Create Date: 2026-07-16 00:00:00
"""

import sqlalchemy as sa

from alembic import op

revision = "20260716_0001"
down_revision = None
branch_labels = None
depends_on = None


project_status = sa.Enum("DRAFT", "PUBLISHED", name="project_status")
technology_category = sa.Enum(
    "FRONTEND",
    "BACKEND",
    "DATABASE",
    "TOOL",
    "LANGUAGE",
    "OTHER",
    name="technology_category",
)
media_type = sa.Enum("COVER", "GALLERY", "ARCHITECTURE", name="media_type")


def upgrade() -> None:
    bind = op.get_bind()
    project_status.create(bind, checkfirst=True)
    technology_category.create(bind, checkfirst=True)
    media_type.create(bind, checkfirst=True)

    op.create_table(
        "admin_users",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("email", sa.String(length=320), nullable=False),
        sa.Column("password_hash", sa.String(length=255), nullable=False),
        sa.Column("is_active", sa.Boolean(), nullable=False),
        sa.Column("token_version", sa.Integer(), nullable=False),
        sa.Column("last_login_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_admin_users_email"), "admin_users", ["email"], unique=True)

    op.create_table(
        "site_settings",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("full_name", sa.String(length=255), nullable=False),
        sa.Column("professional_title", sa.String(length=255), nullable=False),
        sa.Column("hero_title", sa.String(length=255), nullable=False),
        sa.Column("hero_subtitle", sa.Text(), nullable=False),
        sa.Column("introduction", sa.Text(), nullable=False),
        sa.Column("about", sa.Text(), nullable=False),
        sa.Column("email", sa.String(length=320), nullable=True),
        sa.Column("location", sa.String(length=255), nullable=True),
        sa.Column("github_username", sa.String(length=255), nullable=True),
        sa.Column("github_url", sa.String(length=500), nullable=True),
        sa.Column("linkedin_url", sa.String(length=500), nullable=True),
        sa.Column("availability", sa.String(length=255), nullable=True),
        sa.Column("resume_url", sa.String(length=500), nullable=True),
        sa.Column("default_seo_title", sa.String(length=255), nullable=True),
        sa.Column("default_seo_description", sa.Text(), nullable=True),
        sa.Column("default_social_image_url", sa.String(length=500), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )

    op.create_table(
        "technologies",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("name", sa.String(length=120), nullable=False),
        sa.Column("slug", sa.String(length=140), nullable=False),
        sa.Column("category", technology_category, nullable=False),
        sa.Column("sort_order", sa.Integer(), nullable=False),
        sa.Column("is_active", sa.Boolean(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("name"),
    )
    op.create_index(op.f("ix_technologies_slug"), "technologies", ["slug"], unique=True)

    op.create_table(
        "experiences",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("role", sa.String(length=255), nullable=False),
        sa.Column("organization", sa.String(length=255), nullable=False),
        sa.Column("experience_type", sa.String(length=120), nullable=False),
        sa.Column("location", sa.String(length=255), nullable=True),
        sa.Column("start_date", sa.Date(), nullable=True),
        sa.Column("end_date", sa.Date(), nullable=True),
        sa.Column("is_current", sa.Boolean(), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("sort_order", sa.Integer(), nullable=False),
        sa.Column("is_visible", sa.Boolean(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )

    op.create_table(
        "projects",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("slug", sa.String(length=255), nullable=False),
        sa.Column("project_type", sa.String(length=120), nullable=True),
        sa.Column("short_description", sa.Text(), nullable=True),
        sa.Column("context", sa.Text(), nullable=True),
        sa.Column("problem", sa.Text(), nullable=True),
        sa.Column("responsibilities", sa.Text(), nullable=True),
        sa.Column("architecture", sa.Text(), nullable=True),
        sa.Column("features", sa.Text(), nullable=True),
        sa.Column("challenges", sa.Text(), nullable=True),
        sa.Column("decisions", sa.Text(), nullable=True),
        sa.Column("results", sa.Text(), nullable=True),
        sa.Column("learnings", sa.Text(), nullable=True),
        sa.Column("future_improvements", sa.Text(), nullable=True),
        sa.Column("project_url", sa.String(length=500), nullable=True),
        sa.Column("repository_url", sa.String(length=500), nullable=True),
        sa.Column("start_date", sa.Date(), nullable=True),
        sa.Column("end_date", sa.Date(), nullable=True),
        sa.Column("status", project_status, nullable=False),
        sa.Column("featured", sa.Boolean(), nullable=False),
        sa.Column("sort_order", sa.Integer(), nullable=False),
        sa.Column("seo_title", sa.String(length=255), nullable=True),
        sa.Column("seo_description", sa.Text(), nullable=True),
        sa.Column("published_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_projects_slug"), "projects", ["slug"], unique=True)
    op.create_index(op.f("ix_projects_status"), "projects", ["status"], unique=False)

    op.create_table(
        "featured_repositories",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("owner", sa.String(length=255), nullable=False),
        sa.Column("repository_name", sa.String(length=255), nullable=False),
        sa.Column("sort_order", sa.Integer(), nullable=False),
        sa.Column("is_active", sa.Boolean(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("owner", "repository_name", name="uq_featured_repository_owner_name"),
    )

    op.create_table(
        "experience_technologies",
        sa.Column("experience_id", sa.Uuid(), nullable=False),
        sa.Column("technology_id", sa.Uuid(), nullable=False),
        sa.ForeignKeyConstraint(["experience_id"], ["experiences.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["technology_id"], ["technologies.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("experience_id", "technology_id"),
    )

    op.create_table(
        "project_technologies",
        sa.Column("project_id", sa.Uuid(), nullable=False),
        sa.Column("technology_id", sa.Uuid(), nullable=False),
        sa.ForeignKeyConstraint(["project_id"], ["projects.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["technology_id"], ["technologies.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("project_id", "technology_id"),
    )

    op.create_table(
        "project_media",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("project_id", sa.Uuid(), nullable=False),
        sa.Column("media_type", media_type, nullable=False),
        sa.Column("file_url", sa.String(length=500), nullable=False),
        sa.Column("storage_path", sa.String(length=500), nullable=False),
        sa.Column("alt_text", sa.String(length=255), nullable=False),
        sa.Column("caption", sa.Text(), nullable=True),
        sa.Column("sort_order", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["project_id"], ["projects.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )


def downgrade() -> None:
    op.drop_table("project_media")
    op.drop_table("project_technologies")
    op.drop_table("experience_technologies")
    op.drop_table("featured_repositories")
    op.drop_index(op.f("ix_projects_status"), table_name="projects")
    op.drop_index(op.f("ix_projects_slug"), table_name="projects")
    op.drop_table("projects")
    op.drop_table("experiences")
    op.drop_index(op.f("ix_technologies_slug"), table_name="technologies")
    op.drop_table("technologies")
    op.drop_table("site_settings")
    op.drop_index(op.f("ix_admin_users_email"), table_name="admin_users")
    op.drop_table("admin_users")

    bind = op.get_bind()
    media_type.drop(bind, checkfirst=True)
    technology_category.drop(bind, checkfirst=True)
    project_status.drop(bind, checkfirst=True)

