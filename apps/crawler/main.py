import argparse
from pathlib import Path

from providers import PROVIDERS

DATA_DIR = Path(__file__).parent / "data"


def main() -> None:
    parser = argparse.ArgumentParser(description="Crawl Malagasy news providers")
    parser.add_argument("provider", choices=[*PROVIDERS.keys(), "all"])
    parser.add_argument("--limit", type=int, default=10)
    args = parser.parse_args()

    names = list(PROVIDERS.keys()) if args.provider == "all" else [args.provider]

    for name in names:
        source = PROVIDERS[name]()
        print(f"=== {name} (limit {args.limit}) ===")
        articles = source.crawl(limit=args.limit)
        print(f"got {len(articles)} articles")
        for a in articles:
            print(f"  - {a.title!r} ({a.published_date})")
        out_path = source.save(articles, DATA_DIR / name)
        print(f"saved to {out_path}")


if __name__ == "__main__":
    main()
