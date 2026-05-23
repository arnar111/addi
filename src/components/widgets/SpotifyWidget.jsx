import { Music2 } from 'lucide-react'

export default function SpotifyWidget({ spotifyData }) {
  if (!spotifyData) {
    return (
      <div className="card flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
             style={{ background: 'rgba(29,185,84,0.15)' }}>
          <Music2 size={18} style={{ color: '#1db954' }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium" style={{ color: 'var(--muted)' }}>Spotify</div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>Tengdu Spotify til að sjá tónlist</div>
        </div>
        <a href="#" className="text-xs shrink-0" style={{ color: '#1db954' }}>
          Tengja
        </a>
      </div>
    )
  }

  const { item, is_playing } = spotifyData
  return (
    <div className="card flex items-center gap-3">
      {item?.album?.images?.[0]?.url ? (
        <img src={item.album.images[0].url} alt="Album" className="w-10 h-10 rounded-xl object-cover shrink-0" />
      ) : (
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(29,185,84,0.15)' }}>
          <Music2 size={18} style={{ color: '#1db954' }} />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate">{item?.name || 'Ekki í spilun'}</div>
        <div className="text-xs truncate" style={{ color: 'var(--muted)' }}>
          {item?.artists?.map(a => a.name).join(', ')}
        </div>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: is_playing ? '#1db954' : 'var(--muted)' }} />
        <span className="text-xs" style={{ color: 'var(--muted)' }}>{is_playing ? 'Í spilun' : 'Hlé'}</span>
      </div>
    </div>
  )
}
