import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Moon, Sun } from 'lucide-react'
import { BRAND_NAME, SECTION_IDS } from '../../constants/marketing'
import { staggerContainer, fadeUpItem, viewportOnce } from './motion'

type ScreenshotMode = 'dark' | 'light'

interface ScreenshotItem {
  title: string
  description: string
  darkImage: string
  lightImage: string
  fit: 'cover' | 'contain'
  wide?: boolean
}

const screenshots: ScreenshotItem[] = [
  {
    title: 'Dashboard',
    description:
      'Track active projects, field activity, proposals, QC alerts, and placement conditions.',
    darkImage: '/images/dashboard-dark.png',
    lightImage: '/images/dashboard-light.png',
    fit: 'cover',
  },
  {
    title: 'Estimate Builder',
    description: 'Review project pricing, labor hours, cost breakdowns, and final sell price.',
    darkImage: '/images/estimate-builder-dark.png',
    lightImage: '/images/estimate-builder-light.png',
    fit: 'cover',
  },
  {
    title: 'Level III Gantt',
    description: 'View project activities, critical path, crew loading, and schedule flow.',
    darkImage: '/images/gantt-dark.png',
    lightImage: '/images/gantt-light.png',
    fit: 'contain',
    wide: true,
  },
  {
    title: 'Logic Network',
    description: 'Build and review activity relationships before running CPM calculations.',
    darkImage: '/images/logic-network-dark.png',
    lightImage: '/images/logic-network-light.png',
    fit: 'contain',
    wide: true,
  },
]

function ModeToggle({
  mode,
  onChange,
}: {
  mode: ScreenshotMode
  onChange: (mode: ScreenshotMode) => void
}) {
  return (
    <div
      className="inline-flex rounded-full border border-white/10 bg-white/5 p-1 backdrop-blur-sm"
      role="group"
      aria-label="Screenshot theme"
    >
      <button
        type="button"
        onClick={() => onChange('dark')}
        className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${
          mode === 'dark'
            ? 'bg-electric-500 text-navy-950 shadow-sm'
            : 'text-concrete-400 hover:text-white'
        }`}
        aria-pressed={mode === 'dark'}
      >
        <Moon className="h-4 w-4" />
        Dark Mode
      </button>
      <button
        type="button"
        onClick={() => onChange('light')}
        className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${
          mode === 'light'
            ? 'bg-electric-500 text-navy-950 shadow-sm'
            : 'text-concrete-400 hover:text-white'
        }`}
        aria-pressed={mode === 'light'}
      >
        <Sun className="h-4 w-4" />
        Light Mode
      </button>
    </div>
  )
}

function ScreenshotCard({
  item,
  screenshotMode,
}: {
  item: ScreenshotItem
  screenshotMode: ScreenshotMode
}) {
  const isContain = item.fit === 'contain'
  const src = screenshotMode === 'dark' ? item.darkImage : item.lightImage

  return (
    <motion.div variants={fadeUpItem} className="group">
      <div
        className={`overflow-hidden rounded-2xl border border-white/15 bg-charcoal-900 shadow-card transition-all duration-300 group-hover:border-electric-500/30 group-hover:shadow-glow ${
          item.wide ? 'lg:col-span-2' : ''
        }`}
      >
        <div
          className={`relative overflow-hidden bg-navy-950 ${
            isContain ? 'aspect-[16/9] sm:aspect-[21/9]' : 'aspect-video'
          }`}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={src}
              src={src}
              alt={`${item.title} — ${BRAND_NAME} ${screenshotMode} mode`}
              loading="lazy"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className={`h-full w-full transition-transform duration-500 group-hover:scale-105 ${
                isContain ? 'object-contain object-center' : 'object-cover object-top'
              }`}
            />
          </AnimatePresence>
        </div>
      </div>
      <h3 className="mt-4 text-base font-semibold text-white">{item.title}</h3>
      <p className="mt-1 text-sm leading-relaxed text-concrete-400">{item.description}</p>
    </motion.div>
  )
}

export default function ScreenshotShowcase() {
  const [screenshotMode, setScreenshotMode] = useState<ScreenshotMode>('dark')

  return (
    <section id={SECTION_IDS.screenshots} className="py-20 lg:py-28">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"
        >
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-electric-400">
              See it in action
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              A clearer way to manage construction work
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-concrete-400">
              Explore the product in dark or light mode — the same professional workspace, styled
              the way your team prefers.
            </p>
          </div>

          <div className="shrink-0 lg:self-start lg:pt-8">
            <ModeToggle mode={screenshotMode} onChange={setScreenshotMode} />
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer}
          className="mt-12 grid gap-8 sm:grid-cols-2"
        >
          {screenshots.map((item) => (
            <ScreenshotCard key={item.title} item={item} screenshotMode={screenshotMode} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
