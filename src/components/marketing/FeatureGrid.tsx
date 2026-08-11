import { motion } from 'framer-motion'
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
import { staggerContainer, fadeUpItem, viewportOnce } from './motion'
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

export default function FeatureGrid() {
  return (
    <section id={SECTION_IDS.features} className="marketing-section marketing-section--capabilities py-20 lg:py-28">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="arden-eyebrow">Project OS capabilities</p>
          <h2 className="section-heading mt-4">Everything you need to run projects</h2>
          <p className="section-subheading mx-auto">
            A complete suite of tools built for the way construction teams actually work.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer}
          className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {features.map((feature) => (
            <motion.article
              key={feature.title}
              variants={fadeUpItem}
              whileHover={{ y: -4, transition: { duration: 0.18 } }}
              className="capability-card group"
            >
              <CapabilityArtwork artworkKey={feature.artworkKey} fallback={feature.icon} />
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
