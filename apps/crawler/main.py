import argparse
import sys

from providers import PROVIDERS


def main() -> None:
    parser = argparse.ArgumentParser(description="Crawl Malagasy news providers")
    parser.add_argument("provider", choices=[*PROVIDERS.keys(), "all"])
    parser.add_argument(
        "--limit", type=int, default=10, help="max NEW articles to fetch this run (0 = unlimited, run until exhausted)"
    )
    args = parser.parse_args()

    names = list(PROVIDERS.keys()) if args.provider == "all" else [args.provider]

    any_errored = False
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

        # crawl() swallows discovery errors so a transient network blip doesn't dump a
        # traceback into the TUI — but that means a real error and genuine exhaustion both
        # come back here as an ordinary return. Check the recorded reason so this process's
        # exit code stays accurate: nonzero on a real error (Go shows ✗), zero when the
        # source was actually exhausted or the limit was hit (Go shows ✓).
        reason = source._load_state().get("last_stopped_reason", "")
        if reason.startswith("error:"):
            any_errored = True
            print(f"  ! stopped early: {reason}", flush=True)

    if any_errored:
        sys.exit(1)


if __name__ == "__main__":
    main()
