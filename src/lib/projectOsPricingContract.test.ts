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

describe('projectOsPricingContract', () => {
  it('accepts the committed v2 Project OS artifact', () => {
    const terms = parseProjectOsCommercialTerms(canonical)
    expect(terms.schemaVersion).toBe(2)
    expect(terms.plans.map((plan) => plan.planId)).toEqual(['starter', 'professional', 'business'])
    expect(terms.plans[0].monthlyPriceUsd).toBe(49)
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

  it('rejects actual canonical drift in display amounts', () => {
    const drifted = structuredClone(canonical)
    drifted.products[0].plans[0].monthlyPriceMinor = 5900
    const terms = parseProjectOsCommercialTerms(drifted)
    expect(projectOsCommercialFingerprint(terms)).not.toBe(
      projectOsCommercialFingerprint(parseProjectOsCommercialTerms(canonical)),
    )
  })
})
