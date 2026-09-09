from io import BytesIO
from pathlib import Path
from uuid import uuid4

from fastapi import UploadFile
from PIL import Image, UnidentifiedImageError

from app.core.config import Settings
from app.core.errors import ApiError

IMAGE_EXTENSIONS = {
    "JPEG": ".jpg",
    "PNG": ".png",
    "WEBP": ".webp",
}


class LocalStorage:
    def __init__(self, settings: Settings) -> None:
        self.settings = settings
        self.root = settings.media_root.resolve()
        self.root.mkdir(parents=True, exist_ok=True)

    def _ensure_safe_path(self, relative_path: str) -> Path:
        candidate = (self.root / relative_path).resolve()
        if self.root not in candidate.parents and candidate != self.root:
            raise ApiError(status_code=400, code="invalid_path", message="Invalid storage path.")
        return candidate

    def save_bytes(self, *, content: bytes, subdirectory: str, extension: str) -> tuple[str, str]:
        folder = self._ensure_safe_path(subdirectory)
        folder.mkdir(parents=True, exist_ok=True)
        filename = f"{uuid4().hex}{extension}"
        destination = folder / filename
        destination.write_bytes(content)
        relative_path = destination.relative_to(self.root).as_posix()
        public_url = f"{self.settings.media_base_url.rstrip('/')}/{relative_path}"
        return relative_path, public_url

    def delete(self, relative_path: str) -> None:
        target = self._ensure_safe_path(relative_path)
        if target.exists():
            target.unlink()

    def storage_path_from_url(self, url: str | None) -> str | None:
        if not url:
            return None
        base = self.settings.media_base_url.rstrip("/")
        if not url.startswith(base):
            return None
        return url.removeprefix(base).lstrip("/")


async def _read_upload(file: UploadFile) -> bytes:
    content = await file.read()
    await file.close()
    return content


def _validate_image_bytes(content: bytes, *, settings: Settings) -> str:
    if not content:
        raise ApiError(status_code=400, code="invalid_image", message="Image file is empty.")
    if len(content) > settings.image_max_bytes:
        raise ApiError(status_code=400, code="image_too_large", message="Image exceeds the allowed size limit.")
    try:
        with Image.open(BytesIO(content)) as image:
            image.verify()
        with Image.open(BytesIO(content)) as image:
            file_format = image.format or ""
    except UnidentifiedImageError as exc:
        raise ApiError(status_code=400, code="invalid_image", message="Unsupported or invalid image file.") from exc
    if file_format not in IMAGE_EXTENSIONS:
        raise ApiError(status_code=400, code="invalid_image", message="Only JPEG, PNG, and WebP images are allowed.")
    return IMAGE_EXTENSIONS[file_format]


def _validate_pdf_bytes(content: bytes, *, settings: Settings) -> str:
    if not content:
        raise ApiError(status_code=400, code="invalid_pdf", message="PDF file is empty.")
    if len(content) > settings.resume_max_bytes:
        raise ApiError(status_code=400, code="pdf_too_large", message="PDF exceeds the allowed size limit.")
    if not content.startswith(b"%PDF"):
        raise ApiError(status_code=400, code="invalid_pdf", message="Only PDF files are allowed.")
    return ".pdf"


async def save_image_upload(storage: LocalStorage, file: UploadFile, *, subdirectory: str) -> tuple[str, str]:
    content = await _read_upload(file)
    extension = _validate_image_bytes(content, settings=storage.settings)
    return storage.save_bytes(content=content, subdirectory=subdirectory, extension=extension)


async def save_pdf_upload(storage: LocalStorage, file: UploadFile, *, subdirectory: str) -> tuple[str, str]:
    content = await _read_upload(file)
    extension = _validate_pdf_bytes(content, settings=storage.settings)
    return storage.save_bytes(content=content, subdirectory=subdirectory, extension=extension)

