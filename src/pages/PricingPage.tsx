import SeoHead from '../components/seo/SeoHead'
import MarketingPricingCards from '../components/marketing/MarketingPricingCards'
import MarketingPageShell from '../components/marketing/MarketingPageShell'
import { MARKETING_URL } from '../constants/marketing'
import { organizationJsonLd, softwareApplicationJsonLd } from '../lib/jsonLd'

export default function PricingPage() {
  return (
    <MarketingPageShell>
      <SeoHead
        title="Pricing | Arden Project OS"
        description="Starter, Professional, and Business plans for construction estimating, field work, schedules, and portfolio control. Prices match in-app Billing."
        canonical={`${MARKETING_URL}/pricing`}
        jsonLd={[organizationJsonLd, softwareApplicationJsonLd]}
      />

      <section className="section-container py-16 lg:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Plans built for contractor workflows
          </h1>
          <p className="mt-6 text-lg text-concrete-400">
            The same Starter, Professional, and Business plans you see in Billing — with project limits,
            field seats, and verified capabilities listed up front.
          </p>
        </div>

        <div className="mt-12">
          <MarketingPricingCards />
        </div>
      </section>
    </MarketingPageShell>
  )
}
