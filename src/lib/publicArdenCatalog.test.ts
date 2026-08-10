import { describe, expect, it } from 'vitest'
import rawCatalog from '../../shared/public-arden-catalog-v1.json'
import {
  PUBLIC_ARDEN_CATALOG,
  capabilityStatusLabel,
  getPublicArtwork,
  integrationStatusLabel,
  productStatusLabel,
  validatePublicArdenCatalogV1,
} from './publicArdenCatalog'

describe('PublicArdenCatalogV1 marketing consumer', () => {
  it('accepts the synced V1 artifact and keeps canonical order', () => {
    expect(validatePublicArdenCatalogV1(rawCatalog)).toBe(PUBLIC_ARDEN_CATALOG)
    expect(PUBLIC_ARDEN_CATALOG.products.map(({ productId }) => productId)).toEqual([
      'project_os',
      'proposals',
      'crm',
      'invoicing',
      'calc',
      'change_orders',
      'field_log',
      'subtracker',
      'quote_leveler',
      'safety',
      'crew_cost',
    ])
  })

  it('does not contain hidden products, internal providers, or internal fields', () => {
    const productIds = PUBLIC_ARDEN_CATALOG.products.map(({ productId }) => productId)
    const integrationIds = PUBLIC_ARDEN_CATALOG.integrations.map(
      ({ integrationId }) => integrationId,
    )
    const serialized = JSON.stringify(PUBLIC_ARDEN_CATALOG)

    expect(productIds).not.toContain('forms')
    expect(productIds).not.toContain('schedule')
    expect(integrationIds).not.toContain('stripe_connect')
    expect(integrationIds).not.toContain('email_delivery')
    expect(serialized).not.toContain('launchTarget')
    expect(serialized).not.toContain('connectionState')
    expect(serialized).not.toContain('entitlement')
  })

  it('keeps truthful labels and complete artwork coverage', () => {
    expect(productStatusLabel('coming_soon')).toBe('Coming Soon')
    expect(productStatusLabel('planned')).toBe('Planned')
    expect(integrationStatusLabel('coming_soon')).toBe('Coming Soon')
    expect(capabilityStatusLabel('not_yet_supported')).toBe('Not yet supported')

    const illustratedProducts = PUBLIC_ARDEN_CATALOG.products.filter(
      ({ productId }) => productId !== 'project_os',
    )
    expect(illustratedProducts.every(({ iconKey }) => getPublicArtwork(iconKey) !== null)).toBe(true)
  })
})
