export const APP_LOGIN = 'https://app.concrete-calc.com/login'
export const APP_SIGNUP = 'https://app.concrete-calc.com/signup'

export const SECTION_IDS = {
  features: 'features',
  screenshots: 'screenshots',
  pricing: 'pricing',
  faq: 'faq',
} as const

export function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}
