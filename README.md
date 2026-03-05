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
- `npm run cms:local`: starts Decap local backend server for localhost admin testing.

## Decap scaffold status
- Admin UI scaffold: `src/admin/index.html`
- Decap config scaffold: `src/admin/config.yml`
- Upload target: `src/Images/uploads/` (served as `/Images/uploads`)
- Eleventy passthrough includes `src/admin/config.yml`
- Promotion convention: add `featured` in `tags` for entries that should surface on home/highlight modules.

### Local CMS test flow
1. `npm install`
2. In terminal A: `npm run start`
3. In terminal B: `npm run cms:local`
4. Open `http://localhost:8080/admin/`

`src/admin/config.yml` is currently set to branch `jamstack-builder` so Decap authoring stays off `main` while this setup is in progress.

## Key dirs
- `src/`: Eleventy templates, includes, assets
- `content/`: blog/profile/lesson content entries
- `docs/`: content specs and sitemap notes
- `scripts/cms/`: validation and index generators
