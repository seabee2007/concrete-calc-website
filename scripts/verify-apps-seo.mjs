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

requireSource('src/App.tsx', /'\/apps': AppsPage/, 'App route map is missing /apps')
requireSource(
  'src/pages/AppsPage.tsx',
  /title="Arden Systems Apps \| Construction Software Catalog"/,
  '/apps title metadata is missing or changed',
)
requireSource(
  'src/pages/AppsPage.tsx',
  /canonical=\{`\$\{MARKETING_URL\}\/apps`\}/,
  '/apps canonical metadata is missing or changed',
)
requireSource('src/pages/AppsPage.tsx', /<h1\b/, '/apps must contain one H1 source marker')
requireSource('src/components/marketing/Header.tsx', /href: '\/apps'/, 'primary navigation is missing /apps')

const sitemap = source('public/sitemap.xml')
if (!sitemap.includes('<loc>https://ardenprojectos.com/apps</loc>')) {
  failures.push('sitemap.xml is missing https://ardenprojectos.com/apps')
}

for (const asset of [
  'public/images/arden-hub-hero.webp',
  'shared/public-arden-catalog-v1.json',
]) {
  if (!existsSync(join(root, asset))) failures.push(`${asset} is missing`)
}

if (failures.length > 0) {
  console.log('\n/apps SEO verification\n')
  failures.forEach((message) => console.log(`  ✗ ${message}`))
  console.log('\nResult: FAIL')
  process.exit(1)
}

console.log('/apps SEO verification: PASS')
