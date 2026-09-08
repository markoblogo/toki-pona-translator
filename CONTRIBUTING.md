# Contributing

Thanks for your interest in contributing.

## Ways to help

- Report reproducible translation, display, package, or accessibility bugs.
- Propose mapping changes with the affected profile and a short rationale.
- Improve framework adapters, tests, examples, and documentation.

## Development setup
1. Clone the repository.
2. Run `npm ci` in `backend`, `frontend`, and `packages/sitelen-layer-plugin`.
3. Install `packages/sitelen-emoji/requirements-dev.txt` in a Python environment.
4. Copy `backend/.env.example` to `backend/.env` and add `OPENAI_API_KEY`. Gemini is optional.
5. Run `bash scripts/check-all.sh` before opening a pull request.

## Pull requests
- Keep PRs focused and small.
- Describe the motivation and the change.
- If you change the canonical emoji profile, run `npm run emoji:update --prefix packages/sitelen-layer-plugin` and commit the generated output.
- Preserve the public npm/PyPI package names and compatibility unless the pull request explicitly proposes a breaking release.
