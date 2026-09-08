import type { ReactNode } from 'react'
import { BRAND_NAME } from '../../constants/marketing'
import ProjectOsLogo from '../marketing/ProjectOsLogo'

const legalLinkClassName =
  'text-slate-400 transition-colors hover:text-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07111d]'

interface LegalPageLayoutProps {
  children: ReactNode
}

export default function LegalPageLayout({ children }: LegalPageLayoutProps) {
  return (
    <div className="relative min-h-screen bg-[#050b13] text-white">
      <header className="border-b border-white/10 bg-[#050b13]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-4 sm:flex-row lg:px-8">
          <a href="/" className="flex shrink-0 items-center" aria-label="Project OS home">
            <ProjectOsLogo variant="inverse" className="h-auto w-40 object-contain" />
          </a>
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm" aria-label="Legal">
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
