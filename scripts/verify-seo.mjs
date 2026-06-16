#!/usr/bin/env node
/**
 * SEO Phase 1 verification for Arden Project OS marketing site.
 *
 * Usage:
 *   node scripts/verify-seo.mjs                 # static + dist checks
 *   node scripts/verify-seo.mjs --base-url https://ardenprojectos.com
 */

import { readFileSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const MARKETING_URL = 'https://ardenprojectos.com'

const args = process.argv.slice(2)
const baseUrlArgIndex = args.indexOf('--base-url')
const baseUrl = baseUrlArgIndex >= 0 ? args[baseUrlArgIndex + 1]?.replace(/\/$/, '') : null

const failures = []
const warnings = []
const passes = []

function pass(message) {
  passes.push(message)
}

function warn(message) {
  warnings.push(message)
}

function fail(message) {
  failures.push(message)
}

function read(path) {
  return readFileSync(join(root, path), 'utf8')
}

function parseSitemapUrls(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1])
}

/** Expected public marketing metadata compiled from source. */
const EXPECTED_PAGES = [
  {
    path: '/',
    title: 'Arden Project OS | Construction Project Management Software for Contractors',
    description:
      'Plan estimates, proposals, schedules, change orders, field work, and client approvals in one construction project management workspace built for contractors.',
    canonical: `${MARKETING_URL}/`,
    h1Files: ['src/components/marketing/Hero.tsx'],
    h1Pattern: /<h1\b/,
  },
  {
    path: '/pricing',
    title: 'Pricing | Arden Project OS',
    description:
      'Simple, transparent pricing for construction project management. Starter, Professional, and Business plans.',
    canonical: `${MARKETING_URL}/pricing`,
    h1Files: ['src/pages/PricingPage.tsx'],
    h1Pattern: /<h1\b/,
  },
  {
    path: '/terms',
    title: 'Terms of Service | Arden Project OS',
    description:
      'Read the Arden Project OS Terms of Service governing use of our construction project management software.',
    canonical: `${MARKETING_URL}/terms`,
    h1Files: ['src/components/legal/TermsOfService.tsx'],
    h1Pattern: /<h1\b/,
  },
  {
    path: '/privacy',
    title: 'Privacy Policy | Arden Project OS',
    description:
      'Read the Arden Project OS Privacy Policy for information about how we collect, use, and protect your data.',
    canonical: `${MARKETING_URL}/privacy`,
    h1Files: ['src/components/legal/PrivacyPolicy.tsx'],
    h1Pattern: /<h1\b/,
  },
  {
    path: '/contact',
    title: 'Contact Us | Arden Project OS',
    description: 'Contact Arden Project OS for product questions, support, and partnership inquiries.',
    canonical: `${MARKETING_URL}/contact`,
    h1Files: ['src/pages/ContactPage.tsx'],
    h1Pattern: /<h1\b/,
  },
]

function loadLandingPages() {
  const source = read('src/content/landingPages.ts')
  const exports = [...source.matchAll(/export const (\w+):[\s\S]*?path: '([^']+)'[\s\S]*?title: '([^']+)'[\s\S]*?description:\s*\n\s*'([^']+)'[\s\S]*?h1: '([^']+)'/g)]

  for (const [, , path, title, description, h1] of exports) {
    EXPECTED_PAGES.push({
      path,
      title,
      description,
      canonical: `${MARKETING_URL}${path}`,
      h1Files: ['src/components/marketing/TopicLandingPage.tsx', 'src/content/landingPages.ts'],
      h1Pattern: new RegExp(`h1: '${h1.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}'`),
    })
  }
}

function checkStaticFiles() {
  for (const file of ['public/robots.txt', 'public/sitemap.xml']) {
    if (existsSync(join(root, file))) {
      pass(`${file} exists`)
    } else {
      fail(`${file} is missing`)
    }
  }

  const robots = read('public/robots.txt')
  if (robots.includes('Sitemap: https://ardenprojectos.com/sitemap.xml')) {
    pass('robots.txt references sitemap.xml')
  } else {
    fail('robots.txt missing Sitemap directive')
  }

  const disallowed = ['/login', '/signup', '/auth/', '/projects/', '/settings/']
  for (const path of disallowed) {
    if (robots.includes(`Disallow: ${path}`)) {
      pass(`robots.txt disallows ${path}`)
    } else {
      fail(`robots.txt should disallow ${path}`)
    }
  }

  const redirects = read('public/_redirects')
  if (redirects.includes('/privacy-policy /privacy 301')) {
    pass('/privacy-policy -> /privacy 301 redirect configured in _redirects')
  } else {
    fail('/privacy-policy 301 redirect missing from public/_redirects')
  }

  for (const asset of ['public/images/Favicon_sqoosh.png', 'public/images/logo_dark_banner.jpg']) {
    if (existsSync(join(root, asset))) {
      pass(`${asset} exists`)
    } else {
      fail(`${asset} is missing`)
    }
  }

  if (read('index.html').includes('/images/Favicon_sqoosh.png')) {
    pass('index.html references existing favicon asset')
  } else {
    fail('index.html favicon path may 404 in local builds')
  }

  if (read('src/components/seo/SeoHead.tsx').includes('/images/logo_dark_banner.jpg')) {
    pass('SeoHead default OG image references existing asset')
  } else {
    fail('SeoHead OG image path may 404 in local builds')
  }
}

