import shutil
import subprocess
from pathlib import Path

from sitelen_emoji import defaultProfile, load_profile, lookup, translate


ROOT = Path(__file__).resolve().parents[1]


def test_python_package_api():
    assert defaultProfile["entries"]["pona"] == "👍"
    assert load_profile()["entries"]["pona"] == "👍"
    assert lookup("toki") == "🗣️"
    assert lookup("ali") == lookup("ale")
    assert translate("jan pona") == "👤 👍"


def test_js_package_api():
    if shutil.which("node") is None:
        return

    result = subprocess.run(
        ["node", "--test", "packages/js/test.js"],
        cwd=ROOT,
        text=True,
        capture_output=True,
        check=True,
    )
    assert "# pass 2" in result.stdout
