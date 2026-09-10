export const PROJECT_OS_PRODUCT_ID = 'project_os' as const
export const PAID_PLAN_IDS = ['starter', 'professional', 'business'] as const
export const USD_MINOR_UNITS = 100
export const PROJECT_OS_SALE_COMMERCIAL_STATE = 'approved' as const
export const PROJECT_OS_SALE_BILLING_AVAILABILITY = 'standalone' as const

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
  grants: Array<{ productId: string; planId: string; rank: number }>
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

function requireSafeInteger(value: unknown, label: string): number {
  if (typeof value !== 'number' || !Number.isSafeInteger(value)) {
    throw new PricingContractError('INVALID_AMOUNT', `${label} must be a finite safe integer`)
  }
  return value
}

function minorToUsd(minor: number, label: string): number {
  if (minor < 0) {
    throw new PricingContractError('INVALID_AMOUNT', `${label} must be a non-negative integer`)
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
  if (trialDays !== null && !Number.isSafeInteger(trialDays)) {
    throw new PricingContractError('INVALID_STRUCTURE', `${label}.trialDays must be null or a safe integer`)
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
  const rawGrants = value.grants
  if (!Array.isArray(rawGrants) || rawGrants.length === 0) {
    throw new PricingContractError('INVALID_STRUCTURE', `plans[${index}].grants must include a Project OS grant`)
  }
  const grants = rawGrants.map((entry, grantIndex) => {
    if (!isRecord(entry)) {
      throw new PricingContractError(
        'INVALID_STRUCTURE',
        `plans[${index}].grants[${grantIndex}] must be an object`,
      )
    }
    return {
      productId: requireString(entry.productId, `${planId}.grants[${grantIndex}].productId`),
      planId: requireString(entry.planId, `${planId}.grants[${grantIndex}].planId`),
      rank: requireSafeInteger(entry.rank, `${planId}.grants[${grantIndex}].rank`),
    }
  })
  if (grants.length !== 1) {
    throw new PricingContractError(
      'UNSUPPORTED_GRANT',
      `plans[${index}] must have exactly one Project OS grant; extra or parallel grants are not part of the website contract`,
    )
  }
  const grant = grants[0]
  if (grant.productId !== PROJECT_OS_PRODUCT_ID || grant.planId !== planId) {
    throw new PricingContractError('INVALID_PLAN_IDENTITY', `plans[${index}] grant must bind project_os/${planId}`)
  }
  if (typeof value.recommended !== 'boolean') {
    throw new PricingContractError('INVALID_STRUCTURE', `${planId}.recommended must be a boolean`)
  }
  const recommended = value.recommended

  const monthlyPriceMinor = requireSafeInteger(value.monthlyPriceMinor, `${planId}.monthlyPriceMinor`)
  const annualPriceMinor = requireSafeInteger(value.annualPriceMinor, `${planId}.annualPriceMinor`)
  const annualDisplayMonthlyMinor = requireSafeInteger(
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
    monthlyPriceUsd: minorToUsd(monthlyPriceMinor, `${planId}.monthlyPriceMinor`),
    annualTotalUsd: minorToUsd(annualPriceMinor, `${planId}.annualPriceMinor`),
    annualMonthlyUsd: minorToUsd(annualDisplayMonthlyMinor, `${planId}.annualDisplayMonthlyMinor`),
    recommended,
    activeProjectLimit: requireSafeInteger(marketing.activeProjectLimit, `${planId}.activeProjectLimit`),
    includedFieldSeats: requireSafeInteger(marketing.includedFieldSeats, `${planId}.includedFieldSeats`),
    marketableFeatureKeys: marketing.marketableFeatureKeys as string[],
    usageSummary: requireString(marketing.usageSummary, `${planId}.usageSummary`),
    grantRank: grant.rank,
    grants,
    stripeLookupKeys: {
      month: requireString(lookups.month, `${planId}.stripeLookupKeys.month`),
      year: requireString(lookups.year, `${planId}.stripeLookupKeys.year`),
    },
  }
}

function parseProjectOsProduct(value: unknown) {
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

  const commercialState = requireString(value.commercialState, 'project_os.commercialState')
  const billingAvailability = requireString(value.billingAvailability, 'project_os.billingAvailability')
  if (
    commercialState !== PROJECT_OS_SALE_COMMERCIAL_STATE ||
    billingAvailability !== PROJECT_OS_SALE_BILLING_AVAILABILITY
  ) {
    throw new PricingContractError(
      'NOT_SALE_ENABLED',
      `project_os is not sale-enabled (${commercialState}/${billingAvailability}); checkout offers must not be published`,
    )
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
    commercialState,
    billingAvailability,
    currencyCode: 'USD' as const,
    trial: parseTrial(value.trial, 'project_os.trial'),
    nonMarketableFeatureKeys: value.nonMarketableFeatureKeys as string[],
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
    version: terms.version,
    currencyCode: terms.currencyCode,
    commercialState: terms.commercialState,
    billingAvailability: terms.billingAvailability,
    trial: terms.trial,
    nonMarketableFeatureKeys: terms.nonMarketableFeatureKeys,
    plans: terms.plans.map((plan) => ({
      planId: plan.planId,
      name: plan.name,
      audience: plan.audience,
      monthlyPriceMinor: plan.monthlyPriceMinor,
      annualPriceMinor: plan.annualPriceMinor,
      annualDisplayMonthlyMinor: plan.annualDisplayMonthlyMinor,
      recommended: plan.recommended,
      activeProjectLimit: plan.activeProjectLimit,
      includedFieldSeats: plan.includedFieldSeats,
      marketableFeatureKeys: plan.marketableFeatureKeys,
      usageSummary: plan.usageSummary,
      grantRank: plan.grantRank,
      grants: plan.grants,
      stripeLookupKeys: plan.stripeLookupKeys,
    })),
  })
}
