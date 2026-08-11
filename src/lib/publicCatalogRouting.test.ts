import { describe, expect, it } from 'vitest'
import { appLoginHref } from '../constants/marketing'
import {
  catalogSelectionSearch,
  resolvePublicCatalogSelection,
} from './publicCatalogRouting'

describe('public Arden Hub routing', () => {
  it('allowlists canonical public product and integration IDs', () => {
    expect(resolvePublicCatalogSelection('?product=proposals')).toMatchObject({
      kind: 'product',
      item: { productId: 'proposals' },
    })
    expect(resolvePublicCatalogSelection('?integration=microsoft_365')).toMatchObject({
      kind: 'integration',
      item: { integrationId: 'microsoft_365' },
    })
    expect(resolvePublicCatalogSelection('?product=forms')).toBeNull()
    expect(resolvePublicCatalogSelection('?integration=stripe_connect')).toBeNull()
    expect(resolvePublicCatalogSelection('?product=https://example.com')).toBeNull()
  })

  it('uses product intent first and serializes one safe selection', () => {
    const selection = resolvePublicCatalogSelection(
      '?product=proposals&integration=google_workspace',
    )
    expect(selection).toMatchObject({ kind: 'product', item: { productId: 'proposals' } })
    expect(catalogSelectionSearch(selection)).toBe('?product=proposals')
    expect(catalogSelectionSearch(null)).toBe('')
  })

  it('preserves a relative authenticated Hub target through login', () => {
    expect(appLoginHref('/apps?product=proposals')).toBe(
      'https://app.ardenprojectos.com/login?returnTo=%2Fapps%3Fproduct%3Dproposals',
    )
  })
})
