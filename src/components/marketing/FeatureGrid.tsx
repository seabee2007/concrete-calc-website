import { motion, useReducedMotion, type Variants } from 'framer-motion'
import {
  Calculator,
  FileText,
  LayoutGrid,
  GanttChart,
  GitBranch,
  FilePen,
  ScrollText,
  ClipboardList,
  HardHat,
  FileDown,
  Users,
  PieChart,
  type LucideIcon,
} from 'lucide-react'
import { SECTION_IDS } from '../../constants/marketing'
import { viewportOnce } from './motion'
import CapabilityArtwork, { type CapabilityArtworkKey } from './CapabilityArtwork'

interface Feature {
  artworkKey: CapabilityArtworkKey
  icon: LucideIcon
  title: string
  description: string
}

const features: Feature[] = [
  { artworkKey: 'estimate-builder', icon: Calculator, title: 'Estimate Builder', description: 'Create detailed construction estimates with line items, assemblies, and cost codes.' },
  { artworkKey: 'proposal-generator', icon: FileText, title: 'Proposal Generator', description: 'Turn estimates into polished client proposals with your branding and terms.' },
  { artworkKey: 'project-planner', icon: LayoutGrid, title: 'Project Planner', description: 'Organize phases, milestones, and deliverables across your entire project portfolio.' },
  { artworkKey: 'schedule-gantt', icon: GanttChart, title: 'Schedule / Gantt', description: 'Build visual schedules with dependencies, critical paths, and milestone tracking.' },
  { artworkKey: 'logic-network', icon: GitBranch, title: 'Logic Network', description: 'Map activity relationships and sequencing logic for complex construction workflows.' },
  { artworkKey: 'change-orders', icon: FilePen, title: 'Change Orders', description: 'Document scope changes, track approvals, and update project costs in real time.' },
  { artworkKey: 'contracts', icon: ScrollText, title: 'Contracts', description: 'Manage contract documents, terms, and signatures alongside your project data.' },
  { artworkKey: 'daily-reports', icon: ClipboardList, title: 'Daily Reports', description: 'Capture field activity, weather, labor, and equipment logs from the job site.' },
  { artworkKey: 'concrete-planner', icon: HardHat, title: 'Concrete Planner', description: 'Plan concrete placements with risk assessment, crew scheduling, and weather windows.' },
  { artworkKey: 'pdf-export', icon: FileDown, title: 'PDF Export', description: 'Export estimates, proposals, schedules, and reports as professional PDF documents.' },
  { artworkKey: 'client-database', icon: Users, title: 'Client Database', description: 'Keep client contacts, project history, and communication records in one place.' },
  { artworkKey: 'cost-tracking', icon: PieChart, title: 'Cost Tracking', description: 'Monitor budget vs. actual costs across labor, materials, and equipment.' },
]

const cardVariants: Variants = {
  hidden: (index: number) => ({
    opacity: 0,
    x: index % 4 < 2 ? -30 : 30,
    y: 20,
  }),
  visible: (index: number) => ({
    opacity: 1,
    x: 0,
    y: 0,
    transition: {
      duration: 0.52,
      delay: (index % 4) * 0.055 + Math.floor(index / 4) * 0.07,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
}

export default function FeatureGrid() {
  const reducedMotion = Boolean(useReducedMotion())

  return (
    <section id={SECTION_IDS.features} className="marketing-section marketing-section--capabilities">
      <div className="section-container">
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: reducedMotion ? 0 : 0.62 }}
          className="capabilities-heading"
        >
          <h2 className="section-heading">Everything you need to run projects</h2>
          <p className="section-subheading">
            A complete suite of tools built for the way construction teams actually work.
          </p>
        </motion.div>

        <div className="capability-grid">
          {features.map((feature, index) => (
            <motion.article
              key={feature.title}
              custom={index}
              initial={reducedMotion ? false : 'hidden'}
              whileInView="visible"
              viewport={viewportOnce}
              variants={cardVariants}
              whileHover={reducedMotion ? undefined : { y: -4 }}
              className="capability-card"
            >
              <CapabilityArtwork artworkKey={feature.artworkKey} fallback={feature.icon} size="4.25rem" />
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
