# Backend

**Stack:** Go, [PocketBase](https://pocketbase.io), [Meilisearch](https://www.meilisearch.com), [Eve](https://vercel.com) (agent)

## Responsibilities

- **PocketBase** — primary data store and admin layer: articles, sources (newspapers), crawl runs, and story history/timelines. Used as an embeddable Go library (not the standalone binary), so custom logic lives in the same process.
- **Custom endpoints (Go)** — application logic layered on top of PocketBase's base API:
  - Summarization — hand off to the Eve agent to condense one article or a cluster of articles.
  - Cross-outlet comparison — given a story, pull the versions from each newspaper and have Eve produce an unbiased synthesis.
  - History/timeline — trace how a story evolved across articles and dates, backed by PocketBase queries.
  - Search — proxies/query-builds requests to Meilisearch and shapes the response for the frontend.
- **Meilisearch** — full-text + typo-tolerant search index over articles (title, body, source, date). Kept in sync with PocketBase records on create/update (via PocketBase hooks) rather than queried directly by the frontend.
- **Eve (Vercel)** — the agent the Go backend calls into for summarization and cross-outlet bias comparison, rather than hand-rolling LLM orchestration in Go.

## Why this split

- PocketBase gives structured storage, auth, and an admin UI for free, without hand-rolling a schema/migrations layer.
- Meilisearch is purpose-built for fast fuzzy search — better fit than PocketBase's built-in filtering for free-text article search.
- Eve is the seam where AI orchestration (summarization, bias comparison) lives, independent of both PocketBase and Meilisearch — the Go endpoints just call it.

## Open Questions

- Exact contract between the Go endpoints and Eve (sync call vs. queued job).
- Which fields get indexed into Meilisearch vs. queried straight from PocketBase.
- Sync strategy: PocketBase hooks pushing to Meilisearch vs. a periodic reconciliation job.
