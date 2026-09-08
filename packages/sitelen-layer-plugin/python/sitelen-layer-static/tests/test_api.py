from pathlib import Path

from sitelen_layer_static import (
    UPSTREAM_VERSION,
    asset_path,
    asset_root,
    copy_assets,
    html_tags,
)


def test_upstream_version_is_exposed():
    assert UPSTREAM_VERSION == "0.3.9"


def test_expected_assets_exist():
    root = asset_root()
    assert (root / "dist" / "sitelen-layer-plugin.js").exists()
    assert (root / "dist" / "sitelen-layer-plugin.css").exists()
    assert (root / "sitelen-pona-font.css").exists()
    assert (root / "assets" / "fonts" / "sitelen-seli-kiwen-asuki.ttf").exists()


def test_asset_path_resolves_known_file():
    path = asset_path("dist/sitelen-layer-plugin.js")
    assert path.name == "sitelen-layer-plugin.js"


def test_copy_assets(tmp_path: Path):
    destination = copy_assets(tmp_path / "static")
    assert (destination / "dist" / "sitelen-layer-plugin.js").exists()
    assert (destination / "sitelen-pona-font.css").exists()
    assert (destination / "assets" / "fonts" / "sitelen-seli-kiwen-asuki.ttf").exists()


def test_html_tags():
    tags = html_tags("/static/vendor/sitelen-layer")
    assert "sitelen-layer-plugin.css" in tags
    assert "sitelen-pona-font.css" in tags
    assert "sitelen-layer-plugin.js" in tags
