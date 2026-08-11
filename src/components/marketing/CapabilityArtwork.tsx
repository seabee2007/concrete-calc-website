import { useState, type CSSProperties } from 'react'
import type { LucideIcon } from 'lucide-react'

export type CapabilityArtworkKey =
  | 'estimate-builder'
  | 'proposal-generator'
  | 'project-planner'
  | 'schedule-gantt'
  | 'logic-network'
  | 'change-orders'
  | 'contracts'
  | 'daily-reports'
  | 'concrete-planner'
  | 'pdf-export'
  | 'client-database'
  | 'cost-tracking'

export default function CapabilityArtwork({
  artworkKey,
  fallback: Fallback,
  size = '4.25rem',
}: {
  artworkKey: CapabilityArtworkKey
  fallback: LucideIcon
  size?: string
}) {
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)
  const state = failed ? 'fallback' : loaded ? 'loaded' : 'loading'
  const style = { '--capability-art-size': size } as CSSProperties

  return (
    <span
      className="capability-artwork"
      style={style}
      aria-hidden="true"
      data-capability-artwork={artworkKey}
      data-capability-artwork-state={state}
    >
      <span className="capability-artwork__fallback">
        <Fallback className="h-6 w-6" strokeWidth={1.7} />
      </span>
      {!failed ? (
        <img
          src={`/images/capabilities/${artworkKey}.png`}
          alt=""
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
