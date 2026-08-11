#!/usr/bin/env node

import { createHash } from 'node:crypto'
import { existsSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const artifactPath = join(root, 'shared/public-arden-catalog-v1.json')
const failures = []
const passes = []

function pass(message) {
  passes.push(message)
}

function fail(message) {
  failures.push(message)
}

function sha256(value) {
  return `sha256:${createHash('sha256').update(value).digest('hex')}`
}

function canonicalJson(value) {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(',')}]`
  if (value !== null && typeof value === 'object') {
    return `{${Object.entries(value)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, nested]) => `${JSON.stringify(key)}:${canonicalJson(nested)}`)
      .join(',')}}`
  }
  return JSON.stringify(value)
}

function exactKeys(value, expected, label) {
  const actual = Object.keys(value).sort()
  const sortedExpected = [...expected].sort()
  if (JSON.stringify(actual) === JSON.stringify(sortedExpected)) {
    pass(`${label} uses the exact V1 public field set`)
  } else {
    fail(`${label} fields differ: expected ${sortedExpected.join(', ')}, received ${actual.join(', ')}`)
  }
}

function strictlyOrdered(entries, label) {
  const ordered = entries.every((entry, index) => index === 0 || entry.sortOrder > entries[index - 1].sortOrder)
  if (ordered) pass(`${label} use deterministic sort order`)
  else fail(`${label} are not strictly ordered by sortOrder`)
}

if (!existsSync(artifactPath)) {
  throw new Error(`Missing catalog artifact: ${artifactPath}`)
}

const artifactText = readFileSync(artifactPath, 'utf8')
const artifact = JSON.parse(artifactText)

exactKeys(artifact, ['schemaVersion', 'contentDigest', 'products', 'integrations', 'artwork'], 'artifact')
if (artifact.schemaVersion === 'public-arden-catalog.v1') pass('schema version is public-arden-catalog.v1')
else fail(`unsupported schema version ${artifact.schemaVersion}`)

const { contentDigest, ...digestContent } = artifact
const expectedDigest = sha256(canonicalJson(digestContent))
if (contentDigest === expectedDigest) pass('content digest matches canonical catalog content')
else fail(`content digest mismatch: expected ${expectedDigest}, received ${contentDigest}`)

const productKeys = [
  'productId',
  'slug',
  'displayName',
  'shortName',
  'summary',
  'description',
  'audience',
  'capabilities',
  'iconKey',
  'releaseStatus',
  'interestCaptureAllowed',
  'sortOrder',
]
const integrationKeys = [
  'integrationId',
  'displayName',
  'description',
  'iconKey',
  'availability',
  'capabilities',
  'supportedProductIds',
  'sortOrder',
]
const capabilityKeys = ['capabilityId', 'displayName', 'summary', 'supportState']
const artworkKeys = ['iconKey', 'fileName', 'sha256']

artifact.products.forEach((product, index) => exactKeys(product, productKeys, `product ${index}`))
artifact.integrations.forEach((integration, index) => {
  exactKeys(integration, integrationKeys, `integration ${index}`)
  integration.capabilities.forEach((capability, capabilityIndex) =>
    exactKeys(capability, capabilityKeys, `integration ${index} capability ${capabilityIndex}`),
  )
})
artifact.artwork.forEach((artwork, index) => exactKeys(artwork, artworkKeys, `artwork ${index}`))

strictlyOrdered(artifact.products, 'products')
strictlyOrdered(artifact.integrations, 'integrations')

const productIds = artifact.products.map(({ productId }) => productId)
const integrationIds = artifact.integrations.map(({ integrationId }) => integrationId)
for (const hiddenId of ['hub', 'forms', 'schedule']) {
  if (!productIds.includes(hiddenId)) pass(`noncatalog product ${hiddenId} is excluded`)
  else fail(`noncatalog product ${hiddenId} leaked into the artifact`)
}
for (const internalId of ['stripe_connect', 'email_delivery']) {
  if (!integrationIds.includes(internalId)) pass(`internal integration ${internalId} is excluded`)
  else fail(`internal integration ${internalId} leaked into the artifact`)
}

const serialized = JSON.stringify(artifact)
for (const forbidden of [
  'launchTarget',
  'billingAvailability',
  'entitlement',
  'connectionState',
  'connectionMode',
  'requiredAccountRole',
  'documentationTarget',
  'releaseAuthority',
  'internal_only',
]) {
  if (!serialized.includes(forbidden)) pass(`artifact excludes ${forbidden}`)
  else fail(`artifact contains forbidden field or state ${forbidden}`)
}

const artworkIconKeys = artifact.artwork.map(({ iconKey }) => iconKey)
const expectedArtworkIconKeys = artifact.products
  .filter(({ productId }) => productId !== 'project_os')
  .map(({ iconKey }) => iconKey)
if (JSON.stringify(artworkIconKeys) === JSON.stringify(expectedArtworkIconKeys)) {
  pass('artwork covers every illustrated public product in canonical order')
} else {
  fail('artwork coverage does not match illustrated public products')
}

for (const artwork of artifact.artwork) {
  const imagePath = join(root, 'public/images/arden-products', artwork.fileName)
  if (!existsSync(imagePath)) {
    fail(`missing artwork file ${artwork.fileName}`)
    continue
  }
  const actualHash = sha256(readFileSync(imagePath))
  if (actualHash === artwork.sha256) pass(`${artwork.fileName} hash matches the app artifact`)
  else fail(`${artwork.fileName} hash mismatch: expected ${artwork.sha256}, received ${actualHash}`)
}

const repoCandidates = [
  process.env.ARDEN_APP_REPO,
  resolve(root, '..', 'arden-authenticated-hub-split'),
  resolve(root, '..', 'calc'),
  resolve(root, '..', '..'),
].filter(Boolean)
const parityArtifacts = [...new Set(repoCandidates)]
  .map((candidate) => join(candidate, 'shared/public-arden-catalog-v1.json'))
  .filter((candidate) => candidate !== artifactPath && existsSync(candidate))

if (parityArtifacts.length === 0) {
  pass('app repository parity skipped because no sibling app artifact is available')
} else {
  for (const parityPath of parityArtifacts) {
    if (readFileSync(parityPath, 'utf8') === artifactText) pass(`exact app parity: ${parityPath}`)
    else fail(`catalog differs from app artifact: ${parityPath}`)
  }
}

console.log('\nPublic Arden catalog verification\n')
console.log(`Passed: ${passes.length}`)
passes.forEach((message) => console.log(`  ✓ ${message}`))

if (failures.length > 0) {
  console.log(`\nFailed: ${failures.length}`)
  failures.forEach((message) => console.log(`  ✗ ${message}`))
  console.log('\nResult: FAIL')
  process.exit(1)
}

console.log('\nResult: PASS')
