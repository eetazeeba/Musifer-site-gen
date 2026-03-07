# Responsive Layout Phase 4 Content Modules Implementation Brief

Status
- Parent roadmap: `docs/responsive-layout-navigation-refresh-plan.md` (Phase 4)
- Brief status: planning artifact, implementation-ready
- Last updated: 2026-03-07
- Implementation state: not started (planning only)

## 1) Scope and intent

Problem this phase solves
- Navigation and breakpoint behavior are now stabilized from Phases 1-3, but reusable layout/module structure is still ad hoc.
- Current templates are mostly single-card scaffolds, with no shared system for predictable 1/2/3-column composition, rails, or stacked density variants.
- Without a Phase 4 structure pass, later page work would drift into one-off CSS and inconsistent responsive behavior.

Why this exists now
- This phase follows the navigation refresh so module work can target stable breakpoints (`0-767`, `768-991`, `992-1199`, `1200+`) without moving nav contracts.
- It creates a reusable structural vocabulary before any larger page-level refresh.

What this phase is
- A structural/content-module system pass.
- A reusable primitive and module definition pass for SCSS partials.

What this phase is not
- Not a parent-page redesign (`/about`, `/services`, `/blog`, `/contact`, etc.).
- Not a nav/header rewrite.
- Not a CMS model/rendering contract change.
- Not analytics, media-hosting, or build-system expansion work.
- Not implementation of the next larger visual/IA refresh.

## 2) File ownership and boundaries

Primary scope
- `src/_assets/CSS/_layout.scss`
  - Owns layout primitives and wrappers:
  - page/section shells
  - module stacks
  - responsive grids
  - split-layout primitives
  - rail container geometry and overflow behavior
- `src/_assets/CSS/_components.scss`
  - Owns reusable module/component patterns:
  - card rails and scroll-snap variants
  - stacked-card defaults
  - card density/emphasis modifiers

Secondary/shared scope (only if required)
- `src/_assets/CSS/_tokens.scss`
  - Add shared spacing/gutter/card-width custom properties only when module behavior cannot stay coherent with current tokens.
- `src/_assets/CSS/_base.scss`
  - Minimal baseline rules only when required for broad module consistency (for example, global overflow/focus edge fixes).

Out of scope in this phase
- `src/_assets/CSS/_nav.scss`
- `src/_assets/CSS/header-nav.scss`
- `src/_assets/CSS/header-nav.css`
- `src/_assets/scripts/header-nav.js`
- `src/_includes/header.html`

Exception rule
- Nav/header files remain out of scope except narrowly scoped overlap bug fixes found during future Phase 4 QA.

## 3) Proposed structural taxonomy and naming direction

Naming direction (recommended first pass)
- Layout primitives: `l-*` (or `layout-*`)
- Reusable module containers: `module-*` (or `m-*`)
- Card-level variants: existing `.card`/`.card-impact` plus additive modifiers
- State/modifier hooks: `is-*` or `--modifier` suffixes

Responsibility ladder
1. Shell primitives define width, gutters, and section rhythm.
2. Module wrappers define child arrangement (stack, grid, split, rail).
3. Card variants define per-item emphasis and density.
4. Page-specific compositions are deferred and should compose 1-3, not bypass them.

Structural primitives to define
- Page shell and section shell wrappers
  - Keep content aligned with shared max-width and responsive inline gutters.
- Module stack wrappers
  - Vertical rhythm container for mixed modules on a route.
- Responsive grid wrappers
  - 1-column default with 2/3-column activation by breakpoint/modifier.
- Split-layout primitives
  - Two-region layout for text/media or primary/supporting content at medium+ widths.
- Rail containers
  - Horizontal overflow track with predictable card widths and gutter alignment.
- Snap-enabled rail variants
  - Rail modifier that adds CSS scroll-snap behavior without changing markup contracts.
- Stacked-card defaults
  - Mobile-first single-column card flow with standardized spacing and optional density/emphasis modifiers.

## 4) Utility vs component rules

Low-level layout utilities (layout-only; no card visuals)
- Belongs here:
  - column templates (`1`, `2`, `3` columns)
  - gaps/gutters
  - max-width/container behavior
  - split proportions
