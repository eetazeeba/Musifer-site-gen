Musifer — Frontend quick setup

Overview
- This project contains a minimal `index.html`, `styles.scss`, and a compiled `styles.css`.
- `package.json` provides npm scripts to build or watch the SCSS file.

CMS planning notes (in progress)
- Goal: dependency-light, native file-based content management for `blog`, `profile`, and `lesson` content.
- Start with a shared `blog`/`lesson` base model; a lesson-specific template can be added later.
- Metadata priorities: `published_at`, `updated_at`, `author`, `copyright`, `media_types`, and multi-tag navigation.
- Front matter format: YAML.
- Date format: ISO 8601 (for example: `2026-03-03`).
- Multi-tag entries are supported for convenience and cross-navigation.
- Eleventy split remains optional later (`eleventy-only` branch is preserved for that path).
- Next comparison step after first-pass schema: evaluate external/prebuilt CMS options.
- Jamstack path note: Decap CMS is the leading free candidate and can integrate cleanly with Eleventy content workflows if we revive the 11ty track.

CMS script usage
- `npm run cms:validate`: checks required front matter fields, enums, date formats, and cross-entry `related_ids`.
- `npm run cms:index`: builds `content/_index.json` for listing pages, tag pages, and lightweight lookup.
- `npm run cms:check`: runs validation first, then index generation (recommended before commit/publish).
- Content source directories:
  `content/blog`, `content/profiles`, `content/lessons`

