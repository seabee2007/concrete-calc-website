import ConnectedAppsSection from '../components/marketing/ConnectedAppsSection'
import EcosystemPreview from '../components/marketing/EcosystemPreview'
import FAQ from '../components/marketing/FAQ'
import FeatureGrid from '../components/marketing/FeatureGrid'
import Footer from '../components/marketing/Footer'
import Header from '../components/marketing/Header'
import PricingPreview from '../components/marketing/PricingPreview'
import ProjectOsHero from '../components/marketing/ProjectOsHero'
import ScreenshotShowcase from '../components/marketing/ScreenshotShowcase'
import WorkflowSection from '../components/marketing/WorkflowSection'
import SeoHead from '../components/seo/SeoHead'
import { MARKETING_URL } from '../constants/marketing'
import { organizationJsonLd, softwareApplicationJsonLd } from '../lib/jsonLd'
import { MARKETING_SECTION_ORDER } from '../lib/marketingSectionOrder'

export default function MarketingHomeRefresh() {
  return (
    <div className="marketing-refresh" data-marketing-section-order={MARKETING_SECTION_ORDER.join(',')}>
      <SeoHead
        title="Arden Project OS | Construction Project Management Software for Contractors"
        description="Plan estimates, proposals, schedules, change orders, field work, and client approvals in one construction project management workspace built for contractors."
        canonical={`${MARKETING_URL}/`}
        jsonLd={[organizationJsonLd, softwareApplicationJsonLd]}
      />
      <Header />
      <main>
        <ProjectOsHero />
        <WorkflowSection />
        <FeatureGrid />
        <EcosystemPreview />
        <ConnectedAppsSection />
        <div className="marketing-dark-band marketing-dark-showcase">
          <ScreenshotShowcase />
        </div>
        <FAQ />
        <PricingPreview />
      </main>
      <Footer />
    </div>
  )
}
