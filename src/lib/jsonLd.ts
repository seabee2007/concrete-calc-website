import { MARKETING_URL } from '../constants/marketing'
import { getJsonLdOffers } from './publicPlanCatalog'

export const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Arden Project OS',
  url: MARKETING_URL,
  logo: `${MARKETING_URL}/images/ARDEN-removebg-preview.png`,
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'support@ardenprojectos.com',
    contactType: 'customer support',
  },
}

export const softwareApplicationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Arden Project OS',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  offers: getJsonLdOffers(),
}
