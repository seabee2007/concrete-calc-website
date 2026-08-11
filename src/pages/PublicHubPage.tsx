import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowRight, CheckCircle2, LayoutGrid, LogIn, Network, X } from 'lucide-react'
import CatalogArtwork from '../components/catalog/CatalogArtwork'
import IntegrationProviderArtwork from '../components/catalog/IntegrationProviderArtwork'
import ConnectedAppsSection from '../components/marketing/ConnectedAppsSection'
import Footer from '../components/marketing/Footer'
import Header from '../components/marketing/Header'
import SeoHead from '../components/seo/SeoHead'
import { MARKETING_URL, appLoginHref } from '../constants/marketing'
import { organizationJsonLd } from '../lib/jsonLd'
import {
  PUBLIC_ARDEN_CATALOG,
  capabilityStatusLabel,
  integrationStatusLabel,
  productStatusLabel,
  type PublicArdenIntegrationV1,
  type PublicArdenProductV1,
} from '../lib/publicArdenCatalog'
import {
  catalogSelectionSearch,
  resolvePublicCatalogSelection,
  type PublicCatalogSelection,
} from '../lib/publicCatalogRouting'

const PUBLIC_CATALOG_ORBIT_SLOTS = Object.freeze([
  { gridColumn: '1', gridRow: '1' },
  { gridColumn: '2', gridRow: '1' },
  { gridColumn: '3', gridRow: '1' },
  { gridColumn: '4', gridRow: '1' },
  { gridColumn: '4', gridRow: '2' },
  { gridColumn: '4', gridRow: '3' },
  { gridColumn: '3', gridRow: '3' },
  { gridColumn: '2', gridRow: '3' },
  { gridColumn: '1', gridRow: '3' },
  { gridColumn: '1', gridRow: '2' },
] as const)

function requirePublicProjectOs(): PublicArdenProductV1 {
  const product = PUBLIC_ARDEN_CATALOG.products.find(({ productId }) => productId === 'project_os')
  if (!product) throw new Error('Public catalog is missing Arden Project OS.')
  return product
}

const PUBLIC_PROJECT_OS = requirePublicProjectOs()
const PUBLIC_DISCOVER_PRODUCTS = PUBLIC_ARDEN_CATALOG.products.filter(
  ({ productId }) => productId !== 'project_os',
)

function SelectionArtwork({ selection }: { selection: PublicCatalogSelection }) {
  return selection.kind === 'integration' ? (
    <IntegrationProviderArtwork iconKey={selection.item.iconKey} size={96} />
  ) : (
    <CatalogArtwork iconKey={selection.item.iconKey} size={96} />
  )
}

