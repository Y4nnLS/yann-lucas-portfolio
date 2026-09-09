import html
import math
import re

from app.schemas.common import PaginationMeta

SLUG_PATTERN = re.compile(r"[^a-z0-9]+")


def slugify(value: str) -> str:
    normalized = value.strip().lower()
    normalized = SLUG_PATTERN.sub("-", normalized)
    normalized = normalized.strip("-")
    return normalized or "item"


def build_pagination(page: int, page_size: int, total_items: int) -> PaginationMeta:
    total_pages = max(1, math.ceil(total_items / page_size)) if total_items else 1
    return PaginationMeta(
        page=page,
        page_size=page_size,
        total_items=total_items,
        total_pages=total_pages,
    )


def text_to_html(text: str | None) -> str | None:
    if not text:
        return None
    paragraphs = [segment.strip() for segment in text.splitlines() if segment.strip()]
    return "".join(f"<p>{html.escape(paragraph)}</p>" for paragraph in paragraphs)

