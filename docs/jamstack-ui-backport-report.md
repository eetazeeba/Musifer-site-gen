# Jamstack UI Backport Report

- Generated: 2026-03-05T21:17:18
- Mode: dry-run
- Base...Source: main...jamstack-builder
- Changed files scanned: 64

## Selected For Backport
- "src/_assets/CSS/header-nav.css" -> "CSS/header-nav.css" (portable runtime nav/header stylesheet)
- "src/_assets/CSS/styles.css" -> "CSS/styles.css" (portable runtime stylesheet)
- "src/_assets/scripts/header-nav.js" -> "scripts/header-nav.js" (portable runtime nav interaction logic)

## Blocked By Denylist
- ".eleventy.js"
- "content/_index.json"
- "content/blog/test-post-please-ignore.md"
- "content/blog/writing-better-hooks.md"
- "content/lessons/lesson-melodic-phrasing.md"
- "content/profiles/ava-rivera.md"
- "package-lock.json"
- "package.json"
- "scripts/cms/build-index.js"
- "scripts/cms/lib/content.js"
- "scripts/cms/validate-content.js"
- "src/_assets/CSS/_base.scss"
- "src/_assets/CSS/_components.scss"
- "src/_assets/CSS/_layout.scss"
- "src/_assets/CSS/_nav.scss"
- "src/_assets/CSS/_tokens.scss"
- "src/_assets/CSS/header-nav.scss"
- "src/_assets/CSS/styles.scss"
- "src/_includes/layouts/base.njk"
- "src/about/client-list/index.njk"
- "src/about/faq/index.njk"
- "src/about/history/index.njk"
- "src/about/index.njk"
- "src/about/mission/index.njk"
- "src/about/portfolio/index.njk"
- "src/about/team/index.njk"
- "src/admin/config.yml"
- "src/admin/index.html"
- "src/blog/articles/index.njk"
- "src/blog/case-studies/index.njk"
- "src/blog/guides/index.njk"
- "src/blog/index.njk"
- "src/contact/index.njk"
- "src/contact/locations/index.njk"
- "src/contact/positions/index.njk"
- "src/services/index.njk"
- "src/services/legal/index.njk"
- "src/services/pricing-quote-form/index.njk"
- "src/services/production-audio-engineering/index.njk"

## Manual Review Required
- "src/_data/nav.json"
- "src/_includes/header.html"
- "src/important-update/index.njk"
- "src/index.njk"

## Reviewed But Not Allowlisted
- ".DS_Store"
- ".gitignore"
- "CSS/styles.css"
- "CSS/styles.scss"
- "Images/Musifer site map.png"
- "Images/Musifer_Logo_Mid.png"
- "Junk/launch-local-site.bat"
- "Junk/launch-local-site.command"
- "Junk/start-local-site.js"
- "README.md"
- "docs/cms-content-spec.md"
- "docs/css-refresh-conflict-audit.md"
- "docs/responsive-layout-navigation-refresh-plan.md"
- "docs/sitemap.md"
- "important-update.html"
- "index.html"
- "src/_assets/Images/Musifer_Logo.svg"
- "src/_assets/Images/uploads/.gitkeep"

## Manual Backport Actions Applied
- Adapted `index.html` using static equivalent markup for the refreshed header/nav interaction model.
- Adapted `important-update.html` using the same static nav/header pattern for consistency.
- Kept links scoped to pages that already exist on `main` (`index.html`, `important-update.html`) to avoid introducing dead navigation targets.

## Deferred Features / Intentionally Not Backported
- Multi-page nav/content structure generated from `src/_data/nav.json` and `src/**/*.njk` was not imported.
- Eleventy layout/include abstractions (`src/_includes/**`, `src/_layouts/**`) were not imported.
- Decap CMS admin/config/editorial flow (`src/admin/**`, `scripts/cms/**`, `content/**`) was not imported.
