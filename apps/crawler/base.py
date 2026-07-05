from __future__ import annotations

import gzip
import json
import re
import urllib.request
import xml.etree.ElementTree as ET
from abc import ABC
from dataclasses import asdict
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

from models import Article, SiteSelectors
from scrapling.fetchers import Fetcher, StealthyFetcher

USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/122.0 Safari/537.36"
)

FRENCH_MONTHS = {
    "janvier": 1,
    "fevrier": 2,
    "février": 2,
    "mars": 3,
    "avril": 4,
    "mai": 5,
    "juin": 6,
    "juillet": 7,
    "aout": 8,
    "août": 8,
    "septembre": 9,
    "octobre": 10,
    "novembre": 11,
    "decembre": 12,
    "décembre": 12,
}


def _fetch_xml(url: str) -> str:
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(req, timeout=15) as resp:
        raw = resp.read()
        # Some servers (Sucuri cache hits observed on Midi) send gzip regardless of
        # the Accept-Encoding we ask for, so sniff the magic bytes rather than trust headers.
        if raw[:2] == b"\x1f\x8b":
            raw = gzip.decompress(raw)
        # Midi's cached response has a stray leading newline before the XML
        # declaration, which ElementTree refuses to parse — strip it.
        return raw.decode("utf-8", errors="replace").lstrip()


def discover_sitemap_urls(sitemap_url: str, limit: Optional[int] = None) -> list[str]:
    """Walk a standard sitemap (index or flat urlset) down to leaf article URLs.
    Covers 4 of 5 providers generically — Tribune overrides list_article_urls() instead,
    since its sitemap only lists section pages, not articles."""
    urls: list[str] = []
    to_visit = [sitemap_url]
    while to_visit:
        current = to_visit.pop(0)
        root = ET.fromstring(_fetch_xml(current))
        # Only take each entry's own direct <loc> child — image sitemaps nest
        # <image:image><image:loc> one level deeper, which also localname-matches
        # "loc" after namespace stripping, so descending with .iter() would wrongly
        # pick those up too.
        locs = [
            child.text
            for entry in root
            for child in entry
            if child.tag.rsplit("}", 1)[-1] == "loc" and child.text
        ]
        if root.tag.endswith("sitemapindex"):
            to_visit.extend(locs)
        else:
            urls.extend(locs)
        if limit is not None and len(urls) >= limit:
            return urls[:limit]
    return urls


def parse_french_date(text: str) -> Optional[str]:
    """Parse a French date string, either 'D Month YYYY' or 'Month D, YYYY' (e.g. '22 juin 2019' or 'octobre 30, 2017')."""
    lowered = text.lower()
    match = re.search(r"(\d{1,2})\s+(\w+)\s+(\d{4})", lowered)
    if match:
        day, month_name, year = match.groups()
    else:
        match = re.search(r"(\w+)\s+(\d{1,2}),?\s+(\d{4})", lowered)
        if not match:
            return None
        month_name, day, year = match.groups()
    month = FRENCH_MONTHS.get(month_name)
    if not month:
        return None
    return datetime(int(year), month, int(day), tzinfo=timezone.utc).date().isoformat()


def parse_numeric_date(text: str) -> Optional[str]:
    """Parse a 'DD/MM/YYYY' (optionally with a trailing time) date string to ISO date."""
    match = re.search(r"(\d{1,2})/(\d{1,2})/(\d{4})", text)
    if not match:
        return None
    day, month, year = match.groups()
    return datetime(int(year), int(month), int(day), tzinfo=timezone.utc).date().isoformat()


class NewsSource(ABC):
    """Shared crawl pipeline. Subclasses supply selectors + config, not logic."""

    source_name: str
    selectors: SiteSelectors
    sitemap_url: Optional[str] = None
    needs_stealth: bool = False  # set True for sites behind a JS anti-bot challenge (e.g. Midi/Sucuri)

    def fetch(self, url: str):
        if self.needs_stealth:
            return StealthyFetcher.fetch(url)
        return Fetcher.get(url, headers={"User-Agent": USER_AGENT})

    def list_article_urls(self, limit: Optional[int] = None) -> list[str]:
        if not self.sitemap_url:
            raise NotImplementedError(
                f"{self.source_name}: no sitemap_url set, override list_article_urls()"
            )
        return discover_sitemap_urls(self.sitemap_url, limit=limit)

    def parse_article(self, url: str) -> Optional[Article]:
        page = self.fetch(url)
        s = self.selectors

        title_el = page.css(s.title).first
        if not title_el:
            return None
        title = title_el.get_all_text(strip=True)

        body = "\n\n".join(
            p.get_all_text(strip=True)
            for p in page.css(s.body)
            if p.get_all_text(strip=True)
        )

        author = None
        if s.author:
            author_el = page.css(s.author).first
            author = author_el.get_all_text(strip=True) if author_el else None

        published_date = None
        if s.published_date:
            date_el = page.css(s.published_date).first
            if date_el:
                if s.published_date_attr:
                    published_date = date_el.attrib.get(s.published_date_attr)
                else:
                    raw = date_el.get_all_text(strip=True)
                    if s.published_date_format == "french":
                        published_date = parse_french_date(raw)
                    elif s.published_date_format == "numeric":
                        published_date = parse_numeric_date(raw)
                    else:
                        published_date = raw

        category = None
        if s.category:
            category_el = page.css(s.category).first
            category = category_el.get_all_text(strip=True) if category_el else None

        return Article(
            url=url,
            title=title,
            body=body,
            author=author,
            published_date=published_date,
            category=category,
            source=self.source_name,
            scraped_at=datetime.now(timezone.utc).isoformat(),
        )

    def crawl(self, limit: int = 10) -> list[Article]:
        urls = self.list_article_urls(limit=limit)
        articles = []
        for url in urls[:limit]:
            article = self.parse_article(url)
            if article:
                articles.append(article)
        return articles

    def save(self, articles: list[Article], out_dir: Path) -> Path:
        out_dir.mkdir(parents=True, exist_ok=True)
        date_str = datetime.now(timezone.utc).date().isoformat()
        out_path = out_dir / f"{date_str}.json"
        out_path.write_text(
            json.dumps([asdict(a) for a in articles], ensure_ascii=False, indent=2),
            encoding="utf-8",
        )
        return out_path
