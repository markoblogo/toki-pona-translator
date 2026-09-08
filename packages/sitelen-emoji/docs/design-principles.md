# Design principles

This project prioritizes stable, reproducible production use.

- Frozen profiles must be deterministic.
- Published versions are never silently changed.
- Breaking mapping changes require a new frozen profile version.
- Consumers should pin to git tags.
- Aliases must be explicit and tested.
- Visual exports should be reproducible.
- This project is a production profile and tooling package, not a claim of official sitelen emoji standard status.
- Community input is welcome via issues and PRs, but production stability takes priority.
