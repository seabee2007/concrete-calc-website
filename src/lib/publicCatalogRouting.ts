import {
  PUBLIC_ARDEN_CATALOG,
  type PublicArdenIntegrationV1,
  type PublicArdenProductV1,
} from './publicArdenCatalog'

export type PublicCatalogSelection =
  | { kind: 'product'; item: PublicArdenProductV1 }
  | { kind: 'integration'; item: PublicArdenIntegrationV1 }

export function resolvePublicCatalogSelection(search: string): PublicCatalogSelection | null {
  const params = new URLSearchParams(search)
  const productId = params.get('product')
  if (productId) {
    const product = PUBLIC_ARDEN_CATALOG.products.find((item) => item.productId === productId)
    if (product) return { kind: 'product', item: product }
  }

  const integrationId = params.get('integration')
  if (integrationId) {
    const integration = PUBLIC_ARDEN_CATALOG.integrations.find(
      (item) => item.integrationId === integrationId,
    )
    if (integration) return { kind: 'integration', item: integration }
  }

  return null
}

export function catalogSelectionSearch(selection: PublicCatalogSelection | null): string {
  if (!selection) return ''
  const params = new URLSearchParams()
  if (selection.kind === 'product') params.set('product', selection.item.productId)
  else params.set('integration', selection.item.integrationId)
  return `?${params.toString()}`
}
