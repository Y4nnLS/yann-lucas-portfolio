from datetime import datetime

from pydantic import BaseModel, HttpUrl


class GitHubProfileResponse(BaseModel):
    available: bool
    username: str | None = None
    profile_url: HttpUrl | None = None
    avatar_url: HttpUrl | None = None
    bio: str | None = None
    followers: int | None = None
    public_repos: int | None = None


class GitHubRepositoryResponse(BaseModel):
    name: str
    full_name: str
    description: str | None
    html_url: HttpUrl
    homepage: HttpUrl | None = None
    language: str | None = None
    topics: list[str] = []
    stargazers_count: int
    forks_count: int
    updated_at: datetime


class GitHubRepositoryListResponse(BaseModel):
    available: bool
    source: str
    items: list[GitHubRepositoryResponse]

