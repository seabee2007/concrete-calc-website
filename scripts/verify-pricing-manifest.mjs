#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  parseProjectOsCommercialTerms,
  projectOsCommercialFingerprint,
} from '../src/lib/projectOsPricingContract.ts'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const websiteManifestPath = join(root, 'shared', 'pricing-manifest.json')

function fail(message, code = 1) {
  console.error(message)
  process.exit(code)
}

function loadJson(path, label) {
  if (!existsSync(path)) throw new Error(`${label} not found: ${path}`)
  try {
    return JSON.parse(readFileSync(path, 'utf8'))
  } catch (error) {
    throw new Error(`${label} is not valid JSON: ${error instanceof Error ? error.message : String(error)}`)
  }
}

function parseOrFail(raw, label) {
  try {
    return parseProjectOsCommercialTerms(raw)
  } catch (error) {
    fail(`${label} failed Project OS commercial validation: ${error instanceof Error ? error.message : String(error)}`)
  }
}

const args = process.argv.slice(2)
const schemaOnly = args.includes('--schema-only') || process.env.PRICING_PARITY_MODE === 'schema'
const canonicalFlag = args.findIndex((arg) => arg === '--canonical')
const canonicalFromArgs = canonicalFlag >= 0 ? args[canonicalFlag + 1] : undefined
const canonicalPath = canonicalFromArgs || process.env.PRICING_APP_MANIFEST

if (canonicalFlag >= 0 && !canonicalFromArgs) {
  fail('verify:pricing --canonical requires a path to the calc shared/pricing-manifest.json')
}

let websiteRaw
try {
  websiteRaw = loadJson(websiteManifestPath, 'website pricing manifest')
} catch (error) {
  fail(error.message)
}

const websiteTerms = parseOrFail(websiteRaw, 'website manifest')

console.log('Website Project OS commercial terms parsed from shared/pricing-manifest.json.')
console.log(
  `Derived display: Starter ${websiteTerms.plans[0].monthlyPriceUsd}/${websiteTerms.plans[0].annualTotalUsd}/${websiteTerms.plans[0].annualMonthlyUsd}; Professional ${websiteTerms.plans[1].monthlyPriceUsd}/${websiteTerms.plans[1].annualTotalUsd}/${websiteTerms.plans[1].annualMonthlyUsd}; Business ${websiteTerms.plans[2].monthlyPriceUsd}/${websiteTerms.plans[2].annualTotalUsd}/${websiteTerms.plans[2].annualMonthlyUsd}`,
)
console.log(
  `Sale eligibility: ${websiteTerms.commercialState}/${websiteTerms.billingAvailability}`,
)

if (schemaOnly && !canonicalPath) {
  console.log(
    'CROSS_REPO_PARITY_NOT_CHECKED: schema-only mode; pass --canonical or PRICING_APP_MANIFEST to compare an independent calc source.',
  )
  process.exit(0)
}

if (!canonicalPath) {
  console.log(
    'CROSS_REPO_PARITY_NOT_CHECKED: no explicit canonical input. Set PRICING_APP_MANIFEST or pass --canonical <path>. This is not a cross-repository parity result.',
  )
  process.exit(0)
}

const resolvedCanonical = resolve(canonicalPath)
if (resolvedCanonical === resolve(websiteManifestPath)) {
  console.log(
    'CANONICAL_INPUT_IS_WEBSITE_COPY: the explicit path is the website artifact itself; this proves parser consistency, not independent calc provenance.',
  )
}

let canonicalRaw
try {
  canonicalRaw = loadJson(resolvedCanonical, 'canonical pricing manifest')
} catch (error) {
  fail(`explicit canonical input failed: ${error.message}`)
}

const canonicalTerms = parseOrFail(canonicalRaw, 'canonical manifest')

if (projectOsCommercialFingerprint(websiteTerms) !== projectOsCommercialFingerprint(canonicalTerms)) {
  fail('Canonical drift: website Project OS commercial terms do not match the explicit calc input.')
}

console.log(`Project OS commercial terms match canonical input ${resolvedCanonical}`)
