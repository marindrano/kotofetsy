# Ikotofetsy

A Malagasy-language AI system for news. It crawls multiple Malagasy news sources, indexes articles, and lets readers query, get an unbiased cross-outlet take, summarize, and trace the history of a story through an AI-powered interface.

**Ikotofetsy** is the clever trickster from the Malagasy folktale *Ikotofetsy sy Imahaka* — *fetsy* (cunning, resourceful, always finding the smart way through a problem). The AI plays that role here: instead of dumping articles on the reader, it outsmarts information overload by comparing coverage across newspapers, summarizing, and connecting old and new stories.

Coming soon at [ikotofetsy.marindrano.com](https://ikotofetsy.marindrano.com). Full pitch and architecture: [`docs/PROJECT.md`](./docs/PROJECT.md) · [`docs/architecture/`](./docs/architecture/README.md)

## Who I am

I'm **RANDRIAMANASINA Tianiazy Marindrano**, a cross-platform full-stack developer. Ikotofetsy is my first project built fully in public — from commit one — after years of code that lived behind company logins or on hard drives with no history to show for it. This is where that changes.

## Core features

1. **Cross-outlet, unbiased take** — compare how different Malagasy newspapers cover the same story.
2. **News summarization** — condense articles into concise Malagasy-language summaries.
3. **Query old news / history** — natural-language search and timeline tracing over archived articles.
4. **Crawling & ingestion** — continuous or scheduled collection from multiple Malagasy news sites.

## Stack

| Layer         | Technology                                                     |
|---------------|------------------------------------------------------------------|
| Crawler       | Python + [Scrapling](https://github.com/D4Vinci/Scrapling)       |
| Backend       | Go + [PocketBase](https://pocketbase.io) + [Meilisearch](https://www.meilisearch.com) |
| Frontend      | TanStack Start                                                   |
| Agent         | Eve (Vercel)                                                      |
| Local tooling | [Charm](https://charm.sh) — CLIs for on-device jobs (daily scraping runs, local AI analysis) |

## This repo

This is a [Turborepo](https://turborepo.dev) / pnpm workspace. It currently holds the project's docs and presentation deck; the crawler/backend/frontend services described above are planned (see [Status](#status)).

```
apps/
  intro/                 # open-slide deck — project intro & pitch presentation
packages/
  ui/                    # shared React components
  eslint-config/         # shared eslint config
  typescript-config/     # shared tsconfig
  images/                # shared image assets
docs/
  PROJECT.md             # high-level pitch
  architecture/          # per-component design docs
```

## Develop

```sh
pnpm install
pnpm dev
pnpm build
```

## Status

Early planning stage. Monorepo scaffold in place; crawler, backend, and frontend services are not yet implemented. Built in public, from commit one.
