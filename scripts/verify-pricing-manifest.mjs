#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const websiteManifestPath = join(root, 'shared', 'pricing-manifest.json')
const PROJECT_OS_ID = 'project_os'
const REQUIRED_PLANS = ['starter', 'professional', 'business']
const USD_MINOR = 100
const APPROVED_DISPLAY = {
  starter: { monthly: 49, annualTotal: 490, annualMonth: 41 },
  professional: { monthly: 129, annualTotal: 1308, annualMonth: 109 },
  business: { monthly: 249, annualTotal: 2508, annualMonth: 209 },
}

function fail(message, code = 1) {
  console.error(message)
  process.exit(code)
}

function isRecord(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function requireInteger(value, label) {
  if (typeof value !== 'number' || !Number.isInteger(value)) {
    throw new Error(`${label} must be an integer`)
  }
  return value
}

function minorToUsd(minor, label) {
  const value = requireInteger(minor, label)
  if (value < 0 || value % USD_MINOR !== 0) {
    throw new Error(`${label} must be non-negative integer USD minor units`)
  }
  return value / USD_MINOR
}

function parseProjectOs(raw, label) {
  if (!isRecord(raw)) throw new Error(`${label} must be an object`)
  if (raw.schemaVersion !== 2) throw new Error(`${label} unsupported schemaVersion ${raw.schemaVersion}`)
  if (!Array.isArray(raw.products)) throw new Error(`${label} products must be an array`)

  const matches = raw.products.filter((product) => isRecord(product) && product.productId === PROJECT_OS_ID)
  if (matches.length === 0) throw new Error(`${label} is missing productId project_os`)
  if (matches.length > 1) throw new Error(`${label} has duplicate project_os products`)
  const product = matches[0]
  if (product.currencyCode !== 'USD') throw new Error(`${label} project_os currencyCode must be USD`)
  if (!Array.isArray(product.plans)) throw new Error(`${label} project_os.plans must be an array`)

  const proposals = raw.products.find((product) => isRecord(product) && product.productId === 'proposals')
  if (proposals) {
    if (proposals.commercialState !== 'decision_pending' || proposals.billingAvailability !== 'not_for_sale') {
      throw new Error(`${label} proposals must remain decision_pending/not_for_sale`)
    }
    if (Array.isArray(proposals.plans) && proposals.plans.length > 0) {
      throw new Error(`${label} proposals must not publish standalone plans`)
    }
  }

  const parsedPlans = product.plans.map((plan, index) => {
    if (!isRecord(plan)) throw new Error(`${label} plans[${index}] must be an object`)
    const marketing = plan.projectOsMarketing
    if (!isRecord(marketing)) throw new Error(`${label} plans[${index}].projectOsMarketing is required`)
    return {
      planId: plan.planId,
      monthlyPriceMinor: requireInteger(plan.monthlyPriceMinor, `${label} ${plan.planId}.monthlyPriceMinor`),
      annualPriceMinor: requireInteger(plan.annualPriceMinor, `${label} ${plan.planId}.annualPriceMinor`),
      annualDisplayMonthlyMinor: requireInteger(
        plan.annualDisplayMonthlyMinor,
        `${label} ${plan.planId}.annualDisplayMonthlyMinor`,
      ),
      recommended: plan.recommended === true,
      activeProjectLimit: requireInteger(marketing.activeProjectLimit, `${label} ${plan.planId}.activeProjectLimit`),
      includedFieldSeats: requireInteger(marketing.includedFieldSeats, `${label} ${plan.planId}.includedFieldSeats`),
      marketableFeatureKeys: marketing.marketableFeatureKeys,
      usageSummary: marketing.usageSummary,
    }
  })

  const ids = parsedPlans.map((plan) => plan.planId)
  const missing = REQUIRED_PLANS.filter((id) => !ids.includes(id))
  if (missing.length) throw new Error(`${label} missing Project OS plans: ${missing.join(', ')}`)
  if (ids.length !== new Set(ids).size) throw new Error(`${label} duplicate Project OS plan identities`)

  return {
    trial: product.trial,
    nonMarketableFeatureKeys: product.nonMarketableFeatureKeys,
    plans: parsedPlans,
    display: Object.fromEntries(
      parsedPlans.map((plan) => [
        plan.planId,
        {
          monthly: minorToUsd(plan.monthlyPriceMinor, `${label} ${plan.planId} monthly`),
          annualTotal: minorToUsd(plan.annualPriceMinor, `${label} ${plan.planId} annual`),
          annualMonth: minorToUsd(plan.annualDisplayMonthlyMinor, `${label} ${plan.planId} annualMonth`),
        },
      ]),
    ),
  }
}

function fingerprint(parsed) {
  return JSON.stringify({
    trial: parsed.trial,
    nonMarketableFeatureKeys: parsed.nonMarketableFeatureKeys,
    plans: parsed.plans,
  })
}

function loadJson(path, label) {
  if (!existsSync(path)) throw new Error(`${label} not found: ${path}`)
  try {
    return JSON.parse(readFileSync(path, 'utf8'))
  } catch (error) {
    throw new Error(`${label} is not valid JSON: ${error instanceof Error ? error.message : String(error)}`)
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

let websiteTerms
try {
  websiteTerms = parseProjectOs(websiteRaw, 'website manifest')
} catch (error) {
  fail(`website manifest failed Project OS v2 validation: ${error.message}`)
}

for (const planId of REQUIRED_PLANS) {
  const actual = websiteTerms.display[planId]
  const expected = APPROVED_DISPLAY[planId]
  if (
    actual.monthly !== expected.monthly ||
    actual.annualTotal !== expected.annualTotal ||
    actual.annualMonth !== expected.annualMonth
  ) {
    fail(`approved display terms drifted for ${planId}: ${JSON.stringify(actual)}`)
  }
}

console.log('Website Project OS v2 schema and approved display terms OK.')
console.log(
  `Display: Starter ${websiteTerms.display.starter.monthly}/${websiteTerms.display.starter.annualTotal}/${websiteTerms.display.starter.annualMonth}; Professional ${websiteTerms.display.professional.monthly}/${websiteTerms.display.professional.annualTotal}/${websiteTerms.display.professional.annualMonth}; Business ${websiteTerms.display.business.monthly}/${websiteTerms.display.business.annualTotal}/${websiteTerms.display.business.annualMonth}`,
)

if (schemaOnly && !canonicalPath) {
  console.log('CROSS_REPO_PARITY_NOT_CHECKED: schema-only mode; pass --canonical or PRICING_APP_MANIFEST to compare calc source.')
  process.exit(0)
}

if (!canonicalPath) {
  console.log('CROSS_REPO_PARITY_NOT_CHECKED: no explicit canonical input. Set PRICING_APP_MANIFEST or pass --canonical <path>.')
  process.exit(0)
}

const resolvedCanonical = resolve(canonicalPath)
let canonicalRaw
try {
  canonicalRaw = loadJson(resolvedCanonical, 'canonical pricing manifest')
} catch (error) {
  fail(`explicit canonical input failed: ${error.message}`)
}

let canonicalTerms
try {
  canonicalTerms = parseProjectOs(canonicalRaw, 'canonical manifest')
} catch (error) {
  fail(`canonical manifest failed Project OS v2 validation: ${error.message}`)
}

if (fingerprint(websiteTerms) !== fingerprint(canonicalTerms)) {
  fail('Canonical drift: website Project OS commercial terms do not match the explicit calc input.')
}

console.log(`Project OS commercial terms match canonical input ${resolvedCanonical}`)
