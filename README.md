# Musifer (Eleventy + CMS)

## Overview
- Site builds from `src/` using Eleventy.
- Content source of truth is in `content/`.
- CMS helper scripts live in `scripts/cms/`.

## Run
- `npm install`
- `npm run start` for local dev server
- `npm run build` for production build

## CMS scripts
- `npm run cms:validate`: validates front matter, enums, date formats, and relationships.
- `npm run cms:index`: regenerates `content/_index.json`.
- `npm run cms:check`: validate then index (recommended pre-commit).

## Key dirs
- `src/`: Eleventy templates, includes, assets
- `content/`: blog/profile/lesson content entries
- `docs/`: content specs and sitemap notes
- `scripts/cms/`: validation and index generators
