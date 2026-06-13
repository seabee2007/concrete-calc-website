export const BRAND_NAME = 'Arden Project OS'
export const MARKETING_URL = 'https://ardenprojectos.com'
export const APP_URL = 'https://app.ardenprojectos.com'
export const AUTH_URL = 'https://auth.ardenprojectos.com'
export const APP_LOGIN = `${APP_URL}/login`
export const APP_SIGNUP = `${APP_URL}/signup`

export const SECTION_IDS = {
  features: 'features',
  screenshots: 'screenshots',
  pricing: 'pricing',
  faq: 'faq',
} as const

export function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}
