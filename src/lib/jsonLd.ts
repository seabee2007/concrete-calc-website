import { BRAND_NAME, MARKETING_URL, SYSTEMS_BRAND_NAME } from '../constants/marketing'
import { getJsonLdOffers } from './publicPlanCatalog'

export const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SYSTEMS_BRAND_NAME,
  url: MARKETING_URL,
  logo: `${MARKETING_URL}/images/brand/project-os-icon-512.png`,
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'support@ardenprojectos.com',
    contactType: 'customer support',
  },
}

export const softwareApplicationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: BRAND_NAME,
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  offers: getJsonLdOffers(),
}
