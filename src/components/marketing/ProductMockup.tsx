import { motion } from 'framer-motion'
import { APP_URL } from '../../constants/marketing'

const APP_HOST = new URL(APP_URL).host

export default function ProductMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="group relative"
    >
      <div className="absolute -inset-4 rounded-3xl bg-electric-500/10 blur-3xl" aria-hidden />
      <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-charcoal-900 shadow-glass transition-shadow duration-300 group-hover:shadow-glow lg:rounded-3xl">
        {/* Browser chrome */}
        <div className="flex items-center gap-2 border-b border-white/10 bg-navy-900 px-4 py-3">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-red-500/80" />
            <div className="h-3 w-3 rounded-full bg-amber-500/80" />
            <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
          </div>
          <div className="mx-auto flex h-7 w-48 items-center justify-center rounded-md bg-white/5 text-[10px] text-concrete-500 sm:w-64">
            {APP_HOST}
          </div>
        </div>

        <div className="overflow-hidden bg-navy-950">
          <img
            src="/images/dashboard-dark.png"
            alt="Arden Project OS project dashboard showing estimates, schedules, and project overview"
            className="aspect-[16/10] w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.02]"
          />
        </div>
      </div>
    </motion.div>
  )
}
