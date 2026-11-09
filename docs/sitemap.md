# Musifer Sitemap (Simplified Direction)

Status
- Primary: active (Phase 2 direction)
- Secondary: implementation target
- Updated: 2026-11-09
- Note: This is the new simplified sitemap for the overhaul. The previous comprehensive 16-route structure is archived in `feature/site-structure-2026-11-baseline` branch for historical reference.

## Overview

Simplified information architecture focused on lead generation and credibility building.

**Routes:** 4 primary pages + 1 legal

## Top Level
- Home (`/`)
- About (`/about/`)
- Contact (`/contact/`)
- Privacy Policy (`/privacy-policy/`)

## Home (`/`)
**Purpose:** Immediate impression, value proposition, social proof, lead capture

**Sections:**
- Hero (headline, visual, value statement)
- Why Musifer (2-3 key differentiators)
- Services Overview (3-5 services with descriptions; each links to About for details)
- Client Testimonials (3-4 carousel or static cards with client names/photos/quotes)
- CTA Section ("Let's Work Together" button → Contact)
- Footer (Contact link, social links, copyright)

## About (`/about/`)
**Purpose:** Establish credibility, detail services, showcase client success

**Sections:**
- Our Mission (mission statement, visual)
- What We Offer (service categories with full descriptions; replaces previous `/services/` hierarchy)
- Client Success Stories (3-4 testimonials with metrics and outcomes)
- Team / Experience (founder/key contact bios, years in business, project highlights)
- Call to Action ("Start Your Project" → Contact)

## Contact (`/contact/`)
**Purpose:** Lead generation and inquiry routing

**Elements:**
- Contact form (Name, Email, Phone, Service Interest, Message)
- Optional: Calendly embed or meeting scheduling link
- Form submission flow: email notification to team + auto-reply to inquirer
- No subpages (no Work With Us, Locations, Community)

## Privacy Policy (`/privacy-policy/`)
**Purpose:** Legal compliance

**Note:** Finalized privacy policy from planning. Retained as required legal disclosure.

---

## Deferred to Phase 2

The following routes and sections are deferred and not part of the current MVP:

- **Blog** — Content strategy and authoring workflow TBD
  - Previous plan included: Guides, Articles, Case Studies
  - Can be re-enabled once Home/About/Contact foundation is solid

- **Services Subpages** — Consolidated into About
  - Previous plan included: `/services/production/`, `/services/legal/`, `/services/rates-quote/`
  - Service details now on About page; lead generation via Contact form

- **About Subpages** — Consolidated into single About page
  - Previous plan included: `/about/team/`, `/about/mission/`, `/about/history/`, `/about/portfolio/`, `/about/client-list/`, `/about/faq/`
  - All content consolidated into single About page

- **Contact Subpages** — Consolidated into single Contact form
  - Previous plan included: `/contact/work-with-us/`, `/contact/locations/`, `/contact/community/`
  - All inquiries funnel through single Contact form

---

## Migration Notes

- **CMS Content:** Update schema to remove blog, portfolio, and nested page collections (Phase 1). Add testimonials collection if not present.
- **Navigation:** Simplify header/footer to 4-5 links (no breadcrumb hierarchies)
- **Links:** Audit all internal links; ensure no 404s to removed routes
- **Redirects:** Consider 301 redirects from old `/services/` and `/about/` subpages to new consolidated pages (not MVP, but good for SEO)
- **Previous Structure:** Archived for reference in `feature/site-structure-2026-11-baseline` branch
