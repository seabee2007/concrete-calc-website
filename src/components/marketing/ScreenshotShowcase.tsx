import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Moon, Sun } from 'lucide-react'
import { BRAND_NAME, SECTION_IDS } from '../../constants/marketing'
import { viewportOnce } from './motion'

type ScreenshotMode = 'dark' | 'light'

interface ScreenshotItem {
  title: string
  description: string
  darkImage: string
  lightImage: string
  fit: 'cover' | 'contain'
}

const screenshots: ScreenshotItem[] = [
  {
    title: 'Dashboard',
    description: 'A new workspace showing project, proposal, schedule, and business summary cards.',
    darkImage: '/images/dashboard-dark.png',
    lightImage: '/images/dashboard-light.png',
    fit: 'contain',
  },
  {
    title: 'Estimate Builder',
    description: 'Sample concrete and masonry activities with labor hours, costs, and a calculated sell price.',
    darkImage: '/images/estimate-builder-dark.png',
    lightImage: '/images/estimate-builder-light.png',
    fit: 'contain',
  },
  {
    title: 'Level III Gantt',
    description: 'A two-activity example showing the calculated schedule and critical path.',
    darkImage: '/images/gantt-dark.png',
    lightImage: '/images/gantt-light.png',
    fit: 'contain',
  },
  {
    title: 'Logic Network',
    description: 'A simple finish-to-start relationship between two sample activities.',
    darkImage: '/images/logic-network-dark.png',
    lightImage: '/images/logic-network-light.png',
    fit: 'contain',
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
    <div className="interface-preview-toggle" role="group" aria-label="Interface preview: Dark / Light">
      <button type="button" onClick={() => onChange('dark')} aria-pressed={mode === 'dark'}>
        <Moon className="h-4 w-4" aria-hidden="true" />
        Dark Mode
      </button>
      <button type="button" onClick={() => onChange('light')} aria-pressed={mode === 'light'}>
        <Sun className="h-4 w-4" aria-hidden="true" />
        Light Mode
      </button>
    </div>
  )
}

function ScreenshotCard({
  item,
  screenshotMode,
  index,
  reducedMotion,
}: {
  item: ScreenshotItem
  screenshotMode: ScreenshotMode
  index: number
  reducedMotion: boolean
}) {
  const src = screenshotMode === 'dark' ? item.darkImage : item.lightImage

  return (
    <motion.article
      className="interface-preview-card"
      initial={reducedMotion ? false : { opacity: 0, x: index % 2 === 0 ? -42 : 42, y: 16 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={viewportOnce}
      transition={{ duration: reducedMotion ? 0 : 0.64, delay: reducedMotion ? 0 : (index % 2) * 0.08 }}
    >
      <div className="interface-preview-card__frame">
        <div className="screenshot-fallback" aria-hidden="true">Preview unavailable</div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.img
            key={src}
            src={src}
            alt={`${item.title} — ${BRAND_NAME} ${screenshotMode} demonstration with sample data`}
            width={1440}
            height={1000}
            loading="lazy"
            decoding="async"
            initial={reducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reducedMotion ? undefined : { opacity: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.26 }}
            onError={(event) => {
              event.currentTarget.style.display = 'none'
            }}
            className={item.fit === 'contain' ? 'object-contain' : 'object-cover object-top'}
          />
        </AnimatePresence>
      </div>
      <h3>{item.title}</h3>
      <p>{item.description}</p>
    </motion.article>
  )
}

export default function ScreenshotShowcase() {
  const [screenshotMode, setScreenshotMode] = useState<ScreenshotMode>('dark')
  const reducedMotion = Boolean(useReducedMotion())

  return (
    <section id={SECTION_IDS.screenshots} className="interface-preview-section">
      <div className="section-container">
        <motion.div
          className="interface-preview-section__intro"
          initial={reducedMotion ? false : { opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: reducedMotion ? 0 : 0.64 }}
        >
          <div>
            <p className="interface-preview-section__eyebrow">See it in action</p>
            <h2>A clearer way to manage construction work</h2>
            <p>
              Explore current product components in dark or light mode.
              These demonstrations use sample data, not customer projects.
            </p>
          </div>
          <ModeToggle mode={screenshotMode} onChange={setScreenshotMode} />
        </motion.div>

        <div className="interface-preview-grid">
          {screenshots.map((item, index) => (
            <ScreenshotCard
              key={item.title}
              item={item}
              screenshotMode={screenshotMode}
              index={index}
              reducedMotion={reducedMotion}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
