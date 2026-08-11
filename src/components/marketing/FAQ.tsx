import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { SECTION_IDS } from '../../constants/marketing'
import { fadeUp, viewportOnce } from './motion'

interface FAQItem {
  question: string
  answer: string
}

const faqs: FAQItem[] = [
  {
    question: 'What is Arden Project OS?',
    answer:
      'Arden Project OS is the live Arden construction project management workspace. It brings estimating, proposals, schedules, logic networks, change orders, field records, exports, and project controls into one browser-based application.',
  },
  {
    question: 'Who is Project OS built for?',
    answer:
      'It is designed for general contractors, subcontractors, estimators, project managers, and construction teams working across commercial, residential, concrete, and infrastructure projects.',
  },
  {
    question: 'Can I create estimates and proposals?',
    answer:
      'Yes. Project OS supports detailed estimates with line items, assemblies, and cost codes, plus professional client proposals based on your project pricing and terms.',
  },
  {
    question: 'Does it include scheduling and project controls?',
    answer:
      'Project OS includes project planning, visual schedules, dependency and logic-network tools, milestone tracking, change management, and reporting workflows.',
  },
  {
    question: 'Are all Arden products and connected apps available now?',
    answer:
      'No. Project OS is the live Arden product. Every other product and integration is labeled Coming Soon or Planned from the canonical Arden registry. Those labels are not release dates, checkout availability, or evidence of a live provider connection.',
  },
  {
    question: 'Do I need to install anything?',
    answer:
      'No. Arden Project OS is a cloud-based web application that runs in a modern browser on supported desktop, tablet, and mobile devices.',
  },
  {
    question: 'How does pricing work?',
    answer:
      'The Starter, Professional, and Business plans shown here are generated from the same verified pricing contract used by in-app Billing. Monthly and annual options are available where shown.',
  },
]

function FAQAccordionItem({ item, isOpen, onToggle }: { item: FAQItem; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-white/10 last:border-0">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
        aria-expanded={isOpen}
      >
        <span className="font-medium text-white">{item.question}</span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-concrete-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          aria-hidden="true"
        />
      </button>
      <AnimatePresence initial={false}>
        {isOpen ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm leading-relaxed text-concrete-400">{item.answer}</p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section id={SECTION_IDS.faq} className="marketing-section marketing-section--faq py-20 lg:py-28">
      <div className="section-container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeUp}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="arden-eyebrow">Buyer FAQ</p>
          <h2 className="section-heading mt-4">Frequently asked questions</h2>
          <p className="section-subheading mx-auto">What to know before choosing Arden Project OS.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mx-auto mt-12 max-w-3xl glass-panel rounded-3xl px-6 lg:px-8"
        >
          {faqs.map((item, index) => (
            <FAQAccordionItem
              key={item.question}
              item={item}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
