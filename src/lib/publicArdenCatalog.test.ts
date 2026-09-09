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
    expect(productIds).not.toContain('arden_signal')
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

    const illustratedProducts = PUBLIC_ARDEN_CATALOG.products
    expect(illustratedProducts.every(({ iconKey }) => getPublicArtwork(iconKey) !== null)).toBe(true)
    expect(getPublicArtwork('arden_signal')).not.toBeNull()
  })

  it.each(['project_os', 'crm'])('rejects a missing public %s artwork descriptor', (iconKey) => {
    const candidate = structuredClone(rawCatalog)
    candidate.artwork = candidate.artwork.filter(artwork => artwork.iconKey !== iconKey)
    expect(() => validatePublicArdenCatalogV1(candidate)).toThrow(`Public product artwork ${iconKey} is missing`)
  })

  it('rejects duplicate artwork keys and filenames', () => {
    const duplicateKey = structuredClone(rawCatalog)
    duplicateKey.artwork.push({ ...duplicateKey.artwork[0], fileName: 'extra.webp' })
    expect(() => validatePublicArdenCatalogV1(duplicateKey)).toThrow('duplicates an icon key or filename')
    const duplicateFile = structuredClone(rawCatalog)
    duplicateFile.artwork[1].fileName = duplicateFile.artwork[0].fileName
    expect(() => validatePublicArdenCatalogV1(duplicateFile)).toThrow('duplicates an icon key or filename')
  })

  it.each(['../project_os.webp', '/project_os.webp', 'project_os.svg'])('rejects invalid artwork filename %s', (fileName) => {
    const candidate = structuredClone(rawCatalog)
    candidate.artwork[0].fileName = fileName
    expect(() => validatePublicArdenCatalogV1(candidate)).toThrow('Artwork 0 is invalid')
  })

  it('rejects invalid hashes and unapproved extra artwork', () => {
    const invalidHash = structuredClone(rawCatalog)
    invalidHash.artwork[0].sha256 = 'sha256:invalid'
    expect(() => validatePublicArdenCatalogV1(invalidHash)).toThrow('Artwork 0 is invalid')
    const unapproved = structuredClone(rawCatalog)
    unapproved.artwork.push({ ...unapproved.artwork[0], iconKey: 'unapproved', fileName: 'unapproved.webp' })
    expect(() => validatePublicArdenCatalogV1(unapproved)).toThrow('only the approved Signal extra')
  })
})
