from __future__ import annotations

import gzip
import json
import re
import urllib.request
import xml.etree.ElementTree as ET
from abc import ABC
from collections.abc import Iterator
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

ROOT_DIR = Path(__file__).parent
DATA_DIR = ROOT_DIR / "data"
STATE_DIR = ROOT_DIR / "state"
LOG_DIR = ROOT_DIR / "logs"

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


def discover_sitemap_urls(sitemap_url: str) -> Iterator[str]:
    """Walk a standard sitemap (index or flat urlset), yielding leaf article URLs lazily.
    Covers most providers generically — Tribune/FreeNews/Moov override list_article_urls()
    instead, since they have no article-level sitemap.

    A generator, not a list: the caller (crawl()) stops pulling once it has enough NEW
    (not-already-seen) articles, which means we only fetch as many sitemap sub-files as
    actually needed this run — important for Midi's ~118 sub-sitemaps, where re-fetching
    all of them on every run just to filter would be wasteful."""
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
            yield from locs


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

    # --- resumability: state (seen_urls) + log paths, one file pair per provider ---

    @property
    def _state_path(self) -> Path:
        return STATE_DIR / f"{self.source_name}.json"

    @property
    def _log_path(self) -> Path:
        return LOG_DIR / f"{self.source_name}.log"

    @property
    def _data_path(self) -> Path:
        return DATA_DIR / self.source_name / "articles.jsonl"

    def _load_state(self) -> dict:
        if not self._state_path.exists():
            return {"seen_urls": [], "total_saved": 0}
        return json.loads(self._state_path.read_text(encoding="utf-8"))

    def _save_state(self, state: dict) -> None:
        # Atomic write: a crash mid-write leaves either the old or the new complete
        # file, never a half-written/corrupt one.
        self._state_path.parent.mkdir(parents=True, exist_ok=True)
        tmp_path = self._state_path.with_suffix(".json.tmp")
        tmp_path.write_text(json.dumps(state, ensure_ascii=False, indent=2), encoding="utf-8")
        tmp_path.replace(self._state_path)

    def _log(self, message: str) -> None:
        self._log_path.parent.mkdir(parents=True, exist_ok=True)
        timestamp = datetime.now(timezone.utc).isoformat()
        with self._log_path.open("a", encoding="utf-8") as f:
            f.write(f"[{timestamp}] {message}\n")

    def _append_article(self, article: Article) -> None:
        self._data_path.parent.mkdir(parents=True, exist_ok=True)
        with self._data_path.open("a", encoding="utf-8") as f:
            f.write(json.dumps(asdict(article), ensure_ascii=False) + "\n")

    def fetch(self, url: str):
        if self.needs_stealth:
            return StealthyFetcher.fetch(url)
        return Fetcher.get(url, headers={"User-Agent": USER_AGENT})

    def list_article_urls(self) -> Iterator[str]:
        if not self.sitemap_url:
            raise NotImplementedError(
                f"{self.source_name}: no sitemap_url set, override list_article_urls()"
            )
        yield from discover_sitemap_urls(self.sitemap_url)

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
        """Resumable: skips URLs already saved in a prior run, checkpoints after every
        article (state file + JSONL append), so a crash/interrupt only ever loses the
        one article that was in flight — everything before it is already on disk."""
        state = self._load_state()
        seen: set[str] = set(state.get("seen_urls", []))
        saved: list[Article] = []
        self._log(f"run started, {len(seen)} already seen, target {limit} new")

        try:
            for url in self.list_article_urls():
                if url in seen:
                    continue
                try:
                    article = self.parse_article(url)
                except Exception as exc:  # network/parsing failure on one article — skip, don't crash the run, retry next time
                    self._log(f"error fetching {url}: {exc}")
                    continue
                if not article:
                    self._log(f"skip (title selector didn't match) {url}")
                    continue

                seen.add(url)
                saved.append(article)
                self._append_article(article)
                state["seen_urls"] = sorted(seen)
                state["total_saved"] = state.get("total_saved", 0) + 1
                state["last_run_at"] = datetime.now(timezone.utc).isoformat()
                self._save_state(state)
                self._log(f"saved {url}")

                if len(saved) >= limit:
                    state["last_stopped_reason"] = "limit reached"
                    self._save_state(state)
                    self._log(f"stopped: limit reached ({limit} new articles)")
                    return saved

            state["last_stopped_reason"] = "exhausted"
            self._save_state(state)
            self._log("stopped: no more new urls to discover")
        except Exception as exc:  # discovery itself failed (e.g. network cut) — state up to the last saved article is intact
            state["last_stopped_reason"] = f"error: {exc}"
            self._save_state(state)
            self._log(f"stopped: error during discovery: {exc}")
            raise
        return saved
