# Release pipeline: setup and staging run

This project now has two release workflows:

- `.github/workflows/release-preflight.yml` — PR/push sanity preflight
- `.github/workflows/release-publish.yml` — release pipeline with publish + release assets

## 1) Configure release authentication

### Preferred: Trusted Publishing (OIDC)
1. In npm, open this package and go to **Settings → Access → Trusted publishing**.
2. Add GitHub Actions as trusted publisher:
   - owner: GitHub org/user that owns the repo,
   - repository: `markoblogo/sitelen-layer-plugin`,
   - workflow file: `release-publish.yml`.
3. Set package metadata `repository.url` to `https://github.com/markoblogo/sitelen-layer-plugin` so npm provenance verification can match this repo.
4. If the package does not exist yet, do one local `npm publish` with OTP to create it first.

> For trusted publishing to work reliably in this pipeline, the workflow uses Node.js 24
> (npm CLI 11.5.1+) because older npm versions in CI can still require legacy auth.

### Legacy fallback (optional): `NPM_TOKEN`
1. Open repository settings: `Settings > Secrets and variables > Actions`.
2. Add secret:
   - `NPM_TOKEN` with an npm automation token scoped for publish.

This workflow selects publish mode with:

- `workflow_dispatch` input `publishMode`:
  - `auto` — try `NPM_TOKEN` if present, otherwise Trusted Publishing.
  - `token` — force classic token auth (`NPM_TOKEN`).
  - `trusted` — force npm Trusted Publishing via OIDC.

For push-based releases, the workflow still uses the same `auto` fallback.

## 2) `GITHUB_TOKEN` permissions
- The workflow requires:
  - `contents: write` for release creation/update.
  - `id-token: write` for Trusted Publishing.
- The workflow declares:

```yaml
permissions:
  contents: write
  id-token: write
```

## 3) Staging/manual release run (no npm publish)

Run a dispatch with `dryRun=true` to test:
- tag format validation,
- adapter package build/smoke,
- npm tarball smoke,
- GitHub release creation with attached assets (`*.tgz`, `dist/adapters/*.zip`).

CLI example:

```bash
gh workflow run release-publish.yml \
  --repo markoblogo/sitelen-layer-plugin \
  --field tag="v0.3.0" \
  --field dryRun=true

# Force trusted mode (for environments where a legacy token is present but fails):
gh workflow run release-publish.yml \
  --repo markoblogo/sitelen-layer-plugin \
  --field tag="v0.3.5" \
  --field publishMode=trusted \
  --field dryRun=false
```

Notes:
- For `workflow_dispatch`, the tag must already exist in the repository.
- In staging mode, npm publish is skipped.

## 4) Production release from tag

After validating staging run, create a real release by:

```bash
git tag v0.3.0
git push origin v0.3.0
```

or trigger manually with `dryRun=false`.

For production runs, `package.json` version must match the tag (`vX.Y.Z` → `X.Y.Z`) exactly. The workflow now validates this before build; release is blocked on mismatch.
