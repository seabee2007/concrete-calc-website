import { describe, expect, it } from 'vitest'
import { MARKETING_SECTION_ORDER } from './marketingSectionOrder'
import { INTEGRATION_PROVIDER_ARTWORK } from '../components/catalog/integrationProviderArtworkMap'

describe('marketing and public Hub composition contracts', () => {
  it('keeps the approved deck section order', () => {
    expect(MARKETING_SECTION_ORDER).toEqual([
      'hero',
      'workflow',
      'capabilities',
      'ecosystem',
      'screenshots',
      'faq',
      'connected-apps',
      'pricing',
      'footer',
    ])
  })

  it('keeps Microsoft and Google on neutral artwork fallbacks until approved', () => {
    expect(INTEGRATION_PROVIDER_ARTWORK.microsoft_365?.assetPath).toBeNull()
    expect(INTEGRATION_PROVIDER_ARTWORK.google_workspace?.assetPath).toBeNull()
  })
})
