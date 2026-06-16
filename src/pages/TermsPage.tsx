import SeoHead from '../components/seo/SeoHead'
import LegalPageLayout from '../components/legal/LegalPageLayout'
import TermsOfService from '../components/legal/TermsOfService'
import { MARKETING_URL } from '../constants/marketing'
import { organizationJsonLd } from '../lib/jsonLd'

export default function TermsPage() {
  return (
    <>
      <SeoHead
        title="Terms of Service | Arden Project OS"
        description="Read the Arden Project OS Terms of Service governing use of our construction project management software."
        canonical={`${MARKETING_URL}/terms`}
        jsonLd={organizationJsonLd}
      />
      <LegalPageLayout>
        <TermsOfService />
      </LegalPageLayout>
    </>
  )
}
