from enum import Enum


class ProjectStatus(str, Enum):
    DRAFT = "DRAFT"
    PUBLISHED = "PUBLISHED"


class TechnologyCategory(str, Enum):
    FRONTEND = "FRONTEND"
    BACKEND = "BACKEND"
    DATABASE = "DATABASE"
    TOOL = "TOOL"
    LANGUAGE = "LANGUAGE"
    OTHER = "OTHER"


class MediaType(str, Enum):
    COVER = "COVER"
    GALLERY = "GALLERY"
    ARCHITECTURE = "ARCHITECTURE"

