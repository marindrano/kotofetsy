from __future__ import annotations

import json
import re
import urllib.error
import urllib.request
from collections import deque
from typing import Optional
from urllib.parse import urljoin

from base import USER_AGENT, NewsSource
from models import SiteSelectors
from scrapling.fetchers import Fetcher


class MidiMadagasikara(NewsSource):
    source_name = "midi-madagasikara"
    sitemap_url = "https://midi-madagasikara.mg/sitemap_index.xml"
    needs_stealth = True  # behind a Sucuri JS challenge, see docs/news-providers.md
    selectors = SiteSelectors(
        title="h1.tdb-title-text",
        body=".td-post-content p",
        author=None,  # often absent on this site
        published_date="time.entry-date.updated.td-module-date",
        published_date_attr="datetime",
        category="a.tdb-entry-category",
    )


class LExpressMadagascar(NewsSource):
    source_name = "lexpress-mg"
    sitemap_url = "https://www.lexpress.mg/sitemap.xml"
    selectors = SiteSelectors(
        title="article h1.entry-title",
        body="article #post-body p",
        author="article a",
        published_date="article time.published",
        published_date_attr="datetime",
        category="article a[href*='/search/label/']",
    )


class MadagascarTribune(NewsSource):
    source_name = "madagascar-tribune"
    selectors = SiteSelectors(
        title="h1.titre_article",
        body="div[class*='article-texte-'] p",
        author=None,  # site byline is the outlet itself, not a person — see recon notes
        published_date="meta[property='article:published_time']",
        published_date_attr="content",
        category="p.surtitre_article span.fond_surtitre",
    )
    # No article sitemap here (see docs/news-providers.md), so we do the full
    # 3-step crawl instead: discover categories, paginate each, extract links.
    _home_url = "https://madagascar-tribune.com/"
    _rubrique_re = re.compile(r"spip\.php\?rubrique(\d+)")
    _page_size = 20  # SPIP's debut_articles increments by this on this site
    _max_pages_per_category = (
        20  # ponytail: safety cap, not a real limit — raise if a category needs more
    )

    def _discover_categories(self) -> list[str]:
        try:
            home = Fetcher.get(self._home_url, headers={"User-Agent": USER_AGENT})
        except Exception:
            return []  # homepage fetch failed — no categories this run, resume next time
        rubrique_ids = sorted(
            set(self._rubrique_re.findall(home.html_content)), key=int
        )
        return [f"{self._home_url}spip.php?rubrique{rid}" for rid in rubrique_ids]

    @staticmethod
    def _is_article_link(href: Optional[str]) -> bool:
        if not href or not href.endswith(".html") or href.endswith("-.html"):
            return False  # "-.html" suffix is this site's category/rubrique convention, not an article
        if "://" in href or href.startswith("/"):
            return False  # only flat relative article slugs, no external/absolute links
        if href.startswith("_"):
            return False  # SPIP author/keyword pages: "_Name,id_.html" — byline links, not articles
        return True

    def list_article_urls(self):
        for category_url in self._discover_categories():
            page_url = category_url
            for page_num in range(self._max_pages_per_category):
                offset = page_num * self._page_size
                fetch_url = (
                    category_url
                    if offset == 0
                    else f"{page_url}?debut_articles={offset}"
                )
                try:
                    page = Fetcher.get(fetch_url, headers={"User-Agent": USER_AGENT})
                except Exception:
                    # Transient fetch failure (e.g. curl HTTP/2 error 16) — skip the rest
                    # of this category and move on. Resumable: next run re-walks it.
                    break
                page_url = (
                    page.url
                )  # first fetch may redirect rubriqueN -> canonical pretty URL

                new_on_page = 0
                for link in page.css("a"):
                    href = link.attrib.get("href")
                    if not self._is_article_link(href):
                        continue
                    new_on_page += 1
                    yield urljoin(page_url, href)

                if new_on_page == 0:
                    break  # this category is exhausted


class Newsmada(NewsSource):
    source_name = "newsmada"
    sitemap_url = "https://newsmada.com/wp-sitemap.xml"
    selectors = SiteSelectors(
        title="article h1.entry-title",
        body="article .entry-content",
        author=".entry-author a.url.fn.n",
        published_date="time.entry-date.published",
        published_date_attr="datetime",
        category=".entry-category a[rel='category tag']",
    )


class Site2424(NewsSource):
    source_name = "2424-mg"
    sitemap_url = "https://2424.mg/sitemap_index.xml"
    selectors = SiteSelectors(
        title="h1.jeg_post_title",
        body="div.entry-content.no-share p",
        author="div.jeg_meta_author",
        published_date="div.jeg_meta_date",
        published_date_attr=None,
        published_date_format="french",
        category="a[href*='/category/']",
    )


class LaGazetteDeLaGrandeIle(NewsSource):
    source_name = "lgdi-madagascar"
    sitemap_url = "https://lgdi-madagascar.com/sitemap.xml"
    selectors = SiteSelectors(
        title="h1.vcex-page-title__heading",
        body="div.vcex-post-content",
        author=None,  # only publication name present, not an individual byline
        published_date="div.vcex-author-bio__meta",
        published_date_attr=None,
        published_date_format="numeric",
        category="a.vcex-post-terms__item",
    )


