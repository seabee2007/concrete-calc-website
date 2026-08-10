import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, LayoutGrid, TrendingUp, Zap } from 'lucide-react'
import { APP_SIGNUP } from '../../constants/marketing'

const proofPoints = [
  { icon: Zap, label: 'Estimate faster', detail: 'Build detailed bids in minutes' },
  { icon: LayoutGrid, label: 'Plan cleaner', detail: 'Organize every project phase' },
  { icon: TrendingUp, label: 'Track better', detail: 'Monitor costs and progress' },
]

export default function ProjectOsHero() {
  const reducedMotion = Boolean(useReducedMotion())

  return (
    <section className="project-os-hero" aria-labelledby="project-os-hero-heading">
      <motion.img
        src="/images/arden-hub-hero.webp"
        alt=""
        aria-hidden="true"
        width={1920}
        height={1080}
        fetchPriority="high"
        decoding="async"
        className="project-os-hero__photo"
        initial={reducedMotion ? false : { opacity: 0, x: 28 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: reducedMotion ? 0 : 0.85, ease: [0.22, 1, 0.36, 1] }}
        onError={(event) => {
          event.currentTarget.style.display = 'none'
        }}
      />
      <div className="project-os-hero__wash" aria-hidden="true" />
      <div className="project-os-hero__content">
        <motion.div
          className="project-os-hero__copy"
          initial={reducedMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.7, delay: reducedMotion ? 0 : 0.08 }}
        >
          <p className="project-os-hero__eyebrow">Arden Project OS</p>
          <h1 id="project-os-hero-heading">
            Construction Project Management Software for Contractors
          </h1>
          <p className="project-os-hero__lede">
            Build estimates, proposals, schedules, logic networks, change orders, and field records
            from one calm, professional workspace—then keep every project moving with clearer cost
            and progress control.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a href="/pricing" className="btn-primary gap-2 px-6 py-3 text-base">
              View Project OS pricing
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <a href="/apps" className="btn-secondary gap-2 px-6 py-3 text-base">
              Explore Arden Systems
            </a>
            <a href={APP_SIGNUP} className="sr-only">
              Create an Arden account
            </a>
          </div>

          <div className="project-os-hero__stats" aria-label="Project OS outcomes">
            {proofPoints.map((point) => (
              <div key={point.label} className="project-os-hero__stat">
                <point.icon className="h-5 w-5 text-electric-600" aria-hidden="true" />
                <p className="mt-2 text-sm font-bold text-slate-900">{point.label}</p>
                <p className="mt-1 text-xs leading-5 text-slate-600">{point.detail}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
