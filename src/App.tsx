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
    <div className="relative min-h-screen bg-navy-950 text-slate-100">
      <div className="pointer-events-none fixed inset-0 grid-bg gradient-radial" aria-hidden />
      <Header />
      <main className="relative">
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
