export const BRAND_NAME = 'Project OS'
export const SYSTEMS_BRAND_NAME = 'Arden Systems'
export const MARKETING_URL = 'https://ardenprojectos.com'
export const APP_URL = 'https://app.ardenprojectos.com'
export const AUTH_URL = 'https://auth.ardenprojectos.com'
export const APP_LOGIN = `${APP_URL}/login`
export const APP_SIGNUP = `${APP_URL}/signup`

export function appLoginHref(returnTo = '/dashboard') {
  const params = new URLSearchParams({ returnTo })
  return `${APP_LOGIN}?${params.toString()}`
}

export const SECTION_IDS = {
  workflow: 'workflow',
  features: 'features',
  ecosystem: 'apps',
  integrations: 'connected-apps',
  screenshots: 'screenshots',
  pricing: 'pricing',
  faq: 'faq',
} as const

export function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}
