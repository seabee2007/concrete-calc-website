import { Cloud, PanelsTopLeft, Receipt, type LucideIcon } from 'lucide-react'

export interface ProviderArtworkDefinition {
  assetPath: string | null
  fallback: LucideIcon
  tone: 'finance' | 'productivity' | 'cloud'
}

/**
 * Presentation-owned provider artwork slots. Assets remain null until the
 * corresponding provider grants use for a static catalog card.
 */
export const INTEGRATION_PROVIDER_ARTWORK: Readonly<Record<string, ProviderArtworkDefinition>> = {
  quickbooks_online: { assetPath: null, fallback: Receipt, tone: 'finance' },
  microsoft_365: { assetPath: null, fallback: PanelsTopLeft, tone: 'productivity' },
  google_workspace: { assetPath: null, fallback: Cloud, tone: 'cloud' },
}