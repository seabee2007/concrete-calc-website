import { motion, useReducedMotion, type Variants } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import CatalogArtwork from '../catalog/CatalogArtwork'
import { SECTION_IDS } from '../../constants/marketing'
import { PUBLIC_ARDEN_CATALOG, productStatusLabel } from '../../lib/publicArdenCatalog'
import { viewportOnce } from './motion'

const previewProducts = PUBLIC_ARDEN_CATALOG.products
  .filter(({ productId }) => productId !== 'project_os')
  .slice(0, 4)

const productVariants: Variants = {
  hidden: (index: number) => ({ opacity: 0, x: index < 2 ? -36 : 36, y: 18 }),
  visible: (index: number) => ({
    opacity: 1,
    x: 0,
    y: 0,
    transition: { duration: 0.54, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] },
  }),
}

export default function EcosystemPreview() {
  const reducedMotion = Boolean(useReducedMotion())

  return (
    <section id={SECTION_IDS.ecosystem} className="ecosystem-preview" aria-labelledby="ecosystem-preview-heading">
      <div className="ecosystem-preview__inner">
        <div className="ecosystem-preview__intro">
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={viewportOnce}
            transition={{ duration: reducedMotion ? 0 : 0.62 }}
          >
            <p className="arden-eyebrow">Arden Systems</p>
            <h2 id="ecosystem-preview-heading">
              Start with Project OS. Grow into a connected construction system.
            </h2>
          </motion.div>

          <motion.div
            className="ecosystem-preview__copy"
            initial={reducedMotion ? false : { opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={viewportOnce}
            transition={{ duration: reducedMotion ? 0 : 0.62, delay: reducedMotion ? 0 : 0.08 }}
          >
            <p>
              Arden Project OS is available today. The broader Arden catalog shows the approved
              direction for focused estimating, field, safety, and business tools—without inventing
              release dates or checkout availability.
            </p>
            <a href="/hub">
              Explore every Arden product
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </motion.div>
        </div>

        <div className="ecosystem-preview__grid">
          {previewProducts.map((product, index) => (
            <motion.a
              key={product.productId}
              href={`/hub?product=${encodeURIComponent(product.productId)}`}
              custom={index}
              initial={reducedMotion ? false : 'hidden'}
              whileInView="visible"
              viewport={viewportOnce}
              variants={productVariants}
              className="catalog-card ecosystem-card group no-underline"
            >
              <div className="flex items-start justify-between gap-3">
                <CatalogArtwork iconKey={product.iconKey} size={64} />
                <span className="catalog-status" data-status={product.releaseStatus}>
                  {productStatusLabel(product.releaseStatus)}
                </span>
              </div>
              <h3>{product.displayName}</h3>
              <p>{product.summary}</p>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}
