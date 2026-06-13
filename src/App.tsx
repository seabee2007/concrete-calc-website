import { useSyncExternalStore } from 'react'
import MarketingHome from './pages/MarketingHome'
import PrivacyPage from './pages/PrivacyPage'
import TermsPage from './pages/TermsPage'

function usePathname() {
  return useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener('popstate', onStoreChange)
      return () => window.removeEventListener('popstate', onStoreChange)
    },
    () => window.location.pathname,
    () => '/',
  )
}

export default function App() {
  const pathname = usePathname()

  if (pathname === '/privacy') {
    return <PrivacyPage />
  }

  if (pathname === '/terms') {
    return <TermsPage />
  }

  return <MarketingHome />
}
