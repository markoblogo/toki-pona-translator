from pathlib import Path
import subprocess
import sys
import pytest

from tools.profile import load_profile, resolve
from tools.twemoji import to_twemoji_slug

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets" / "twemoji" / "17.0.0" / "72x72"
PROFILE = ROOT / "profiles" / "default-stable.v1.json"

def test_emojify_to_html_creates_index_and_images(tmp_path: Path):
    if not ASSETS.exists():
        pytest.skip("Twemoji assets not downloaded. Run: python -m tools.fetch_twemoji_assets")

    p = load_profile(PROFILE)
    for w in ["jan", "pona"]:
        e = resolve(w, p)
        if not e:
            pytest.skip(f"Word {w} not resolvable in profile")
        png = ASSETS / f"{to_twemoji_slug(e)}.png"
        if not png.exists():
            pytest.skip("Required Twemoji PNGs missing. Run: python -m tools.fetch_twemoji_assets")

    inp = tmp_path / "in.txt"
    inp.write_text("jan pona\n", encoding="utf-8")

    outdir = tmp_path / "out"
    cmd = [sys.executable, "-m", "tools.emojify_to_html", "--in", str(inp), "--outdir", str(outdir)]
    subprocess.check_call(cmd)

    index = outdir / "index.html"
    assert index.exists()
    html = index.read_text(encoding="utf-8")

    assert 'class="emoji"' in html
    assert (outdir / "img").exists()
    assert any(p.suffix == ".png" for p in (outdir / "img").iterdir())