import { APP_LOGIN, APP_SIGNUP, SECTION_IDS, scrollToSection } from '../../constants/marketing'

const productLinks = [
  { label: 'Features', id: SECTION_IDS.features },
  { label: 'Screenshots', id: SECTION_IDS.screenshots },
  { label: 'Pricing', id: SECTION_IDS.pricing },
  { label: 'FAQ', id: SECTION_IDS.faq },
]

const companyLinks = [
  { label: 'About', href: '#' },
  { label: 'Contact', href: '#' },
  { label: 'Privacy', href: '#' },
  { label: 'Terms', href: '#' },
]

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-navy-950/50 py-12 lg:py-16">
      <div className="section-container">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <p className="text-lg font-bold text-white">Concrete Calc</p>
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
                  <a
                    href={link.href}
                    className="text-sm text-concrete-400 transition-colors hover:text-white"
                  >
                    {link.label}
                  </a>
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
            &copy; {new Date().getFullYear()} Concrete Calc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
