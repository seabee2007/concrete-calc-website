import type { ReactNode } from 'react'
import Header from './Header'
import Footer from './Footer'

interface MarketingPageShellProps {
  children: ReactNode
}

export default function MarketingPageShell({ children }: MarketingPageShellProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050b13]">
      <div className="marketing-page-bg" aria-hidden="true" />
      <div className="relative z-10 min-h-screen text-white">
        <Header />
        <main>{children}</main>
        <Footer />
      </div>
    </div>
  )
}
