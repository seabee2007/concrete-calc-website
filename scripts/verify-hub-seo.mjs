#!/usr/bin/env node

import { existsSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const failures = []

function source(path) {
  return readFileSync(join(root, path), 'utf8')
}

function requireSource(path, pattern, message) {
  if (!pattern.test(source(path))) failures.push(message)
}

requireSource('src/App.tsx', /'\/hub': PublicHubPage/, 'App route map is missing /hub')
requireSource('public/_redirects', /^\/apps \/hub 301$/m, '/apps -> /hub permanent redirect is missing')
requireSource(
  'src/pages/PublicHubPage.tsx',
  /title="Product Hub \| Construction Software Catalog"/,
  '/hub title metadata is missing or changed',
)
requireSource(
  'src/pages/PublicHubPage.tsx',
  /canonical=\{`\$\{MARKETING_URL\}\/hub`\}/,
  '/hub canonical metadata is missing or changed',
)
requireSource('src/pages/PublicHubPage.tsx', /<h1\b/, '/hub must contain one H1 source marker')
requireSource('src/components/marketing/Header.tsx', /href: '\/hub'/, 'primary navigation is missing /hub')

const sitemap = source('public/sitemap.xml')
if (!sitemap.includes('<loc>https://ardenprojectos.com/hub</loc>')) {
  failures.push('sitemap.xml is missing https://ardenprojectos.com/hub')
}
if (sitemap.includes('<loc>https://ardenprojectos.com/apps</loc>')) {
  failures.push('sitemap.xml must not list the redirected /apps route')
}

const capabilityAssets = [
  'estimate-builder', 'proposal-generator', 'project-planner', 'schedule-gantt',
  'logic-network', 'change-orders', 'contracts', 'daily-reports',
  'concrete-planner', 'pdf-export', 'client-database', 'cost-tracking',
].map((name) => `public/images/capabilities/${name}.png`)

for (const asset of ['shared/public-arden-catalog-v1.json', ...capabilityAssets]) {
  if (!existsSync(join(root, asset))) failures.push(`${asset} is missing`)
}

if (failures.length > 0) {
  console.log('\n/hub SEO verification\n')
  failures.forEach((message) => console.log(`  ✗ ${message}`))
  console.log('\nResult: FAIL')
  process.exit(1)
}

console.log('/hub SEO verification: PASS')
