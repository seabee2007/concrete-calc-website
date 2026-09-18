import type { ComponentType } from 'react'
import { useSyncExternalStore } from 'react'
import { normalizePathname } from './lib/marketingRoutePaths'
import ContactPage from './pages/ContactPage'
import MarketingHomeRefresh from './pages/MarketingHomeRefresh'
import PricingPage from './pages/PricingPage'
import PrivacyPage from './pages/PrivacyPage'
import PublicHubPage from './pages/PublicHubPage'
import TermsPage from './pages/TermsPage'
import ChangeOrderManagementPage from './pages/marketing/ChangeOrderManagementPage'
import ConstructionClientPortalPage from './pages/marketing/ConstructionClientPortalPage'
import ConstructionDailyReportsPage from './pages/marketing/ConstructionDailyReportsPage'
import ConstructionEstimatingPage from './pages/marketing/ConstructionEstimatingPage'
import ConstructionProjectManagementPage from './pages/marketing/ConstructionProjectManagementPage'
import ConstructionSchedulingPage from './pages/marketing/ConstructionSchedulingPage'
import ContractorProposalPage from './pages/marketing/ContractorProposalPage'
import RfiFarQcPage from './pages/marketing/RfiFarQcPage'

// The server snapshot is what the prerender renders for a route and what the
// browser hydrates against; both sides pass the pathname they know, so the
// first client render matches the static HTML.
function usePathname(initialPathname: string) {
  return useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener('popstate', onStoreChange)
      return () => window.removeEventListener('popstate', onStoreChange)
    },
    () => window.location.pathname,
    () => initialPathname,
  )
}

const PAGE_ROUTES: Readonly<Record<string, ComponentType>> = {
  '/hub': PublicHubPage,
  '/privacy': PrivacyPage,
  '/privacy-policy': PrivacyPage,
  '/terms': TermsPage,
  '/contact': ContactPage,
  '/pricing': PricingPage,
  '/construction-project-management-software': ConstructionProjectManagementPage,
  '/construction-estimating-software': ConstructionEstimatingPage,
  '/construction-scheduling-software': ConstructionSchedulingPage,
  '/contractor-proposal-software': ContractorProposalPage,
  '/change-order-management-software': ChangeOrderManagementPage,
  '/construction-client-portal': ConstructionClientPortalPage,
  '/construction-daily-reports': ConstructionDailyReportsPage,
  '/rfi-far-qc-construction-software': RfiFarQcPage,
}

export interface AppProps {
  /** Pathname to render before the browser location is read (prerender and hydration). */
  initialPathname?: string
}

export default function App({ initialPathname = '/' }: AppProps) {
  const pathname = normalizePathname(usePathname(initialPathname))
  const Page = PAGE_ROUTES[pathname]
  return Page ? <Page /> : <MarketingHomeRefresh />
}
