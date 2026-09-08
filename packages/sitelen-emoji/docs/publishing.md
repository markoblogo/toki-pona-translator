# Publishing

Package publishing is available for npm and PyPI.

## Current package names

- npm: https://www.npmjs.com/package/sitelen-emoji
- PyPI: https://pypi.org/project/sitelen-emoji/

Current published version: `1.1.0`.

## GitHub settings

- Repository variable: `ENABLE_PACKAGE_PUBLISH=false`
- PyPI environment: `pypi`

Publishing is intentionally disabled by default so release creation does not republish packages accidentally. Enable it only for a release that has a new package version.

## npm trusted publisher

The package was initially published manually. For future automated publishing, configure npm trusted publishing:

- Repository: `markoblogo/sitelen-emoji-truth`
- Workflow: `publish-npm.yml`
- Allowed action: `npm publish`

Workflow file: `.github/workflows/publish-npm.yml`

Docs: https://docs.npmjs.com/trusted-publishers/

## PyPI trusted publisher

PyPI publishing uses GitHub trusted publishing:

- Owner: `markoblogo`
- Repository: `sitelen-emoji-truth`
- Workflow name: `publish-pypi.yml`
- Environment name: `pypi`

Workflow file: `.github/workflows/publish-pypi.yml`

Docs: https://docs.pypi.org/trusted-publishers/

## Enable publishing

Enable package publishing only after bumping package versions:

```bash
gh variable set ENABLE_PACKAGE_PUBLISH --repo markoblogo/sitelen-emoji-truth --body true
```

Publishing runs on GitHub Release publish events and can also be started manually with `workflow_dispatch`.

Disable it again after the package release:

```bash
gh variable set ENABLE_PACKAGE_PUBLISH --repo markoblogo/sitelen-emoji-truth --body false
```
