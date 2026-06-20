import { useState } from 'react'
import { Check } from 'lucide-react'
import {
  formatUsd,
  getDisplayPrice,
  getPlanCheckoutUrl,
  getPublicPlanCatalog,
  getPublicPlanCtaLabel,
  type BillingInterval,
} from '../../lib/publicPlanCatalog'

interface MarketingPricingCardsProps {
  showUsageDetails?: boolean
  compact?: boolean
}

export default function MarketingPricingCards({
  showUsageDetails = true,
  compact = false,
}: MarketingPricingCardsProps) {
  const plans = getPublicPlanCatalog()
  const [billingInterval, setBillingInterval] = useState<BillingInterval>('month')
  const isAnnual = billingInterval === 'year'

  const maxAnnualSavingsPercent = Math.max(...plans.map((plan) => plan.annualSavingsPercent))

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-center gap-3">
        <div
          className="inline-flex rounded-xl border border-white/10 bg-white/5 p-1"
          role="tablist"
          aria-label="Billing interval"
        >
          <button
            type="button"
            role="tab"
            aria-selected={!isAnnual}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              !isAnnual ? 'bg-electric-500 text-navy-950' : 'text-concrete-300 hover:text-white'
            }`}
            onClick={() => setBillingInterval('month')}
          >
            Monthly
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={isAnnual}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              isAnnual ? 'bg-electric-500 text-navy-950' : 'text-concrete-300 hover:text-white'
            }`}
            onClick={() => setBillingInterval('year')}
          >
            Annual
            {maxAnnualSavingsPercent > 0 ? (
              <span className="ml-1.5 text-xs font-semibold">Save up to {maxAnnualSavingsPercent}%</span>
            ) : null}
          </button>
        </div>
      </div>

      <div className={`grid gap-6 ${compact ? 'lg:grid-cols-3 lg:gap-6' : 'lg:grid-cols-3 lg:gap-8'}`}>
        {plans.map((plan) => {
          const displayPrice = getDisplayPrice(plan, billingInterval)
          const ctaLabel = getPublicPlanCtaLabel(plan.planId)

          return (
            <article
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

              <h3 className="text-xl font-bold text-white">{plan.name}</h3>
              {!compact ? <p className="mt-2 text-sm leading-relaxed text-concrete-400">{plan.audience}</p> : null}

              <div className="mt-4">
                <p className="text-3xl font-extrabold text-white">
                  {formatUsd(displayPrice)}
                  <span className="text-base font-medium text-concrete-400">/mo</span>
                </p>
                <p className="mt-1 text-xs text-concrete-500">
                  {isAnnual
                    ? `Billed annually at ${formatUsd(plan.annualTotalUsd)}/year · save ${formatUsd(plan.annualSavingsUsd)}/yr`
                    : 'Billed monthly · cancel anytime'}
                </p>
              </div>

              <ul className="mt-6 flex-1 space-y-3">
                {plan.highlights.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-electric-400" />
                    <span className="text-sm text-concrete-300">{feature}</span>
                  </li>
                ))}
              </ul>

              {showUsageDetails ? (
                <p className="mt-4 text-xs leading-relaxed text-concrete-500">
                  <span className="font-medium text-concrete-400">Plan limits and usage:</span> {plan.usageSummary}
                </p>
              ) : null}

              <a
                href={getPlanCheckoutUrl(plan.planId)}
                className={`mt-8 text-center ${
                  plan.recommended ? 'btn-primary w-full py-3' : 'btn-secondary w-full py-3'
                }`}
              >
                {ctaLabel}
              </a>
            </article>
          )
        })}
      </div>
    </div>
  )
}
