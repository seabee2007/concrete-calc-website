# SEO Phase 2 — Static pre-rendering for marketing routes

## Problem

Phase 1 uses `react-helmet-async` in a Vite SPA. Metadata is correct in the browser after hydration, but **View Page Source** still serves generic `index.html` for every route.

## Outcome

Each public marketing URL should return HTML that already includes:

- Unique `<title>` and meta description
- Canonical link
- Open Graph / Twitter tags
- JSON-LD where applicable
- Primary H1 and above-the-fold content

## Scope

Prerender these routes only:

```
/
/pricing
/construction-project-management-software
/construction-estimating-software
/construction-scheduling-software
/contractor-proposal-software
/change-order-management-software
/construction-client-portal
/construction-daily-reports
/rfi-far-qc-construction-software
/terms
/privacy
/contact
```

## Out of scope

- App dashboard, login, signup, settings, billing, project pages
- Token/private pages
- Changing product app routes or OAuth behavior

## Implementation options

1. **Vite prerender plugin** — generate static HTML per route at build time; keep current React components.
2. **Separate static marketing build** — export HTML for marketing routes only.
3. **Dedicated marketing framework** — Astro/Next if marketing content grows substantially.

## Acceptance criteria

- View Page Source on `/pricing` shows `Pricing | Arden Project OS` in `<title>`.
- Canonical in raw HTML matches the requested URL.
- OG image URL returns 200.
- `npm run verify:seo -- --base-url https://ardenprojectos.com` passes without SPA limitation warnings.
- Private routes remain noindex/excluded.

## Verification

```bash
npm run build
npm run verify:seo -- --base-url https://ardenprojectos.com
```

Manual spot-check: View Page Source vs Inspect Element should match for title/description on priority pages.
