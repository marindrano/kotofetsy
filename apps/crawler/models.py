from dataclasses import dataclass, field
from typing import Optional


@dataclass
class Article:
    url: str
    title: str
    body: str
    author: Optional[str]
    published_date: Optional[str]
    category: Optional[str]
    source: str
    scraped_at: str
    cover_image: Optional[str] = None
    embed_url: Optional[str] = None  # youtube/video iframe or <video> src, if any
    images: list[str] = field(default_factory=list)  # all in-article images, absolute URLs, deduped


@dataclass
class SiteSelectors:
    """Static per-provider selector data. No behavior — just where to look."""

    title: str
    body: str
    author: Optional[str] = None
    published_date: Optional[str] = None
    published_date_attr: Optional[str] = (
        None  # e.g. "datetime" or meta "content"; None means read visible text
    )
    published_date_format: Optional[str] = (
        None  # e.g. "french" when text must be parsed (no attr available)
    )
    category: Optional[str] = None
