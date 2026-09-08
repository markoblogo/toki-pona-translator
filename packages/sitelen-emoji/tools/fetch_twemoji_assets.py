#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import time
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

from tools.twemoji import to_twemoji_slug

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_PROFILE = ROOT / "profiles" / "default-stable.v1.json"

# Pin a specific Twemoji release for reproducible book builds
DEFAULT_TWEMOJI_VERSION = "17.0.0"
DEFAULT_BASE = f"https://cdn.jsdelivr.net/gh/jdecked/twemoji@{DEFAULT_TWEMOJI_VERSION}/assets/72x72"


def load_profile(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def download(url: str, out_path: Path, timeout: float, retries: int, backoff: float) -> None:
    out_path.parent.mkdir(parents=True, exist_ok=True)

    last_exc: Exception | None = None
    for attempt in range(1, retries + 1):
        try:
            req = Request(url, headers={"User-Agent": "sitelen-emoji-truth/0.1"})
            with urlopen(req, timeout=timeout) as r:
                out_path.write_bytes(r.read())
            return
        except HTTPError:
            # 404/403 и прочие HTTP ошибки — не лечатся ретраями
            raise
        except (URLError, TimeoutError) as e:
            last_exc = e
            if attempt < retries:
                time.sleep(backoff * attempt)
            else:
                raise
        except Exception as e:
            last_exc = e
            if attempt < retries:
                time.sleep(backoff * attempt)
            else:
                raise

    if last_exc:
        raise last_exc


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--profile", type=Path, default=DEFAULT_PROFILE)
    ap.add_argument("--out", type=Path, default=ROOT / "assets" / "twemoji" / DEFAULT_TWEMOJI_VERSION / "72x72")
    ap.add_argument("--base", type=str, default=DEFAULT_BASE)
    ap.add_argument("--overwrite", action="store_true")
    ap.add_argument("--timeout", type=float, default=15.0, help="Per-request timeout (seconds)")
    ap.add_argument("--retries", type=int, default=3, help="Retries for network errors/timeouts")
    ap.add_argument("--backoff", type=float, default=0.5, help="Backoff base (seconds)")
    ap.add_argument("--max", type=int, default=0, help="Limit number of unique emoji to fetch (0=all)")
    ap.add_argument("--progress-every", type=int, default=25, help="Print progress every N downloads")
    args = ap.parse_args()

    prof = load_profile(args.profile)
    entries: dict[str, str] = prof.get("entries", {})

    unique = sorted(set(entries.values()))
    if args.max and args.max > 0:
        unique = unique[: args.max]

    missing: list[tuple[str, str, str]] = []
    downloaded = 0
    skipped = 0

    total = len(unique)
    for idx, emoji in enumerate(unique, start=1):
        slug = to_twemoji_slug(emoji)
        filename = f"{slug}.png"
        url = f"{args.base}/{filename}"
        out_path = args.out / filename

        if out_path.exists() and not args.overwrite:
            skipped += 1
            continue

        try:
            download(url, out_path, timeout=args.timeout, retries=args.retries, backoff=args.backoff)
            downloaded += 1
            if downloaded % args.progress_every == 0:
                print(f"[{idx}/{total}] downloaded={downloaded} skipped={skipped} missing={len(missing)}")
        except HTTPError as e:
            missing.append((emoji, url, f"HTTP {getattr(e, 'code', '?')}"))
        except Exception as e:
            missing.append((emoji, url, f"{type(e).__name__}: {e}"))

    print(f"Requested: {total}")
    print(f"Downloaded: {downloaded}, skipped: {skipped}, missing: {len(missing)}")

    if missing:
        print("\nMissing assets (first 50):")
        for emoji, url, reason in missing[:50]:
            print(f"- {emoji}\t{reason}\t{url}")
        return 1

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
