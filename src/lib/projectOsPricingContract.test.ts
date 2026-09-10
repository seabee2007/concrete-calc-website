import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import {
  parseProjectOsCommercialTerms,
  PricingContractError,
  projectOsCommercialFingerprint,
} from './projectOsPricingContract'

const canonical = JSON.parse(
  readFileSync(new URL('../../shared/pricing-manifest.json', import.meta.url), 'utf8'),
)

const APPROVED_DISPLAY_FIXTURE = {
  starter: { monthly: 49, annualTotal: 490, annualMonth: 41 },
  professional: { monthly: 129, annualTotal: 1308, annualMonth: 109 },
  business: { monthly: 249, annualTotal: 2508, annualMonth: 209 },
} as const

describe('projectOsPricingContract', () => {
  it('accepts the committed v2 Project OS artifact and derives fixture display amounts', () => {
    const terms = parseProjectOsCommercialTerms(canonical)
    expect(terms.schemaVersion).toBe(2)
    expect(terms.commercialState).toBe('approved')
    expect(terms.billingAvailability).toBe('standalone')
    expect(terms.plans.map((plan) => plan.planId)).toEqual(['starter', 'professional', 'business'])
    for (const plan of terms.plans) {
      const expected = APPROVED_DISPLAY_FIXTURE[plan.planId]
      expect(plan.monthlyPriceUsd).toBe(expected.monthly)
      expect(plan.annualTotalUsd).toBe(expected.annualTotal)
      expect(plan.annualMonthlyUsd).toBe(expected.annualMonth)
    }
  })

  it('rejects unsupported schema versions', () => {
    expect(() => parseProjectOsCommercialTerms({ schemaVersion: 1, products: [] })).toThrow(PricingContractError)
    try {
      parseProjectOsCommercialTerms({ schemaVersion: 1, products: [] })
    } catch (error) {
      expect((error as PricingContractError).code).toBe('UNSUPPORTED_SCHEMA')
    }
  })

  it('rejects duplicate or missing Project OS plan identities', () => {
    const duplicate = structuredClone(canonical)
    duplicate.products[0].plans.push(duplicate.products[0].plans[0])
    expect(() => parseProjectOsCommercialTerms(duplicate)).toThrow(/duplicate/i)

    const missing = structuredClone(canonical)
    missing.products[0].plans = missing.products[0].plans.filter((plan: { planId: string }) => plan.planId !== 'business')
    expect(() => parseProjectOsCommercialTerms(missing)).toThrow(/missing/i)
  })

  it('rejects non-integer amounts and non-USD currency', () => {
    const fractional = structuredClone(canonical)
    fractional.products[0].plans[0].monthlyPriceMinor = 4900.5
    expect(() => parseProjectOsCommercialTerms(fractional)).toThrow(/integer/i)

    const currency = structuredClone(canonical)
    currency.products[0].currencyCode = 'EUR'
    expect(() => parseProjectOsCommercialTerms(currency)).toThrow(/USD/)
  })

  it('converts non-whole-dollar minor units instead of rejecting them', () => {
    const cents = structuredClone(canonical)
    cents.products[0].plans[0].monthlyPriceMinor = 4950
    const terms = parseProjectOsCommercialTerms(cents)
    expect(terms.plans[0].monthlyPriceUsd).toBe(49.5)
  })

  it('fails closed when Project OS is not sale-enabled', () => {
    const pending = structuredClone(canonical)
    pending.products[0].commercialState = 'decision_pending'
    pending.products[0].billingAvailability = 'not_for_sale'
    try {
      parseProjectOsCommercialTerms(pending)
      throw new Error('expected sale-enabled rejection')
    } catch (error) {
      expect(error).toBeInstanceOf(PricingContractError)
      expect((error as PricingContractError).code).toBe('NOT_SALE_ENABLED')
    }
  })

  it('fingerprints name, grant rank, lookup keys, and eligibility so those drifts fail parity', () => {
    const base = projectOsCommercialFingerprint(parseProjectOsCommercialTerms(canonical))

    const renamed = structuredClone(canonical)
    renamed.products[0].plans[0].name = 'Starter Plus'
    expect(projectOsCommercialFingerprint(parseProjectOsCommercialTerms(renamed))).not.toBe(base)

    const rank = structuredClone(canonical)
    rank.products[0].plans[1].grants[0].rank = 9
    expect(projectOsCommercialFingerprint(parseProjectOsCommercialTerms(rank))).not.toBe(base)

    const lookup = structuredClone(canonical)
    lookup.products[0].plans[0].stripeLookupKeys.month = 'arden_starter_monthly_v2'
    expect(projectOsCommercialFingerprint(parseProjectOsCommercialTerms(lookup))).not.toBe(base)
  })
})
