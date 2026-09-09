import catalogJson from '../../shared/public-arden-catalog-v1.json'

export type PublicProductReleaseStatus = 'planned' | 'coming_soon' | 'beta' | 'live' | 'retired'
export type PublicIntegrationAvailability =
  | 'available'
  | 'beta'
  | 'coming_soon'
  | 'planned'
  | 'retired'
export type PublicCapabilitySupportState =
  | 'supported'
  | 'preview'
  | 'not_yet_supported'
  | 'retired'

export interface PublicArdenProductV1 {
  productId: string
  slug: string
  displayName: string
  shortName: string
  summary: string
  description: string
  audience: readonly string[]
  capabilities: readonly string[]
  iconKey: string
  releaseStatus: PublicProductReleaseStatus
  interestCaptureAllowed: boolean
  sortOrder: number
}

export interface PublicArdenIntegrationCapabilityV1 {
  capabilityId: string
  displayName: string
  summary: string
  supportState: PublicCapabilitySupportState
}

export interface PublicArdenIntegrationV1 {
  integrationId: string
  displayName: string
  description: string
  iconKey: string
  availability: PublicIntegrationAvailability
  capabilities: readonly PublicArdenIntegrationCapabilityV1[]
  supportedProductIds: readonly string[]
  sortOrder: number
}

export interface PublicArdenArtworkV1 {
  iconKey: string
  fileName: string
  sha256: string
}

export interface PublicArdenCatalogV1 {
  schemaVersion: 'public-arden-catalog.v1'
  contentDigest: string
  products: readonly PublicArdenProductV1[]
  integrations: readonly PublicArdenIntegrationV1[]
  artwork: readonly PublicArdenArtworkV1[]
}

const PRODUCT_STATUSES = new Set<PublicProductReleaseStatus>([
  'planned',
  'coming_soon',
  'beta',
  'live',
  'retired',
])
const INTEGRATION_STATUSES = new Set<PublicIntegrationAvailability>([
  'available',
  'beta',
  'coming_soon',
  'planned',
  'retired',
])
const SHA256_PATTERN = /^sha256:[a-f0-9]{64}$/

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function assertStringArray(value: unknown, field: string): asserts value is string[] {
  if (!Array.isArray(value) || value.some((item) => typeof item !== 'string')) {
    throw new Error(`Public Arden Systems catalog field ${field} must be an array of strings.`)
  }
}

function assertSorted<T>(values: readonly T[], getOrder: (value: T) => number, field: string) {
  for (let index = 1; index < values.length; index += 1) {
    if (getOrder(values[index]) <= getOrder(values[index - 1])) {
      throw new Error(`Public Arden Systems catalog ${field} must use strictly increasing sortOrder.`)
    }
  }
}

export function validatePublicArdenCatalogV1(input: unknown): PublicArdenCatalogV1 {
  if (!isRecord(input) || input.schemaVersion !== 'public-arden-catalog.v1') {
    throw new Error('Unsupported public Arden Systems catalog schema version.')
  }
  if (typeof input.contentDigest !== 'string' || !SHA256_PATTERN.test(input.contentDigest)) {
    throw new Error('Public Arden Systems catalog contentDigest must be a SHA-256 digest.')
  }
  if (!Array.isArray(input.products) || !Array.isArray(input.integrations) || !Array.isArray(input.artwork)) {
    throw new Error('Public Arden Systems catalog collections are missing.')
  }

  for (const [index, product] of input.products.entries()) {
    if (!isRecord(product)) throw new Error(`Product ${index} must be an object.`)
    for (const field of [
      'productId',
      'slug',
      'displayName',
      'shortName',
      'summary',
      'description',
      'iconKey',
    ]) {
      if (typeof product[field] !== 'string' || product[field].length === 0) {
        throw new Error(`Product ${index} has an invalid ${field}.`)
      }
    }
    assertStringArray(product.audience, `products[${index}].audience`)
    assertStringArray(product.capabilities, `products[${index}].capabilities`)
    if (!PRODUCT_STATUSES.has(product.releaseStatus as PublicProductReleaseStatus)) {
      throw new Error(`Product ${index} has an invalid releaseStatus.`)
    }
    if (typeof product.interestCaptureAllowed !== 'boolean' || !Number.isInteger(product.sortOrder)) {
      throw new Error(`Product ${index} has invalid eligibility or ordering.`)
    }
  }

  for (const [index, integration] of input.integrations.entries()) {
    if (!isRecord(integration)) throw new Error(`Integration ${index} must be an object.`)
    for (const field of ['integrationId', 'displayName', 'description', 'iconKey']) {
      if (typeof integration[field] !== 'string' || integration[field].length === 0) {
        throw new Error(`Integration ${index} has an invalid ${field}.`)
      }
    }
    if (!INTEGRATION_STATUSES.has(integration.availability as PublicIntegrationAvailability)) {
      throw new Error(`Integration ${index} has an invalid availability.`)
    }
    assertStringArray(integration.supportedProductIds, `integrations[${index}].supportedProductIds`)
    if (!Array.isArray(integration.capabilities) || !Number.isInteger(integration.sortOrder)) {
      throw new Error(`Integration ${index} has invalid capabilities or ordering.`)
    }
  }

  for (const [index, artwork] of input.artwork.entries()) {
    if (
      !isRecord(artwork) ||
      typeof artwork.iconKey !== 'string' ||
      typeof artwork.fileName !== 'string' ||
      typeof artwork.sha256 !== 'string' ||
      !SHA256_PATTERN.test(artwork.sha256)
    ) {
      throw new Error(`Artwork ${index} is invalid.`)
    }
  }

  const catalog = input as unknown as PublicArdenCatalogV1
  assertSorted(catalog.products, ({ sortOrder }) => sortOrder, 'products')
  assertSorted(catalog.integrations, ({ sortOrder }) => sortOrder, 'integrations')
  return catalog
}

export const PUBLIC_ARDEN_CATALOG = validatePublicArdenCatalogV1(catalogJson)

export function productStatusLabel(status: PublicProductReleaseStatus) {
  if (status === 'coming_soon') return 'Coming Soon'
  return status.charAt(0).toUpperCase() + status.slice(1)
}

export function integrationStatusLabel(status: PublicIntegrationAvailability) {
  if (status === 'coming_soon') return 'Coming Soon'
  return status.charAt(0).toUpperCase() + status.slice(1)
}

export function capabilityStatusLabel(status: PublicCapabilitySupportState) {
  if (status === 'not_yet_supported') return 'Not yet supported'
  return status.charAt(0).toUpperCase() + status.slice(1)
}

export function getPublicArtwork(iconKey: string) {
  return PUBLIC_ARDEN_CATALOG.artwork.find((artwork) => artwork.iconKey === iconKey) ?? null
}
