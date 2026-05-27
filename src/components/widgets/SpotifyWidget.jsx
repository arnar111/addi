import { useState } from 'react'
import { Music2, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react'

// Arnar's public Spotify embed — can customise playlist/track ID
const SPOTIFY_EMBED_DEFAULT = 'https://open.spotify.com/embed/playlist/37i9dQZF1DX4sWSpwq3LiO?utm_source=generator&theme=0'

export default function SpotifyWidget() {
  const [expanded, setExpanded] = useState(false)
  const [embedUrl] = useState(SPOTIFY_EMBED_DEFAULT)

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      {/* Header row */}
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
             style={{ background: 'rgba(29,185,84,0.15)' }}>
          <Music2 size={17} style={{ color: '#1db954' }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold">Spotify</div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>
            {expanded ? 'Hljóðspilari' : 'Ýttu til að spila'}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="https://open.spotify.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-lg"
            style={{ color: 'var(--muted)' }}
            onClick={e => e.stopPropagation()}
          >
            <ExternalLink size={14} />
          </a>
          <button
            onClick={() => setExpanded(e => !e)}
            className="p-1.5 rounded-lg"
            style={{ color: 'var(--muted)', background: 'var(--surface2)' }}
          >
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
      </div>

      {/* Spotify embed */}
      {expanded && (
        <div style={{ borderTop: '1px solid var(--border)' }}>
          <iframe
            src={embedUrl}
            width="100%"
            height="152"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            style={{ display: 'block' }}
            title="Spotify Player"
          />
        </div>
      )}
    </div>
  )
}
