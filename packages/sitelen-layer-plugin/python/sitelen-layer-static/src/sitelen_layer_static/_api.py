from __future__ import annotations

from importlib.resources import as_file, files
from pathlib import Path
import shutil

UPSTREAM_VERSION = "0.3.9"

_ASSET_ROOT = files("sitelen_layer_static") / "assets"


def asset_root() -> Path:
    """Return a filesystem path to the packaged asset root."""
    with as_file(_ASSET_ROOT) as root:
        return Path(root)


def asset_path(relative_path: str) -> Path:
    """Resolve a relative asset path inside the packaged assets."""
    path = asset_root() / relative_path
    if not path.exists():
        raise FileNotFoundError(f"Unknown sitelen-layer asset: {relative_path}")
    return path


def copy_assets(destination: str | Path) -> Path:
    """Copy packaged assets into a destination directory."""
    destination = Path(destination)
    destination.mkdir(parents=True, exist_ok=True)
    root = asset_root()
    for source in root.rglob("*"):
        if source.is_dir():
            continue
        target = destination / source.relative_to(root)
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(source, target)
    return destination


def stylesheet_tags(url_prefix: str) -> str:
    base = _normalized_prefix(url_prefix)
    return "\n".join(
        [
            f'<link rel="stylesheet" href="{base}/dist/sitelen-layer-plugin.css">',
            f'<link rel="stylesheet" href="{base}/sitelen-pona-font.css">',
        ]
    )


def script_tags(url_prefix: str) -> str:
    base = _normalized_prefix(url_prefix)
    return f'<script type="module" src="{base}/dist/sitelen-layer-plugin.js"></script>'


def html_tags(url_prefix: str) -> str:
    return "\n".join([stylesheet_tags(url_prefix), script_tags(url_prefix)])


def _normalized_prefix(url_prefix: str) -> str:
    prefix = url_prefix.rstrip("/")
    if not prefix:
        raise ValueError("url_prefix must not be empty")
    return prefix
