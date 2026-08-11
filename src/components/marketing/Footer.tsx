import { ArrowUpRight, LayoutGrid } from 'lucide-react'
import { appLoginHref, BRAND_NAME } from '../../constants/marketing'

const dashboardLogin = appLoginHref('/dashboard')

export default function Footer() {
  return (
    <footer className="arden-site-footer">
      <div className="arden-site-footer__main">
        <div className="arden-site-footer__brand">
          <a href="/" aria-label="Arden Systems home">
            <span className="arden-site-header__mark">
              <LayoutGrid className="h-5 w-5" aria-hidden="true" />
            </span>
            <strong>Arden Systems</strong>
          </a>
          <p>
            Construction technology that grows from one professional operating system into a connected Arden suite.
          </p>
        </div>

        <nav aria-label="Product and support">
          <a href="/#apps">Apps</a>
          <a href="/#pricing">Pricing</a>
          <a href="mailto:support@ardenprojectos.com">Support</a>
          <a href="/privacy">Privacy</a>
        </nav>

        <nav aria-label="Workflow and legal">
          <a href="/#connected-apps">Connected workflow</a>
          <a href="/#faq">FAQ</a>
          <a href="/terms">Terms</a>
        </nav>

        <a href={dashboardLogin} className="arden-site-footer__dashboard">
          Open dashboard
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>

      <div className="arden-site-footer__legal">
        <span>© {new Date().getFullYear()} {BRAND_NAME} LLC</span>
      </div>
    </footer>
  )
}