function CatalogDialog({
  selection,
  onClose,
}: {
  selection: PublicCatalogSelection
  onClose: () => void
}) {
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
          <SelectionArtwork selection={selection} />
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

        <span className="catalog-status mt-6" data-status={statusKey}>{status}</span>
        <h2 id="catalog-dialog-title" className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">
          {selection.item.displayName}
        </h2>
        <p id="catalog-dialog-description" className="mt-4 leading-7 text-slate-600">
          {selection.item.description}
        </p>

        {isProduct && selection.item.capabilities.length > 0 ? (
          <div className="mt-7">
            <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-slate-500">Approved capabilities</h3>
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
            <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-slate-500">Capability status</h3>
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
              <a href={appLoginHref('/dashboard')} className="btn-secondary px-5 py-3">Open Project OS</a>
            </div>
          ) : isProduct ? (
            <div>
              <p className="text-sm leading-6 text-slate-600">
                {selection.item.interestCaptureAllowed
                  ? 'Sign in to follow this product and register interest. No release date or checkout is available from this page.'
                  : 'This catalog entry is informational. No release date or checkout is available from this page.'}
              </p>
              {selection.item.interestCaptureAllowed ? (
                <a href={appLoginHref(`/apps?product=${selection.item.productId}`)} className="btn-primary mt-4 gap-2 px-5 py-3">
                  <LogIn className="h-4 w-4" aria-hidden="true" />
                  Sign in to follow
                </a>
              ) : null}
            </div>
          ) : (
            <p className="text-sm leading-6 text-slate-600">
              Status comes from the Arden integration registry. This public Hub does not show
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

export default function PublicHubPage() {
  const [selection, setSelection] = useState<PublicCatalogSelection | null>(() =>
    typeof window === 'undefined' ? null : resolvePublicCatalogSelection(window.location.search),
  )
  const [viewMode, setViewMode] = useState<'orbit' | 'grid'>('orbit')
  const projectOs = PUBLIC_PROJECT_OS
  const products = PUBLIC_DISCOVER_PRODUCTS
  const orbitSupported = products.length === PUBLIC_CATALOG_ORBIT_SLOTS.length
  const showOrbit = orbitSupported && viewMode === 'orbit'

  const updateSelection = useCallback((next: PublicCatalogSelection | null) => {
    setSelection(next)
    if (typeof window === 'undefined') return
    const nextUrl = `${window.location.pathname}${catalogSelectionSearch(next)}${window.location.hash}`
    window.history.replaceState(null, '', nextUrl)
  }, [])

  useEffect(() => {
    const syncFromLocation = () => setSelection(resolvePublicCatalogSelection(window.location.search))
    window.addEventListener('popstate', syncFromLocation)
    return () => window.removeEventListener('popstate', syncFromLocation)
  }, [])

  const selectProduct = (product: PublicArdenProductV1) => updateSelection({ kind: 'product', item: product })
  const selectIntegration = (integration: PublicArdenIntegrationV1) =>
    updateSelection({ kind: 'integration', item: integration })

  return (
    <div className="marketing-refresh">
      <SeoHead
        title="Arden Hub | Construction Software Catalog"
        description="Explore Arden Project OS and the approved Arden Systems catalog for estimating, proposals, field work, safety, cost control, and connected construction workflows."
        canonical={`${MARKETING_URL}/hub`}
        jsonLd={organizationJsonLd}
      />
      <Header />
      <main>
        <section className="public-hub-section" aria-labelledby="public-hub-heading">
          <div className="public-hub-section__inner">
            <div className="public-hub-intro">
              <div>
                <p className="arden-eyebrow">Public Arden Hub</p>
                <h1 id="public-hub-heading">One system, organized around the work.</h1>
              </div>
              <p>
                Project OS is available today. Explore the approved Arden product family and
                customer-provider integrations with every availability status kept explicit.
              </p>
            </div>

            <div className="public-hub-toolbar">
              <div>
                <p className="font-semibold text-slate-900">Discover Arden</p>
                <p className="mt-1 text-sm text-slate-600">Select any product for approved details and its next available action.</p>
              </div>
              <div className="hidden items-center rounded-xl border border-slate-200 bg-white p-1 shadow-sm xl:inline-flex" role="group" aria-label="Product layout">
                <button
                  type="button"
                  className={`public-hub-view-button ${viewMode === 'orbit' ? 'is-active' : ''}`}
                  aria-pressed={viewMode === 'orbit'}
                  onClick={() => setViewMode('orbit')}
                  disabled={!orbitSupported}
                >
                  <Network className="h-4 w-4" aria-hidden="true" /> Orbit
                </button>
                <button
                  type="button"
                  className={`public-hub-view-button ${viewMode === 'grid' ? 'is-active' : ''}`}
                  aria-pressed={viewMode === 'grid'}
                  onClick={() => setViewMode('grid')}
                >
                  <LayoutGrid className="h-4 w-4" aria-hidden="true" /> Grid
                </button>
              </div>
            </div>

            {showOrbit ? (
              <div className="catalog-constellation hidden xl:grid" data-testid="public-catalog-constellation">
                <button
                  type="button"
                  className="catalog-constellation__core group"
                  onClick={() => selectProduct(projectOs)}
                  aria-label={`${projectOs.displayName}, ${productStatusLabel(projectOs.releaseStatus)}`}
                >
                  <span className="catalog-constellation__core-content">
                    <span className="catalog-constellation__core-label">Available now</span>
                    <CatalogArtwork iconKey={projectOs.iconKey} size={72} />
                    <strong>{projectOs.displayName}</strong>
                    <span>One workspace for today&apos;s construction projects.</span>
                  </span>
                </button>
                {products.map((product, index) => {
                  const slot = PUBLIC_CATALOG_ORBIT_SLOTS[index]
                  if (!slot) return null
                  return (
                    <div
                      key={product.productId}
                      className="catalog-constellation__slot"
                      style={{ gridColumn: slot.gridColumn, gridRow: slot.gridRow }}
                      data-orbit-column={slot.gridColumn}
                      data-orbit-row={slot.gridRow}
                    >
                      <button
                        type="button"
                        className="catalog-constellation__card group"
                        onClick={() => selectProduct(product)}
                        aria-label={`${product.displayName}, ${productStatusLabel(product.releaseStatus)}`}
                      >
                        <CatalogArtwork iconKey={product.iconKey} size={56} />
                        <span className="min-w-0 flex-1">
                          <strong className="block text-sm leading-5">{product.shortName}</strong>
                          <span className="block text-xs text-slate-500">{productStatusLabel(product.releaseStatus)}</span>
                          <span className="catalog-constellation__summary">{product.summary}</span>
                        </span>
                      </button>
                    </div>
                  )
                })}
              </div>
            ) : null}

            <div className={`mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 ${showOrbit ? 'xl:hidden' : ''}`} data-testid="public-catalog-grid">
              {[projectOs, ...products].map((product) => (
                <ProductCard key={product.productId} product={product} onSelect={() => selectProduct(product)} />
              ))}
            </div>
          </div>
        </section>

        <ConnectedAppsSection onSelect={selectIntegration} compact />
      </main>
      <Footer />
      {selection ? <CatalogDialog selection={selection} onClose={() => updateSelection(null)} /> : null}
    </div>
  )
}
