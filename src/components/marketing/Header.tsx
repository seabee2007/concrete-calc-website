import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { APP_LOGIN, APP_SIGNUP, BRAND_NAME, SECTION_IDS, scrollToSection } from '../../constants/marketing'

const navLinks = [
  { label: 'Features', id: SECTION_IDS.features },
  { label: 'Screenshots', id: SECTION_IDS.screenshots },
  { label: 'Pricing', id: SECTION_IDS.pricing },
  { label: 'FAQ', id: SECTION_IDS.faq },
]

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleNavClick = (id: string) => {
    scrollToSection(id)
    setMobileOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-navy-950/80 backdrop-blur-md">
      <div className="section-container flex h-16 items-center justify-between lg:h-[72px]">
        <div className="flex items-center gap-3">
          <a href="#" className="text-lg font-bold text-white lg:text-xl">
            {BRAND_NAME}
          </a>
          <span className="hidden rounded-full border border-electric-500/30 bg-electric-500/10 px-2.5 py-0.5 text-xs font-medium text-electric-400 sm:inline-block">
            Construction Management Software
          </span>
        </div>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <button
              key={link.id}
              type="button"
              onClick={() => handleNavClick(link.id)}
              className="text-sm font-medium text-concrete-300 transition-colors hover:text-white"
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <a
            href={APP_LOGIN}
            className="text-sm font-medium text-concrete-300 transition-colors hover:text-white"
          >
            Login
          </a>
          <a href={APP_SIGNUP} className="btn-primary">
            Start Free Trial
          </a>
        </div>

        <button
          type="button"
          className="rounded-lg p-2 text-concrete-300 hover:bg-white/5 md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-white/10 md:hidden"
          >
            <div className="section-container flex flex-col gap-4 py-4">
              <span className="rounded-full border border-electric-500/30 bg-electric-500/10 px-2.5 py-0.5 text-xs font-medium text-electric-400 w-fit">
                Construction Management Software
              </span>
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => handleNavClick(link.id)}
                  className="text-left text-sm font-medium text-concrete-300 hover:text-white"
                >
                  {link.label}
                </button>
              ))}
              <div className="flex flex-col gap-3 pt-2">
                <a href={APP_LOGIN} className="btn-secondary text-center">
                  Login
                </a>
                <a href={APP_SIGNUP} className="btn-primary text-center">
                  Start Free Trial
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
