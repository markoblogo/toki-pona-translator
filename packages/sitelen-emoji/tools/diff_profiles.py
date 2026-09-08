#!/usr/bin/env python3
from __future__ import annotations

import argparse
import sys
from pathlib import Path
from html import escape
from typing import Dict, Tuple, List

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.append(str(ROOT))

from tools.profile import load_profile

DEFAULT_OLD = ROOT / "profiles" / "default-stable.v1.json"
DEFAULT_NEW = ROOT / "dist" / "default-stable.json"


def diff_entries(old: Dict[str, str], new: Dict[str, str]) -> Tuple[List[str], List[str], List[Tuple[str, str, str]]]:
    old_keys = set(old.keys())
    new_keys = set(new.keys())

    added = sorted(new_keys - old_keys)
    removed = sorted(old_keys - new_keys)

    changed = []
    for k in sorted(old_keys & new_keys):
        if old[k] != new[k]:
            changed.append((k, old[k], new[k]))

    return added, removed, changed


def render_text(old_path: Path, new_path: Path, old_p, new_p, added, removed, changed) -> str:
    lines = [
        f"OLD: {old_path}  ({old_p.name} {old_p.version})",
        f"NEW: {new_path}  ({new_p.name} {new_p.version})",
        "",
        f"Added keys:   {len(added)}",
        f"Removed keys: {len(removed)}",
        f"Changed keys: {len(changed)}",
        "",
    ]

    if added:
        lines.append("## Added")
        lines.extend(f"+ {k}\t{new_p.entries[k]}" for k in added)
        lines.append("")

    if removed:
        lines.append("## Removed")
        lines.extend(f"- {k}\t{old_p.entries[k]}" for k in removed)
        lines.append("")

    if changed:
        lines.append("## Changed")
        lines.extend(f"* {k}\t{a}\t=>\t{b}" for k, a, b in changed)
        lines.append("")

    return "\n".join(lines)


def render_markdown(old_path: Path, new_path: Path, old_p, new_p, added, removed, changed) -> str:
    lines = [
        "# Profile diff report",
        "",
        f"- Old: `{old_path}` ({old_p.name} {old_p.version})",
        f"- New: `{new_path}` ({new_p.name} {new_p.version})",
        f"- Added: **{len(added)}**",
        f"- Removed: **{len(removed)}**",
        f"- Changed: **{len(changed)}**",
        "",
    ]

    def table(title: str, headers: list[str], rows: list[list[str]]) -> None:
        lines.extend([f"## {title}", ""])
        lines.append("| " + " | ".join(headers) + " |")
        lines.append("| " + " | ".join("---" for _ in headers) + " |")
        for row in rows:
            lines.append("| " + " | ".join(cell.replace("|", "\\|") for cell in row) + " |")
        if not rows:
            lines.append("|  |  |  |")
        lines.append("")

    table("Added", ["word", "old", "new"], [[f"`{k}`", "", new_p.entries[k]] for k in added])
    table("Removed", ["word", "old", "new"], [[f"`{k}`", old_p.entries[k], ""] for k in removed])
    table("Changed", ["word", "old", "new"], [[f"`{k}`", a, b] for k, a, b in changed])
    return "\n".join(lines)


def render_html(old_path: Path, new_path: Path, old_p, new_p, added, removed, changed) -> str:
    def table(title: str, rows: list[tuple[str, str, str]]) -> str:
        if not rows:
            body = '<p class="empty">No entries.</p>'
        else:
            body = (
                "<table><thead><tr><th>word</th><th>old</th><th>new</th></tr></thead><tbody>"
                + "".join(
                    f"<tr><td><code>{escape(word)}</code></td><td>{escape(old)}</td><td>{escape(new)}</td></tr>"
                    for word, old, new in rows
                )
                + "</tbody></table>"
            )
        return f"<section><h2>{escape(title)}</h2>{body}</section>"

    added_rows = [(k, "", new_p.entries[k]) for k in added]
    removed_rows = [(k, old_p.entries[k], "") for k in removed]
    changed_rows = [(k, a, b) for k, a, b in changed]

    return f"""<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Profile diff report</title>
  <style>
    body {{ margin: 0; padding: 32px; background: #f8f8f4; color: #202124; font: 16px/1.5 system-ui, sans-serif; }}
    main {{ max-width: 1040px; margin: 0 auto; }}
    h1 {{ margin: 0 0 16px; }}
    .summary {{ display: flex; flex-wrap: wrap; gap: 8px; margin: 16px 0 24px; }}
    .pill {{ border: 1px solid #d8d8cf; border-radius: 999px; padding: 4px 10px; background: #fff; }}
    section {{ margin-top: 24px; }}
    table {{ width: 100%; border-collapse: collapse; background: #fff; border: 1px solid #d8d8cf; }}
    th, td {{ border-bottom: 1px solid #d8d8cf; padding: 8px 10px; text-align: left; }}
    th {{ color: #5f625c; font-size: .82rem; text-transform: uppercase; }}
    .empty {{ color: #5f625c; }}
  </style>
</head>
<body>
  <main>
    <h1>Profile diff report</h1>
    <p><strong>Old:</strong> <code>{escape(str(old_path))}</code> ({escape(old_p.name)} {escape(old_p.version)})</p>
    <p><strong>New:</strong> <code>{escape(str(new_path))}</code> ({escape(new_p.name)} {escape(new_p.version)})</p>
    <div class="summary">
      <span class="pill">Added: {len(added)}</span>
      <span class="pill">Removed: {len(removed)}</span>
      <span class="pill">Changed: {len(changed)}</span>
    </div>
    {table("Added", added_rows)}
    {table("Removed", removed_rows)}
    {table("Changed", changed_rows)}
  </main>
</body>
</html>
"""


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description="Diff two sitelen-emoji-truth profiles")
    ap.add_argument("--old", type=Path, default=DEFAULT_OLD, help="Old (frozen) profile JSON")
    ap.add_argument("--new", type=Path, default=DEFAULT_NEW, help="New (built) profile JSON")
    ap.add_argument("--format", choices=("text", "markdown", "html"), default="text", help="Report format")
    ap.add_argument("--out", type=Path, help="Write report to a file instead of stdout")
    args = ap.parse_args(argv)

    old_p = load_profile(args.old)
    new_p = load_profile(args.new)

    added, removed, changed = diff_entries(old_p.entries, new_p.entries)

    if args.format == "markdown":
        report = render_markdown(args.old, args.new, old_p, new_p, added, removed, changed)
    elif args.format == "html":
        report = render_html(args.old, args.new, old_p, new_p, added, removed, changed)
    else:
        report = render_text(args.old, args.new, old_p, new_p, added, removed, changed)

    if args.out:
        args.out.parent.mkdir(parents=True, exist_ok=True)
        args.out.write_text(report, encoding="utf-8")
    else:
        print(report, end="" if report.endswith("\n") else "\n")

    # exit code: 0 если нет различий, 1 если есть
    return 0 if (not added and not removed and not changed) else 1


if __name__ == "__main__":
    raise SystemExit(main())