- Does not belong here:
  - card colors, shadows, button styling
  - route-specific spacing exceptions

Reusable structural components (module containers)
- Belongs here:
  - grid module wrappers
  - rail wrappers
  - snap rail behavior
  - stacked module wrappers
- Does not belong here:
  - page-specific hero/landing assembly
  - custom rules tied to a single route slug

Card-level component variants
- Belongs here:
  - featured vs standard card emphasis
  - compact vs comfortable density
  - card-in-rail width caps and spacing variants
- Does not belong here:
  - module container overflow logic
  - layout shell geometry

Future page-specific compositions (deferred)
- Examples to defer:
  - custom `/about` landing layout assembly
  - route-specific hero/banner choreography
  - one-off rail behavior unique to a parent route

## 5) Breakpoint behavior guidance

Breakpoint ladder (aligned to refresh plan)
- Narrow: `0-767px`
- Medium: `768-991px`
- Wide: `992-1199px`
- Extra-wide: `1200px+`

Narrow defaults (`0-767px`)
- Default all modules to single-column stack.
- Rails remain touch-first horizontal overflow with clear card boundaries.
- Use comfortable tap targets and larger vertical rhythm.
- Keep inline gutters simple and stable so snap alignment remains predictable.

Medium behavior (`768-991px`)
- Enable optional 2-column grid and split layouts when content readability holds.
- Increase module gap and section rhythm from narrow baseline.
- Rails can widen visible card width while preserving horizontal scroll ergonomics.

Wide behavior (`992-1199px`)
- Activate denser grid variants including optional 3-column patterns where card content supports it.
- Tighten vertical rhythm slightly versus narrow to improve scan density.
- Rails should show more cards per viewport without clipping interactive controls.

Extra-wide behavior (`1200px+`)
- Enable widest container and densest rail/grid variants within readability guardrails.
- Increase maximum rail viewport utilization while preserving gutter alignment.
- Keep line lengths and card text measure constrained to avoid readability regressions.

Spacing, gutters, and density expectations
- Mobile-first defaults in base module classes.
- `min-width` queries progressively increase column count and adjust gaps.
- Density modifiers should alter spacing scale, not break module semantics.
- Any new spacing tokens should be shared via `_tokens.scss`; do not hardcode route-specific values.

## 6) Module family planning guidance

### 6.1 Responsive grid modules
Intended use
- Reusable card/text module groups requiring responsive 1/2/3-column composition.

Layout behavior
- 1-column default.
- Optional 2-column activation at `>=768px`.
- Optional 3-column activation at `>=992px` or `>=1200px` based on card density needs.

Likely markup assumptions
- Module wrapper around repeatable child items (`article`, `section`, or card blocks).
- Child items should not require route-specific wrapper nesting to participate.

Interaction expectations
- No JS dependency.

Accessibility/usability guardrails
- Keep DOM order equal to reading order.
- Avoid visual reordering that conflicts with keyboard/screen-reader flow.

### 6.2 Card rail modules
Intended use
- High-density lists where vertical space is constrained and horizontal browse is acceptable.

Layout behavior
- Horizontal overflow container with consistent card min/max width and inter-card gap.
- Gutters align with page/section shell spacing.

Likely markup assumptions
- One rail container with direct card children or a lightweight inner track wrapper.

Interaction expectations
- CSS-first scrolling behavior.
- JS controls are optional future enhancement, not required in Phase 4.

Accessibility/usability guardrails
- Preserve keyboard access to all links/buttons within off-screen cards.
- Ensure focused elements are not clipped by overflow styling.
- Keep touch-scroll behavior smooth and non-trapping.

### 6.3 Scroll-snap rail variants
Intended use
- Touch-first card rails that benefit from deliberate snapping.

Layout behavior
- Rail modifier enabling `scroll-snap-type` on container and `scroll-snap-align` on items.
- Use `scroll-padding-inline` to align first/last snap positions with shell gutters.

Likely markup assumptions
- Reuses card rail markup with an additive snap modifier.

Interaction expectations
- Snap behavior should degrade gracefully if unsupported.
- No mandatory JS for basic snapping.

