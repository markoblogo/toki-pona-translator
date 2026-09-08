from pathlib import Path
import subprocess
import sys

from tools.profile import load_profile
from tools.diff_profiles import diff_entries, main

ROOT = Path(__file__).resolve().parents[1]
P1 = ROOT / "profiles" / "default-stable.v1.json"


def test_diff_same_profile_is_empty():
    p = load_profile(P1)
    added, removed, changed = diff_entries(p.entries, p.entries)
    assert added == []
    assert removed == []
    assert changed == []


def test_diff_profiles_writes_markdown_report(tmp_path):
    out = tmp_path / "diff.md"

    assert main(["--old", str(P1), "--new", str(P1), "--format", "markdown", "--out", str(out)]) == 0

    text = out.read_text(encoding="utf-8")
    assert "# Profile diff report" in text
    assert "| word | old | new |" in text


def test_diff_profiles_writes_html_report(tmp_path):
    out = tmp_path / "diff.html"

    assert main(["--old", str(P1), "--new", str(P1), "--format", "html", "--out", str(out)]) == 0

    text = out.read_text(encoding="utf-8")
    assert "<title>Profile diff report</title>" in text
    assert "Added: 0" in text


def test_diff_profiles_script_mode_runs():
    result = subprocess.run(
        [sys.executable, "tools/diff_profiles.py", "--old", str(P1), "--new", str(P1)],
        cwd=ROOT,
        text=True,
        capture_output=True,
        check=True,
    )
    assert "Added keys:   0" in result.stdout
