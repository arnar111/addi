import { Music2 } from 'lucide-react'

export default function SpotifyWidget({ spotifyData }) {
  if (!spotifyData) {
    return (
      <div className="card flex items-center gap-3 py-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: 'rgba(29,185,84,0.14)' }}
        >
          <Music2 size={18} style={{ color: '#1db954' }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium">Spotify</div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>Tengdu reikning til að sjá tónlist</div>
        </div>
        <span className="pill pill-accent text-xs">Tengja</span>
      </div>
    )
  }

  const { item, is_playing } = spotifyData
  return (
    <div className="card flex items-center gap-3 py-3">
      {item?.album?.images?.[0]?.url ? (
        <img
          src={item.album.images[0].url}
          alt="Album"
          className="w-11 h-11 rounded-xl object-cover shrink-0"
          style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.5)' }}
        />
      ) : (
        <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(29,185,84,0.14)' }}>
          <Music2 size={18} style={{ color: '#1db954' }} />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold truncate">{item?.name || 'Ekki í spilun'}</div>
        <div className="text-xs truncate" style={{ color: 'var(--text2)' }}>
          {item?.artists?.map(a => a.name).join(', ')}
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <div
          className="status-dot"
          style={{ background: is_playing ? '#1db954' : 'var(--muted)', boxShadow: is_playing ? '0 0 6px #1db954' : 'none' }}
        />
        <span className="text-xs" style={{ color: 'var(--muted)' }}>{is_playing ? 'Í spilun' : 'Hlé'}</span>
      </div>
    </div>
  )
}
