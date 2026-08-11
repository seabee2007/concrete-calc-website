import type { ReactNode } from 'react'
import Footer from './Footer'
import Header from './Header'

export default function MarketingPageShell({ children }: { children: ReactNode }) {
  return (
    <div className="marketing-refresh">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  )
}
