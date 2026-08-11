import { motion, useReducedMotion, type Variants } from 'framer-motion'
import { SECTION_IDS } from '../../constants/marketing'
import { viewportOnce } from './motion'

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

const stepVariants: Variants = {
  hidden: (index: number) => ({
    opacity: 0,
    x: index < steps.length / 2 ? -34 : 34,
    y: 18,
  }),
  visible: (index: number) => ({
    opacity: 1,
    x: 0,
    y: 0,
    transition: {
      duration: 0.58,
      delay: index * 0.07,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
}

export default function WorkflowSection() {
  const reducedMotion = Boolean(useReducedMotion())

  return (
    <section id={SECTION_IDS.workflow} className="marketing-section marketing-section--workflow">
      <div className="section-container">
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: reducedMotion ? 0 : 0.62 }}
          className="workflow-heading"
        >
          <h2 className="section-heading">Your workflow, simplified</h2>
          <p className="section-subheading">
            From first estimate to final report — every step connected in one platform.
          </p>
        </motion.div>

        <ol className="workflow-steps">
          {steps.map((step, index) => (
            <motion.li
              key={step.title}
              custom={index}
              initial={reducedMotion ? false : 'hidden'}
              whileInView="visible"
              viewport={viewportOnce}
              variants={stepVariants}
              className="workflow-step"
            >
              <span className="workflow-step__number">{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  )
}
