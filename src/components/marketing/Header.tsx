import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { appLoginHref } from '../../constants/marketing'
import ProjectOsLogo from './ProjectOsLogo'
import '../../marketing-refresh.css'
import '../../marketing-deck.css'

const hubLink = { label: 'Arden Hub', href: '/hub' }

const navLinks = [
  { label: 'Apps', href: '/#apps' },
  { label: 'Connected workflow', href: '/#connected-apps' },
  { label: 'Pricing', href: '/#pricing' },
  { label: 'FAQ', href: '/#faq' },
]

const dashboardLogin = appLoginHref('/dashboard')

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const reducedMotion = Boolean(useReducedMotion())

  return (
    <header className="arden-site-header">
      <div className="arden-site-header__inner">
        <a href="/" className="arden-site-header__brand" aria-label="Project OS home">
          <ProjectOsLogo className="arden-site-header__logo" />
        </a>

        <span className="arden-site-header__divider" aria-hidden="true" />
        <a href={hubLink.href} className="arden-site-header__hub-link">
          {hubLink.label}
        </a>

        <nav className="arden-site-header__nav" aria-label="Primary navigation">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="arden-site-header__link">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="arden-site-header__actions">
          <a href={dashboardLogin} className="arden-site-header__dashboard">
            Open dashboard
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>

        <button
          type="button"
          className="arden-site-header__menu-button"
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
            className="arden-site-header__mobile"
            initial={reducedMotion ? false : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={reducedMotion ? undefined : { opacity: 0, height: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.18 }}
          >
            <a href={hubLink.href} className="arden-site-header__link" onClick={() => setMobileOpen(false)}>
              {hubLink.label}
            </a>
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
            <a href={dashboardLogin} className="arden-site-header__dashboard" onClick={() => setMobileOpen(false)}>
              Open dashboard
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  )
}
