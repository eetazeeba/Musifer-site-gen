Musifer - Project Notes

Overview (main branch)
- `main` currently tracks the static site (`index.html`, `important-update.html`, `CSS/`, `Images/`).
- Jamstack + file-based CMS remains the active direction for ongoing work.

Important branch context (as of 2026-03-05)
- `jamstack-builder` (active build branch)
  - Eleventy structure: `src/` -> `_site/`
  - Content source: `content/` (blog, lessons, profiles)
  - CMS tooling: `scripts/cms/` (`cms:validate`, `cms:index`, `cms:check`)
  - Decap scaffold present under `src/admin/` with local backend support (`npm run cms:local`)
- `experimental`
  - Static-site quick-setup and local launch flow notes.
- Archived branch tips
  - `archive/cms-foundation-tip-2026-03-05`
  - `archive/eleventy-only-tip-2026-03-05`

CMS direction (shared planning)
- Content targets: blog entries, artist/collaborator profiles, and lesson content.
- Metadata priorities: publishing/edit dates, author, copyright, media types, and tags.