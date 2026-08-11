import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, LayoutGrid, Menu, X } from 'lucide-react'
import { APP_LOGIN } from '../../constants/marketing'
import '../../marketing-refresh.css'

const navLinks = [
  { label: 'Project OS', href: '/#features' },
  { label: 'Screenshots', href: '/#screenshots' },
  { label: 'Arden Apps', href: '/apps' },
  { label: 'Pricing', href: '/pricing' },
]

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="arden-site-header">
      <div className="arden-site-header__inner">
        <a href="/" className="arden-site-header__brand" aria-label="Arden Project OS home">
          <span className="arden-site-header__mark">
            <LayoutGrid className="h-5 w-5" aria-hidden="true" />
          </span>
          <span>
            <strong className="block text-[0.68rem] uppercase tracking-[0.22em] text-cyan-700">Arden</strong>
            <span className="block text-sm font-bold tracking-tight">Project OS</span>
          </span>
        </a>

        <nav className="arden-site-header__nav" aria-label="Primary navigation">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="arden-site-header__link">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto hidden items-center gap-2 lg:flex">
          <a href={APP_LOGIN} className="arden-site-header__link inline-flex items-center gap-1.5">
            Sign in
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
          <a href="/pricing" className="arden-site-header__cta">
            View pricing
          </a>
        </div>

        <button
          type="button"
          className="arden-site-header__menu-button ml-auto rounded-xl border border-slate-200 bg-white p-2 text-slate-700 lg:hidden"
          onClick={() => setMobileOpen((open) => !open)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-marketing-navigation"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence initial={false}>
        {mobileOpen ? (
          <motion.nav
            id="mobile-marketing-navigation"
            aria-label="Mobile navigation"
            className="arden-site-header__mobile lg:hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.18 }}
          >
            <div className="mx-auto flex max-w-[96rem] flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="arden-site-header__link"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <a href={APP_LOGIN} className="arden-site-header__link" onClick={() => setMobileOpen(false)}>
                Sign in to Arden
              </a>
              <a href="/pricing" className="arden-site-header__cta mt-2" onClick={() => setMobileOpen(false)}>
                View pricing
              </a>
            </div>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  )
}
