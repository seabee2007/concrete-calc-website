import type { ReactNode } from 'react'
import { BRAND_NAME } from '../../constants/marketing'

const legalLinkClassName =
  'text-slate-400 transition-colors hover:text-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07111d]'

interface LegalPageLayoutProps {
  children: ReactNode
}

export default function LegalPageLayout({ children }: LegalPageLayoutProps) {
  return (
    <div className="relative min-h-screen bg-[#050b13] text-white">
      <header className="border-b border-white/10 bg-[#050b13]/90 backdrop-blur-xl">
        <div className="mx-auto flex min-h-[72px] max-w-7xl items-center justify-between px-6 lg:px-8">
          <a href="/" className="flex shrink-0 items-center">
            <img
              src="/images/ARDEN-removebg-preview.png"
              alt={BRAND_NAME}
              className="h-auto max-h-9 w-[150px] object-contain sm:max-h-10 sm:w-[170px] lg:w-[210px]"
            />
          </a>
          <nav className="flex items-center gap-6 text-sm" aria-label="Legal">
            <a href="/terms" className={legalLinkClassName}>
              Terms of Service
            </a>
            <a href="/privacy" className={legalLinkClassName}>
              Privacy Policy
            </a>
            <a href="/contact" className={legalLinkClassName}>
              Contact
            </a>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-12 lg:px-8 lg:py-16">{children}</main>

      <footer className="border-t border-white/10 bg-[#07111d]/90 px-6 py-8 text-center backdrop-blur-md">
        <nav
          className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-sm text-slate-400"
          aria-label="Legal"
        >
          <a href="/" className={legalLinkClassName}>
            Home
          </a>
          <a href="/terms" className={legalLinkClassName}>
            Terms of Service
          </a>
          <a href="/privacy" className={legalLinkClassName}>
            Privacy Policy
          </a>
          <a href="/contact" className={legalLinkClassName}>
            Contact Us
          </a>
        </nav>
        <p className="mt-6 text-xs text-slate-500">
          © {new Date().getFullYear()} {BRAND_NAME}. All rights reserved.
        </p>
      </footer>
    </div>
  )
}