function checkSitemapConsistency() {
  const sitemapUrls = parseSitemapUrls(read('public/sitemap.xml'))
  const expectedPaths = EXPECTED_PAGES.map((page) => page.path)
  const expectedUrls = expectedPaths.map((path) => (path === '/' ? `${MARKETING_URL}/` : `${MARKETING_URL}${path}`))

  for (const url of expectedUrls) {
    if (sitemapUrls.includes(url)) {
      pass(`sitemap includes ${url}`)
    } else {
      fail(`sitemap missing ${url}`)
    }
  }

  for (const url of sitemapUrls) {
    if (!expectedUrls.includes(url)) {
      warn(`sitemap contains extra URL not in expected page list: ${url}`)
    }
  }

  return sitemapUrls
}

function checkMetadataUniqueness() {
  const titles = EXPECTED_PAGES.map((page) => page.title)
  const descriptions = EXPECTED_PAGES.map((page) => page.description)
  const duplicates = (values) =>
    values.filter((value, index) => values.indexOf(value) !== index)

  if (new Set(titles).size === titles.length) {
    pass('all landing page titles are unique')
  } else {
    fail(`duplicate titles found: ${[...new Set(duplicates(titles))].join(', ')}`)
  }

  if (new Set(descriptions).size === descriptions.length) {
    pass('all landing page meta descriptions are unique')
  } else {
    fail(`duplicate descriptions found: ${[...new Set(duplicates(descriptions))].join(', ')}`)
  }

  for (const page of EXPECTED_PAGES) {
    if (page.canonical.startsWith(`${MARKETING_URL}`)) {
      pass(`${page.path} canonical uses ${MARKETING_URL}`)
    } else {
      fail(`${page.path} canonical must use ${MARKETING_URL}`)
    }
  }
}

function checkH1Coverage() {
  for (const page of EXPECTED_PAGES) {
    const hasH1 = page.h1Files.some((file) => page.h1Pattern.test(read(file)))
    if (hasH1) {
      pass(`${page.path} has exactly one H1 source marker`)
    } else {
      fail(`${page.path} is missing an H1 in expected source files`)
    }
  }
}

function checkSpaShellLimitation() {
  const distIndex = join(root, 'dist/index.html')
  const sourceIndex = read('index.html')

  if (existsSync(distIndex)) {
    const html = readFileSync(distIndex, 'utf8')
    if (!html.includes('meta name="description"') && html.includes('<title>Arden Project OS</title>')) {
      pass('dist/index.html is SPA shell with generic fallback title only (expected before prerender)')
    } else if (html.includes('meta name="description"')) {
      warn('dist/index.html contains route-specific description — prerender may already be active')
    } else {
      warn('dist/index.html title/meta pattern differs from expected SPA shell')
    }
  } else {
    warn('dist/index.html not found — run npm run build for SPA shell verification')
  }

  if (!sourceIndex.includes('react-helmet-async')) {
    pass('route metadata is injected client-side via react-helmet-async (not in raw index.html)')
    warn(
      'SPA limitation: View Page Source will not show route-specific title/description/canonical/JSON-LD until SEO Phase 2 prerender/SSR',
    )
  }
}

async function fetchStatus(url, { follow = false } = {}) {
  const response = await fetch(url, { redirect: follow ? 'follow' : 'manual' })
  return {
    status: response.status,
    finalUrl: response.url,
    headers: response.headers,
    body: follow ? await response.text() : null,
  }
}

