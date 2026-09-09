from fastapi import APIRouter

from app.api.routes import admin, auth, health, public

api_router = APIRouter()
api_router.include_router(health.router)
api_router.include_router(public.router, prefix="/api/v1", tags=["public"])
api_router.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
api_router.include_router(admin.router, prefix="/api/v1/admin", tags=["admin"])

