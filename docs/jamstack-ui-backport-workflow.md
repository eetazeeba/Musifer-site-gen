# Jamstack UI Backport Workflow

## Purpose

Backport user-facing UI improvements from `jamstack-builder` into a branch based on `main` without importing Decap CMS or Eleventy/11ty infrastructure.

This workflow intentionally favors runtime assets and static markup adaptation over framework/source plumbing.

## What Is Allowed

- Portable runtime CSS (`.css`) that can run directly on `main`
- Portable runtime JavaScript (`.js`) for front-end interactions
- Static assets directly used by UI (images/icons/fonts), when explicitly allowlisted
- Manual static HTML updates in `main` pages to mirror rendered UI behavior

## What Is Blocked By Default

- Decap CMS and editorial wiring (`src/admin/**`, `static/admin/**`, `scripts/cms/**`, content index plumbing)
- Eleventy/11ty infrastructure (`.eleventy.js`, `src/_data/**`, `src/_includes/**`, `src/_layouts/**`, `src/**/*.njk`)
- Jamstack branch build/tooling changes (`package.json`, `package-lock.json`, SCSS source files)

## Files

- Manifest: `scripts/backport-jamstack-ui.paths.json`
- PowerShell workflow: `scripts/backport-jamstack-ui.ps1`
- Windows wrapper: `scripts/backport-jamstack-ui.bat`

## Run Dry-Run

PowerShell:

```powershell
PowerShell -NoProfile -ExecutionPolicy Bypass -File scripts/backport-jamstack-ui.ps1 -Mode dry-run -ReportPath docs/jamstack-ui-backport-report.md
```

Batch wrapper:

```bat
scripts\backport-jamstack-ui.bat -Mode dry-run -ReportPath docs/jamstack-ui-backport-report.md
```

Dry-run only reports candidates and classifications.

## Run Apply Mode

```powershell
PowerShell -NoProfile -ExecutionPolicy Bypass -File scripts/backport-jamstack-ui.ps1 -Mode apply
```

If unresolved manual dependencies are detected, apply mode stops by default.

To proceed after explicitly handling manual files:

```powershell
PowerShell -NoProfile -ExecutionPolicy Bypass -File scripts/backport-jamstack-ui.ps1 -Mode apply -AllowUnresolved
```

## Updating Allowlist / Denylist

Edit `scripts/backport-jamstack-ui.paths.json`:

- `allowMappings`: exact source-to-target copies
- `blockedPatterns`: excluded path patterns
- `manualReviewPatterns`: high-risk files that require manual adaptation review

## Known Limitations

- The script is intentionally conservative and maps text/runtime files only.
- It does not transform 11ty templates into static HTML; that remains a manual adaptation step.
- It will not infer hidden dependencies automatically beyond pattern-based classification.
- Keep commits focused: run dry-run, review report, then apply and manually adapt static markup only where needed.
