# Yann Lucas Portfolio Agents Guide

## Stack

- Front-end: Next.js App Router, React, TypeScript strict mode, Tailwind CSS, React Hook Form, Zod, Vitest, Playwright.
- Back-end: FastAPI, Pydantic Settings, SQLAlchemy 2, Alembic, PostgreSQL, Psycopg, Pytest, Ruff.
- Infra: Docker Compose, persistent media volume, GitHub Actions CI.

## Structure

- `frontend/`: public website and private admin panel.
- `backend/`: API, database models, seed, migrations, uploads, GitHub integration.
- `docs/`: implementation notes, architecture, auth, and database decisions.
- `scripts/`: helper scripts for local development when needed.
- `.github/workflows/`: validation pipelines.

## Commands

- Docker: `docker compose up --build`
- Front-end dev: `cd frontend && npm install && npm run dev`
- Back-end dev: `cd backend && python -m venv .venv && .\.venv\Scripts\Activate.ps1 && pip install -r requirements.txt && python -m alembic upgrade head && python -m app.db.seed && uvicorn app.main:app --reload`
- Front-end validation: `npm run lint`, `npm run typecheck`, `npm run test`, `npm run build`
- Back-end validation: `ruff check .`, `pytest`

## Code Rules

- Keep TypeScript strict and avoid unnecessary `any`.
- Keep database access in repositories/services, not directly inside route handlers.
- Hide or skip empty public sections instead of rendering placeholder lorem ipsum.
- Prefer Server Components for public pages and Client Components only for real interaction.
- Use local storage abstraction for uploads so the implementation can be swapped later.
- Future changes should modify the smallest reasonable number of files.

## Adding Features

1. Update schemas before UI forms when data contracts change.
2. Add migrations for persistent schema changes.
3. Reuse existing UI primitives before creating new abstractions.
4. Validate with tests and lint/build commands before finishing work.
