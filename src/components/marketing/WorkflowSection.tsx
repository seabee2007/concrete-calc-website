import { motion, useReducedMotion } from 'framer-motion'
import { SECTION_IDS } from '../../constants/marketing'
import { staggerContainer, fadeUpItem, viewportOnce } from './motion'

const steps = [
  { number: 1, title: 'Project', description: 'Set up phases, milestones, and team assignments.' },
  { number: 2, title: 'Estimate', description: 'Build detailed estimates with assemblies and cost codes.' },
  { number: 3, title: 'Proposal', description: 'Turn approved pricing into polished client proposals.' },
  { number: 4, title: 'Schedule', description: 'Coordinate dependencies, critical paths, and milestones.' },
  { number: 5, title: 'Track', description: 'Monitor progress, costs, changes, and daily field activity.' },
  { number: 6, title: 'Report', description: 'Export professional records and share project status.' },
]

export default function WorkflowSection() {
  const reducedMotion = Boolean(useReducedMotion())

  return (
    <section id={SECTION_IDS.workflow} className="marketing-section marketing-section--workflow py-20 lg:py-28">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="arden-eyebrow">Connected workflow</p>
          <h2 className="section-heading mt-4">Your workflow, simplified</h2>
          <p className="section-subheading mx-auto">
            From first estimate to final report—every stage stays connected in one Project OS workspace.
          </p>
        </motion.div>

        <motion.ol
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer}
          className="workflow-steps mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-6"
        >
          {steps.map((step) => (
            <motion.li
              key={step.title}
              variants={fadeUpItem}
              whileHover={reducedMotion ? undefined : { scale: 1.1, y: -4 }}
              whileFocus={reducedMotion ? undefined : { scale: 1.1, y: -4 }}
              transition={{ duration: reducedMotion ? 0 : 0.18, ease: [0.22, 1, 0.36, 1] }}
              tabIndex={0}
              className="workflow-step"
            >
              <span className="workflow-step__number">{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </section>
  )
}
