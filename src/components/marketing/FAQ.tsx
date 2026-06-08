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
    question: 'What is Concrete Calc?',
    answer:
      'Concrete Calc is a professional construction project management software suite. It helps contractors, builders, estimators, and project managers create estimates, proposals, schedules, logic networks, change orders, contracts, daily reports, PDF exports, and concrete pour plans — all from one workspace.',
  },
  {
    question: 'Is this only for concrete contractors?',
    answer:
      'No. While Concrete Calc includes specialized pour planning tools, the platform is built for all types of construction teams — general contractors, subcontractors, estimators, and project managers working on commercial, residential, and infrastructure projects.',
  },
  {
    question: 'Can I create estimates and proposals?',
    answer:
      'Yes. Build detailed estimates with line items, assemblies, and cost codes, then generate polished client proposals directly from your estimates with your branding and terms.',
  },
  {
    question: 'Will it support schedules and Gantt charts?',
    answer:
      'Yes. Create visual schedules with Gantt charts, task dependencies, critical path analysis, and milestone tracking linked to your project estimates and logic networks.',
  },
  {
    question: 'Can I export PDFs?',
    answer:
      'Yes. Export estimates, proposals, schedules, daily reports, and other project documents as professional PDF files ready to share with clients and stakeholders.',
  },
  {
    question: 'Do I need to install anything?',
    answer:
      'No. Concrete Calc is a cloud-based web application. Access it from any modern browser on desktop, tablet, or mobile — no downloads or installations required.',
  },
  {
    question: 'Is there a free trial?',
    answer:
      'Yes. Start with a free trial to explore the platform with your own project. No credit card required to get started.',
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
        />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm leading-relaxed text-concrete-400">{item.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section id={SECTION_IDS.faq} className="py-20 lg:py-28">
      <div className="section-container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeUp}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <h2 className="section-heading">Frequently asked questions</h2>
          <p className="section-subheading mx-auto">
            Everything you need to know about Concrete Calc.
          </p>
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
