# Release pipeline

`sitelen-layer-plugin` and `sitelen-layer-static` are maintained in `packages/sitelen-layer-plugin` within `markoblogo/toki-pona-translator`.

## Before publishing

1. Bump the selected package version and update its changelog.
2. Run `npm run emoji:update` and commit the generated mapping.
3. Run `npm run ci:release`; this rebuilds and tests the plugin and synchronizes the Python static assets.
4. Create `sitelen-layer-plugin-vX.Y.Z` or `sitelen-layer-static-vX.Y.Z`.
5. Run **Publish package** with `dry_run` enabled, then rerun with it disabled.
6. Install the public artifact in a clean environment and verify its version and basic API.

For npm Trusted Publishing, configure `markoblogo/toki-pona-translator` and `publish-packages.yml`. PyPI Trusted Publishing uses the same repository and workflow. The workflow requests OIDC only for publication and does not store registry tokens in the repository.
