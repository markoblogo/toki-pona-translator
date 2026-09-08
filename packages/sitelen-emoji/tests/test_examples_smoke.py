import shutil
import subprocess
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def test_python_example_runs():
    result = subprocess.run(
        [sys.executable, "examples/python-load-profile.py"],
        cwd=ROOT,
        text=True,
        capture_output=True,
        check=True,
    )
    assert "jan\t👤" in result.stdout


def test_node_example_runs():
    if shutil.which("node") is None:
        return

    result = subprocess.run(
        ["node", "examples/node-load-profile.js"],
        cwd=ROOT,
        text=True,
        capture_output=True,
        check=True,
    )
    assert "jan\t👤" in result.stdout
