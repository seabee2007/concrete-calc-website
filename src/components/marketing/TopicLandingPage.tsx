import { ArrowRight } from 'lucide-react'
import { MARKETING_URL } from '../../constants/marketing'
import { organizationJsonLd } from '../../lib/jsonLd'
import SeoHead from '../seo/SeoHead'
import MarketingPageShell from './MarketingPageShell'

export interface LandingSection {
  heading: string
  paragraphs: string[]
}

export interface TopicLandingPageProps {
  path: string
  title: string
  description: string
  h1: string
  intro: string
  sections: LandingSection[]
  relatedLinks: { href: string; label: string }[]
}

export default function TopicLandingPage({
  path,
  title,
  description,
  h1,
  intro,
  sections,
  relatedLinks,
}: TopicLandingPageProps) {
  return (
    <MarketingPageShell>
      <SeoHead
        title={title}
        description={description}
        canonical={`${MARKETING_URL}${path}`}
        jsonLd={organizationJsonLd}
      />

      <article className="section-container py-16 lg:py-24">
        <header className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">{h1}</h1>
          <p className="mt-6 text-lg leading-relaxed text-concrete-400">{intro}</p>
        </header>

        <div className="mx-auto mt-12 max-w-3xl space-y-12">
          {sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-2xl font-bold text-white">{section.heading}</h2>
              <div className="mt-4 space-y-4 text-base leading-relaxed text-concrete-300">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 48)}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <section className="mx-auto mt-16 max-w-3xl rounded-3xl border border-electric-500/20 bg-electric-500/5 p-8 text-center lg:p-12">
          <h2 className="text-2xl font-bold text-white">Start with Arden Project OS</h2>
          <p className="mx-auto mt-4 max-w-xl text-concrete-400">
            Bring estimates, schedules, field records, and client approvals into one workspace built for
            contractors.
          </p>
          <a href="/pricing" className="btn-primary mt-8 inline-flex gap-2 px-8 py-3.5 text-base">
            View pricing
            <ArrowRight className="h-4 w-4" />
          </a>
        </section>

        <nav
          className="mx-auto mt-12 flex max-w-3xl flex-wrap gap-x-6 gap-y-3 text-sm"
          aria-label="Related topics"
        >
          {relatedLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-electric-400 underline-offset-2 transition hover:text-electric-300 hover:underline"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </article>
    </MarketingPageShell>
  )
}
