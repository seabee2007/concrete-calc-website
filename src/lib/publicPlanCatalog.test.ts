import { describe, expect, it } from 'vitest'
import {
  getJsonLdOffers,
  getPlanCheckoutUrl,
  getPublicPlan,
  getPublicPlanCatalog,
  getPublicPlanCtaLabel,
  PAID_PLAN_ORDER,
} from './publicPlanCatalog'
import { parseProjectOsCommercialTerms } from './projectOsPricingContract'
import manifest from '../../shared/pricing-manifest.json'

const APPROVED_DISPLAY_FIXTURE = {
  starter: { monthly: 49, annualTotal: 490, annualMonth: 41 },
  professional: { monthly: 129, annualTotal: 1308, annualMonth: 109 },
  business: { monthly: 249, annualTotal: 2508, annualMonth: 209 },
} as const

describe('publicPlanCatalog', () => {
  const projectOs = parseProjectOsCommercialTerms(manifest)

  it('uses Starter, Professional, and Business names consistently', () => {
    const names = getPublicPlanCatalog().map((plan) => plan.name)
    expect(names).toEqual(['Starter', 'Professional', 'Business'])
    expect(names).not.toContain('Pro')
  })

  it('matches approved Project OS monthly and annual display prices from the manifest', () => {
    for (const planId of PAID_PLAN_ORDER) {
      const plan = getPublicPlan(planId)
      const expected = APPROVED_DISPLAY_FIXTURE[planId as keyof typeof APPROVED_DISPLAY_FIXTURE]
      expect(plan.monthlyPriceUsd).toBe(expected.monthly)
      expect(plan.annualTotalUsd).toBe(expected.annualTotal)
      expect(plan.annualMonthlyUsd).toBe(expected.annualMonth)
      expect(plan.annualSavingsUsd).toBe(expected.monthly * 12 - expected.annualTotal)
    }
  })

  it('keeps the existing annual-month display convention instead of annualTotal/12', () => {
    expect(getPublicPlan('starter').annualMonthlyUsd).toBe(41)
    expect(getPublicPlan('starter').annualTotalUsd / 12).not.toBe(41)
  })

  it('calculates annual savings percentage from configured prices', () => {
    const starter = getPublicPlan('starter')
    expect(starter.annualSavingsPercent).toBe(Math.round((98 / 588) * 100))
  })

  it('does not expose trial CTAs when trial is not configured', () => {
    expect(projectOs.trial.hasTrial).toBe(false)
    expect(getPublicPlanCtaLabel('starter')).toBe('Choose Starter')
    expect(getPublicPlanCtaLabel('professional')).toBe('Choose Professional')
    expect(getPublicPlanCtaLabel('business')).toBe('Choose Business')
  })

  it('maps upgrade and downgrade CTA labels for logged-in users', () => {
    expect(getPublicPlanCtaLabel('professional', 'starter')).toBe('Upgrade to Professional')
    expect(getPublicPlanCtaLabel('starter', 'professional')).toBe('Downgrade to Starter')
    expect(getPublicPlanCtaLabel('professional', 'professional')).toBe('Current Plan')
  })

  it('lists only marketable capabilities in highlights', () => {
    for (const plan of getPublicPlanCatalog()) {
      for (const blocked of projectOs.nonMarketableFeatureKeys) {
        expect(plan.highlights.join(' ').toLowerCase()).not.toContain(blocked.replaceAll('_', ' '))
      }
    }
  })

  it('reflects verified project and field-seat limits', () => {
    expect(getPublicPlan('starter').activeProjectLimit).toBe(3)
    expect(getPublicPlan('starter').includedFieldSeats).toBe(1)
    expect(getPublicPlan('professional').includedFieldSeats).toBe(5)
    expect(getPublicPlan('business').activeProjectLimit).toBe('unlimited')
    expect(getPublicPlan('business').includedFieldSeats).toBe(15)
  })

  it('routes plan CTAs to in-app billing with upgrade param', () => {
    for (const planId of PAID_PLAN_ORDER) {
      expect(getPlanCheckoutUrl(planId)).toBe(
        `https://app.ardenprojectos.com/settings/billing?upgrade=${planId}`,
      )
    }
  })

  it('derives JSON-LD offers from the catalog', () => {
    expect(getJsonLdOffers()).toEqual([
      { '@type': 'Offer', name: 'Starter', price: '49', priceCurrency: 'USD' },
      { '@type': 'Offer', name: 'Professional', price: '129', priceCurrency: 'USD' },
      { '@type': 'Offer', name: 'Business', price: '249', priceCurrency: 'USD' },
    ])
  })
})