Accessibility/usability guardrails
- Do not create focus traps or forced snap behavior that fights keyboard navigation.
- Keep wheel/trackpad behavior reasonable on desktop and hybrid devices.

### 6.4 Stacked-card modules
Intended use
- Default module presentation for narrow screens and content-first sections.

Layout behavior
- Single-column vertical stack by default.
- Predictable spacing between cards.
- Optional transition to grid/rail variants at medium+ breakpoints via wrapper modifiers.

Likely markup assumptions
- Existing `.card` and `.card-impact` usage can be retained with additive wrapper classes.

Interaction expectations
- No special interaction required beyond standard links/buttons.

Accessibility/usability guardrails
- Maintain clear heading hierarchy and readable text measures.
- Keep tap targets and spacing comfortable on narrow touch devices.

### 6.5 Density modifiers (`compact`, `comfortable`)
Intended use
- Adjust card/module density by context without redefining core layout primitives.

Layout behavior
- `compact`: reduced gaps/padding for high-density contexts.
- `comfortable`: increased spacing for readability-first contexts.

Likely markup assumptions
- Applied as additive module/card modifiers, not alternate component forks.

Interaction expectations
- No behavior changes; visual spacing only.

Accessibility/usability guardrails
- Compact mode must still preserve minimum target sizes and readable line-height.

### 6.6 Emphasis modifiers (`featured`, `standard`)
Intended use
- Distinguish priority content while keeping module structure reusable.

Layout behavior
- `featured`: stronger visual weight, potentially larger span in grid contexts.
- `standard`: default card rhythm.

Likely markup assumptions
- Builds on existing `.card` and `.card-impact` patterns where practical.

Interaction expectations
- No separate interaction model.

Accessibility/usability guardrails
- Emphasis must not rely on color alone; preserve semantic headings and clear contrast.

## 7) Constraints and guardrails

Required constraints for implementation
- Preserve current CMS rendering contracts in this phase.
- Minimize markup churn; prefer additive classes/wrappers over template rewrites.
- Keep modules mobile-first.
- Keep horizontal overflow patterns touch-friendly.
- Prefer CSS-first rail/snap behavior before introducing JS.
- Keep nav/header behavior unchanged unless fixing direct overlap regressions.
- Avoid introducing route-specific one-off layout rules as a substitute for primitives.

## 8) Recommended future implementation sequence

1. Structural wrappers first
- Define page/section shell + module stack primitives in `_layout.scss`.
- Confirm no regressions against current templates.

2. Grid primitives second
- Add responsive 1/2/3-column grid utilities/wrappers.
- Validate breakpoint/gutter behavior across existing scaffold pages.

3. Card rail and snap variants third
- Add base rail container and optional snap modifier in `_components.scss`.
- Validate touch/keyboard/trackpad behavior.

4. Stacked-card defaults and modifiers fourth
- Formalize stacked defaults and density/emphasis modifiers.
- Align with existing `.card`/`.card-impact` usage to reduce markup churn.

5. Module QA and documentation pass
- Verify accessibility, overflow behavior, and breakpoint consistency.
- Document final class vocabulary and usage examples in Phase 4 docs.

## 9) Adoption/deferment note

Explicit deferment
- Parent-level route layout expansion for `/about`, `/services`, `/blog`, `/contact`, and related hubs is deferred to a later refresh.
- Phase 4 defines reusable primitives/modules only.
- Later parent-page refresh work should consume these primitives instead of inventing one-off layout systems.

## 10) Acceptance criteria for future Phase 4 implementation

- Reusable structural primitives exist for shell, stack, grid, split, and rail composition.
- Grid primitives support predictable 1/2/3-column behavior across target breakpoints.
- Rail and snap variants are implemented and documented with intended use and constraints.
- Stacked-card narrow defaults are implemented with density and emphasis modifiers.
- Utility/component taxonomy is coherent and avoids overlap or duplicate responsibilities.
- Existing CMS rendering contracts remain unchanged.
- Nav/header behavior remains stable (except explicit overlap fixes if needed).
- Parent-page redesign/composition work remains deferred.
