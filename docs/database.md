# Database

## Local development

- Docker continues to use PostgreSQL; development without Docker uses SQLite bundled with Python.
- Copy the root `.env.local.example` to `.env.local`, then run migrations and seed from `backend/`.
- The database persists at `backend/portfolio.db`; uploads persist at `backend/media/`.
- The local database is separate from Docker's PostgreSQL volume. Switching modes does not migrate data.
- SQLite connections enforce foreign keys, including cascade deletion of dependent rows.
- Validate future migrations against both databases when introducing dialect-specific operations.

## Main Entities

- `AdminUser`
- `SiteSettings`
- `Project`
- `Technology`
- `ProjectMedia`
- `Experience`
- `FeaturedRepository`

## Conventions

- UUID primary keys.
- UTC timestamps.
- Unique slugs for public entities.
- Explicit many-to-many tables for project and experience technologies.
- Safe cascade deletes only for dependent media and join-table rows.

## Migration Workflow

- Create schema changes through Alembic revisions.
- Apply changes with `python -m alembic upgrade head`.
- Run the idempotent seed after migrations to ensure baseline content exists.
