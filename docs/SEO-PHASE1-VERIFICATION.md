# SEO Phase 1 — Verification and Hardening

Marketing site: React/Vite SPA at `https://ardenprojectos.com`  
App (private): `https://app.ardenprojectos.com`

## Run verification locally

```bash
npm run build
npm run verify:seo
npm run verify:seo -- --base-url https://ardenprojectos.com
```

The script checks:

1. `public/robots.txt` and `public/sitemap.xml` exist; robots references sitemap
2. Private app paths are disallowed in robots.txt
3. `/privacy-policy` → `/privacy` 301 is configured in `public/_redirects`
4. Favicon and default Open Graph image assets exist and are referenced correctly
5. Every sitemap URL has unique title/description/canonical definitions in source
6. Each public page has one H1 in source
7. Built `dist/index.html` is a generic SPA shell (expected before Phase 2)
8. With `--base-url`, live HTTP status checks for robots, sitemap, assets, and sitemap URLs

## SPA limitation (important)

This site uses `react-helmet-async`. Route-specific `<title>`, meta description, canonical, Open Graph tags, and JSON-LD are injected **after JavaScript runs**.

### What to test after deploy

On each public URL, compare:

1. **View Page Source** (initial HTML response)
2. **Inspect Element** after the page loads (post-JavaScript DOM)

Expected today:

| Check | View Page Source | After JS loads |
| --- | --- | --- |
| Route-specific `<title>` | Generic fallback only | Unique per page |
| Meta description | Absent or generic | Unique per page |
| Canonical | Absent | Matches current route |
| JSON-LD | Absent | Present on key pages |
| Visible H1/content | Minimal shell | Full marketing content |

Google generally renders JavaScript, so Phase 1 still helps Googlebot. Raw source and some social/link crawlers may not see route-specific metadata immediately.

**Do not block deploy on this.** Document the limitation and plan Phase 2.

## Phase 1 public routes (13 URLs in sitemap)

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

## Private / non-index routes

Excluded via `robots.txt` and app-domain redirects:

- `/login`, `/signup`, `/auth/*` → app domain
- `/projects/*`, `/settings/*`, `/calculator`, `/planner/*`, `/invite/*`, etc.

Do not add these to the marketing sitemap.

## Post-deploy checklist

1. Deploy marketing site with SEO Phase 1 changes.
2. Open `https://ardenprojectos.com/robots.txt` (expect 200).
3. Open `https://ardenprojectos.com/sitemap.xml` (expect 200).
4. Confirm every sitemap URL returns 200 and does not redirect unintentionally.
5. Confirm `/privacy-policy` returns **301** to `/privacy`.
6. On each landing page, confirm after JS loads:
   - one H1
   - unique title and meta description
   - canonical uses `https://ardenprojectos.com` and matches the route
   - internal links and primary CTA present
7. Confirm favicon and OG image URLs return 200:
   - `/images/Favicon_sqoosh.png`
   - `/images/logo_dark_banner.jpg`
8. Submit sitemap in Google Search Console.
9. Request indexing for priority pages:
   - `/`
   - `/pricing`
   - `/construction-project-management-software`
   - `/construction-estimating-software`
   - `/construction-scheduling-software`
10. Wait 2–4 weeks; review Search Console → Performance → Queries.

## SEO Phase 2 — static pre-rendering (recommended)

**Goal:** Put title, meta, canonical, JSON-LD, and primary content in the **initial HTML response** for public marketing routes.

**Priority routes:** same 13 URLs listed above.

**Possible approaches:**

- Vite prerender plugin (e.g. `vite-plugin-ssr` / prerender SPA routes at build time)
- Separate static marketing build artifact
- Astro or Next-style marketing site later if scope grows

**Ticket summary:** Add build-time prerender for public marketing routes so crawlers and social previews receive route-specific metadata without executing JavaScript.

Ranking for competitive keywords still requires content depth, authority, and backlinks — not metadata alone.
