# Codex task: integrate Services page from wireframe

Work on the `experimental` branch.

## Objective
Integrate the attached `services_page_wireframe.jsx` into the Musifer site as the first implementation pass for the new `services` landing page.

This page should act as a focused, reasonably concise conversion page that:
- introduces Musifer's core service lanes
- helps visitors self-sort quickly
- explains the intake path clearly
- funnels users toward the quote form
- avoids leading with an immediate hard-sell `Get a Quote` hero CTA

## Source of truth and constraints
- Treat the repository's current architecture, naming conventions, styling patterns, and responsive behavior as the source of truth.
- Preserve existing layout and card conventions where possible.
- Favor small, reviewable diffs over broad rewrites.
- Reuse shared utilities, layout primitives, and component classes instead of introducing page-specific one-off systems unless clearly justified.
- Protect responsive behavior carefully. Do not introduce horizontal overflow, unstable spacing, layout jumps, or fragile breakpoint logic.
- Keep the page visually aligned with Musifer's existing clean, slightly whimsical / mythical identity.
- This is a first implementation pass, not the final content-polish pass.

## Inputs
- Use `docs\wireframes\services_page_wireframe.jsx` as the structural reference.
- The uploaded `docs\wireframes\services_page_wireframe.jsx` is a style precedent for how the wireframe was expressed, but the repo itself remains the real implementation authority.

## Expected page structure
Implement the Services page with this section order unless the repo's patterns require a very close equivalent:
1. Hero
2. Service categories grid
3. How work starts
4. Project fit / prep guidance
5. Primary quote CTA band
6. FAQ teasers
7. Final routing / footer CTA

## Content and UX intent
- The hero should orient the visitor and introduce Musifer's creative support scope.
- The first primary CTA should be closer to `Explore Services` or `How It Works`, not `Get a Quote`.
- The service grid should show four core lanes:
  - Music Projects
  - Visual + Design Support
  - Writing + Editorial
  - Web + Digital Presence
- The page should move to a real quote CTA reasonably quickly after the services and process/fit bridge.
- The quote CTA should feel earned, not abrupt.
- Adjacent paths like Contact / Blog / About can remain visible near the bottom without muddying the main conversion path.

## Implementation guidance
- Map the wireframe into the repo's real templates/components/partials/layout system.
- If a shared card, rail, stack, hero, CTA band, or FAQ pattern already exists, extend or reuse it.
- If new reusable variants are needed, implement them in the shared system rather than hardcoding for this page only.
- Keep markup churn low.
- Keep anchor flow sensible if useful, such as hero CTA to services and quote CTA to quote form.
- If the quote form already exists elsewhere, route cleanly to it rather than duplicating form logic.

## File-level expectations
Codex should identify and update the real files needed in the repo, but likely areas include:
- the Services page entry/template
- shared card/layout/CTA styling or component files if needed
- page-specific styling only if truly necessary and kept light
- any navigation or routing hooks required to expose the page correctly

## QA requirements
Perform and document QA for:
- narrow viewport
- medium viewport
- wide viewport

Specifically check:
- no horizontal overflow
- hero CTA layout stacks cleanly
- service cards remain balanced and readable
- quote CTA appears early enough to be useful without feeling pushy
- spacing remains stable across breakpoints
- no regression to existing shared card/layout behavior

## Documentation updates required
Update project documentation as part of the task. Include:
- goal of the Services page pass
- implementation approach
- reusable systems added or extended
- responsive QA notes
- any follow-up recommendations for content refinement or service-detail expansion

## Deliverable summary
Return with:
- concise change summary
- files changed
- QA results
- documentation updates completed
- any follow-up notes or known gaps
