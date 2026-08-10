import EcosystemPreview from '../components/marketing/EcosystemPreview'
import FAQ from '../components/marketing/FAQ'
import FeatureGrid from '../components/marketing/FeatureGrid'
import FinalCTA from '../components/marketing/FinalCTA'
import Footer from '../components/marketing/Footer'
import Header from '../components/marketing/Header'
import PricingPreview from '../components/marketing/PricingPreview'
import ProblemSolution from '../components/marketing/ProblemSolution'
import ProjectOsHero from '../components/marketing/ProjectOsHero'
import ScreenshotShowcase from '../components/marketing/ScreenshotShowcase'
import WorkflowSection from '../components/marketing/WorkflowSection'
import SeoHead from '../components/seo/SeoHead'
import { MARKETING_URL } from '../constants/marketing'
import { organizationJsonLd, softwareApplicationJsonLd } from '../lib/jsonLd'

export default function MarketingHomeRefresh() {
  return (
    <div className="marketing-refresh" data-marketing-section-order="hero,problem,capabilities,screenshots,workflow,ecosystem,pricing,faq,cta">
      <SeoHead
        title="Arden Project OS | Construction Project Management Software for Contractors"
        description="Plan estimates, proposals, schedules, change orders, field work, and client approvals in one construction project management workspace built for contractors."
        canonical={`${MARKETING_URL}/`}
        jsonLd={[organizationJsonLd, softwareApplicationJsonLd]}
      />
      <Header />
      <main>
        <ProjectOsHero />
        <ProblemSolution />
        <FeatureGrid />
        <div className="marketing-dark-band">
          <ScreenshotShowcase />
        </div>
        <WorkflowSection />
        <EcosystemPreview />
        <PricingPreview />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  )
}
