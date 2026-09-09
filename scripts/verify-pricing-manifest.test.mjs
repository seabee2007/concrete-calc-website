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

function run(args = [], extraEnv = {}) {
  return spawnSync(process.execPath, [script, ...args], {
    encoding: 'utf8',
    env: { ...process.env, ...extraEnv },
  })
}

test('accepted v2 website manifest validates in schema-only mode', () => {
  const result = run(['--schema-only'])
  assert.equal(result.status, 0)
  assert.match(result.stdout, /CROSS_REPO_PARITY_NOT_CHECKED/)
})

test('explicit canonical match succeeds', () => {
  const result = run(['--canonical', websiteManifest])
  assert.equal(result.status, 0)
  assert.match(result.stdout, /match canonical input/)
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

test('canonical drift fails', () => {
  const dir = mkdtempSync(join(tmpdir(), 'pricing-drift-'))
  const path = join(dir, 'pricing-manifest.json')
  const parsed = JSON.parse(readFileSync(websiteManifest, 'utf8'))
  parsed.products[0].plans[0].monthlyPriceMinor = 5900
  writeFileSync(path, JSON.stringify(parsed))
  const result = run(['--canonical', path])
  assert.notEqual(result.status, 0)
  assert.match(result.stderr, /Canonical drift/)
})
