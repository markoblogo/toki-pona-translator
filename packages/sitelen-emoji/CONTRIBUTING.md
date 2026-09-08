# Contributing

Thanks for contributing to **sitelen-emoji-truth**.

## What this project is
This repo provides a **frozen, pinned** mapping for **toki pona → sitelen emoji** and tooling to:
- build a generated mapping from upstream sources (`dist/`)
- keep a frozen “source of truth” profile under `profiles/`
- export visuals for publishing (Twemoji PNG pipeline)

## Quick start
```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements-dev.txt
python -m pytest -q
```

## How to propose changes

*1) Code / tooling changes*
	•	Open a PR.
	•	Keep changes small and focused.
	•	Add or update tests when behavior changes.

*2) Profile changes (important)*

The frozen profile under profiles/ is treated as versioned output.
	•	Do not change existing frozen mappings in-place for published versions.
	•	If you want to change mappings, create a new frozen profile file (e.g. profiles/default-stable.v2.json)
and explain why the change is needed.
	•	Include a diff using:
  ```bash
  python tools/build_default_stable.py
  python3 -m tools.diff_profiles
  ```

*3) Aliases and punctuation*
	•	Aliases (e.g. ali → ale) must be deterministic and covered by tests.
	•	Punctuation helper keys (_punct_period, _punct_colon) should remain stable for book pipelines.

## Commit / PR guidelines
	•	Use clear commit messages.
	•	Prefer one feature or fix per PR.
	•	Ensure CI is green (tests pass).

## Reporting issues
	•	Use GitHub Issues.
	•	Include:
	  •	your OS + Python version
	  •	exact command
	  •	relevant output / error logs

## Twemoji attribution

If you publish outputs that embed Twemoji PNG assets, include proper attribution (Twemoji graphics are CC BY 4.0).

## License

By contributing, you agree that your contributions are licensed under the repository license (MIT).
  
