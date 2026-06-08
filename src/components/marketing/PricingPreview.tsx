import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { APP_SIGNUP, SECTION_IDS } from '../../constants/marketing'
import { staggerContainer, fadeUpItem, viewportOnce } from './motion'

interface Plan {
  name: string
  description: string
  features: string[]
  highlighted?: boolean
}

const plans: Plan[] = [
  {
    name: 'Starter',
    description: 'For solo contractors getting organized.',
    features: ['Basic estimates', 'PDF exports', 'Project dashboard', 'Client records'],
  },
  {
    name: 'Pro',
    description: 'For growing contractors who need full project control.',
    features: [
      'Everything in Starter',
      'Proposals',
      'Scheduling',
      'Logic network',
      'Change orders',
      'Daily reports',
    ],
    highlighted: true,
  },
  {
    name: 'Business',
    description: 'For teams managing multiple projects.',
    features: [
      'Everything in Pro',
      'Team workflow',
      'Advanced reporting',
      'Contracts',
      'Priority support',
    ],
  },
]

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
          <h2 className="section-heading">Simple, transparent pricing</h2>
          <p className="section-subheading mx-auto">
            Choose the plan that fits your team. Start with a free trial — no credit card required.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer}
          className="mt-12 grid gap-6 lg:grid-cols-3 lg:gap-8"
        >
          {plans.map((plan) => (
            <motion.div
              key={plan.name}
              variants={fadeUpItem}
              className={`relative flex flex-col rounded-3xl p-6 lg:p-8 ${
                plan.highlighted
                  ? 'scale-[1.02] border-2 border-electric-500/50 bg-electric-500/5 shadow-glow-lg'
                  : 'glass-panel'
              }`}
            >
              {plan.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-electric-500 px-3 py-0.5 text-xs font-semibold text-navy-950">
                  Recommended
                </span>
              )}
              <h3 className="text-xl font-bold text-white">{plan.name}</h3>
              <p className="mt-2 text-sm text-concrete-400">{plan.description}</p>

              <ul className="mt-6 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-electric-400" />
                    <span className="text-sm text-concrete-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <a
                href={APP_SIGNUP}
                className={`mt-8 text-center ${
                  plan.highlighted ? 'btn-primary w-full py-3' : 'btn-secondary w-full py-3'
                }`}
              >
                Start Free Trial
              </a>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
