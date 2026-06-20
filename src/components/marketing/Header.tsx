import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { APP_LOGIN, SECTION_IDS, scrollToSection } from '../../constants/marketing'

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
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#050b13]/90 backdrop-blur-xl">
      <div className="mx-auto flex min-h-[72px] max-w-7xl items-center justify-between px-6 lg:px-8">
        <a href="#" className="flex shrink-0 items-center">
          <img
            src="/images/ARDEN-removebg-preview.png"
            alt="Arden Project OS"
            className="h-auto max-h-9 w-[150px] object-contain sm:max-h-10 sm:w-[170px] lg:w-[210px]"
          />
        </a>

        <nav className="hidden flex-1 items-center justify-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <button
              key={link.id}
              type="button"
              onClick={() => handleNavClick(link.id)}
              className="text-sm font-semibold text-slate-300 transition hover:text-white"
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div className="hidden shrink-0 items-center gap-5 lg:flex">
          <a
            href={APP_LOGIN}
            className="text-sm font-semibold text-slate-300 transition hover:text-white"
          >
            Login
          </a>
          <a
            href="/pricing"
            className="inline-flex h-11 items-center justify-center rounded-2xl bg-cyan-500 px-6 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-400"
          >
            View pricing
          </a>
        </div>

        <button
          type="button"
          className="rounded-lg p-2 text-slate-300 transition hover:bg-white/5 hover:text-white lg:hidden"
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
            className="overflow-hidden border-t border-white/10 lg:hidden"
          >
            <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-4 lg:px-8">
              <span className="w-fit rounded-full border border-electric-500/30 bg-electric-500/10 px-2.5 py-0.5 text-xs font-medium text-electric-400">
                Construction Management Software
              </span>
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => handleNavClick(link.id)}
                  className="text-left text-sm font-semibold text-slate-300 transition hover:text-white"
                >
                  {link.label}
                </button>
              ))}
              <div className="flex flex-col gap-3 pt-2">
                <a
                  href={APP_LOGIN}
                  className="btn-secondary text-center text-sm font-semibold"
                >
                  Login
                </a>
                <a
                  href="/pricing"
                  className="inline-flex h-11 items-center justify-center rounded-2xl bg-cyan-500 px-6 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-400"
                >
                  View pricing
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
