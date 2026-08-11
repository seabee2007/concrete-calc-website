import { useState } from 'react'
import { Check } from 'lucide-react'
import {
  formatUsd,
  getDisplayPrice,
  getPlanCheckoutUrl,
  getPublicPlanCatalog,
  getPublicPlanCtaLabel,
  type BillingInterval,
  type PaidPlanId,
} from '../../lib/publicPlanCatalog'

interface MarketingPricingCardsProps {
  showUsageDetails?: boolean
  compact?: boolean
}

const planCategories: Record<PaidPlanId, string> = {
  starter: 'Foundation',
  professional: 'Field',
  business: 'Portfolio',
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
    <div className="marketing-pricing-cards">
      <div className="billing-toggle" role="tablist" aria-label="Billing interval">
        <button
          type="button"
          role="tab"
          aria-selected={!isAnnual}
          className={!isAnnual ? 'is-active' : ''}
          onClick={() => setBillingInterval('month')}
        >
          Monthly
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={isAnnual}
          className={isAnnual ? 'is-active' : ''}
          onClick={() => setBillingInterval('year')}
        >
          Annual{maxAnnualSavingsPercent > 0 ? ` · save up to ${maxAnnualSavingsPercent}%` : ''}
        </button>
      </div>

      <div className="pricing-card-grid">
        {plans.map((plan) => {
          const displayPrice = getDisplayPrice(plan, billingInterval)
          const ctaLabel = getPublicPlanCtaLabel(plan.planId)
          const highlights = compact ? plan.highlights.slice(0, 5) : plan.highlights

          return (
            <article
              key={plan.planId}
              className={`pricing-card ${plan.recommended ? 'pricing-card--featured' : ''}`}
            >
              <div className="pricing-card__topline">
                <span>{planCategories[plan.planId]}</span>
                {plan.recommended ? <strong>Most popular</strong> : null}
              </div>

              <h3>{plan.name}</h3>
              <p className="pricing-card__audience">{plan.audience}</p>

              <p className="pricing-card__price">
                {formatUsd(displayPrice)}
                <span>/ month</span>
              </p>
              <p className="pricing-card__billing-note">
                {isAnnual
                  ? `Billed annually at ${formatUsd(plan.annualTotalUsd)}/year · save ${formatUsd(plan.annualSavingsUsd)}/yr`
                  : 'Billed monthly · change plans from Billing'}
              </p>

              <ul>
                {highlights.map((feature) => (
                  <li key={feature}>
                    <Check aria-hidden="true" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {showUsageDetails ? (
                <p className="pricing-card__usage">
                  <strong>Plan limits and usage:</strong> {plan.usageSummary}
                </p>
              ) : null}

              <a href={getPlanCheckoutUrl(plan.planId)} className="pricing-card__cta">
                {ctaLabel}
              </a>
            </article>
          )
        })}
      </div>
    </div>
  )
}
