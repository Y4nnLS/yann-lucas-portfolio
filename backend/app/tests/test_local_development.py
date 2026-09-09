import os
import sqlite3
import subprocess
import sys
from pathlib import Path

import pytest
from sqlalchemy import select, text

from app.core.config import Settings
from app.models import Project, Technology


@pytest.mark.parametrize(
    "value",
    [
        "http://localhost:3000, http://127.0.0.1:3000",
        '["http://localhost:3000", "http://127.0.0.1:3000"]',
    ],
)
def test_cors_origins_from_environment(monkeypatch, value):
    monkeypatch.setenv("CORS_ORIGINS", value)
    assert Settings(_env_file=None).cors_origins == [
        "http://localhost:3000", "http://127.0.0.1:3000",
    ]


def test_sqlite_enforces_foreign_keys_and_cascades(db_session):
    project = db_session.scalar(select(Project))
    technology = db_session.scalar(select(Technology))
    assert db_session.scalar(text("PRAGMA foreign_keys")) == 1
    project.technologies.append(technology)
    db_session.commit()

    # A database-level deletion must remove association rows without ORM cleanup.
    db_session.execute(
        text("DELETE FROM technologies WHERE id = :id"), {"id": str(technology.id)},
    )
    db_session.commit()
    assert db_session.scalar(text("SELECT COUNT(*) FROM project_technologies")) == 0


def test_public_project_filter_with_sqlite(client, db_session):
    project = db_session.scalar(select(Project))
    technology = db_session.scalar(select(Technology))
    project.technologies.append(technology)
    db_session.commit()

    response = client.get("/api/v1/projects", params={"technology": technology.slug})
    assert response.status_code == 200
    assert [item["id"] for item in response.json()["items"]] == [str(project.id)]
    assert client.get("/api/v1/projects?technology=missing").json()["items"] == []


def test_sqlite_migrations_and_seed_persist_across_processes(tmp_path):
    database_path = tmp_path / "portfolio.db"
    env = {
        **os.environ,
        "DATABASE_URL": f"sqlite:///{database_path.as_posix()}",
        "MEDIA_ROOT": str(tmp_path / "media"),
    }
    backend_path = Path(__file__).resolve().parents[2]
    for arguments in (
        ["-m", "alembic", "upgrade", "head"],
        ["-m", "app.db.seed"],
        ["-m", "alembic", "upgrade", "head"],
        ["-m", "app.db.seed"],
    ):
        result = subprocess.run(
            [sys.executable, *arguments], cwd=backend_path, env=env,
            capture_output=True, text=True, timeout=60, check=False,
        )
        assert result.returncode == 0, result.stdout + result.stderr

    with sqlite3.connect(database_path) as connection:
        assert connection.execute("SELECT version_num FROM alembic_version").fetchone()
        assert connection.execute("SELECT COUNT(*) FROM admin_users").fetchone()[0] == 1
        assert connection.execute("SELECT COUNT(*) FROM projects").fetchone()[0] == 1
        assert connection.execute("SELECT COUNT(*) FROM technologies").fetchone()[0] == 18
