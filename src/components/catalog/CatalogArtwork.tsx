import { useState, type CSSProperties } from 'react'
import {
  BookOpen,
  Calculator,
  ClipboardList,
  Cloud,
  FileText,
  FolderKanban,
  HardHat,
  LayoutGrid,
  Receipt,
  Scale,
  ShieldCheck,
  Users,
  type LucideIcon,
} from 'lucide-react'
import { getPublicArtwork } from '../../lib/publicArdenCatalog'

const ICONS: Readonly<Record<string, LucideIcon>> = {
  project_os: FolderKanban,
  proposals: FileText,
  crm: Users,
  invoicing: Receipt,
  calc: Calculator,
  change_orders: ClipboardList,
  field_log: BookOpen,
  subtracker: Users,
  quote_leveler: Scale,
  safety: ShieldCheck,
  crew_cost: HardHat,
  quickbooks_online: Receipt,
  microsoft_365: LayoutGrid,
  google_workspace: Cloud,
}

export default function CatalogArtwork({
  iconKey,
  size = 72,
}: {
  iconKey: string
  size?: 48 | 56 | 64 | 72 | 96 | 120
}) {
  const artwork = getPublicArtwork(iconKey)
  const Icon = ICONS[iconKey] ?? LayoutGrid
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)
  const state = artwork === null || failed ? 'fallback' : loaded ? 'loaded' : 'loading'
  const style = { '--catalog-art-size': `${size / 16}rem` } as CSSProperties

  return (
    <span
      className="catalog-artwork"
      style={style}
      aria-hidden="true"
      data-catalog-artwork={iconKey}
      data-catalog-artwork-state={state}
    >
      <span className="catalog-artwork__fallback">
        <Icon className="h-1/2 w-1/2" strokeWidth={1.7} />
      </span>
      {artwork && !failed ? (
        <img
          src={`/images/arden-products/${artwork.fileName}`}
          alt=""
          aria-hidden="true"
          width={256}
          height={256}
          loading="lazy"
          decoding="async"
          className={loaded ? 'opacity-100' : 'opacity-0'}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
        />
      ) : null}
    </span>
  )
}
