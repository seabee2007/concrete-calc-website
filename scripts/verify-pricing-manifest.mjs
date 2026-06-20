import { readFileSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const appManifestCandidates = [
  process.env.PRICING_APP_MANIFEST,
  'c:/dev/calc/shared/pricing-manifest.json',
  join(root, '..', '..', '..', '..', '..', 'dev', 'calc', 'shared', 'pricing-manifest.json'),
].filter(Boolean)

const appManifestPath = appManifestCandidates.find((candidate) => existsSync(candidate))

function loadManifest(path) {
  return JSON.parse(readFileSync(path, 'utf8'))
}

const marketingManifest = loadManifest(join(root, 'shared', 'pricing-manifest.json'))

if (existsSync(appManifestPath)) {
  const appManifest = loadManifest(appManifestPath)
  if (JSON.stringify(marketingManifest) !== JSON.stringify(appManifest)) {
    console.error('Pricing manifest drift detected between marketing and app repos.')
    process.exit(1)
  }
  console.log('Pricing manifest matches app repo.')
} else {
  console.log('App manifest not found locally — skipped cross-repo drift check.')
}

console.log('Marketing pricing manifest OK.')
