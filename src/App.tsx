import type { ComponentType } from 'react'
import { useSyncExternalStore } from 'react'
import MarketingHome from './pages/MarketingHome'
import PrivacyPage from './pages/PrivacyPage'
import TermsPage from './pages/TermsPage'
import ContactPage from './pages/ContactPage'
import PricingPage from './pages/PricingPage'
import ChangeOrderManagementPage from './pages/marketing/ChangeOrderManagementPage'
import ConstructionClientPortalPage from './pages/marketing/ConstructionClientPortalPage'
import ConstructionDailyReportsPage from './pages/marketing/ConstructionDailyReportsPage'
import ConstructionEstimatingPage from './pages/marketing/ConstructionEstimatingPage'
import ConstructionProjectManagementPage from './pages/marketing/ConstructionProjectManagementPage'
import ConstructionSchedulingPage from './pages/marketing/ConstructionSchedulingPage'
import ContractorProposalPage from './pages/marketing/ContractorProposalPage'
import RfiFarQcPage from './pages/marketing/RfiFarQcPage'

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

const PAGE_ROUTES: Record<string, ComponentType> = {
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

export default function App() {
  const pathname = usePathname()
  const Page = PAGE_ROUTES[pathname]

  if (Page) {
    return <Page />
  }

  return <MarketingHome />
}
