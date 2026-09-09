export const PROJECT_OS_PRODUCT_ID = 'project_os' as const
export const PAID_PLAN_IDS = ['starter', 'professional', 'business'] as const
export const USD_MINOR_UNITS = 100
export const EXPECTED_DISPLAY = {
  starter: { monthly: 49, annualTotal: 490, annualMonth: 41 },
  professional: { monthly: 129, annualTotal: 1308, annualMonth: 109 },
  business: { monthly: 249, annualTotal: 2508, annualMonth: 209 },
} as const

export type PaidPlanId = (typeof PAID_PLAN_IDS)[number]

export interface ProjectOsTrial {
  hasTrial: boolean
  trialDays: number | null
}

export interface ProjectOsPlanTerms {
  planId: PaidPlanId
  name: string
  audience: string
  monthlyPriceUsd: number
  annualMonthlyUsd: number
  annualTotalUsd: number
  monthlyPriceMinor: number
  annualPriceMinor: number
  annualDisplayMonthlyMinor: number
  recommended: boolean
  activeProjectLimit: number
  includedFieldSeats: number
  marketableFeatureKeys: string[]
  usageSummary: string
  grantRank: number
  stripeLookupKeys: { month: string; year: string }
}

export interface ProjectOsCommercialTerms {
  schemaVersion: 2
  version: string
  currencyCode: 'USD'
  commercialState: string
  billingAvailability: string
  trial: ProjectOsTrial
  nonMarketableFeatureKeys: string[]
  plans: ProjectOsPlanTerms[]
}

export class PricingContractError extends Error {
  readonly code: string

