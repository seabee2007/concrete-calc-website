import manifest from '../../shared/pricing-manifest.json'
import { APP_URL } from '../constants/marketing'

export type PaidPlanId = 'starter' | 'professional' | 'business'

export type BillingInterval = 'month' | 'year'

type ManifestPlan = (typeof manifest.plans)[number] & { planId: PaidPlanId }

export interface PublicPlanCatalogEntry {
  planId: PaidPlanId
  name: string
  audience: string
  monthlyPriceUsd: number
  annualMonthlyUsd: number
  annualTotalUsd: number
  annualSavingsUsd: number
  annualSavingsPercent: number
  hasTrial: boolean
  trialDays?: number
  activeProjectLimit: number | 'unlimited'
  includedFieldSeats: number
  highlights: string[]
  usageSummary: string
  recommended: boolean
  checkoutPlanId: PaidPlanId
}

const MARKETABLE_FEATURE_LABELS: Record<string, string> = {
  quick_estimates: 'Quick ballpark estimates',
  conceptual_estimates: 'Conceptual estimates with scenarios',
  calculators: 'Standalone calculators and field tools',
  resources: 'Resources hub for estimating references',
  proposals: 'Proposal creation workflow',
  global_ask_ai: 'Global Ask AI assistant',
  activity_based_estimating: 'Activity-based estimating',
  arden_calc_in_estimator: 'Arden Calc inside the estimator',
  employee_portal: 'Employee field portal',
  rfis: 'RFI workflow',
  fars: 'Field Adjustment Request workflow',
  qc: 'Quality control inspections',
  change_orders: 'Change order scope and pricing',
  logic_network: 'Logic Network for schedule dependencies',
  cpm: 'Critical path method scheduling',
  level_three_gantt: 'Level III Gantt workspace',
  level_three_gantt_export: 'Level III Gantt PDF and Excel exports',
  accounting_exports: 'Accounting and tax exports',
  financial_dashboard: 'Financial dashboards',
  ai_concrete_chat: 'Concrete Chat AI assistant',
  ai_scope_summary: 'AI scope summary tools',
  ai_labor_crew_review: 'AI labor and crew review',
  ai_batch_plant_tools: 'AI batch plant pricing tools',
  global_planner_hub: 'Global Planner portfolio hub',
}

const NON_MARKETABLE = new Set(manifest.nonMarketableFeatureKeys)
export const PAID_PLAN_ORDER: PaidPlanId[] = ['starter', 'professional', 'business']

export function formatUsd(amount: number): string {
  return `$${amount.toLocaleString('en-US')}`
}

export function formatProjectLimit(limit: number | 'unlimited'): string {
  if (limit === 'unlimited') return 'Unlimited active projects'
  return `Up to ${limit} active projects`
}

export function formatFieldSeatLimit(seats: number): string {
  return `${seats} field seat${seats === 1 ? '' : 's'} included`
}

function normalizeProjectLimit(value: number): number | 'unlimited' {
  return value < 0 ? 'unlimited' : value
}

function calculateAnnualSavings(monthlyPriceUsd: number, annualTotalUsd: number) {
  const fullYearMonthly = monthlyPriceUsd * 12
  const annualSavingsUsd = fullYearMonthly - annualTotalUsd
  const annualSavingsPercent =
    fullYearMonthly > 0 ? Math.round((annualSavingsUsd / fullYearMonthly) * 100) : 0
  return { annualSavingsUsd, annualSavingsPercent }
}

function buildHighlights(entry: ManifestPlan): string[] {
  const projectLimit = normalizeProjectLimit(entry.activeProjectLimit)
  const limitBullets = [formatProjectLimit(projectLimit), formatFieldSeatLimit(entry.includedFieldSeats)]

  const featureBullets = entry.marketableFeatureKeys
    .filter((key) => !NON_MARKETABLE.has(key))
    .map((key) => MARKETABLE_FEATURE_LABELS[key])
    .filter(Boolean)

  return [...limitBullets, ...featureBullets].slice(0, 7)
}

function toCatalogEntry(raw: ManifestPlan): PublicPlanCatalogEntry {
  const { annualSavingsUsd, annualSavingsPercent } = calculateAnnualSavings(
    raw.monthlyPriceUsd,
    raw.annualTotalUsd,
  )

  return {
    planId: raw.planId,
    name: raw.name,
    audience: raw.audience,
    monthlyPriceUsd: raw.monthlyPriceUsd,
    annualMonthlyUsd: raw.annualMonthlyUsd,
    annualTotalUsd: raw.annualTotalUsd,
    annualSavingsUsd,
    annualSavingsPercent,
    hasTrial: manifest.trial.hasTrial,
    trialDays: manifest.trial.trialDays ?? undefined,
    activeProjectLimit: normalizeProjectLimit(raw.activeProjectLimit),
    includedFieldSeats: raw.includedFieldSeats,
    highlights: buildHighlights(raw),
    usageSummary: raw.usageSummary,
    recommended: raw.recommended,
    checkoutPlanId: raw.planId,
  }
}

export const PUBLIC_PLAN_CATALOG: PublicPlanCatalogEntry[] = (manifest.plans as ManifestPlan[]).map(
  toCatalogEntry,
)

export function getPublicPlanCatalog(): PublicPlanCatalogEntry[] {
  return PUBLIC_PLAN_CATALOG
}

export function getPublicPlan(planId: PaidPlanId): PublicPlanCatalogEntry {
  const plan = PUBLIC_PLAN_CATALOG.find((entry) => entry.planId === planId)
  if (!plan) throw new Error(`Unknown plan: ${planId}`)
  return plan
}

export function getPlanRank(planId: PaidPlanId): number {
  return PAID_PLAN_ORDER.indexOf(planId)
}

export function getDisplayPrice(plan: PublicPlanCatalogEntry, interval: BillingInterval): number {
  return interval === 'year' ? plan.annualMonthlyUsd : plan.monthlyPriceUsd
}

export function getPlanCheckoutUrl(planId: PaidPlanId): string {
  return `${APP_URL}/settings/billing?upgrade=${planId}`
}

export function getPublicPlanCtaLabel(
  planId: PaidPlanId,
  currentPlanId: PaidPlanId | null = null,
): string {
  const plan = getPublicPlan(planId)

  if (manifest.trial.hasTrial && manifest.trial.trialDays) {
    return `Start ${manifest.trial.trialDays}-Day Trial`
  }

  if (currentPlanId === null) {
    return `Choose ${plan.name}`
  }

  if (planId === currentPlanId) {
    return 'Current Plan'
  }

  const cardRank = getPlanRank(planId)
  const currentRank = getPlanRank(currentPlanId)
  return cardRank > currentRank ? `Upgrade to ${plan.name}` : `Downgrade to ${plan.name}`
}

export function getJsonLdOffers() {
  return PUBLIC_PLAN_CATALOG.map((plan) => ({
    '@type': 'Offer' as const,
    name: plan.name,
    price: String(plan.monthlyPriceUsd),
    priceCurrency: 'USD',
  }))
}

export function assertMarketableFeaturesOnly() {
  for (const plan of manifest.plans) {
    for (const key of plan.marketableFeatureKeys) {
      if (NON_MARKETABLE.has(key)) {
        throw new Error(`Plan ${plan.planId} lists non-marketable feature: ${key}`)
      }
      if (!MARKETABLE_FEATURE_LABELS[key]) {
        throw new Error(`Plan ${plan.planId} lists unknown feature key: ${key}`)
      }
    }
  }
}

assertMarketableFeaturesOnly()
