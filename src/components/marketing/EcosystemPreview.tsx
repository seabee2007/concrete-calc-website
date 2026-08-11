import { ArrowRight } from 'lucide-react'
import CatalogArtwork from '../catalog/CatalogArtwork'
import { PUBLIC_ARDEN_CATALOG, productStatusLabel } from '../../lib/publicArdenCatalog'

const previewProducts = PUBLIC_ARDEN_CATALOG.products
  .filter(({ productId }) => productId !== 'project_os')
  .slice(0, 4)

export default function EcosystemPreview() {
  return (
    <section id="ecosystem" className="ecosystem-preview" aria-labelledby="ecosystem-preview-heading">
      <div className="ecosystem-preview__inner">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-end">
          <div>
            <p className="arden-eyebrow">Arden Systems</p>
            <h2
              id="ecosystem-preview-heading"
              className="mt-4 max-w-2xl text-3xl font-semibold tracking-[-0.03em] text-slate-900 sm:text-4xl lg:text-5xl"
            >
              Start with Project OS. Grow into a connected construction system.
            </h2>
          </div>
          <div className="max-w-2xl lg:justify-self-end">
            <p className="text-base leading-7 text-slate-600">
              Arden Project OS is available today. The broader Arden catalog shows the approved
              direction for focused estimating, field, safety, and business tools—without
              inventing release dates or checkout availability.
            </p>
            <a
              href="/hub"
              className="mt-5 inline-flex items-center gap-2 font-bold text-electric-600 hover:text-electric-500"
            >
              Explore the public Arden Hub
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {previewProducts.map((product) => (
            <a key={product.productId} href={`/hub?product=${encodeURIComponent(product.productId)}`} className="catalog-card group no-underline">
              <div className="flex items-start justify-between gap-3">
                <CatalogArtwork iconKey={product.iconKey} size={64} />
                <span className="catalog-status" data-status={product.releaseStatus}>
                  {productStatusLabel(product.releaseStatus)}
                </span>
              </div>
              <h3 className="mt-5 text-lg font-bold text-slate-900">{product.displayName}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{product.summary}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
