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
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { SECTION_IDS } from '../../constants/marketing'
import { staggerContainer, fadeUpItem, viewportOnce } from './motion'

interface Feature {
  icon: LucideIcon
  title: string
  description: string
}

const features: Feature[] = [
  {
    icon: Calculator,
    title: 'Estimate Builder',
    description: 'Create detailed construction estimates with line items, assemblies, and cost codes.',
  },
  {
    icon: FileText,
    title: 'Proposal Generator',
    description: 'Turn estimates into polished client proposals with your branding and terms.',
  },
  {
    icon: LayoutGrid,
    title: 'Project Planner',
    description: 'Organize phases, milestones, and deliverables across your entire project portfolio.',
  },
  {
    icon: GanttChart,
    title: 'Schedule / Gantt',
    description: 'Build visual schedules with dependencies, critical paths, and milestone tracking.',
  },
  {
    icon: GitBranch,
    title: 'Logic Network',
    description: 'Map activity relationships and sequencing logic for complex construction workflows.',
  },
  {
    icon: FilePen,
    title: 'Change Orders',
    description: 'Document scope changes, track approvals, and update project costs in real time.',
  },
  {
    icon: ScrollText,
    title: 'Contracts',
    description: 'Manage contract documents, terms, and signatures alongside your project data.',
  },
  {
    icon: ClipboardList,
    title: 'Daily Reports',
    description: 'Capture field activity, weather, labor, and equipment logs from the job site.',
  },
  {
    icon: HardHat,
    title: 'Concrete Planner',
    description: 'Plan concrete placements with risk assessment, crew scheduling, and weather windows.',
  },
  {
    icon: FileDown,
    title: 'PDF Export',
    description: 'Export estimates, proposals, schedules, and reports as professional PDF documents.',
  },
  {
    icon: Users,
    title: 'Client Database',
    description: 'Keep client contacts, project history, and communication records in one place.',
  },
  {
    icon: PieChart,
    title: 'Cost Tracking',
    description: 'Monitor budget vs. actual costs across labor, materials, and equipment.',
  },
]

export default function FeatureGrid() {
  return (
    <section id={SECTION_IDS.features} className="py-20 lg:py-28">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <h2 className="section-heading">Everything you need to run projects</h2>
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
            <motion.div
              key={feature.title}
              variants={fadeUpItem}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="glass-panel group rounded-2xl p-5 transition-colors hover:border-electric-500/30 hover:shadow-glow"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-electric-500/10 transition-colors group-hover:bg-electric-500/20">
                <feature.icon className="h-5 w-5 text-electric-400" />
              </div>
              <h3 className="font-semibold text-white">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-concrete-400">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