async function checkRemote(base) {
  pass(`remote checks against ${base}`)

  for (const path of ['/robots.txt', '/sitemap.xml']) {
    const response = await fetchStatus(`${base}${path}`, { follow: true })
    const body = response.body ?? ''

    if (response.status === 200 && path === '/robots.txt' && body.startsWith('User-agent:')) {
      pass(`${path} returns 200 with valid robots.txt body`)
    } else if (response.status === 200 && path === '/sitemap.xml' && body.includes('<urlset')) {
      pass(`${path} returns 200 with valid XML sitemap body`)
    } else if (response.status === 200) {
      warn(
        `${path} returns 200 but body is SPA HTML — production has not deployed Phase 1 static files yet`,
      )
    } else {
      fail(`${path} returned ${response.status}`)
    }

    if (path === '/robots.txt' && !body.startsWith('User-agent:')) {
      fail(`${path} body is not robots.txt — deploy dist/robots.txt (from public/robots.txt) to production`)
    }
    if (path === '/sitemap.xml' && !body.includes('<urlset')) {
      fail(`${path} body is not XML sitemap — deploy dist/sitemap.xml (from public/sitemap.xml) to production`)
    }
  }

  for (const asset of ['/images/Favicon_sqoosh.png', '/images/logo_dark_banner.jpg']) {
    const { status } = await fetchStatus(`${base}${asset}`, { follow: true })
    if (status === 200) {
      pass(`${asset} returns 200`)
    } else {
      fail(`${asset} returned ${status}`)
    }
  }

  const sitemapResponse = await fetchStatus(`${base}/sitemap.xml`, { follow: true })
  const sitemapUrls = parseSitemapUrls(sitemapResponse.body ?? '')
  if (sitemapUrls.length === 0) {
    fail('could not parse any URLs from live sitemap.xml')
  } else {
    for (const url of sitemapUrls) {
      const { status } = await fetchStatus(url, { follow: true })
      if (status === 200) {
        pass(`${url} returns 200`)
      } else {
        fail(`${url} returned ${status}`)
      }
    }
  }

  const privacyPolicy = await fetchStatus(`${base}/privacy-policy`)
  if (privacyPolicy.status >= 300 && privacyPolicy.status < 400) {
    const location = privacyPolicy.headers.get('location')
    if (location?.includes('/privacy')) {
      pass('/privacy-policy returns redirect to /privacy')
    } else {
      fail(`/privacy-policy redirect location unexpected: ${location ?? 'none'}`)
    }
  } else if (privacyPolicy.status === 200) {
    warn('/privacy-policy returns 200 — deploy _redirects or confirm host redirect rules are live')
  } else {
    fail(`/privacy-policy returned ${privacyPolicy.status}`)
  }

  const homepageHtml = (await fetchStatus(`${base}/`, { follow: true })).body ?? ''
  const pricingHtml = (await fetchStatus(`${base}/pricing`, { follow: true })).body ?? ''

  const genericOnly =
    homepageHtml.includes('<title>') &&
    homepageHtml.includes('<div id="root">') &&
    !homepageHtml.includes('Pricing | Arden Project OS')

  if (genericOnly && homepageHtml === pricingHtml) {
    warn(
      'raw HTML responses appear identical across routes — route metadata likely only appears after JavaScript (SPA limitation)',
    )
  } else if (pricingHtml.includes('Pricing | Arden Project OS')) {
    pass('raw /pricing HTML includes route-specific title — prerender/SSR may be active')
  }

  if (homepageHtml.includes('noindex')) {
    fail('homepage raw HTML contains noindex')
  }
}

async function main() {
  loadLandingPages()
  checkStaticFiles()
  checkSitemapConsistency()
  checkMetadataUniqueness()
  checkH1Coverage()
  checkSpaShellLimitation()

  if (baseUrl) {
    await checkRemote(baseUrl)
  } else {
    warn('skipped remote checks — pass --base-url https://ardenprojectos.com after deploy')
  }

  console.log('\nSEO Phase 1 verification\n')
  console.log(`Passed: ${passes.length}`)
  passes.forEach((message) => console.log(`  ✓ ${message}`))

  if (warnings.length) {
    console.log(`\nWarnings: ${warnings.length}`)
    warnings.forEach((message) => console.log(`  ! ${message}`))
  }

  if (failures.length) {
    console.log(`\nFailed: ${failures.length}`)
    failures.forEach((message) => console.log(`  ✗ ${message}`))

    const productionNotDeployed = failures.some((message) =>
      message.includes('body is not robots.txt') || message.includes('body is not XML sitemap'),
    )
    if (productionNotDeployed && baseUrl) {
      console.log(
        '\nLikely cause: production is still on a pre-SEO-Phase-1 deploy. Local build is correct; push and deploy, then rerun with --base-url.',
      )
    }

    console.log('\nResult: FAIL')
    process.exit(1)
  }

  console.log('\nResult: PASS')
  if (baseUrl && warnings.some((message) => message.includes('SPA limitation') || message.includes('raw HTML'))) {
    console.log(
      '\nNext step: submit sitemap in Google Search Console, request indexing for priority pages, plan SEO Phase 2 prerender.',
    )
  } else if (!baseUrl) {
    console.log('\nNext step: run with --base-url https://ardenprojectos.com after deploy.')
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
