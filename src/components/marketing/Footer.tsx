import { LayoutGrid } from 'lucide-react'
import { BRAND_NAME } from '../../constants/marketing'

const productLinks = [
  { href: '/#features', label: 'Project OS features' },
  { href: '/#screenshots', label: 'Screenshots' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/hub', label: 'Arden Hub' },
]

const legalLinks = [
  { href: '/terms', label: 'Terms' },
  { href: '/privacy', label: 'Privacy' },
  { href: '/contact', label: 'Contact' },
  { href: 'mailto:support@ardenprojectos.com', label: 'Support' },
]

export default function Footer() {
  return (
    <footer className="arden-site-footer px-4 py-12 sm:px-6">
      <div className="mx-auto grid w-full max-w-[96rem] gap-10 md:grid-cols-[1.2fr_0.7fr_0.7fr]">
        <div>
          <a href="/" className="inline-flex items-center gap-3 text-slate-900 no-underline" aria-label="Arden Systems home">
            <span className="arden-site-header__mark">
              <LayoutGrid className="h-5 w-5" aria-hidden="true" />
            </span>
            <strong>Arden Systems</strong>
          </a>
          <p className="mt-4 max-w-md text-sm leading-6 text-slate-600">
            Construction project software for clearer estimating, planning, field execution, and
            project control—built as the foundation of Arden Systems.
          </p>
        </div>
        <nav aria-label="Product" className="text-sm">
          <p className="font-bold text-slate-900">Product</p>
          <div className="mt-4 grid gap-3">
            {productLinks.map((link) => (
              <a key={link.href} href={link.href} className="text-slate-600 hover:text-cyan-700">
                {link.label}
              </a>
            ))}
          </div>
        </nav>
        <nav aria-label="Company and legal" className="text-sm">
          <p className="font-bold text-slate-900">Company</p>
          <div className="mt-4 grid gap-3">
            {legalLinks.map((link) => (
              <a key={link.href} href={link.href} className="text-slate-600 hover:text-cyan-700">
                {link.label}
              </a>
            ))}
          </div>
        </nav>
      </div>
      <div className="mx-auto mt-10 flex w-full max-w-[96rem] flex-wrap justify-between gap-3 border-t border-slate-200 pt-5 text-xs text-slate-500">
        <span>© {new Date().getFullYear()} {BRAND_NAME}. All rights reserved.</span>
        <span>Built for construction professionals.</span>
      </div>
    </footer>
  )
}
