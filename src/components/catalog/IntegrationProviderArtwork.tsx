import { useState, type CSSProperties } from 'react'
import { Cloud } from 'lucide-react'
import { INTEGRATION_PROVIDER_ARTWORK } from './integrationProviderArtworkMap'

export default function IntegrationProviderArtwork({
  iconKey,
  size = 72,
}: {
  iconKey: string
  size?: 56 | 64 | 72 | 96
}) {
  const definition = INTEGRATION_PROVIDER_ARTWORK[iconKey] ?? {
    assetPath: null,
    fallback: Cloud,
    tone: 'cloud' as const,
  }
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)
  const Fallback = definition.fallback
  const artworkAvailable = definition.assetPath !== null && !failed
  const state = !artworkAvailable ? 'fallback' : loaded ? 'loaded' : 'loading'
  const style = { '--provider-art-size': `${size / 16}rem` } as CSSProperties

  return (
    <span
      className={`provider-artwork provider-artwork--${definition.tone}`}
      style={style}
      aria-hidden="true"
      data-provider-artwork={iconKey}
      data-provider-artwork-state={state}
    >
      <span className="provider-artwork__fallback">
        <Fallback className="h-1/2 w-1/2" strokeWidth={1.7} />
      </span>
      {artworkAvailable ? (
        <img
          src={definition.assetPath ?? undefined}
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
