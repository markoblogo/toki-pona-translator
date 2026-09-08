# sitelen-layer-static

Python static-asset integration package for [`sitelen-layer-plugin`](https://github.com/markoblogo/sitelen-layer-plugin).

This package is not a Python reimplementation of the plugin. It packages the built frontend assets so Python web apps can ship them from local static files instead of relying on npm at deploy time.

Bundled upstream artifact:

- `sitelen-layer-plugin` `0.3.9`

Included assets:

- built JS bundles from `dist/`
- `sitelen-layer-plugin.css`
- `sitelen-pona-font.css`
- bundled `sitelen seli kiwen asuki` font files and OFL notice

## Install

```bash
pip install sitelen-layer-static
```

Recommended when:

- your app is Django, Flask, FastAPI, or another Python web stack;
- you want vendored local static assets instead of npm at runtime;
- you still want upstream `sitelen-layer-plugin` behavior and built artifacts.

## Basic usage

```python
from sitelen_layer_static import asset_path, stylesheet_tags, script_tags

css = stylesheet_tags("/static/vendor/sitelen-layer")
js = script_tags("/static/vendor/sitelen-layer")

print(asset_path("dist/sitelen-layer-plugin.js"))
```

## Copy assets into your static tree

```python
from pathlib import Path

from sitelen_layer_static import copy_assets

copy_assets(Path("static/vendor/sitelen-layer"))
```

This writes:

- `dist/*`
- `sitelen-pona-font.css`
- `assets/fonts/*`

## HTML tags

```python
from sitelen_layer_static import html_tags

print(html_tags("/static/vendor/sitelen-layer"))
```

Example output:

```html
<link rel="stylesheet" href="/static/vendor/sitelen-layer/dist/sitelen-layer-plugin.css">
<link rel="stylesheet" href="/static/vendor/sitelen-layer/sitelen-pona-font.css">
<script type="module" src="/static/vendor/sitelen-layer/dist/sitelen-layer-plugin.js"></script>
```

## Notes

- This package does not install npm dependencies.
- It does not expose the plugin API to Python code.
- It is intended for Django, Flask, FastAPI, static site generators, or CI pipelines that want vendored assets.
- Upstream frontend package version bundled here: `0.3.9`

## License

Package code is MIT.

Bundled font assets include `sitelen seli kiwen asuki` under SIL Open Font License 1.1. See:

- `assets/fonts/OFL-sitelen-seli-kiwen.txt`
