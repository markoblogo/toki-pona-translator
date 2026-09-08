from pathlib import Path
import subprocess
import sys

from tools.profile import load_profile, resolve

ROOT = Path(__file__).resolve().parents[1]
PROFILE = ROOT / "profiles" / "default-stable.v1.json"

def test_convert_tp_text_basic(tmp_path: Path):
    p = load_profile(PROFILE)
    jan = resolve("jan", p)
    pona = resolve("pona", p)
    period = resolve("_punct_period", p)

    assert jan and pona and period

    inp = tmp_path / "book_tp.txt"
    inp.write_text("jan pona.\n", encoding="utf-8")
    outp = tmp_path / "book_se.txt"

    cmd = [sys.executable, "-m", "tools.convert_tp_text", "--in", str(inp), "--out", str(outp)]
    subprocess.check_call(cmd)

    got = outp.read_text(encoding="utf-8")
    assert got == f"{jan} {pona} {period}\n"
