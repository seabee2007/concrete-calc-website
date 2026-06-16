import SeoHead from '../components/seo/SeoHead'
import LegalPageLayout from '../components/legal/LegalPageLayout'
import { MARKETING_URL } from '../constants/marketing'
import { organizationJsonLd } from '../lib/jsonLd'

export default function ContactPage() {
  return (
    <>
      <SeoHead
        title="Contact Us | Arden Project OS"
        description="Contact Arden Project OS for product questions, support, and partnership inquiries."
        canonical={`${MARKETING_URL}/contact`}
        jsonLd={organizationJsonLd}
      />
      <LegalPageLayout>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-white">Contact Us</h1>
          <p className="text-concrete-300">
            For product questions, support, or partnership inquiries, contact the Arden Project OS team.
          </p>
          <div className="glass-panel rounded-2xl p-6">
            <p className="font-semibold text-white">Email</p>
            <a
              href="mailto:support@ardenprojectos.com"
              className="mt-2 inline-block text-electric-400 underline-offset-2 hover:text-electric-300 hover:underline"
            >
              support@ardenprojectos.com
            </a>
          </div>
          <p className="text-sm text-concrete-400">
            We typically respond within one business day.
          </p>
        </div>
      </LegalPageLayout>
    </>
  )
}
