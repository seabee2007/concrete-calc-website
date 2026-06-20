import { describe, expect, it } from 'vitest'
import manifest from '../../shared/pricing-manifest.json'
import {
  getJsonLdOffers,
  getPlanCheckoutUrl,
  getPublicPlan,
  getPublicPlanCatalog,
  getPublicPlanCtaLabel,
  PAID_PLAN_ORDER,
} from './publicPlanCatalog'

describe('publicPlanCatalog', () => {
  it('uses Starter, Professional, and Business names consistently', () => {
    const names = getPublicPlanCatalog().map((plan) => plan.name)
    expect(names).toEqual(['Starter', 'Professional', 'Business'])
    expect(names).not.toContain('Pro')
  })

  it('matches manifest monthly and annual prices', () => {
    for (const entry of manifest.plans) {
      const plan = getPublicPlan(entry.planId as 'starter' | 'professional' | 'business')
      expect(plan.monthlyPriceUsd).toBe(entry.monthlyPriceUsd)
      expect(plan.annualTotalUsd).toBe(entry.annualTotalUsd)
      expect(plan.annualSavingsUsd).toBe(entry.monthlyPriceUsd * 12 - entry.annualTotalUsd)
    }
  })

  it('calculates annual savings percentage from configured prices', () => {
    const starter = getPublicPlan('starter')
    expect(starter.annualSavingsPercent).toBe(Math.round((98 / 588) * 100))
  })

  it('does not expose trial CTAs when trial is not configured', () => {
    expect(manifest.trial.hasTrial).toBe(false)
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
      for (const blocked of manifest.nonMarketableFeatureKeys) {
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
