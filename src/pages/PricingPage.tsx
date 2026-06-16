import { Check } from 'lucide-react'
import SeoHead from '../components/seo/SeoHead'
import MarketingPageShell from '../components/marketing/MarketingPageShell'
import { APP_SIGNUP, MARKETING_URL } from '../constants/marketing'
import { organizationJsonLd, softwareApplicationJsonLd } from '../lib/jsonLd'
import { formatUsd, getPlanMarketingCards } from '../lib/planMarketing'

export default function PricingPage() {
  const plans = getPlanMarketingCards()

  return (
    <MarketingPageShell>
      <SeoHead
        title="Pricing | Arden Project OS"
        description="Simple, transparent pricing for construction project management. Starter, Professional, and Business plans."
        canonical={`${MARKETING_URL}/pricing`}
        jsonLd={[organizationJsonLd, softwareApplicationJsonLd]}
      />

      <section className="section-container py-16 lg:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Simple, transparent pricing
          </h1>
          <p className="mt-6 text-lg text-concrete-400">
            Choose the plan that fits your team. Start with a free trial — no credit card required.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3 lg:gap-8">
          {plans.map((plan) => (
            <div
              key={plan.planId}
              className={`relative flex flex-col rounded-3xl p-6 lg:p-8 ${
                plan.recommended
                  ? 'scale-[1.02] border-2 border-electric-500/50 bg-electric-500/5 shadow-glow-lg'
                  : 'glass-panel'
              }`}
            >
              {plan.recommended ? (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-electric-500 px-3 py-0.5 text-xs font-semibold text-navy-950">
                  Recommended
                </span>
              ) : null}
              <h2 className="text-xl font-bold text-white">{plan.longName}</h2>
              <p className="mt-3 text-3xl font-extrabold text-white">
                {formatUsd(plan.pricing.monthlyUsd)}
                <span className="text-base font-medium text-concrete-400">/mo</span>
              </p>
              <ul className="mt-6 flex-1 space-y-3">
                {plan.highlights.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-electric-400" />
                    <span className="text-sm text-concrete-300">{feature}</span>
                  </li>
                ))}
              </ul>
              <a
                href={APP_SIGNUP}
                className={`mt-8 text-center ${
                  plan.recommended ? 'btn-primary w-full py-3' : 'btn-secondary w-full py-3'
                }`}
              >
                Start Free Trial
              </a>
            </div>
          ))}
        </div>
      </section>
    </MarketingPageShell>
  )
}
