# Analytics Rollout Plan: Umami First, Plausible-Compatible Later

Snapshot date: 2026-03-09 (branch `experimental`)

Status
- Phase 1 base analytics script insertion strategy is implemented on `experimental` (2026-03-09).
- Build-time env gating is active in the GitHub Pages production workflow and Eleventy global data.
- Phase 2+ work (shared wrapper + page-level instrumentation) remains pending.

## 1. Current architecture assessment
- Framework/build system:
  - Eleventy 3 (`@11ty/eleventy`) with Nunjucks templates.
  - Sass compiled through npm scripts.
  - Static output directory: `_site`.
- Page/rendering model:
  - Multi-page static site (MPA), not SPA.
  - Public routes are `src/**/index.njk`.
  - Public pages consistently use `layout: layouts/base.njk`.
- Shared insertion points:
  - Global layout for public pages: `src/_includes/layouts/base.njk`.
  - Current shared client script include: `/scripts/header-nav.js`.
  - Current script passthrough path: `src/_assets/scripts` -> `/scripts` via `.eleventy.js`.
- Hosting/deployment notes relevant to analytics:
  - Repo-documented deployment path is GitHub Pages via `.github/workflows/deploy-pages.yml` on pushes to `main`.
  - No repo-tracked Netlify deploy/config artifacts were found (`netlify.toml`, `_headers`, `_redirects`).
  - External context still matters: Netlify project `creative-cassata-f39fb9` is connected, but for this rollout plan it is contextual infrastructure only, not canonical production hosting.

## 2. Provider strategy
- Recommended initial provider: Umami.
  - Good fit for a lightweight static MPA rollout.
  - Supports quick baseline pageview visibility without changing route architecture.
  - Keeps early analytics setup simple while landing-page work continues.
- Integration layer should stay vendor-agnostic:
  - Templates/components should never call provider globals directly.
  - All pageview/event calls should flow through one internal helper contract.
  - Provider selection should be centralized in config, not distributed across templates.
- Plausible-compatible later:
  - Keep event names short and stable (for example `cta_click`, `service_intent`, `blog_article_open`, `contact_submit_start`).
  - Keep properties flat and portable (string/number/boolean only; avoid nested payloads).
  - Keep wrapper interface generic (`pageview`, `track`) so provider adapters can swap with minimal template churn.
- Not directly portable between providers:
  - Historical data continuity and dashboard history.
  - Provider-specific goals/funnels/segments configuration.
  - Provider-specific attribution/session definitions and reporting UI semantics.
  - Provider endpoint/domain setup details.

## 3. Feasibility verdict
- Verdict:
  - This repo can support an Umami-first analytics integration without major architectural changes.
  - Risk is operational/configurational, not structural.
- Why feasible:
  - Single shared public base layout allows one low-churn script insertion strategy.
  - Static MPA model supports baseline pageviews without SPA route listeners.
  - Existing passthrough script pipeline supports adding a shared analytics helper later.
- Caveats now narrowed to implementation readiness:
  - Domain direction is documented, but final DNS/canonical redirect implementation is still pending.
  - Privacy policy now exists as a finalized planning reference and must be published/linked in the live site when analytics is enabled.
  - The Phase 1 analytics gating contract wiring is implemented; wrapper/instrumentation phases remain pending.

## 4. Phase 0 decisions and assumptions
- Canonical hosting/deployment baseline:
  - GitHub Pages is the canonical host baseline for this analytics rollout.
- Domain direction:
  - Primary domain direction: `musifer.studio`.
  - Secondary/backup direction: `musifer.art`.
  - Domain planning reference: [`docs/planning/domain-direction-musifer-studio-art.md`](domain-direction-musifer-studio-art.md).
- Initial rollout scope:
  - Production-only analytics collection for the first rollout.
- Build-time gating contract (implemented):
  - Production analytics enablement uses an explicit build-time environment flag contract. The GitHub Pages production deploy workflow sets `ANALYTICS_ENABLED=true`, `ANALYTICS_PROVIDER=umami`, and `ANALYTICS_DOMAIN=musifer.studio`. Eleventy reads these from `process.env`, exposes them via a global `analytics` data object, and `base.njk` includes analytics only when `analytics.enabled` is true. Non-production builds keep analytics disabled by default.
- Privacy/disclosure readiness tracking:
  - Active privacy policy reference: [`docs/planning/privacy-policy-draft.md`](privacy-policy-draft.md) (content finalized; filename retained for continuity).
- Netlify status for this plan:
  - Netlify `creative-cassata-f39fb9` remains connected-project context only.
  - It is not the canonical host baseline for this rollout unless future repo-tracked implementation changes explicitly say otherwise.
- Planning implication:
  - Phase 0 strategy decisions are locked and now wired through Phase 1 implementation.
  - Remaining follow-up items are publishing/privacy linkage and later-phase instrumentation work.

## 5. Recommended integration approach
- Implemented base script placement:
  - Analytics include is loaded through `src/_includes/layouts/base.njk` only.
  - `/admin` remains naturally excluded because it uses `src/admin/index.html`, not the public base layout.
