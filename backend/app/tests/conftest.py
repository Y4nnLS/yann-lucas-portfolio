import os
import tempfile
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

TEST_DB_PATH = Path(tempfile.gettempdir()) / "yann-lucas-portfolio-test.db"
TEST_MEDIA_PATH = Path(tempfile.gettempdir()) / "yann-lucas-portfolio-test-media"

os.environ["DATABASE_URL"] = f"sqlite:///{TEST_DB_PATH.resolve().as_posix()}"
os.environ["MEDIA_ROOT"] = str(TEST_MEDIA_PATH.resolve())
os.environ["JWT_SECRET_KEY"] = "test-secret-key"
os.environ["ADMIN_EMAIL"] = "admin@example.com"
os.environ["ADMIN_PASSWORD"] = "admin12345"

from app.core.config import get_settings

get_settings.cache_clear()

from app.db.seed import seed_database
from app.db.session import SessionLocal, engine
from app.main import app
from app.models.base import Base


@pytest.fixture(autouse=True)
def reset_environment():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    seed_database(get_settings())
    yield


@pytest.fixture
def client():
    with TestClient(app) as test_client:
        yield test_client


@pytest.fixture
def db_session():
    with SessionLocal() as session:
        yield session