  constructor(code: string, message: string) {
    super(message)
    this.name = 'PricingContractError'
    this.code = code
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function requireString(value: unknown, label: string): string {
  if (typeof value !== 'string' || value.length === 0) {
    throw new PricingContractError('INVALID_STRUCTURE', `${label} must be a non-empty string`)
  }
  return value
}

function requireInteger(value: unknown, label: string): number {
  if (typeof value !== 'number' || !Number.isInteger(value)) {
    throw new PricingContractError('INVALID_AMOUNT', `${label} must be an integer`)
  }
  return value
}

function minorToUsdDisplay(minor: number, label: string): number {
  if (minor < 0) {
    throw new PricingContractError('INVALID_AMOUNT', `${label} must be a non-negative integer`)
  }
  if (minor % USD_MINOR_UNITS !== 0) {
    throw new PricingContractError(
      'INVALID_AMOUNT',
      `${label} must convert to a whole USD display amount`,
    )
  }
  return minor / USD_MINOR_UNITS
}

function parseTrial(value: unknown, label: string): ProjectOsTrial {
  if (!isRecord(value)) {
    throw new PricingContractError('INVALID_STRUCTURE', `${label} must be an object`)
  }
  if (typeof value.hasTrial !== 'boolean') {
    throw new PricingContractError('INVALID_STRUCTURE', `${label}.hasTrial must be a boolean`)
  }
  const trialDays = value.trialDays
  if (trialDays !== null && !Number.isInteger(trialDays)) {
    throw new PricingContractError('INVALID_STRUCTURE', `${label}.trialDays must be null or an integer`)
  }
  return { hasTrial: value.hasTrial, trialDays: trialDays === null ? null : Number(trialDays) }
}

function parsePlan(value: unknown, index: number): ProjectOsPlanTerms {
  if (!isRecord(value)) {
    throw new PricingContractError('INVALID_STRUCTURE', `plans[${index}] must be an object`)
  }
  const planId = requireString(value.planId, `plans[${index}].planId`)
  if (!PAID_PLAN_IDS.includes(planId as PaidPlanId)) {
    throw new PricingContractError('INVALID_PLAN_IDENTITY', `unsupported Project OS planId ${planId}`)
  }
  const marketing = value.projectOsMarketing
  if (!isRecord(marketing)) {
    throw new PricingContractError('INVALID_STRUCTURE', `plans[${index}].projectOsMarketing is required`)
  }
  if (!Array.isArray(marketing.marketableFeatureKeys) || marketing.marketableFeatureKeys.some((key) => typeof key !== 'string')) {
    throw new PricingContractError('INVALID_STRUCTURE', `plans[${index}].marketableFeatureKeys must be strings`)
  }
  const lookups = value.stripeLookupKeys
  if (!isRecord(lookups)) {
    throw new PricingContractError('INVALID_STRUCTURE', `plans[${index}].stripeLookupKeys is required`)
  }
  const grants = value.grants
  if (!Array.isArray(grants) || grants.length === 0 || !isRecord(grants[0])) {
    throw new PricingContractError('INVALID_STRUCTURE', `plans[${index}].grants must include a Project OS grant`)
  }
  const grant = grants[0]
  if (grant.productId !== PROJECT_OS_PRODUCT_ID || grant.planId !== planId) {
    throw new PricingContractError('INVALID_PLAN_IDENTITY', `plans[${index}] grant must bind project_os/${planId}`)
  }

  const monthlyPriceMinor = requireInteger(value.monthlyPriceMinor, `${planId}.monthlyPriceMinor`)
  const annualPriceMinor = requireInteger(value.annualPriceMinor, `${planId}.annualPriceMinor`)
  const annualDisplayMonthlyMinor = requireInteger(
    value.annualDisplayMonthlyMinor,
    `${planId}.annualDisplayMonthlyMinor`,
  )

  return {
    planId: planId as PaidPlanId,
    name: requireString(value.name, `${planId}.name`),
    audience: requireString(value.audience, `${planId}.audience`),
    monthlyPriceMinor,
    annualPriceMinor,
    annualDisplayMonthlyMinor,
    monthlyPriceUsd: minorToUsdDisplay(monthlyPriceMinor, `${planId}.monthlyPriceMinor`),
    annualTotalUsd: minorToUsdDisplay(annualPriceMinor, `${planId}.annualPriceMinor`),
    annualMonthlyUsd: minorToUsdDisplay(annualDisplayMonthlyMinor, `${planId}.annualDisplayMonthlyMinor`),
    recommended: value.recommended === true,
    activeProjectLimit: requireInteger(marketing.activeProjectLimit, `${planId}.activeProjectLimit`),
    includedFieldSeats: requireInteger(marketing.includedFieldSeats, `${planId}.includedFieldSeats`),
    marketableFeatureKeys: marketing.marketableFeatureKeys as string[],
    usageSummary: requireString(marketing.usageSummary, `${planId}.usageSummary`),
    grantRank: requireInteger(grant.rank, `${planId}.grant.rank`),
    stripeLookupKeys: {
      month: requireString(lookups.month, `${planId}.stripeLookupKeys.month`),
      year: requireString(lookups.year, `${planId}.stripeLookupKeys.year`),
    },
  }
}

interface ProjectOsProductBody {
  commercialState: string
  billingAvailability: string
  currencyCode: 'USD'
  trial: ProjectOsTrial
  nonMarketableFeatureKeys: string[]
  plans: ProjectOsPlanTerms[]
}

function parseProjectOsProduct(value: unknown): ProjectOsProductBody {
  if (!isRecord(value)) {
    throw new PricingContractError('INVALID_STRUCTURE', 'project_os product must be an object')
  }
  if (value.productId !== PROJECT_OS_PRODUCT_ID) {
    throw new PricingContractError('INVALID_STRUCTURE', 'selected product is not project_os')
  }
  if (value.currencyCode !== 'USD') {
    throw new PricingContractError('INVALID_CURRENCY', 'project_os currencyCode must be USD')
  }
  if (!Array.isArray(value.nonMarketableFeatureKeys) || value.nonMarketableFeatureKeys.some((key) => typeof key !== 'string')) {
    throw new PricingContractError('INVALID_STRUCTURE', 'nonMarketableFeatureKeys must be strings')
  }
  if (!Array.isArray(value.plans)) {
    throw new PricingContractError('INVALID_STRUCTURE', 'project_os.plans must be an array')
  }

  const plans = value.plans.map((plan, index) => parsePlan(plan, index))
  const ids = plans.map((plan) => plan.planId)
  const missing = PAID_PLAN_IDS.filter((id) => !ids.includes(id))
  if (missing.length > 0) {
    throw new PricingContractError('MISSING_PLAN_IDENTITY', `missing Project OS plans: ${missing.join(', ')}`)
  }
  if (ids.length !== new Set(ids).size) {
    throw new PricingContractError('DUPLICATE_PLAN_IDENTITY', 'duplicate Project OS plan identities')
  }

  return {
    commercialState: requireString(value.commercialState, 'project_os.commercialState'),
    billingAvailability: requireString(value.billingAvailability, 'project_os.billingAvailability'),
    currencyCode: 'USD',
    trial: parseTrial(value.trial, 'project_os.trial'),
    nonMarketableFeatureKeys: value.nonMarketableFeatureKeys,
    plans: PAID_PLAN_IDS.map((id) => plans.find((plan) => plan.planId === id)!),
  }
}

export function parseProjectOsCommercialTerms(raw: unknown): ProjectOsCommercialTerms {
  if (!isRecord(raw)) {
    throw new PricingContractError('INVALID_STRUCTURE', 'pricing manifest must be an object')
  }
  if (raw.schemaVersion !== 2) {
    throw new PricingContractError('UNSUPPORTED_SCHEMA', `unsupported schemaVersion ${String(raw.schemaVersion)}`)
  }
  if (!Array.isArray(raw.products)) {
    throw new PricingContractError('INVALID_STRUCTURE', 'products must be an array')
  }

  const projectOsEntries = raw.products.filter((product) => isRecord(product) && product.productId === PROJECT_OS_PRODUCT_ID)
  if (projectOsEntries.length === 0) {
    throw new PricingContractError('MISSING_PLAN_IDENTITY', 'no project_os product is present')
  }
  if (projectOsEntries.length > 1) {
    throw new PricingContractError('DUPLICATE_PLAN_IDENTITY', 'multiple project_os products are present')
  }

  const proposals = raw.products.find((product) => isRecord(product) && product.productId === 'proposals')
  if (proposals) {
    if (!isRecord(proposals)) {
      throw new PricingContractError('INVALID_STRUCTURE', 'proposals product is invalid')
    }
    if (proposals.commercialState !== 'decision_pending' || proposals.billingAvailability !== 'not_for_sale') {
      throw new PricingContractError(
        'INVALID_STRUCTURE',
        'proposals must remain decision_pending and not_for_sale',
      )
    }
    if (Array.isArray(proposals.plans) && proposals.plans.length > 0) {
      throw new PricingContractError('INVALID_STRUCTURE', 'proposals must not publish standalone plans')
    }
  }

  const projectOs = parseProjectOsProduct(projectOsEntries[0])
  return {
    schemaVersion: 2,
    version: requireString(raw.version, 'version'),
    ...projectOs,
  }
}

export function projectOsCommercialFingerprint(terms: ProjectOsCommercialTerms): string {
  return JSON.stringify({
    schemaVersion: terms.schemaVersion,
    currencyCode: terms.currencyCode,
    trial: terms.trial,
    nonMarketableFeatureKeys: terms.nonMarketableFeatureKeys,
    plans: terms.plans.map((plan) => ({
      planId: plan.planId,
      name: plan.name,
      monthlyPriceMinor: plan.monthlyPriceMinor,
      annualPriceMinor: plan.annualPriceMinor,
      annualDisplayMonthlyMinor: plan.annualDisplayMonthlyMinor,
      recommended: plan.recommended,
      activeProjectLimit: plan.activeProjectLimit,
      includedFieldSeats: plan.includedFieldSeats,
      marketableFeatureKeys: plan.marketableFeatureKeys,
      usageSummary: plan.usageSummary,
      grantRank: plan.grantRank,
      stripeLookupKeys: plan.stripeLookupKeys,
    })),
  })
}

export function assertApprovedDisplayTerms(terms: ProjectOsCommercialTerms): void {
  for (const planId of PAID_PLAN_IDS) {
    const plan = terms.plans.find((entry) => entry.planId === planId)!
    const expected = EXPECTED_DISPLAY[planId]
    if (
      plan.monthlyPriceUsd !== expected.monthly ||
      plan.annualTotalUsd !== expected.annualTotal ||
      plan.annualMonthlyUsd !== expected.annualMonth
    ) {
      throw new PricingContractError(
        'CANONICAL_DRIFT',
        `${planId} display amounts drifted from the approved Project OS terms`,
      )
    }
  }
}
