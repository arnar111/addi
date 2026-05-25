import { Music2, ExternalLink } from 'lucide-react'

const MEDIA_LINKS = [
  { label: 'Spotify', color: '#1db954', emoji: '🎵', url: 'https://open.spotify.com' },
  { label: 'The Athletic', color: '#f97316', emoji: '⚽', url: 'https://theathletic.com' },
  { label: 'YouTube', color: '#ef4444', emoji: '▶️', url: 'https://youtube.com' },
]

export default function SpotifyWidget() {
  return (
    <div className="card flex items-center gap-3"
         style={{ background: 'linear-gradient(135deg, rgba(29,185,84,0.06), rgba(0,0,0,0))' }}>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
           style={{ background: 'rgba(29,185,84,0.15)' }}>
        <Music2 size={18} style={{ color: '#1db954' }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs font-medium mb-1.5" style={{ color: 'var(--muted)' }}>Fjölmiðlar</div>
        <div className="flex gap-1.5 flex-wrap">
          {MEDIA_LINKS.map(l => (
            <a key={l.label} href={l.url} target="_blank" rel="noreferrer"
               className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs transition-all"
               style={{ background: `${l.color}18`, color: l.color, border: `1px solid ${l.color}30` }}>
              <span>{l.emoji}</span> {l.label}
            </a>
          ))}
        </div>
      </div>
      <ExternalLink size={13} style={{ color: 'var(--muted)' }} />
    </div>
  )
}
