import { motion } from 'framer-motion'
import { X, Check } from 'lucide-react'
import { fadeUp, staggerContainer, fadeUpItem, viewportOnce } from './motion'

const beforeItems = [
  'Scattered spreadsheets with outdated formulas',
  'Paper notes and sticky reminders on job sites',
  'Disconnected apps that do not share data',
  'Critical updates buried in emails and texts',
]

const afterItems = [
  'Estimates, proposals, and schedules in one workspace',
  'Logic networks and concrete placement plans linked to your timeline',
  'Change orders, contracts, and daily reports organized',
  'PDF exports and client records always up to date',
]

export default function ProblemSolution() {
  return (
    <section className="py-20 lg:py-28">
      <div className="section-container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeUp}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <h2 className="section-heading">Stop juggling disconnected tools</h2>
          <p className="section-subheading mx-auto">
            Contractors are often stuck using spreadsheets, paper notes, disconnected apps, emails, and text messages.
            Arden Project OS brings everything into one organized workspace.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer}
          className="mt-12 grid gap-6 lg:grid-cols-2 lg:gap-8"
        >
          {/* Before */}
          <motion.div
            variants={fadeUpItem}
            className="glass-panel rounded-3xl p-6 lg:p-8"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-sm font-medium text-red-400">
              Before Arden
            </div>
            <ul className="space-y-4">
              {beforeItems.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500/20">
                    <X className="h-3 w-3 text-red-400" />
                  </div>
                  <span className="text-concrete-300">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* After */}
          <motion.div
            variants={fadeUpItem}
            className="glass-panel-strong rounded-3xl border-electric-500/20 p-6 shadow-glow lg:p-8"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-electric-500/30 bg-electric-500/10 px-3 py-1 text-sm font-medium text-electric-400">
              With Arden Project OS
            </div>
            <ul className="space-y-4">
              {afterItems.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-electric-500/20">
                    <Check className="h-3 w-3 text-electric-400" />
                  </div>
                  <span className="text-slate-200">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
