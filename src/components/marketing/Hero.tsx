import { motion } from 'framer-motion'
import { ArrowRight, ChevronDown, Zap, LayoutGrid, TrendingUp } from 'lucide-react'
import { APP_SIGNUP, SECTION_IDS, scrollToSection } from '../../constants/marketing'
import { fadeUp } from './motion'
import ProductMockup from './ProductMockup'

const stats = [
  { icon: Zap, label: 'Estimate faster', desc: 'Build detailed bids in minutes' },
  { icon: LayoutGrid, label: 'Plan cleaner', desc: 'Organize every project phase' },
  { icon: TrendingUp, label: 'Track better', desc: 'Monitor costs and progress' },
]

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
      <div className="section-container">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <img
              src="/images/logo_dark_banner.png"
              alt="Arden Project OS"
              className="mb-8 max-w-xs object-contain sm:max-w-md lg:max-w-xl"
            />
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-[3.25rem] lg:leading-[1.1]">
              Professional estimating, scheduling, and project planning software for construction teams.
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-concrete-400">
              Arden Project OS helps contractors build estimates, proposals, schedules, logic networks, and project plans from one clean workspace.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a href={APP_SIGNUP} className="btn-primary gap-2 px-6 py-3 text-base">
                Start Free Trial
                <ArrowRight className="h-4 w-4" />
              </a>
              <button
                type="button"
                onClick={() => scrollToSection(SECTION_IDS.features)}
                className="btn-secondary gap-2 px-6 py-3 text-base"
              >
                View Features
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="glass-panel rounded-2xl p-4 transition-colors hover:border-electric-500/30"
                >
                  <stat.icon className="mb-2 h-5 w-5 text-electric-400" />
                  <p className="text-sm font-semibold text-white">{stat.label}</p>
                  <p className="mt-1 text-xs text-concrete-500">{stat.desc}</p>
                </div>
              ))}
            </div>

            <p className="mt-8 text-sm text-concrete-500">
              Built for contractors, estimators, and project managers.
            </p>
          </motion.div>

          <div className="relative lg:pl-4">
            <ProductMockup />
          </div>
        </div>
      </div>
    </section>
  )
}