- Implemented centralized analytics config/data strategy:
  - GitHub Pages production deploy workflow now sets `ANALYTICS_ENABLED`, `ANALYTICS_PROVIDER`, and `ANALYTICS_DOMAIN` in the build job.
  - Eleventy reads these values from `process.env` in `src/_data/analytics.js`.
  - Global template data now exposes:
    - `analytics.enabled`
    - `analytics.provider`
    - `analytics.domain`
  - `base.njk` conditionally includes analytics only when `analytics.enabled` is `true`.
  - Non-production builds default to disabled analytics when env values are absent.
- Implemented provider template boundary:
  - Umami provider markup is isolated in `src/_includes/analytics/umami.njk`.
  - Provider/domain values are consumed from global `analytics` data instead of hard-coded route/template values.
- Wrapper/helper contract:
  - Introduce one shared client helper in `src/_assets/scripts/analytics.js` (planned, not implemented in this pass).
  - Contract shape:
    - `pageview(path, props?)`
    - `track(eventName, props?)`
  - Behavior:
    - no-op when analytics is disabled or provider is unavailable.
    - normalize payload keys/values before forwarding to provider adapter.
- Vendor-call guardrails:
  - No direct Umami/Plausible globals inside templates/components/page scripts.
  - Provider-specific implementation stays behind wrapper internals only.
- Secondary runtime guard:
  - A hostname/domain guard can be added as defense in depth, but remains secondary to the explicit build-time environment gate.
- Portable naming/property conventions:
  - Event names: lowercase snake_case, verb-oriented, stable.
  - Properties: flat keys, short values, avoid nested objects and provider-specific field names.

## 6. Proposed analytics event structure
Event design rules
- Track meaningful intent/conversion signals, not UI noise.
- Avoid event spam from hover/scroll/mousemove.
- Keep properties minimal and reusable across providers.

Global events
- `nav_link_click`
  - Trigger: top-level or submenu nav link click.
  - Properties: `nav_section`, `nav_label`, `target_path`.
- `cta_click`
  - Trigger: primary CTA click from major sections.
  - Properties: `page_type`, `cta_id`, `target_path`.
- `outbound_click`
  - Trigger: user clicks external link.
  - Properties: `page_type`, `link_domain`, `link_label`.

`services` events
- `service_intent`
  - Trigger: service-card/service-link click.
  - Properties: `service_slug`, `service_group`, `from_path`.
- `quote_flow_start`
  - Trigger: click into pricing/quote form entry.
  - Properties: `entry_point`, `from_path`.

`blog` events (priority surface)
- `blog_hub_open`
  - Trigger: open `/blog/` hub or blog category entry.
  - Properties: `entry_source`, `category`.
- `blog_article_open`
  - Trigger: click from blog listing/category into article page.
  - Properties: `category`, `post_slug`, `from_path`.
- `blog_growth_cta`
  - Trigger: subscribe/follow/contact-for-content CTA interaction (once present).
  - Properties: `cta_id`, `placement`, `from_path`.

`contact` events
- `contact_path_select`
  - Trigger: user chooses a contact route (general, positions, locations, etc.).
  - Properties: `contact_path`, `from_path`.
- `contact_submit_start`
  - Trigger: first interaction with contact submit flow entry point.
  - Properties: `contact_type`, `from_path`.
- `contact_submit_success`
  - Trigger: confirmed contact submission completion (if flow exists).
  - Properties: `contact_type`, `completion_path`.

## 7. Rollout phases
### Phase 0: decisions documented and locked (planning complete)
- Phase status:
  - Locked in planning docs and consumed by implemented Phase 1 wiring.
- Intended changes:
  - Record canonical host baseline (GitHub Pages), domain direction (`musifer.studio` primary, `musifer.art` backup), production-only scope, and privacy-policy linkage.
  - Record Netlify as contextual infrastructure only for this rollout plan.
- Likely files/systems touched:
  - `docs/planning/analytics-rollout-plan.md`
  - `docs/planning/domain-direction-musifer-studio-art.md`
  - `docs/planning/privacy-policy-draft.md`
  - `docs/high-level-project-tracking.md`
  - `docs/planning/README.md`
- Risk level: Low (documentation alignment).
- Acceptance criteria:
  - Decisions are explicit and no longer framed as open strategy questions.
  - Cross-references to domain and privacy planning docs are present and correct.
- Dependency notes:
  - Phase 1 implementation is complete on `experimental` (2026-03-09).

Remaining implementation-prep items after Phase 0 lock
- Confirm where/how the finalized privacy policy will be published and linked in the live site.
- Confirm production hostname value used with `ANALYTICS_DOMAIN` once domain cutover is implemented.
- Keep later phases aligned to the implemented env-variable gating contract.

### Phase 1: base analytics script insertion strategy
- Phase status:
  - Implemented on `experimental` (2026-03-09).
- Implemented changes:
  - Added global analytics data mapping from `process.env` in `src/_data/analytics.js`.
  - Added conditional analytics include gate in `src/_includes/layouts/base.njk` keyed to `analytics.enabled`.
  - Added Umami provider include in `src/_includes/analytics/umami.njk`.
  - Set production deploy env vars in `.github/workflows/deploy-pages.yml`:
    - `ANALYTICS_ENABLED=true`
    - `ANALYTICS_PROVIDER=umami`
    - `ANALYTICS_DOMAIN=musifer.studio`
