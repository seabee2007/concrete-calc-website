import { motion } from 'framer-motion'
import { staggerContainer, fadeUpItem, viewportOnce } from './motion'

const steps = [
  {
    number: 1,
    title: 'Project',
    description: 'Set up your project with phases, milestones, and team assignments.',
  },
  {
    number: 2,
    title: 'Estimate',
    description: 'Build detailed estimates with line items, assemblies, and cost codes.',
  },
  {
    number: 3,
    title: 'Proposal',
    description: 'Generate polished proposals from your estimates and send to clients.',
  },
  {
    number: 4,
    title: 'Schedule',
    description: 'Create Gantt charts with dependencies and critical path analysis.',
  },
  {
    number: 5,
    title: 'Track',
    description: 'Monitor progress, costs, change orders, and daily field reports.',
  },
  {
    number: 6,
    title: 'Report',
    description: 'Export PDFs and share project status with stakeholders.',
  },
]

export default function WorkflowSection() {
  return (
    <section className="py-20 lg:py-28">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <h2 className="section-heading">Your workflow, simplified</h2>
          <p className="section-subheading mx-auto">
            From first estimate to final report — every step connected in one platform.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer}
          className="relative mt-12"
        >
          {/* Desktop connector line */}
          <div
            className="absolute top-8 right-0 left-0 hidden h-px bg-gradient-to-r from-transparent via-electric-500/40 to-transparent lg:block"
            aria-hidden
          />

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-6 lg:gap-4">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                variants={fadeUpItem}
                className="relative flex flex-col items-center text-center"
              >
                <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl border border-electric-500/30 bg-electric-500/10 text-xl font-bold text-electric-400 shadow-glow">
                  {step.number}
                </div>
                {index < steps.length - 1 && (
                  <div className="my-2 h-8 w-px bg-electric-500/30 lg:hidden" aria-hidden />
                )}
                <h3 className="mt-4 font-semibold text-white">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-concrete-400">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
