import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { ArrowRight, CheckCircle2, LogIn, X } from 'lucide-react'
import CatalogArtwork from '../components/catalog/CatalogArtwork'
import Footer from '../components/marketing/Footer'
import Header from '../components/marketing/Header'
import SeoHead from '../components/seo/SeoHead'
import { APP_LOGIN, APP_SIGNUP, MARKETING_URL } from '../constants/marketing'
import { organizationJsonLd } from '../lib/jsonLd'
import {
  PUBLIC_ARDEN_CATALOG,
  capabilityStatusLabel,
  integrationStatusLabel,
  productStatusLabel,
  type PublicArdenIntegrationV1,
  type PublicArdenProductV1,
} from '../lib/publicArdenCatalog'

type CatalogSelection =
  | { kind: 'product'; item: PublicArdenProductV1 }
  | { kind: 'integration'; item: PublicArdenIntegrationV1 }

function CatalogDialog({ selection, onClose }: { selection: CatalogSelection; onClose: () => void }) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)
  const isProduct = selection.kind === 'product'
  const status = isProduct
    ? productStatusLabel(selection.item.releaseStatus)
    : integrationStatusLabel(selection.item.availability)
  const statusKey = isProduct ? selection.item.releaseStatus : selection.item.availability

  useEffect(() => {
    previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
    closeRef.current?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }
      if (event.key !== 'Tab' || !dialogRef.current) return

      const focusable = [...dialogRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )]
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      previousFocusRef.current?.focus()
    }
  }, [onClose])

  return (
    <div
      className="catalog-dialog-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        ref={dialogRef}
        className="catalog-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="catalog-dialog-title"
        aria-describedby="catalog-dialog-description"
      >
        <div className="flex items-start justify-between gap-5">
          <CatalogArtwork iconKey={selection.item.iconKey} size={96} />
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-600 hover:border-cyan-300 hover:text-cyan-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600"
            aria-label="Close catalog details"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <span className="catalog-status mt-6" data-status={statusKey}>
          {status}
        </span>
        <h2 id="catalog-dialog-title" className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">
          {selection.item.displayName}
        </h2>
        <p id="catalog-dialog-description" className="mt-4 leading-7 text-slate-600">
          {selection.item.description}
        </p>

        {isProduct && selection.item.capabilities.length > 0 ? (
          <div className="mt-7">
            <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-slate-500">
              Approved capabilities
            </h3>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {selection.item.capabilities.map((capability) => (
                <li key={capability} className="flex items-start gap-2 text-sm leading-6 text-slate-700">
                  <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-cyan-600" aria-hidden="true" />
                  {capability}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {!isProduct && selection.item.capabilities.length > 0 ? (
          <div className="mt-7 space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-slate-500">
              Capability status
            </h3>
            {selection.item.capabilities.map((capability) => (
              <div key={capability.capabilityId} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-bold text-slate-900">{capability.displayName}</p>
                  <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
                    {capabilityStatusLabel(capability.supportState)}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">{capability.summary}</p>
              </div>
            ))}
          </div>
        ) : null}

        <div className="mt-8 border-t border-slate-200 pt-6">
          {isProduct && selection.item.productId === 'project_os' ? (
            <div className="flex flex-wrap gap-3">
              <a href="/pricing" className="btn-primary gap-2 px-5 py-3">
                View Project OS pricing
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
              <a href={APP_SIGNUP} className="btn-secondary px-5 py-3">
                Create account
              </a>
            </div>
          ) : isProduct ? (
            <div>
              <p className="text-sm leading-6 text-slate-600">
                {selection.item.interestCaptureAllowed
                  ? 'Sign in to follow this product and register interest. No release date or checkout is available from this page.'
                  : 'This catalog entry is informational. No release date or checkout is available from this page.'}
              </p>
              {selection.item.interestCaptureAllowed ? (
                <a href={APP_LOGIN} className="btn-primary mt-4 gap-2 px-5 py-3">
                  <LogIn className="h-4 w-4" aria-hidden="true" />
                  Sign in to follow
                </a>
              ) : null}
            </div>
          ) : (
            <p className="text-sm leading-6 text-slate-600">
              Status comes from the Arden integration registry. This public catalog does not show
              account connection state and does not provide a live connection action.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

function ProductCard({ product, onSelect }: { product: PublicArdenProductV1; onSelect: () => void }) {
  return (
    <button
      type="button"
      className="catalog-card group min-h-[16rem]"
      onClick={onSelect}
      aria-label={`${product.displayName}, ${productStatusLabel(product.releaseStatus)}`}
      data-catalog-product={product.productId}
    >
      <div className="flex w-full items-start justify-between gap-3">
        <CatalogArtwork iconKey={product.iconKey} size={72} />
        <span className="catalog-status" data-status={product.releaseStatus}>
          {productStatusLabel(product.releaseStatus)}
        </span>
      </div>
      <h3 className="mt-5 text-lg font-bold text-slate-900">{product.displayName}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{product.summary}</p>
      <span className="mt-auto pt-5 text-sm font-bold text-cyan-700">View details</span>
    </button>
  )
}

export default function AppsPage() {
  const [selection, setSelection] = useState<CatalogSelection | null>(null)
  const projectOs = PUBLIC_ARDEN_CATALOG.products.find(({ productId }) => productId === 'project_os')
  const products = PUBLIC_ARDEN_CATALOG.products.filter(({ productId }) => productId !== 'project_os')

  if (!projectOs) throw new Error('Public catalog is missing Arden Project OS.')

  return (
    <div className="marketing-refresh">
      <SeoHead
        title="Arden Systems Apps | Construction Software Catalog"
        description="Explore Arden Project OS and the approved Arden Systems catalog for estimating, proposals, field work, safety, cost control, and connected construction workflows."
        canonical={`${MARKETING_URL}/apps`}
        jsonLd={organizationJsonLd}
      />
      <Header />
      <main>
        <section className="relative overflow-hidden bg-[#eef6f6] px-4 py-20 sm:px-6 lg:py-28">
          <img
            src="/images/arden-hub-hero.webp"
            alt=""
            aria-hidden="true"
            width={1920}
            height={1080}
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover object-[70%_center] opacity-45"
            onError={(event) => {
              event.currentTarget.style.display = 'none'
            }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,#f5fbfb_0%,rgba(245,251,251,0.95)_45%,rgba(245,251,251,0.48)_75%,rgba(245,251,251,0.2)_100%)]" aria-hidden="true" />
          <div className="relative mx-auto w-full max-w-[96rem]">
            <p className="arden-eyebrow">Arden Systems catalog</p>
            <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-[1.02] tracking-[-0.04em] text-slate-900 sm:text-5xl lg:text-7xl">
              One construction system, built around the work.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Start with Arden Project OS today. Explore the approved direction for focused Arden
              products and customer-provider integrations, with every status kept explicit.
            </p>
          </div>
        </section>

        <section className="px-4 py-20 sm:px-6 lg:py-28" aria-labelledby="featured-project-os">
          <div className="mx-auto grid w-full max-w-[96rem] overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_30px_90px_rgba(15,48,58,0.14)] lg:grid-cols-[0.92fr_1.08fr]">
            <div className="p-7 sm:p-10 lg:p-14">
              <div className="flex items-center justify-between gap-4">
                <CatalogArtwork iconKey={projectOs.iconKey} size={96} />
                <span className="catalog-status" data-status={projectOs.releaseStatus}>
                  {productStatusLabel(projectOs.releaseStatus)}
                </span>
              </div>
              <p className="arden-eyebrow mt-8">Featured product</p>
              <h2 id="featured-project-os" className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                {projectOs.displayName}
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-600">{projectOs.description}</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a href="/pricing" className="btn-primary gap-2 px-5 py-3">
                  View pricing
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
                <button type="button" className="btn-secondary px-5 py-3" onClick={() => setSelection({ kind: 'product', item: projectOs })}>
                  Product details
                </button>
              </div>
            </div>
            <div className="min-h-[22rem] overflow-hidden bg-[#071924] lg:min-h-full">
              <img
                src="/images/dashboard-dark.png"
                alt="Arden Project OS dashboard showing construction project controls"
                width={1600}
                height={1000}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover object-top"
                onError={(event) => {
                  event.currentTarget.style.display = 'none'
                }}
              />
            </div>
          </div>
        </section>

        <section id="products" className="bg-[#eaf3f3] px-4 py-20 sm:px-6 lg:py-28" aria-labelledby="products-heading">
          <div className="mx-auto w-full max-w-[96rem]">
            <div className="mx-auto max-w-3xl text-center">
              <p className="arden-eyebrow">Discover Arden</p>
              <h2 id="products-heading" className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
                Focused tools, one deliberate product family.
              </h2>
              <p className="mt-5 text-base leading-7 text-slate-600">
                Coming Soon and Planned are registry statuses—not release promises. Select any product
                for its approved scope and next available action.
              </p>
            </div>

            <div className="catalog-constellation hidden xl:block" data-testid="public-catalog-constellation">
              <div className="catalog-constellation__core">
                <div>
                  <CatalogArtwork iconKey="project_os" size={56} />
                  <strong className="mt-1 block text-sm">Project OS</strong>
                  <span className="text-xs text-slate-500">Available now</span>
                </div>
              </div>
              {products.map((product, index) => {
                const angle = index * (360 / products.length) - 90
                const style = {
                  '--orbit-angle': `${angle}deg`,
                  '--orbit-counter-angle': `${-angle}deg`,
                } as CSSProperties
                return (
                  <button
                    key={product.productId}
                    type="button"
                    style={style}
                    className="catalog-constellation__card group"
                    onClick={() => setSelection({ kind: 'product', item: product })}
                    aria-label={`${product.displayName}, ${productStatusLabel(product.releaseStatus)}`}
                  >
                    <CatalogArtwork iconKey={product.iconKey} size={48} />
                    <span className="min-w-0">
                      <strong className="block text-sm leading-5">{product.shortName}</strong>
                      <span className="block text-xs text-slate-500">
                        {productStatusLabel(product.releaseStatus)}
                      </span>
                    </span>
                  </button>
                )
              })}
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:hidden" data-testid="public-catalog-grid">
              {products.map((product) => (
                <ProductCard
                  key={product.productId}
                  product={product}
                  onSelect={() => setSelection({ kind: 'product', item: product })}
                />
              ))}
            </div>
          </div>
        </section>

        <section id="integrations" className="px-4 py-20 sm:px-6 lg:py-28" aria-labelledby="integrations-heading">
          <div className="mx-auto w-full max-w-[96rem]">
            <div className="grid gap-8 lg:grid-cols-[1fr_0.75fr] lg:items-end">
              <div>
                <p className="arden-eyebrow">Integrations</p>
                <h2 id="integrations-heading" className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
                  Connected workflow, status made clear.
                </h2>
              </div>
              <p className="text-base leading-7 text-slate-600">
                These are public catalog entries, not connected accounts. Availability and capability
                language come directly from the Arden integration registry.
              </p>
            </div>

            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {PUBLIC_ARDEN_CATALOG.integrations.map((integration) => (
                <button
                  key={integration.integrationId}
                  type="button"
                  className="catalog-card group min-h-[18rem]"
                  onClick={() => setSelection({ kind: 'integration', item: integration })}
                  aria-label={`${integration.displayName}, ${integrationStatusLabel(integration.availability)}`}
                  data-catalog-integration={integration.integrationId}
                >
                  <div className="flex w-full items-start justify-between gap-3">
                    <CatalogArtwork iconKey={integration.iconKey} size={72} />
                    <span className="catalog-status" data-status={integration.availability}>
                      {integrationStatusLabel(integration.availability)}
                    </span>
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-slate-900">{integration.displayName}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{integration.description}</p>
                  <span className="mt-auto pt-5 text-sm font-bold text-cyan-700">View registry details</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="marketing-dark-band px-4 py-20 text-center sm:px-6 lg:py-28">
          <div className="mx-auto max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-300">Start with Project OS</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-5xl">
              Run today’s projects in one professional workspace.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-300">
              Project OS is the live Arden product. Explore plans now, then return to the catalog as the
              system grows.
            </p>
            <a href="/pricing" className="btn-primary mt-8 gap-2 px-6 py-3">
              View Project OS pricing
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </section>
      </main>
      <Footer />
      {selection ? <CatalogDialog selection={selection} onClose={() => setSelection(null)} /> : null}
    </div>
  )
}
