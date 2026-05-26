import { Music2 } from 'lucide-react'

const SPOTIFY_GREEN = '#1db954'

export default function SpotifyWidget({ spotifyData }) {
  return (
    <div className="card flex items-center gap-3"
      style={{ background: 'rgba(29,185,84,0.04)', borderColor: 'rgba(29,185,84,0.15)' }}>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: 'rgba(29,185,84,0.15)' }}>
        <Music2 size={18} style={{ color: SPOTIFY_GREEN }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium" style={{ color: 'var(--text)' }}>Spotify</div>
        <div className="text-xs" style={{ color: 'var(--muted)' }}>
          Opnaðu Spotify til að hlusta 🎵
        </div>
      </div>
      <a
        href="https://open.spotify.com"
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-sm shrink-0"
        style={{ background: SPOTIFY_GREEN, color: '#fff', padding: '5px 10px' }}
      >
        Opna
      </a>
    </div>
  )
}
