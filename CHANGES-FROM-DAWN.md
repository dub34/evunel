# Changes from Dawn

This log records every structural change made to the Dawn codebase. Use it when porting fixes from newer Dawn releases: if a file appears here, review the upstream change by hand instead of applying it directly.

Base: Dawn `v16.0.0` (commit `bc39a7d2`).

## Removed

| File | Reason |
| --- | --- |
| `.github/CODE_OF_CONDUCT.md`, `.github/CONTRIBUTING.md`, `.github/ISSUE_TEMPLATE/` | Dawn open-source project process; not used for this project. |
| `.github/workflows/cla.yml`, `.github/workflows/stale.yml` | Shopify CLA bot and stale-issue bot. |
| `release-notes.md` | Dawn release notes. The upstream version is recorded in the README. |

## Changed

| File | Change |
| --- | --- |
| `README.md` | Replaced with the EVUNEL project README. |
| `.github/workflows/ci.yml` | Kept Theme Check only and granted `checks: write` so it can report results. The Lighthouse job needs store secrets and returns in the QA phase. |
| `.github/PULL_REQUEST_TEMPLATE.md` | Replaced with a project template. |
| `.gitignore` | Added `.env` files. |

## Added

| File | Purpose |
| --- | --- |
| `CHANGES-FROM-DAWN.md` | This log. |
