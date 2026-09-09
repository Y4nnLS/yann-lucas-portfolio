from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.api.router import api_router
from app.core.config import get_settings
from app.core.errors import register_exception_handlers
from app.db.session import SessionLocal
from app.services.auth import ensure_admin_user
from app.services.site import get_site_settings

settings = get_settings()


@asynccontextmanager
async def lifespan(_: FastAPI):
    settings.media_root.mkdir(parents=True, exist_ok=True)
    with SessionLocal() as db:
        ensure_admin_user(db, settings)
        get_site_settings(db, settings)
        db.commit()
    yield


app = FastAPI(
    title="Yann Lucas Portfolio API",
    version="0.1.0",
    lifespan=lifespan,
)

register_exception_handlers(app)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

app.mount(settings.media_base_url, StaticFiles(directory=settings.media_root, check_dir=False), name="media")
app.include_router(api_router)
