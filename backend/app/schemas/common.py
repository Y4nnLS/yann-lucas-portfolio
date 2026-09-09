from typing import Generic, TypeVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class MessageResponse(BaseModel):
    message: str


class ErrorDetail(BaseModel):
    field: str | None = None
    message: str


class ErrorBody(BaseModel):
    code: str
    message: str
    details: list[ErrorDetail] | None = None


class ErrorResponse(BaseModel):
    error: ErrorBody


class PaginationMeta(BaseModel):
    page: int
    page_size: int
    total_items: int
    total_pages: int


ItemT = TypeVar("ItemT")


class PaginatedResponse(BaseModel, Generic[ItemT]):
    items: list[ItemT]
    pagination: PaginationMeta


class UploadResponse(BaseModel):
    id: UUID
    file_url: str
    media_type: str


class BaseSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

