import { motion } from 'framer-motion'
import MarketingPricingCards from './MarketingPricingCards'
import { SECTION_IDS } from '../../constants/marketing'
import { fadeUpItem, staggerContainer, viewportOnce } from './motion'

export default function PricingPreview() {
  return (
    <section id={SECTION_IDS.pricing} className="py-20 lg:py-28">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <h2 className="section-heading">Plans built for contractor workflows</h2>
          <p className="section-subheading mx-auto">
            Starter, Professional, and Business pricing matches in-app Billing — including project limits,
            field seats, and verified capabilities.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer}
          className="mt-12"
        >
          <motion.div variants={fadeUpItem}>
            <MarketingPricingCards compact showUsageDetails={false} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
