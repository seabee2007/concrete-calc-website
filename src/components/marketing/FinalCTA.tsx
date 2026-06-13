import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { APP_SIGNUP } from '../../constants/marketing'
import { fadeUp, viewportOnce } from './motion'

export default function FinalCTA() {
  return (
    <section className="py-20 lg:py-28">
      <div className="section-container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeUp}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl border border-electric-500/20 bg-gradient-to-br from-electric-500/10 via-navy-900 to-navy-950 p-8 text-center shadow-glow-lg lg:p-16"
        >
          <div className="absolute inset-0 grid-bg opacity-30" aria-hidden />
          <div className="relative">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Build better estimates. Plan cleaner projects. Win more work.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-concrete-400">
              Start with one project and see how Arden Project OS can organize your estimating, proposals, and planning workflow.
            </p>
            <a href={APP_SIGNUP} className="btn-primary mt-8 inline-flex gap-2 px-8 py-3.5 text-base">
              Start Free Trial
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
