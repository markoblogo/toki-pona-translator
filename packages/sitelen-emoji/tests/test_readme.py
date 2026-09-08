from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
README_PATH = ROOT / "README.md"


def test_readme_exists():
    """README.md should exist at the repository root."""
    assert README_PATH.is_file(), "README.md should be present in the project root"


def test_readme_has_dev_setup_instructions():
    """README.md should contain the initial dev setup instructions."""
    content = README_PATH.read_text(encoding="utf-8")

    # Basic structure
    assert "python3 -m venv" in content or "python -m venv" in content
    assert "pip install -r requirements-dev.txt" in content
    assert "pytest -q" in content

    # Key shell commands for initial developer setup
    expected_snippets = [
        "python3 -m venv .venv",
        "source .venv/bin/activate",
        "python -m pip install -r requirements-dev.txt",
        "python -m pytest -q",
        "python tools/build_default_stable.py",
    ]

    for snippet in expected_snippets:
        assert snippet in content, f"Missing expected snippet in README.md: {snippet!r}"
