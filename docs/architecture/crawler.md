# Crawler

**Stack:** Python, [Scrapling](https://github.com/D4Vinci/Scrapling)

## Responsibilities

- Scrape Malagasy news sites (multiple outlets/newspaper companies).
- Handle dynamic pages / anti-bot measures via Scrapling's adaptive fetching.
- Extract article content (title, body, author, published date, source).
- Write extracted articles into PocketBase (see [`backend.md`](./backend.md)).

## Open Questions

- Initial list of newspaper sources to crawl.
- Crawl/update frequency and deduplication strategy across outlets covering the same story.
- Whether crawling runs as a scheduled job or a long-running service.
