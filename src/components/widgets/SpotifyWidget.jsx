import { Music2, ExternalLink } from 'lucide-react'

export default function SpotifyWidget() {
  return (
    <a
      href="https://open.spotify.com"
      target="_blank"
      rel="noopener noreferrer"
      className="card flex items-center gap-3"
      style={{
        border: '1px solid rgba(29,185,84,0.2)',
        background: 'rgba(29,185,84,0.04)',
        textDecoration: 'none',
        cursor: 'pointer',
      }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: 'rgba(29,185,84,0.12)' }}
      >
        <Music2 size={18} style={{ color: '#1db954' }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium" style={{ color: 'var(--text)' }}>Spotify</div>
        <div className="text-xs" style={{ color: 'var(--muted)' }}>Opna Spotify Web Player</div>
      </div>
      <ExternalLink size={14} style={{ color: '#1db954' }} className="shrink-0" />
    </a>
  )
}
