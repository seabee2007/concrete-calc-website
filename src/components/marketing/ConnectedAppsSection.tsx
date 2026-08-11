import { ArrowRight, Cable } from 'lucide-react'
import IntegrationProviderArtwork from '../catalog/IntegrationProviderArtwork'
import { SECTION_IDS } from '../../constants/marketing'
import {
  PUBLIC_ARDEN_CATALOG,
  integrationStatusLabel,
  type PublicArdenIntegrationV1,
} from '../../lib/publicArdenCatalog'

export default function ConnectedAppsSection({
  onSelect,
  compact = false,
}: {
  onSelect?: (integration: PublicArdenIntegrationV1) => void
  compact?: boolean
}) {
  return (
    <section
      id={SECTION_IDS.integrations}
      className={`connected-apps-section ${compact ? 'connected-apps-section--compact' : ''}`}
      aria-labelledby="connected-apps-heading"
    >
      <div className="connected-apps-section__inner">
        <div className="grid gap-7 lg:grid-cols-[1fr_0.76fr] lg:items-end">
          <div>
            <p className="arden-eyebrow inline-flex items-center gap-2">
              <Cable className="h-4 w-4" aria-hidden="true" />
              Connected Apps
            </p>
            <h2 id="connected-apps-heading" className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-slate-900 sm:text-5xl">
              Familiar providers, clearly stated availability.
            </h2>
          </div>
          <p className="text-base leading-7 text-slate-600">
            These are approved catalog entries, not connected accounts. Availability and capability
            language comes from the Arden integration registry.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {PUBLIC_ARDEN_CATALOG.integrations.map((integration) => {
            const content = (
              <>
                <div className="flex w-full items-start justify-between gap-3">
                  <IntegrationProviderArtwork iconKey={integration.iconKey} size={72} />
                  <span className="catalog-status" data-status={integration.availability}>
                    {integrationStatusLabel(integration.availability)}
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-bold text-slate-900">{integration.displayName}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{integration.description}</p>
                <span className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-bold text-cyan-700">
                  View registry details
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </span>
              </>
            )

            return onSelect ? (
              <button
                key={integration.integrationId}
                type="button"
                className="catalog-card connected-app-card group"
                onClick={() => onSelect(integration)}
                aria-label={`${integration.displayName}, ${integrationStatusLabel(integration.availability)}`}
                data-catalog-integration={integration.integrationId}
              >
                {content}
              </button>
            ) : (
              <a
                key={integration.integrationId}
                href={`/hub?integration=${encodeURIComponent(integration.integrationId)}`}
                className="catalog-card connected-app-card group no-underline"
                aria-label={`${integration.displayName}, ${integrationStatusLabel(integration.availability)}`}
                data-catalog-integration={integration.integrationId}
              >
                {content}
              </a>
            )
          })}
        </div>

        <p className="mt-6 text-xs leading-5 text-slate-500">
          Provider names identify intended compatibility only. No provider endorses Arden, and no
          live connection or synchronization is implied.
        </p>
      </div>
    </section>
  )
}
