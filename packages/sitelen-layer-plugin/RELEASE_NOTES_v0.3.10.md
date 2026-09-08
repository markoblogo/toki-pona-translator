# sitelen-layer-plugin v0.3.10

This patch release makes the toki pona monorepository the canonical package source.

- Preserves the v0.3.9 public API and adapter behavior.
- Synchronizes the generated emoji mapping from `packages/sitelen-emoji`.
- Rebuilds the Python static-assets package as `sitelen-layer-static` 0.1.1.
- Publishes npm and PyPI artifacts through the monorepository release workflow.
