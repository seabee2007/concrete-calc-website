import { motion, useReducedMotion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import MarketingPricingCards from './MarketingPricingCards'
import { SECTION_IDS } from '../../constants/marketing'
import { viewportOnce } from './motion'

export default function PricingPreview() {
  const reducedMotion = Boolean(useReducedMotion())

  return (
    <section id={SECTION_IDS.pricing} className="marketing-section marketing-section--pricing">
      <div className="section-container">
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: reducedMotion ? 0 : 0.62 }}
          className="pricing-preview__intro"
        >
          <p className="pricing-preview__eyebrow">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            Plans for the way you build
          </p>
          <h2>Start focused. Grow without changing systems.</h2>
          <p>
            Every paid plan starts with Project OS. Choose the operating depth your team needs today.
          </p>
        </motion.div>

        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 34 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: reducedMotion ? 0 : 0.68, delay: reducedMotion ? 0 : 0.1 }}
          className="pricing-preview__cards"
        >
          <MarketingPricingCards compact showUsageDetails={false} />
        </motion.div>
      </div>
    </section>
  )
}
