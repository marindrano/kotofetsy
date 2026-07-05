from __future__ import annotations

import re
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
        home = Fetcher.get(self._home_url, headers={"User-Agent": USER_AGENT})
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
        return True

    def list_article_urls(self, limit: Optional[int] = None) -> list[str]:
        urls: list[str] = []
        seen: set[str] = set()

        for category_url in self._discover_categories():
            page_url = category_url
            for page_num in range(self._max_pages_per_category):
                offset = page_num * self._page_size
                fetch_url = (
                    category_url
                    if offset == 0
                    else f"{page_url}?debut_articles={offset}"
                )
                page = Fetcher.get(fetch_url, headers={"User-Agent": USER_AGENT})
                page_url = (
                    page.url
                )  # first fetch may redirect rubriqueN -> canonical pretty URL

                new_on_page = 0
                for link in page.css("a"):
                    href = link.attrib.get("href")
                    if not self._is_article_link(href):
                        continue
                    full_url = urljoin(page_url, href)
                    if full_url not in seen:
                        seen.add(full_url)
                        urls.append(full_url)
                        new_on_page += 1
                    if limit is not None and len(urls) >= limit:
                        return urls

                if new_on_page == 0:
                    break  # this category is exhausted

        return urls


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
    # ponytail: no sitemap on this site — seeding from the homepage only for now,
    # same gap as Tribune had before its category+pagination crawl was built.
    _seed_url = "https://www.freenews.mg/"
    selectors = SiteSelectors(
        title="h1",
        body="article p",
        author="a[href*='/author/']",
        published_date=None,
        published_date_format="french",
        category="a[href*='/categories/']",
    )

    def list_article_urls(self, limit: Optional[int] = None) -> list[str]:
        page = Fetcher.get(self._seed_url, headers={"User-Agent": USER_AGENT})
        urls: list[str] = []
        seen = set()
        for link in page.css("h1 a, h2 a, h3 a"):
            href = link.attrib.get("href")
            if not href or "/author/" in href or "/categories/" in href:
                continue
            full_url = urljoin(self._seed_url, href)
            if full_url not in seen:
                seen.add(full_url)
                urls.append(full_url)
            if limit is not None and len(urls) >= limit:
                break
        return urls


class Moov(NewsSource):
    source_name = "moov-mg"
    _seed_url = "https://new.moov.mg/"
    selectors = SiteSelectors(
        title="h2",
        body="p",
        author=None,
        published_date=None,
        published_date_format="numeric",
        category="a[href*='/actualites/']",
    )

    def list_article_urls(self, limit: Optional[int] = None) -> list[str]:
        page = Fetcher.get(self._seed_url, headers={"User-Agent": USER_AGENT})
        urls: list[str] = []
        seen = set()
        for link in page.css("a[href*='/article/']"):
            href = link.attrib.get("href")
            if not href:
                continue
            full_url = urljoin(self._seed_url, href)
            if full_url not in seen:
                seen.add(full_url)
                urls.append(full_url)
            if limit is not None and len(urls) >= limit:
                break
        return urls


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


class RadioNationaleMalagasy(NewsSource):
    source_name = "radiomadagasikara-rnm"
    sitemap_url = "https://www.radiomadagasikara.com/wp-sitemap.xml"
    selectors = SiteSelectors(
        title="h1",
        body="div.post-content",
        author=None,
        published_date="span.post-date",
        published_date_attr=None,
        published_date_format="french",
        category="div.post-tags a",
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
    "radiomadagasikara-rnm": RadioNationaleMalagasy,
    "kolo-tv": KoloTV,
    "journalmadagascar": JournalMadagascar,
}
