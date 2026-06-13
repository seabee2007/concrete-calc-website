import { useState } from 'react'
import { APP_LOGIN, APP_SIGNUP, BRAND_NAME, SECTION_IDS, scrollToSection } from '../../constants/marketing'
import LegalDocumentModal from '../legal/LegalDocumentModal'
import PrivacyPolicy from '../legal/PrivacyPolicy'
import TermsOfService from '../legal/TermsOfService'

const productLinks = [
  { label: 'Features', id: SECTION_IDS.features },
  { label: 'Screenshots', id: SECTION_IDS.screenshots },
  { label: 'Pricing', id: SECTION_IDS.pricing },
  { label: 'FAQ', id: SECTION_IDS.faq },
]

const companyLinks = [
  { label: 'About', href: '#' },
  { label: 'Contact', href: '#' },
  { label: 'Privacy', action: 'privacy' as const },
  { label: 'Terms', action: 'terms' as const },
]

export default function Footer() {
  const [showTerms, setShowTerms] = useState(false)
  const [showPrivacy, setShowPrivacy] = useState(false)

  return (
    <>
      <footer className="relative z-10 border-t border-white/10 bg-navy-950/30 py-12 backdrop-blur-sm lg:py-16">
        <div className="section-container">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div className="sm:col-span-2 lg:col-span-1">
              <a href="#" className="inline-block" aria-label={BRAND_NAME}>
                <img
                  src="/images/logo_dark_banner_simple.png"
                  alt={BRAND_NAME}
                  className="h-10 w-auto max-w-[220px] object-contain"
                />
              </a>
              <p className="mt-3 text-sm font-medium text-white">{BRAND_NAME}</p>
              <p className="mt-1 text-sm text-electric-400">Estimate. Schedule. Deliver.</p>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-concrete-400">
                Professional construction project management software for estimates, proposals, schedules, and planning.
              </p>
            </div>

            {/* Product */}
            <div>
              <p className="text-sm font-semibold text-white">Product</p>
              <ul className="mt-4 space-y-3">
                {productLinks.map((link) => (
                  <li key={link.id}>
                    <button
                      type="button"
                      onClick={() => scrollToSection(link.id)}
                      className="text-sm text-concrete-400 transition-colors hover:text-white"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <p className="text-sm font-semibold text-white">Company</p>
              <ul className="mt-4 space-y-3">
                {companyLinks.map((link) => (
                  <li key={link.label}>
                    {'action' in link ? (
                      <button
                        type="button"
                        onClick={() =>
                          link.action === 'terms' ? setShowTerms(true) : setShowPrivacy(true)
                        }
                        className="text-sm text-concrete-400 transition-colors hover:text-white"
                      >
                        {link.label}
                      </button>
                    ) : (
                      <a
                        href={link.href}
                        className="text-sm text-concrete-400 transition-colors hover:text-white"
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Account */}
            <div>
              <p className="text-sm font-semibold text-white">Get Started</p>
              <ul className="mt-4 space-y-3">
                <li>
                  <a
                    href={APP_LOGIN}
                    className="text-sm text-concrete-400 transition-colors hover:text-white"
                  >
                    Login
                  </a>
                </li>
                <li>
                  <a
                    href={APP_SIGNUP}
                    className="text-sm font-medium text-electric-400 transition-colors hover:text-electric-300"
                  >
                    Start Free Trial
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t border-white/10 pt-8">
            <p className="text-center text-sm text-concrete-500">
              &copy; {new Date().getFullYear()} {BRAND_NAME}. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      <LegalDocumentModal
        open={showTerms}
        title="Terms of Service"
        onClose={() => setShowTerms(false)}
      >
        <TermsOfService />
      </LegalDocumentModal>

      <LegalDocumentModal
        open={showPrivacy}
        title="Privacy Policy"
        onClose={() => setShowPrivacy(false)}
      >
        <PrivacyPolicy />
      </LegalDocumentModal>
    </>
  )
}
