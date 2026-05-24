import { Music2 } from 'lucide-react'

export default function SpotifyWidget({ spotifyData }) {
  if (!spotifyData) {
    return (
      <a href="https://open.spotify.com" target="_blank" rel="noopener noreferrer"
         className="card flex items-center gap-3 no-underline transition-all active:scale-[0.99]"
         style={{ textDecoration: 'none' }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
             style={{ background: 'rgba(29,185,84,0.15)' }}>
          <Music2 size={18} style={{ color: '#1db954' }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium" style={{ color: 'var(--muted)' }}>Spotify</div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>Opna Spotify</div>
        </div>
        <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: '#1db954', opacity: 0.5 }} />
      </a>
    )
  }

  const { item, is_playing } = spotifyData
  return (
    <div className="card flex items-center gap-3">
      {item?.album?.images?.[0]?.url ? (
        <img src={item.album.images[0].url} alt="Album"
             className="w-10 h-10 rounded-xl object-cover shrink-0" />
      ) : (
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
             style={{ background: 'rgba(29,185,84,0.15)' }}>
          <Music2 size={18} style={{ color: '#1db954' }} />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate">{item?.name || 'Í bið'}</div>
        <div className="text-xs truncate" style={{ color: 'var(--muted)' }}>
          {item?.artists?.map(a => a.name).join(', ')}
        </div>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        {is_playing && (
          <div className="flex items-end gap-0.5 h-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-0.5 rounded-full"
                   style={{ background: '#1db954', height: `${40 + i * 20}%`, animation: `pulse-soft ${0.6 + i * 0.2}s ease-in-out infinite` }} />
            ))}
          </div>
        )}
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: is_playing ? '#1db954' : 'var(--muted)' }} />
      </div>
    </div>
  )
}
