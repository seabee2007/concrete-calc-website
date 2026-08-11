import type { ComponentType } from 'react'
import { useEffect, useSyncExternalStore } from 'react'
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

function LegacyAppsRedirect() {
  useEffect(() => {
    window.location.replace(`/hub${window.location.search}${window.location.hash}`)
  }, [])

  return (
    <main className="marketing-refresh grid min-h-screen place-items-center px-6 text-center">
      <div>
        <p className="arden-eyebrow">Arden Systems</p>
        <h1 className="mt-4 text-3xl font-semibold text-slate-900">Opening the public Arden Hub…</h1>
      </div>
    </main>
  )
}

const PAGE_ROUTES: Readonly<Record<string, ComponentType>> = {
  '/hub': PublicHubPage,
  '/apps': LegacyAppsRedirect,
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
  return Page ? <Page /> : <MarketingHomeRefresh />
}
