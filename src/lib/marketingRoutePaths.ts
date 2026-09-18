/**
 * Public marketing routes that are prerendered to static HTML at build time
 * (docs/SEO-PHASE2-PRERENDER.md). `/privacy-policy` is deliberately absent: it
 * is a 301 in public/_redirects, and a static file at that path would shadow
 * the redirect on Netlify.
 */
export const MARKETING_ROUTE_PATHS: readonly string[] = [
  '/',
  '/hub',
  '/pricing',
  '/terms',
  '/privacy',
  '/contact',
  '/construction-project-management-software',
  '/construction-estimating-software',
  '/construction-scheduling-software',
  '/contractor-proposal-software',
  '/change-order-management-software',
  '/construction-client-portal',
  '/construction-daily-reports',
  '/rfi-far-qc-construction-software',
]

/** `/pricing/` and `/pricing` are the same page; Netlify serves both from one file. */
export function normalizePathname(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith('/')) {
    return pathname.replace(/\/+$/, '') || '/'
  }
  return pathname
}
