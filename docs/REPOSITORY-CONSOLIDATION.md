# Repository consolidation

This repository is the canonical home for the ABVX Toki Pona toolchain.

## Imported projects

| Former repository | New location | Published packages |
| --- | --- | --- |
| `markoblogo/sitelen-emoji-truth` | `packages/sitelen-emoji/` | `sitelen-emoji` on PyPI and npm |
| `markoblogo/sitelen-layer-plugin` | `packages/sitelen-layer-plugin/` | `sitelen-layer-plugin` on npm and `sitelen-layer-static` on PyPI |

Both Git histories were merged into this repository. Package names and APIs remain independent. The translator consumes the canonical profile from `packages/sitelen-emoji/profiles/default-stable.v1.json`; the display-layer generator consumes the same file.

## Capability boundaries

- `frontend/` and `backend/`: translation application and API;
- `packages/sitelen-emoji/`: versioned mapping and reproducible publishing exports;
- `packages/sitelen-layer-plugin/`: page display modes, framework bindings, CLI, and adapters;
- `skills/toki-pona-formatting-pass/`: layered ODT formatting and read-only editorial QA.

Translation quality, display conversion, mapping governance, and manuscript QA remain separate gates even though they share one repository.

## Release continuity

Future package tags are namespaced:

- `sitelen-emoji-vX.Y.Z`;
- `sitelen-layer-plugin-vX.Y.Z`;
- `sitelen-layer-static-vX.Y.Z` when released independently.

The root CI verifies every component. Package publication is manually dispatched from this repository and remains gated by the existing package registry credentials and environment rules.

Before former repositories are removed, mirror their latest GitHub release records and assets here, update PyPI/npm repository links on the next package releases, and verify the live translator deployment.
