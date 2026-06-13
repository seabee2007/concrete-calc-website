import Header from './components/marketing/Header'
import Hero from './components/marketing/Hero'
import ProblemSolution from './components/marketing/ProblemSolution'
import FeatureGrid from './components/marketing/FeatureGrid'
import ScreenshotShowcase from './components/marketing/ScreenshotShowcase'
import WorkflowSection from './components/marketing/WorkflowSection'
import PricingPreview from './components/marketing/PricingPreview'
import FAQ from './components/marketing/FAQ'
import FinalCTA from './components/marketing/FinalCTA'
import Footer from './components/marketing/Footer'

export default function App() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-navy-950 text-slate-100">
      <div className="marketing-page-bg pointer-events-none fixed inset-0 z-0" aria-hidden="true" />
      <div className="pointer-events-none fixed inset-0 z-[1] grid-bg gradient-radial opacity-70" aria-hidden />
      <Header />
      <main className="relative z-10">
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
  )
}
