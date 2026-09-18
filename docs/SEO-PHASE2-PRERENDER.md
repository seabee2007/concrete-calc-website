# SEO Phase 2 — Static pre-rendering for marketing routes

## Status: implemented (option 1, build-time prerender)

`npm run build` now runs `tsc -b && vite build && node scripts/prerender.mjs`. The prerender step:

1. builds `src/entry-server.tsx` for Node with Vite's SSR mode (temporary `dist-server/`, deleted afterwards);
2. renders every route in `src/lib/marketingRoutePaths.ts` with `renderToString`;
3. moves the `<title>`, `<meta>` and `<link>` tags that React 19 hoists to the front of the output into `<head>`, drops the template's fallback `<title>Project OS</title>`, and puts the page markup inside `<div id="root">` (JSON-LD `<script>` tags stay in the body);
4. writes `dist/index.html` for `/` and `dist/<route>/index.html` for every other route, failing the build if a route has no title or H1, or references an asset the client build did not emit.

`src/main.tsx` hydrates when `#root` already has children and falls back to `createRoot` for the dev server. `App` takes an `initialPathname` so the server snapshot of `useSyncExternalStore` matches on both sides; trailing slashes normalize to the same route.

`public/_redirects` no longer has the `/* /index.html 200` catch-all: every public route is a real file, unknown paths get `public/404.html` with status 404, and `/.well-known/security.txt` is served as text. `/privacy-policy` is not prerendered on purpose so its 301 keeps working.

Verification: `npm run verify:seo` checks each prerendered file for the expected title, description, canonical and H1; `src/lib/prerender.test.ts` renders every route in Vitest. Local preview: `npm run preview`, then open `/pricing/` (Vite's preview server maps the trailing-slash form to `pricing/index.html`; Netlify serves both forms).

Why it matters beyond search: web-content filters and browser-isolation services classify a site by what a crawler can read without JavaScript. Before this change every marketing URL served a 909-byte shell with zero readable words, which left `ardenprojectos.com` uncategorized in the feeds those services use.

## Problem (original)

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
