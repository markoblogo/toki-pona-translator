# Publishing `sitelen-emoji`

The npm and PyPI packages keep the public name `sitelen-emoji`. Source now lives in `packages/sitelen-emoji` within `markoblogo/toki-pona-translator`.

1. Update `pyproject.toml`, `packages/js/package.json`, and `version.txt` to the same version.
2. Run the monorepo CI and inspect the profile diff.
3. Create the namespaced tag `sitelen-emoji-vX.Y.Z`.
4. Run **Publish package** with either `sitelen-emoji-npm` or `sitelen-emoji-pypi`. Keep `dry_run` enabled first.
5. Verify the installed package from npm/PyPI in a clean environment.

Trusted publisher settings must point to:

- repository: `markoblogo/toki-pona-translator`;
- workflow: `publish-packages.yml`;
- PyPI package environment, if required by its publisher configuration.

Package publication is manual so a repository release cannot republish an unchanged version accidentally.
