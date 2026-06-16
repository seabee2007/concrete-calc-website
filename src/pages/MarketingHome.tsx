import SeoHead from '../components/seo/SeoHead'
import { organizationJsonLd, softwareApplicationJsonLd } from '../lib/jsonLd'
import { MARKETING_URL } from '../constants/marketing'
import Header from '../components/marketing/Header'
import Hero from '../components/marketing/Hero'
import ProblemSolution from '../components/marketing/ProblemSolution'
import FeatureGrid from '../components/marketing/FeatureGrid'
import ScreenshotShowcase from '../components/marketing/ScreenshotShowcase'
import WorkflowSection from '../components/marketing/WorkflowSection'
import PricingPreview from '../components/marketing/PricingPreview'
import FAQ from '../components/marketing/FAQ'
import FinalCTA from '../components/marketing/FinalCTA'
import Footer from '../components/marketing/Footer'

export default function MarketingHome() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050b13]">
      <SeoHead
        title="Arden Project OS | Construction Project Management Software for Contractors"
        description="Plan estimates, proposals, schedules, change orders, field work, and client approvals in one construction project management workspace built for contractors."
        canonical={`${MARKETING_URL}/`}
        jsonLd={[organizationJsonLd, softwareApplicationJsonLd]}
      />
      <div className="marketing-page-bg" aria-hidden="true" />
      <div className="relative z-10 min-h-screen text-white">
        <Header />
        <main>
          <Hero />
          <ProblemSolution />
          <FeatureGrid />
          <ScreenshotShowcase />
          <WorkflowSection />
          <PricingPreview />
          <FAQ />
          <FinalCTA />
        </main>
        <Footer />
      </div>
    </div>
  )
}
