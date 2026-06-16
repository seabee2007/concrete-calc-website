export type PlanId = 'starter' | 'professional' | 'business'

export interface PlanPricing {
  monthlyUsd: number
  annualMonthlyUsd: number
  annualTotalUsd: number
}

export const PLAN_PRICING: Record<PlanId, PlanPricing> = {
  starter: { monthlyUsd: 49, annualMonthlyUsd: 41, annualTotalUsd: 490 },
  professional: { monthlyUsd: 129, annualMonthlyUsd: 109, annualTotalUsd: 1308 },
  business: { monthlyUsd: 249, annualMonthlyUsd: 209, annualTotalUsd: 2508 },
}

export function formatUsd(amount: number): string {
  return `$${amount.toLocaleString('en-US')}`
}

export interface PlanMarketingCard {
  planId: PlanId
  shortName: string
  longName: string
  highlights: string[]
  pricing: PlanPricing
  recommended?: boolean
}

const PLAN_ORDER: PlanId[] = ['starter', 'professional', 'business']

export function getPlanMarketingCards(): PlanMarketingCard[] {
  return PLAN_ORDER.map((planId) => {
    const cards: Record<PlanId, Omit<PlanMarketingCard, 'planId' | 'pricing'>> = {
      starter: {
        shortName: 'Starter',
        longName: 'Starter',
        highlights: [
          'Up to 3 active projects',
          '1 field seat included',
          'Quick and conceptual estimates',
          'Standalone calculators and resources hub',
          'Basic proposal creation',
        ],
      },
      professional: {
        shortName: 'Professional',
        longName: 'Professional',
        recommended: true,
        highlights: [
          'Everything in Starter',
          'Up to 10 active projects',
          '3 field seats included',
          'Activity-based estimating and Arden Calc in estimator',
          'Employee field portal, RFIs, FARs, QC, change orders',
          'Logic Network, CPM, and Level III Gantt workspace',
        ],
      },
      business: {
        shortName: 'Business',
        longName: 'Business',
        highlights: [
          'Everything in Professional',
          'Unlimited active projects',
          '10 field seats included',
          'Level III Gantt PDF/Excel exports',
          'Accounting and tax exports and financial dashboards',
          'AI bundle and global planner hub',
        ],
      },
    }

    return {
      planId,
      ...cards[planId],
      pricing: PLAN_PRICING[planId],
    }
  })
}