- Files/systems touched:
  - `.github/workflows/deploy-pages.yml`
  - `src/_data/analytics.js`
  - `src/_includes/layouts/base.njk`
  - `src/_includes/analytics/umami.njk`
- Risk level: Low.
- Acceptance criteria:
  - Implemented: env-variable contract mapped to `analytics.enabled`, `analytics.provider`, and `analytics.domain`.
  - Implemented: analytics include appears on public pages only when `analytics.enabled` is `true`.
  - Implemented: non-production/default builds keep analytics disabled when env values are absent.
  - Implemented: `/admin` remains excluded because it does not use `layouts/base.njk`.
  - Implemented: no layout/build behavior regression detected in Phase 1 validation.
- Dependency notes:
  - Establishes the gating foundation for Phase 2 wrapper/helper work.

### Phase 2: shared analytics helper/wrapper
- Intended changes:
  - Add shared `analytics.js` wrapper with provider adapter boundary.
  - Route all event calls through wrapper API.
- Likely files/systems touched:
  - `src/_assets/scripts/analytics.js`
  - `src/_includes/layouts/base.njk` (script load order/gating if needed)
- Risk level: Low to Medium.
- Acceptance criteria:
  - No direct provider calls in templates/components.
  - Wrapper safely no-ops when `analytics.enabled` is `false` or provider is unavailable.
  - Payload normalization rules documented.
- Dependency notes:
  - Phase 1 env-variable and `analytics.*` config contract should be stable first.

### Phase 3: page-level instrumentation (`services`, `blog`, `contact`)
- Intended changes:
  - Add targeted events for intent, engagement, and conversion.
  - Prioritize `blog` instrumentation depth for discovery/growth.
- Likely files/systems touched:
  - `src/services/**/*.njk`
  - `src/blog/**/*.njk`
  - `src/contact/**/*.njk`
  - `src/_assets/scripts/analytics.js`
- Risk level: Medium.
- Acceptance criteria:
  - Core funnel events fire once per intended action.
  - Event names/properties follow portable taxonomy.
  - No noisy low-signal events added.
- Dependency notes:
  - Requires wrapper contract from Phase 2.

### Phase 4: QA, validation, and documentation cleanup
- Intended changes:
  - Validate pageviews and events in production-like conditions.
  - Document final taxonomy and maintenance rules.
  - Capture GitHub Pages + Netlify context assumptions for ongoing operations.
- Likely files/systems touched:
  - `docs/high-level-project-tracking.md`
  - `docs/planning/README.md`
  - `README.md` (analytics status summary)
- Risk level: Medium.
- Acceptance criteria:
  - Verified pageviews and representative events.
  - Duplicate-fire protections verified.
  - Documentation aligns with implemented behavior and hosting reality.
- Dependency notes:
  - Requires Phase 1-3 completion.

## 8. Landing-page coordination
- Before page implementation (`services`, `blog`, `contact`):
  - Lock Phase 0 decisions and wrapper contract.
  - Freeze core event names so page work does not invent ad-hoc naming.
- During page implementation:
  - Add instrumentation only for meaningful CTA/funnel actions already present in UX.
  - Keep each new event mapped to a clear business question.
  - Prioritize richer `blog` engagement instrumentation to support discovery strategy.
- After each page lands:
  - Validate expected pageview coverage and key events.
  - Check for duplicate listener fires and naming drift.
  - Record any taxonomy adjustments in this plan and tracking doc.

## 9. QA checklist
- Phase 1 validation executed (2026-03-09):
  - Verified `.github/workflows/deploy-pages.yml` build job sets `ANALYTICS_ENABLED=true`, `ANALYTICS_PROVIDER=umami`, `ANALYTICS_DOMAIN=musifer.studio`.
  - Verified default/local build (no analytics env vars) omits analytics include.
  - Verified env-enabled build emits analytics include from `layouts/base.njk` on public pages.
  - Verified `/admin` remains unaffected because it is outside the shared public base layout.
  - Verified provider/domain values are centralized via `src/_data/analytics.js`.
- Later-phase QA still required:
  - Event taxonomy validation for wrapper-driven/page-level instrumentation (Phase 2/3).
  - Duplicate-fire prevention checks for click event handlers once instrumentation is added.
  - Privacy/disclosure publication/linkage verification before production analytics go-live.

## 10. Documentation updates needed
- Updated in this implementation pass:
  - This plan now records Phase 1 as implemented with concrete file references and acceptance outcomes.
  - `docs/high-level-project-tracking.md` now reflects env-gating as implemented (not prep-only).
  - `README.md` and `docs/planning/README.md` wording were synced to avoid stale "planning only" analytics status.
- Required follow-up documentation (later phases):
  - Publish final wrapper/event taxonomy details once Phase 2/3 ship.
  - Add production verification notes for live dashboards and conversion events.
  - Record any future host/domain reconciliation updates if canonical hosting assumptions change.
