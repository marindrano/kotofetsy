# Project Overview

**Name:** Ikotofetsy

**Author:** RANDRIAMANASINA Tianiazy Marindrano — Cross-Platform Full-Stack Developer

**Purpose:** A portfolio project showcasing a Malagasy-language AI system for news. The system crawls multiple Malagasy news sources, indexes articles, and lets users query, get an unbiased cross-outlet take, summarize, and trace the history of a story through an AI-powered interface.

## Naming

**Ikotofetsy** is the clever trickster from the classic Malagasy folktale *Ikotofetsy sy Imahaka* — known for being *fetsy* (cunning, resourceful, always finding the smart way through a problem rather than brute force).

That maps directly onto the product: instead of dumping articles on the reader, the AI is "clever" about cutting through noise — comparing outlets for bias, summarizing, and connecting old and new stories. It's also a distinctly Malagasy reference, signaling the project is built for the Malagasy language and media landscape, not a generic tool ported over.

One-liner: *"Ikotofetsy is a clever trickster from Malagasy folklore — and that's exactly the role the AI plays here: it outsmarts information overload, comparing coverage across newspapers and digging through history to give you an unbiased, summarized answer instead of making you read everything yourself."*

## Goals

- Demonstrate a full end-to-end AI product: data acquisition → processing/storage → API → UI.
- Provide value specific to the Malagasy language/media ecosystem (an underserved NLP space).
- Serve as a public, visible portfolio piece demonstrating cross-platform, full-stack, and AI integration skills.

## Core Features

1. **Cross-outlet, unbiased take** — compare how different Malagasy newspapers cover the same story to surface a balanced, bias-aware synthesis.
2. **News summarization** — condense articles (or groups of articles) into concise Malagasy-language summaries.
3. **Query old news / history** — natural-language search/Q&A and timeline tracing over previously crawled/archived articles (retrieval + LLM).
4. **Crawling & ingestion** — continuous or scheduled collection of news articles from multiple Malagasy news sites.

## Architecture

Detailed component design lives in [`architecture/`](./architecture/README.md) (crawler, backend, frontend, data flow), kept separate from this high-level pitch.

At a glance:

| Layer      | Technology                                                  |
|------------|--------------------------------------------------------------|
| Crawler    | Python + [Scrapling](https://github.com/D4Vinci/Scrapling)  |
| Backend    | Go + [PocketBase](https://pocketbase.io) + [Meilisearch](https://www.meilisearch.com) |
| Frontend   | TanStack Start                                              |
| Agent      | Eve (Vercel)                                                |

## Status

Early planning stage. Monorepo scaffold in place (Turborepo, pnpm workspaces).
