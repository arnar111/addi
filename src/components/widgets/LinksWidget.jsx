const LINKS = [
  { label: 'Gmail', icon: '📧', url: 'https://mail.google.com', color: '#ef4444' },
  { label: 'Drive', icon: '📁', url: 'https://drive.google.com', color: '#f97316' },
  { label: 'Spotify', icon: '🎵', url: 'https://open.spotify.com', color: '#1db954' },
  { label: 'Calendar', icon: '📅', url: 'https://calendar.google.com', color: '#3b82f6' },
  { label: 'Canva', icon: '🎨', url: 'https://www.canva.com', color: '#8b5cf6' },
  { label: 'Maps', icon: '🗺️', url: 'https://maps.google.com', color: '#22c55e' },
]

export default function LinksWidget() {
  return (
    <div className="card">
      <div className="grid grid-cols-6 gap-1">
        {LINKS.map(link => (
          <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer"
             className="flex flex-col items-center gap-1 py-2.5 rounded-xl transition-all active:scale-95"
             style={{ background: 'var(--surface2)' }}>
            <span className="text-lg">{link.icon}</span>
            <span className="text-xs" style={{ color: 'var(--muted)', fontSize: 10 }}>{link.label}</span>
          </a>
        ))}
      </div>
    </div>
  )
}
