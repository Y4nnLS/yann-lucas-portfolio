from dataclasses import dataclass
from datetime import UTC, datetime, timedelta
from typing import Any

import httpx
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import Settings
from app.models import FeaturedRepository
from app.schemas.github import (
    GitHubProfileResponse,
    GitHubRepositoryListResponse,
    GitHubRepositoryResponse,
)
from app.services.site import get_site_settings


@dataclass
class CacheItem:
    expires_at: datetime
    value: Any


class MemoryTTLCache:
    def __init__(self) -> None:
        self._items: dict[str, CacheItem] = {}

    def get(self, key: str) -> Any | None:
        item = self._items.get(key)
        if not item:
            return None
        if item.expires_at <= datetime.now(UTC):
            self._items.pop(key, None)
            return None
        return item.value

    def set(self, key: str, value: Any, ttl_seconds: int) -> Any:
        self._items[key] = CacheItem(
            expires_at=datetime.now(UTC) + timedelta(seconds=ttl_seconds),
            value=value,
        )
        return value


cache = MemoryTTLCache()


def _resolve_username(db: Session, settings: Settings) -> str | None:
    site_settings = get_site_settings(db, settings)
    return site_settings.github_username or settings.github_username


def _client(settings: Settings) -> httpx.Client:
    headers = {
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "yann-lucas-portfolio",
    }
    if settings.github_token:
        headers["Authorization"] = f"Bearer {settings.github_token}"
    return httpx.Client(base_url="https://api.github.com", headers=headers, timeout=10.0)


def get_github_profile(db: Session, settings: Settings) -> GitHubProfileResponse:
    username = _resolve_username(db, settings)
    if not username:
        return GitHubProfileResponse(available=False)

    cache_key = f"github:profile:{username}"
    cached = cache.get(cache_key)
    if cached:
        return cached

    try:
        with _client(settings) as client:
            response = client.get(f"/users/{username}")
            response.raise_for_status()
            data = response.json()
    except httpx.HTTPError:
        return GitHubProfileResponse(available=False, username=username)

    return cache.set(
        cache_key,
        GitHubProfileResponse(
            available=True,
            username=data.get("login"),
            profile_url=data.get("html_url"),
            avatar_url=data.get("avatar_url"),
            bio=data.get("bio"),
            followers=data.get("followers"),
            public_repos=data.get("public_repos"),
        ),
        settings.github_cache_ttl_seconds,
    )


def _map_repository(repo: dict[str, Any]) -> GitHubRepositoryResponse:
    return GitHubRepositoryResponse(
        name=repo["name"],
        full_name=repo["full_name"],
        description=repo.get("description"),
        html_url=repo["html_url"],
        homepage=repo.get("homepage"),
        language=repo.get("language"),
        topics=repo.get("topics") or [],
        stargazers_count=repo.get("stargazers_count") or 0,
        forks_count=repo.get("forks_count") or 0,
        updated_at=repo["updated_at"],
    )


def get_github_repositories(db: Session, settings: Settings) -> GitHubRepositoryListResponse:
    username = _resolve_username(db, settings)
    if not username:
        return GitHubRepositoryListResponse(available=False, source="unavailable", items=[])

    selected = db.scalars(
        select(FeaturedRepository)
        .where(FeaturedRepository.is_active.is_(True))
        .order_by(FeaturedRepository.sort_order.asc(), FeaturedRepository.updated_at.desc())
    ).all()
    selected_key = ",".join(f"{repo.owner}/{repo.repository_name}" for repo in selected) or "fallback"
    cache_key = f"github:repos:{username}:{selected_key}"
    cached = cache.get(cache_key)
    if cached:
        return cached

    try:
        with _client(settings) as client:
            if selected:
                items: list[GitHubRepositoryResponse] = []
                for repo in selected:
                    response = client.get(f"/repos/{repo.owner}/{repo.repository_name}")
                    response.raise_for_status()
                    data = response.json()
                    if not data.get("fork"):
                        items.append(_map_repository(data))
                payload = GitHubRepositoryListResponse(available=True, source="selected", items=items)
            else:
                response = client.get(f"/users/{username}/repos", params={"sort": "updated", "per_page": 8, "type": "owner"})
                response.raise_for_status()
                repositories = [
                    _map_repository(repo)
                    for repo in response.json()
                    if not repo.get("fork")
                ][:6]
                payload = GitHubRepositoryListResponse(available=True, source="fallback", items=repositories)
    except httpx.HTTPError:
        return GitHubRepositoryListResponse(available=False, source="unavailable", items=[])

    return cache.set(cache_key, payload, settings.github_cache_ttl_seconds)

