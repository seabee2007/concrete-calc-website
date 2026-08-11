import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { SECTION_IDS } from '../../constants/marketing'
import { viewportOnce } from './motion'

interface FAQItem {
  question: string
  answer: string
}

const faqs: FAQItem[] = [
  {
    question: 'What is Arden Hub?',
    answer:
      'Arden Hub is the public launch point for the Arden product suite. Visitors can explore the approved roadmap, plans, and provider registry; signed-in teams also receive their secure Project OS launch route and account actions.',
  },
  {
    question: 'Which Arden products are available today?',
    answer:
      'Arden Project OS is available today. Other products remain clearly labeled Coming Soon or Planned from the canonical Arden registry.',
  },
  {
    question: 'What do Planned and Coming Soon mean?',
    answer:
      'Coming Soon marks approved near-term product direction. Planned marks approved catalog direction at an earlier stage. Neither label promises a release date or checkout availability.',
  },
  {
    question: 'Are Connected Workflow providers already live?',
    answer:
      'Not yet. Provider cards describe approved integration direction only. They do not imply a connected account, live synchronization, endorsement, or production availability.',
  },
  {
    question: 'How do I choose a plan?',
    answer:
      'Compare the verified Starter, Professional, and Business plan limits below. The same pricing and included capabilities appear in Project OS Billing.',
  },
  {
    question: 'Can employees use Arden Project OS?',
    answer:
      'Yes. Eligible employees can use the field portal and assigned project workflows available through their organization’s plan and access settings.',
  },
]

function FAQAccordionItem({
  item,
  isOpen,
  onToggle,
  reducedMotion,
}: {
  item: FAQItem
  isOpen: boolean
  onToggle: () => void
  reducedMotion: boolean
}) {
  return (
    <div className="faq-item">
      <button type="button" onClick={onToggle} aria-expanded={isOpen}>
        <span>{item.question}</span>
        <ChevronDown className={isOpen ? 'is-open' : ''} aria-hidden="true" />
      </button>
      <AnimatePresence initial={false}>
        {isOpen ? (
          <motion.div
            initial={reducedMotion ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={reducedMotion ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.26, ease: [0.22, 1, 0.36, 1] }}
            className="faq-item__answer"
          >
            <p>{item.answer}</p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const reducedMotion = Boolean(useReducedMotion())

  return (
    <section id={SECTION_IDS.faq} className="marketing-section marketing-section--faq">
      <div className="section-container faq-layout">
        <motion.div
          className="faq-layout__intro"
          initial={reducedMotion ? false : { opacity: 0, x: -42 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={viewportOnce}
          transition={{ duration: reducedMotion ? 0 : 0.62 }}
        >
          <p className="arden-eyebrow">Frequently asked</p>
          <h2>Clear answers before you choose the next tool.</h2>
          <p>Availability, status, and provider claims stay anchored to Arden&apos;s canonical registries.</p>
        </motion.div>

        <motion.div
          className="faq-list"
          initial={reducedMotion ? false : { opacity: 0, x: 42 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={viewportOnce}
          transition={{ duration: reducedMotion ? 0 : 0.62, delay: reducedMotion ? 0 : 0.08 }}
        >
          {faqs.map((item, index) => (
            <FAQAccordionItem
              key={item.question}
              item={item}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? null : index)}
              reducedMotion={reducedMotion}
            />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
