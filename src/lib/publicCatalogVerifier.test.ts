/// <reference types="node" />

import { appendFileSync, copyFileSync, mkdirSync, mkdtempSync, rmSync, unlinkSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import catalog from '../../shared/public-arden-catalog-v1.json'

const repo = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const temporaryPrefix = join(tmpdir(), 'arden-website-catalog-')
let fixture: string

beforeEach(() => {
  fixture = mkdtempSync(temporaryPrefix)
  for (const path of ['scripts', 'shared', 'public/images/arden-products']) mkdirSync(join(fixture, path), { recursive: true })
  for (const path of ['scripts/verify-public-catalog.mjs', 'shared/public-arden-catalog-v1.json']) copyFileSync(join(repo, path), join(fixture, path))
  for (const artwork of catalog.artwork) {
    const path = `public/images/arden-products/${artwork.fileName}`
    copyFileSync(join(repo, path), join(fixture, path))
  }
})

afterEach(() => {
  const target = resolve(fixture)
  if (!target.startsWith(temporaryPrefix) || target === resolve(tmpdir())) throw new Error('Unexpected catalog fixture cleanup path')
  rmSync(target, { recursive: true })
})

function verifyFixture() {
  const result = spawnSync(process.execPath, [join(fixture, 'scripts/verify-public-catalog.mjs')], {
    cwd: fixture,
    env: { ...process.env, ARDEN_APP_REPO: repo },
    encoding: 'utf8',
  })
  return { status: result.status, output: `${result.stdout}\n${result.stderr}` }
}

describe('public catalog asset verification', () => {
  it('verifies actual files and exact catalog parity including approved Signal artwork', () => {
    const result = verifyFixture()
    expect(result.output).toContain('exact app parity:')
    expect(result.output).toContain('noncatalog product arden_signal is excluded')
    expect(result.status).toBe(0)
  })

  it('rejects a corrupt asset even when its descriptor and app parity remain unchanged', () => {
    appendFileSync(join(fixture, 'public/images/arden-products/crm.webp'), 'corrupt fixture bytes')
    const result = verifyFixture()
    expect(result.output).toContain('crm.webp hash mismatch')
    expect(result.output).toContain('exact app parity:')
    expect(result.status).toBe(1)
  })

  it('rejects a missing public asset file', () => {
    unlinkSync(join(fixture, 'public/images/arden-products/project_os.webp'))
    const result = verifyFixture()
    expect(result.output).toContain('missing artwork file project_os.webp')
    expect(result.status).toBe(1)
  })
})
