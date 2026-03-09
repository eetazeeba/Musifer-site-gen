# Musifer Domain Direction (`.studio` primary, `.art` backup)

## Current decision
- Preferred primary public domain direction: `musifer.studio`.
- Secondary/backup/brand-protection direction: `musifer.art`.
- Decision status (as of 2026-03-09): direction selected for planning; not yet implemented.
- `.com` is not currently the preferred acquisition target due to cost/squatting constraints.
- Final canonical host/domain implementation is still pending follow-up.

## Rationale
- Why `musifer.studio` is preferred:
  - Strong fit for music production, engineering, and broader creative service positioning.
  - Reads clearly as a professional creative destination without over-narrowing scope.
  - Supports current and future service expansion without forcing a genre-locked brand signal.
- Why `musifer.art` should still be reserved:
  - Backup option if `.studio` acquisition or renewal path becomes unfavorable.
  - Brand-protection value against lookalike/impersonation risk.
  - Useful as an alternate redirect domain if primary canonical routing later standardizes on `.studio`.

## Hosting implications (repo-visible facts only)
- Current live production host reference for this implementation window: `eetazeeba.github.io` (pending custom-domain cutover).
- Repo-documented deployment path is GitHub Pages via Actions from `main`:
  - Workflow: `.github/workflows/deploy-pages.yml`.
- Netlify context:
  - Netlify project linkage exists as `creative-cassata-f39fb9` (external dashboard context).
  - Repo does not currently prove active Netlify deployment behavior for production.
- No repo-tracked custom-domain/Netlify edge config artifacts were found at this time:
  - no `CNAME`
  - no `netlify.toml`
  - no `_headers`
  - no `_redirects`
- Practical implication:
  - Canonical domain/redirect behavior must be explicitly implemented and documented later; this file records direction only.

## Follow-up implementation tasks (not executed in this pass)
- Acquire and register target domains (`musifer.studio` primary, `musifer.art` backup/protection).
- Produce DNS plan:
  - authoritative DNS provider choice
  - records for primary host
  - redirect behavior for backup domain
- Implement GitHub Pages custom-domain setup for the chosen canonical domain.
- If Netlify is used for any live environment, document Netlify domain settings and deploy-context behavior.
- Validate redirects/canonical signals end-to-end after domain cutover:
  - host redirects
  - canonical tags where applicable
  - mixed-host drift checks
- Reconcile analytics/domain assumptions after cutover to avoid fragmented reporting.

## Documentation follow-up after acquisition/connection
- Update `README.md` hosting/domain section with confirmed canonical domain and active host path.
- Update `docs/high-level-project-tracking.md` from "direction selected" to "implemented state" with dates.
- Update `docs/planning/analytics-rollout-plan.md` to reflect final canonical domain decision for analytics setup.
- Keep this document as the historical decision record; append implementation outcome notes rather than replacing rationale.
