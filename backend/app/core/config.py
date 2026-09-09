import json
from functools import lru_cache
from pathlib import Path
from typing import Annotated

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, NoDecode, SettingsConfigDict

BACKEND_DIR = Path(__file__).resolve().parents[2]


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=(BACKEND_DIR / ".env", BACKEND_DIR.parent / ".env", BACKEND_DIR.parent / ".env.local"),
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    environment: str = "development"
    site_url: str = "http://localhost:3000"

    postgres_db: str = "portfolio"
    postgres_user: str = "portfolio"
    postgres_password: str = "portfolio"
    database_url: str = "postgresql+psycopg://portfolio:portfolio@localhost:5432/portfolio"

    jwt_secret_key: str = "change-this-in-production"
    access_token_expire_minutes: int = 30
    refresh_token_expire_days: int = 7
    admin_email: str = "admin@example.com"
    admin_password: str = "change-me-now"

    cors_origins: Annotated[list[str], NoDecode] = Field(default_factory=lambda: ["http://localhost:3000"])

    media_root: Path = Path("./media")
    media_base_url: str = "/media"

    github_username: str | None = None
    github_token: str | None = None

    next_public_api_url: str = "http://localhost:8000"
    api_internal_url: str = "http://localhost:8000"

    image_max_bytes: int = 5 * 1024 * 1024
    resume_max_bytes: int = 10 * 1024 * 1024
    github_cache_ttl_seconds: int = 900

    @field_validator("cors_origins", mode="before")
    @classmethod
    def parse_cors_origins(cls, value: object) -> list[str]:
        if value is None:
            return ["http://localhost:3000"]
        if isinstance(value, str):
            if value.strip().startswith("["):
                value = json.loads(value)
            else:
                return [item.strip() for item in value.split(",") if item.strip()]
        if isinstance(value, list):
            return [str(item).strip() for item in value if str(item).strip()]
        raise TypeError("Invalid CORS origins value")

    @property
    def is_production(self) -> bool:
        return self.environment.lower() == "production"


@lru_cache
def get_settings() -> Settings:
    return Settings()
