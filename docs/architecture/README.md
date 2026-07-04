# Architecture

This folder holds the detailed system design for Ikotofetsy, kept separate from the high-level pitch in [`PROJECT.md`](../PROJECT.md).

## Components

| Doc                          | Component     | Stack                                          |
|-------------------------------|---------------|-------------------------------------------------|
| [`crawler.md`](./crawler.md)  | Crawler       | Python + Scrapling                              |
| [`backend.md`](./backend.md)  | Backend       | Go, PocketBase, Meilisearch                     |
| [`frontend.md`](./frontend.md)| Frontend      | TanStack Start                                  |
| [`backend.md`](./backend.md)  | Agent         | Eve (Vercel)                                    |
| —                              | Local tooling | Charm (charmbracelet) — on-device CLIs (daily scraping runs, local AI analysis) |

## Data Flow

```
[News Sites]
     |
     v
[Crawler: Python + Scrapling] --extract--> [PocketBase: articles, sources, history]
                                                   |
                                                   v
                                        [index/sync] --> [Meilisearch]
                                                   |
                                                   v
                                   [Go API: custom endpoints]
                                    - summarization --> [Eve agent]
                                    - cross-outlet comparison --> [Eve agent]
                                    - search (delegates to Meilisearch)
                                    - history/timeline queries (PocketBase)
                                                   |
                                                   v
                                   [Frontend: TanStack Start]
```
