import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { appLoginHref } from '../../constants/marketing'
import ProjectOsLogo from './ProjectOsLogo'

export default function ProjectOsHero() {
  const reducedMotion = Boolean(useReducedMotion())
  const dashboardLogin = appLoginHref('/dashboard')

  return (
    <section className="project-os-hero" aria-labelledby="project-os-hero-heading">
      <div className="project-os-hero__content">
        <motion.div
          className="project-os-hero__copy"
          initial={reducedMotion ? false : { opacity: 0, x: -38, y: 12 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.78, delay: reducedMotion ? 0 : 0.12 }}
        >
          <p className="project-os-hero__eyebrow">Arden Systems</p>
          <h1 id="project-os-hero-heading">One launch point for every stage of the work.</h1>
          <p className="project-os-hero__lede">
            Start with Arden Project OS today, then grow into a connected suite for estimating,
            planning, field execution, and business operations.
          </p>

          <div className="project-os-hero__actions">
            <a href={dashboardLogin} className="btn-primary project-os-hero__primary-action">
              Open Project OS
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <a href="/#apps" className="btn-secondary project-os-hero__secondary-action">
              Explore apps
            </a>
          </div>
        </motion.div>
        <motion.div
          className="project-os-hero__artwork"
          initial={reducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: reducedMotion ? 0 : 0.78 }}
        >
          <ProjectOsLogo variant="stacked" className="project-os-hero__logo" />
        </motion.div>
      </div>
    </section>
  )
}
