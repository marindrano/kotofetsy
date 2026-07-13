import argparse

from providers import PROVIDERS


def main() -> None:
    parser = argparse.ArgumentParser(description="Crawl Malagasy news providers")
    parser.add_argument("provider", choices=[*PROVIDERS.keys(), "all"])
    parser.add_argument(
        "--limit", type=int, default=10, help="max NEW articles to fetch this run (0 = unlimited, run until exhausted)"
    )
    args = parser.parse_args()

    names = list(PROVIDERS.keys()) if args.provider == "all" else [args.provider]

    for name in names:
        source = PROVIDERS[name]()
        print(f"=== {name} (limit {args.limit} new) ===", flush=True)
        # flush=True: streamed live so the Go TUI counter updates during the run, not at the end.
        # Output goes through a pipe (not a tty), which Python would otherwise block-buffer.
        articles = source.crawl(
            limit=args.limit,
            on_save=lambda a: print(f"  - {a.title!r} ({a.published_date})", flush=True),
        )
        print(f"got {len(articles)} new articles this run", flush=True)
        print(
            f"appended to {source._data_path}, state at {source._state_path}, log at {source._log_path}",
            flush=True,
        )


if __name__ == "__main__":
    main()