class FreeNews(NewsSource):
    source_name = "freenews-mg"
    selectors = SiteSelectors(
        title="h1",
        body="article p",
        author="a[href*='/author/']",
        published_date=None,
        published_date_format="french",
        category="a[href*='/categories/']",
    )
    # WordPress, no sitemap, but an open REST API — the real paginated archive (~3200 posts).
    # The visible /category/ pages soft-404 (HTTP 200 past the end) and use messy accented
    # slugs, so the API is the reliable "paginate for real" path. We ask only for `link`
    # and still fetch each article page in parse_article (uniform with other providers);
    # ponytail ceiling: the API already carries content.rendered — consume it directly if
    # the extra per-article fetch ever becomes a problem.
    _api = "https://www.freenews.mg/wp-json/wp/v2/posts"

    def list_article_urls(self):
        page = 1
        while True:
            api = f"{self._api}?per_page=100&page={page}&_fields=link"
            req = urllib.request.Request(api, headers={"User-Agent": USER_AGENT})
            try:
                with urllib.request.urlopen(req, timeout=20) as resp:
                    posts = json.loads(resp.read())
            except urllib.error.HTTPError as exc:
                if exc.code == 400:  # WP's rest_post_invalid_page_number — we're past the last page
                    break
                raise
            if not posts:
                break
            for post in posts:
                link = post.get("link")
                if link:
                    yield link
            page += 1


class Moov(NewsSource):
    source_name = "moov-mg"
    _seed_url = "https://new.moov.mg/"
    selectors = SiteSelectors(
        title="h1",  # h2 are section subheadings on this site; the article title is the h1
        body=".content p",
        author=None,
        published_date=None,
        published_date_format="numeric",
        category="a[href*='/actualites/']",
    )
    # Moov is a JS SPA: category listing pages render client-side (empty to a static fetch)
    # and its Strapi CMS API is locked (403), so there's no static category pagination to walk.
    # But article pages ARE server-rendered and each links ~4 related articles, so we spider:
    # seed from the homepage, then follow /article/ links breadth-first. Resumable across runs
    # via seen_urls. Ceiling: coverage is limited to what's reachable via related-link chains
    # from the seed (not guaranteed to be the whole archive), and each page is fetched twice
    # (once here to expand the frontier, once in parse_article) — acceptable for a small site.
    def list_article_urls(self):
        queued: set[str] = set()
        queue: deque[str] = deque()

        def enqueue(href: Optional[str]) -> None:
            if not href:
                return
            absolute = urljoin(self._seed_url, href)
            if "/article/" in absolute and absolute not in queued:
                queued.add(absolute)
                queue.append(absolute)

        home = Fetcher.get(self._seed_url, headers={"User-Agent": USER_AGENT})
        for link in home.css("a[href*='/article/']"):
            enqueue(link.attrib.get("href"))

        while queue:
            url = queue.popleft()
            yield url
            try:
                page = Fetcher.get(url, headers={"User-Agent": USER_AGENT})
            except Exception:
                continue  # skip a page we can't fetch for frontier expansion; crawl() logs its own parse errors
            for link in page.css("a[href*='/article/']"):
                enqueue(link.attrib.get("href"))


class MalagasyNewsMBS(NewsSource):
    source_name = "malagasynews-mbs"
    sitemap_url = "https://www.malagasynews.com/sitemap_index.xml"
    selectors = SiteSelectors(
        title="h1",
        body="article p",
        author=None,  # "La Redaction" is a publication credit, not a byline
        published_date=None,
        published_date_format="french",
        category="a[href*='/actualites/']",
    )


class KoloTV(NewsSource):
    source_name = "kolo-tv"
    sitemap_url = "https://tv.kolo.mg/wp-sitemap.xml"
    selectors = SiteSelectors(
        title="h1",
        body="p",
        author="a[href*='/author/']",
        published_date=None,
        published_date_format="french",
        category="a[href*='/category/']",
    )


class JournalMadagascar(NewsSource):
    source_name = "journalmadagascar"
    sitemap_url = "https://www.journalmadagascar.com/sitemap.xml"
    selectors = SiteSelectors(
        title="h1",
        body="article p",
        author=".jeg_meta_author",
        published_date=".jeg_meta_date",
        published_date_attr=None,
        published_date_format="french",
        category=".jeg_meta_category a",
    )


PROVIDERS: dict[str, type[NewsSource]] = {
    "midi-madagasikara": MidiMadagasikara,
    "lexpress-mg": LExpressMadagascar,
    "madagascar-tribune": MadagascarTribune,
    "newsmada": Newsmada,
    "2424-mg": Site2424,
    "lgdi-madagascar": LaGazetteDeLaGrandeIle,
    "freenews-mg": FreeNews,
    "moov-mg": Moov,
    "malagasynews-mbs": MalagasyNewsMBS,
    "kolo-tv": KoloTV,
    "journalmadagascar": JournalMadagascar,
}
