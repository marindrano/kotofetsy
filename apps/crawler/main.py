import argparse

from providers import PROVIDERS


def main() -> None:
    parser = argparse.ArgumentParser(description="Crawl Malagasy news providers")
    parser.add_argument("provider", choices=[*PROVIDERS.keys(), "all"])
    parser.add_argument("--limit", type=int, default=10, help="max NEW articles to fetch this run")
    args = parser.parse_args()

    names = list(PROVIDERS.keys()) if args.provider == "all" else [args.provider]

    for name in names:
        source = PROVIDERS[name]()
        print(f"=== {name} (limit {args.limit} new) ===")
        articles = source.crawl(limit=args.limit)
        print(f"got {len(articles)} new articles this run")
        for a in articles:
            print(f"  - {a.title!r} ({a.published_date})")
        print(f"appended to {source._data_path}, state at {source._state_path}, log at {source._log_path}")


if __name__ == "__main__":
    main()
