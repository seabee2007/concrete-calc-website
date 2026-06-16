import SeoHead from '../components/seo/SeoHead'
import LegalPageLayout from '../components/legal/LegalPageLayout'
import PrivacyPolicy from '../components/legal/PrivacyPolicy'
import { MARKETING_URL } from '../constants/marketing'
import { organizationJsonLd } from '../lib/jsonLd'

export default function PrivacyPage() {
  return (
    <>
      <SeoHead
        title="Privacy Policy | Arden Project OS"
        description="Read the Arden Project OS Privacy Policy for information about how we collect, use, and protect your data."
        canonical={`${MARKETING_URL}/privacy`}
        jsonLd={organizationJsonLd}
      />
      <LegalPageLayout>
        <PrivacyPolicy />
      </LegalPageLayout>
    </>
  )
}
