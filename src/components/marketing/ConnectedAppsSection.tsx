import { motion, useReducedMotion, type Variants } from 'framer-motion'
import { ArrowRight, Cable } from 'lucide-react'
import IntegrationProviderArtwork from '../catalog/IntegrationProviderArtwork'
import { SECTION_IDS } from '../../constants/marketing'
import {
  PUBLIC_ARDEN_CATALOG,
  integrationStatusLabel,
  type PublicArdenIntegrationV1,
} from '../../lib/publicArdenCatalog'
import { viewportOnce } from './motion'

const cardVariants: Variants = {
  hidden: (index: number) => ({ opacity: 0, x: index === 0 ? -36 : index === 2 ? 36 : 0, y: 18 }),
  visible: (index: number) => ({
    opacity: 1,
    x: 0,
    y: 0,
    transition: { duration: 0.56, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
}

export default function ConnectedAppsSection({
  onSelect,
  compact = false,
}: {
  onSelect?: (integration: PublicArdenIntegrationV1) => void
  compact?: boolean
}) {
  const reducedMotion = Boolean(useReducedMotion())

  return (
    <section
      id={SECTION_IDS.integrations}
      className={`connected-apps-section ${compact ? 'connected-apps-section--compact' : ''}`}
      aria-labelledby="connected-apps-heading"
    >
      <div className="connected-apps-section__inner">
        <div className="connected-apps-section__intro">
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, x: -42 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={viewportOnce}
            transition={{ duration: reducedMotion ? 0 : 0.62 }}
          >
            <p className="connected-apps-section__eyebrow">
              <Cable className="h-4 w-4" aria-hidden="true" />
              {compact ? 'Connected Apps' : 'Connected Workflow'}
            </p>
            <h2 id="connected-apps-heading">
              {compact ? 'Approved providers, clearly stated availability.' : 'Bring every tool closer to the work.'}
            </h2>
          </motion.div>

          <motion.div
            className="connected-apps-section__copy"
            initial={reducedMotion ? false : { opacity: 0, x: 42 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={viewportOnce}
            transition={{ duration: reducedMotion ? 0 : 0.62, delay: reducedMotion ? 0 : 0.08 }}
          >
            <p>
              Explore Arden Systems&apos; customer-facing providers in a dedicated integration layer, with
              release status kept clear before any connection is available.
            </p>
            <p className="connected-apps-section__registry-note">
              Availability comes from the Arden Systems registry. No live connection state is inferred in this release.
            </p>
          </motion.div>
        </div>

        <div className="connected-apps-section__grid">
          {PUBLIC_ARDEN_CATALOG.integrations.map((integration, index) => {
            const content = (
              <>
                <div className="flex w-full items-start justify-between gap-3">
                  <IntegrationProviderArtwork iconKey={integration.iconKey} size={64} />
                  <span className="catalog-status" data-status={integration.availability}>
                    {integrationStatusLabel(integration.availability)}
                  </span>
                </div>
                <h3>{integration.displayName}</h3>
                <p>{integration.description}</p>
                <span className="connected-app-card__link">
                  View registry details
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </span>
              </>
            )

            const sharedProps = {
              custom: index,
              initial: reducedMotion ? false : 'hidden',
              whileInView: 'visible',
              viewport: viewportOnce,
              variants: cardVariants,
            } as const

            return onSelect ? (
              <motion.button
                {...sharedProps}
                key={integration.integrationId}
                type="button"
                className="catalog-card connected-app-card group"
                onClick={() => onSelect(integration)}
                aria-label={`${integration.displayName}, ${integrationStatusLabel(integration.availability)}`}
                data-catalog-integration={integration.integrationId}
              >
                {content}
              </motion.button>
            ) : (
              <motion.a
                {...sharedProps}
                key={integration.integrationId}
                href={`/hub?integration=${encodeURIComponent(integration.integrationId)}`}
                className="catalog-card connected-app-card group no-underline"
                aria-label={`${integration.displayName}, ${integrationStatusLabel(integration.availability)}`}
                data-catalog-integration={integration.integrationId}
              >
                {content}
              </motion.a>
            )
          })}
        </div>

        <p className="connected-apps-section__disclaimer">
          Provider names identify intended compatibility only. No provider endorses Arden Systems, and no
          live connection or synchronization is implied.
        </p>
      </div>
    </section>
  )
}
