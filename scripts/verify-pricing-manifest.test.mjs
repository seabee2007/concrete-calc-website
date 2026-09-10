import { spawnSync } from 'node:child_process'
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import test from 'node:test'
import assert from 'node:assert/strict'

const root = join(fileURLToPath(new URL('.', import.meta.url)), '..')
const script = join(root, 'scripts/verify-pricing-manifest.mjs')
const websiteManifest = join(root, 'shared/pricing-manifest.json')

function isolatedEnv(extra = {}) {
  const env = { ...process.env, ...extra }
  delete env.PRICING_APP_MANIFEST
  delete env.PRICING_PARITY_MODE
  return env
}

function run(args = [], extraEnv = {}) {
  return spawnSync(process.execPath, ['--experimental-strip-types', script, ...args], {
    encoding: 'utf8',
    env: isolatedEnv(extraEnv),
  })
}

function writeIndependentCanonical(mutate) {
  const dir = mkdtempSync(join(tmpdir(), 'pricing-independent-'))
  const path = join(dir, 'pricing-manifest.json')
  const parsed = JSON.parse(readFileSync(websiteManifest, 'utf8'))
  mutate(parsed)
  writeFileSync(path, JSON.stringify(parsed))
  return path
}

test('no-argument execution does not claim cross-repo parity', () => {
  const result = run([])
  assert.equal(result.status, 0)
  assert.match(result.stdout, /CROSS_REPO_PARITY_NOT_CHECKED/)
})

test('accepted v2 website manifest validates in schema-only mode', () => {
  const result = run(['--schema-only'])
  assert.equal(result.status, 0)
  assert.match(result.stdout, /CROSS_REPO_PARITY_NOT_CHECKED/)
})

test('caller PRICING_PARITY_MODE does not leak into isolated schema-only assertion', () => {
  const result = run(['--schema-only'], { PRICING_APP_MANIFEST: websiteManifest })
  assert.equal(result.status, 0)
  assert.match(result.stdout, /CROSS_REPO_PARITY_NOT_CHECKED/)
})

test('explicit website-copy path matches but discloses it is not independent provenance', () => {
  const result = run(['--canonical', websiteManifest])
  assert.equal(result.status, 0)
  assert.match(result.stdout, /match canonical input/)
  assert.match(result.stdout, /CANONICAL_INPUT_IS_WEBSITE_COPY/)
})

test('missing explicit canonical path fails', () => {
  const result = run(['--canonical', join(tmpdir(), 'missing-pricing-manifest.json')])
  assert.notEqual(result.status, 0)
  assert.match(result.stderr, /not found/)
})

test('invalid explicit canonical JSON fails', () => {
  const dir = mkdtempSync(join(tmpdir(), 'pricing-invalid-'))
  const path = join(dir, 'pricing-manifest.json')
  writeFileSync(path, '{not-json')
  const result = run(['--canonical', path])
  assert.notEqual(result.status, 0)
  assert.match(result.stderr, /valid JSON/)
})

test('unsupported schema on explicit input fails', () => {
  const dir = mkdtempSync(join(tmpdir(), 'pricing-schema-'))
  const path = join(dir, 'pricing-manifest.json')
  writeFileSync(path, JSON.stringify({ schemaVersion: 1, plans: [] }))
  const result = run(['--canonical', path])
  assert.notEqual(result.status, 0)
  assert.match(result.stderr, /unsupported schemaVersion/)
})

test('canonical price drift fails', () => {
  const dir = mkdtempSync(join(tmpdir(), 'pricing-drift-'))
  const path = join(dir, 'pricing-manifest.json')
  const parsed = JSON.parse(readFileSync(websiteManifest, 'utf8'))
  parsed.products[0].plans[0].monthlyPriceMinor = 5900
  writeFileSync(path, JSON.stringify(parsed))
  const result = run(['--canonical', path])
  assert.notEqual(result.status, 0)
  assert.match(result.stderr, /Canonical drift/)
})

test('canonical name drift fails', () => {
  const dir = mkdtempSync(join(tmpdir(), 'pricing-name-'))
  const path = join(dir, 'pricing-manifest.json')
  const parsed = JSON.parse(readFileSync(websiteManifest, 'utf8'))
  parsed.products[0].plans[0].name = 'Starter Plus'
  writeFileSync(path, JSON.stringify(parsed))
  const result = run(['--canonical', path])
  assert.notEqual(result.status, 0)
  assert.match(result.stderr, /Canonical drift/)
})

test('canonical lookup-key and grant-rank drift fail', () => {
  const dir = mkdtempSync(join(tmpdir(), 'pricing-keys-'))
  const lookupPath = join(dir, 'lookup.json')
  const rankPath = join(dir, 'rank.json')
  const parsed = JSON.parse(readFileSync(websiteManifest, 'utf8'))
  const lookup = structuredClone(parsed)
  lookup.products[0].plans[0].stripeLookupKeys.year = 'changed_annual'
  writeFileSync(lookupPath, JSON.stringify(lookup))
  const rank = structuredClone(parsed)
  rank.products[0].plans[2].grants[0].rank = 99
  writeFileSync(rankPath, JSON.stringify(rank))
  const lookupResult = run(['--canonical', lookupPath])
  const rankResult = run(['--canonical', rankPath])
  assert.notEqual(lookupResult.status, 0)
  assert.notEqual(rankResult.status, 0)
  assert.match(lookupResult.stderr, /Canonical drift/)
  assert.match(rankResult.stderr, /Canonical drift/)
})

test('schema-only fails closed when Project OS is not sale-enabled', () => {
  const dir = mkdtempSync(join(tmpdir(), 'pricing-sale-'))
  const path = join(dir, 'pricing-manifest.json')
  const parsed = JSON.parse(readFileSync(websiteManifest, 'utf8'))
  parsed.products[0].commercialState = 'decision_pending'
  parsed.products[0].billingAvailability = 'not_for_sale'
  writeFileSync(path, JSON.stringify(parsed))
  const result = spawnSync(process.execPath, ['--experimental-strip-types', script, '--canonical', path], {
    encoding: 'utf8',
    env: isolatedEnv(),
  })
  assert.notEqual(result.status, 0)
  assert.match(result.stderr, /not sale-enabled|Canonical drift|failed Project OS/)
})

test('independent canonical extra grant is rejected instead of matching the first grant only', () => {
  const path = writeIndependentCanonical((parsed) => {
    parsed.products[0].plans[0].grants.push({
      productId: 'project_os',
      planId: 'starter',
      rank: 99,
    })
  })
  const result = run(['--canonical', path])
  assert.notEqual(result.status, 0)
  assert.match(result.stderr, /exactly one Project OS grant|failed Project OS/)
  assert.doesNotMatch(result.stdout, /match canonical input/)
})

test('independent canonical malformed later grant is rejected', () => {
  const path = writeIndependentCanonical((parsed) => {
    parsed.products[0].plans[1].grants.push({ productId: 'project_os' })
  })
  const result = run(['--canonical', path])
  assert.notEqual(result.status, 0)
  assert.match(result.stderr, /must be a non-empty string|failed Project OS/)
})

test('independent canonical non-boolean recommended is rejected', () => {
  const path = writeIndependentCanonical((parsed) => {
    parsed.products[0].plans[0].recommended = 'false'
  })
  const result = run(['--canonical', path])
  assert.notEqual(result.status, 0)
  assert.match(result.stderr, /recommended must be a boolean|failed Project OS/)
})
