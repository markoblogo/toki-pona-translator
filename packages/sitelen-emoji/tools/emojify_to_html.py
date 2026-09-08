#!/usr/bin/env python3
from __future__ import annotations

import argparse
import html
import shutil
from pathlib import Path

from tools.profile import load_profile, resolve
from tools.twemoji import to_twemoji_slug, is_probably_emoji_token

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_PROFILE = ROOT / "profiles" / "default-stable.v1.json"

# где лежат скачанные PNG
DEFAULT_TWEMOJI_VERSION = "17.0.0"
DEFAULT_ASSETS_DIR = ROOT / "assets" / "twemoji" / DEFAULT_TWEMOJI_VERSION / "72x72"

HTML_TEMPLATE = """<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<title>sitelen emoji visual export</title>
<style>
  body {{ font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; font-size: 20px; line-height: 1.6; padding: 24px; }}
  .emoji {{ width: 1.15em; height: 1.15em; vertical-align: -0.15em; }}
  .line {{ margin: 0.25em 0; }}
  .note {{ margin-top: 1.5em; font-size: 14px; opacity: 0.8; }}
</style>
</head>
<body>
{body}
<div class="note">
Rendered with Twemoji PNG assets. Ensure proper attribution for Twemoji (CC BY 4.0) in your published work.
</div>
</body>
</html>
"""

def ensure_dir(p: Path) -> None:
    p.mkdir(parents=True, exist_ok=True)

def copy_asset(slug: str, src_assets: Path, dst_img: Path) -> Path:
    src = src_assets / f"{slug}.png"
    if not src.exists():
        raise FileNotFoundError(f"Missing asset: {src}")
    dst = dst_img / f"{slug}.png"
    if not dst.exists():
        shutil.copy2(src, dst)
    return dst

def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--profile", type=Path, default=DEFAULT_PROFILE)
    ap.add_argument("--assets", type=Path, default=DEFAULT_ASSETS_DIR, help="Twemoji 72x72 PNG directory")
    ap.add_argument("--in", dest="inp", type=Path, required=True, help="Input text file (space-separated tokens)")
    ap.add_argument("--outdir", type=Path, required=True, help="Output directory (will contain index.html and img/)")
    args = ap.parse_args()

    profile = load_profile(args.profile)

    outdir: Path = args.outdir
    imgdir = outdir / "img"
    ensure_dir(imgdir)

    text = args.inp.read_text(encoding="utf-8")
    used_slugs: set[str] = set()

    lines_html = []
    for raw_line in text.splitlines():
        tokens = [t for t in raw_line.split(" ") if t != ""]
        rendered = []
        for t in tokens:
            # если это слово toki pona — резолвим в emoji
            maybe = resolve(t, profile)
            if maybe:
                t = maybe

            if is_probably_emoji_token(t):
                slug = to_twemoji_slug(t)
                try:
                    copy_asset(slug, args.assets, imgdir)
                    used_slugs.add(slug)
                    rendered.append(f'<img class="emoji" alt="{html.escape(t)}" src="img/{slug}.png"/>')
                except FileNotFoundError:
                    # если PNG не нашли — оставим символ как fallback
                    rendered.append(html.escape(t))
            else:
                rendered.append(html.escape(t))

        lines_html.append(f'<div class="line">{" ".join(rendered)}</div>')

    out_html = HTML_TEMPLATE.format(body="\n".join(lines_html))
    ensure_dir(outdir)
    (outdir / "index.html").write_text(out_html, encoding="utf-8")

    print(f"Exported: {outdir / 'index.html'}")
    print(f"Images copied: {len(used_slugs)} -> {imgdir}")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
