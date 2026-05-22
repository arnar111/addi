const LINKS = [
  { label: 'Claude', icon: '🤖', url: 'https://claude.ai', color: '#8b5cf6' },
  { label: 'GitHub', icon: '🐙', url: 'https://github.com/arnar111', color: '#e2e8f0' },
  { label: 'Netlify', icon: '🌐', url: 'https://app.netlify.com', color: '#00d4aa' },
  { label: 'LinkedIn', icon: '💼', url: 'https://linkedin.com/in/', color: '#0a66c2' },
  { label: 'The Athletic', icon: '⚽', url: 'https://theathletic.com', color: '#1d4ed8' },
  { label: 'NY Times', icon: '📰', url: 'https://nytimes.com', color: '#64748b' },
  { label: 'Spotify', icon: '🎵', url: 'https://open.spotify.com', color: '#1db954' },
  { label: 'Vísir', icon: '🗞️', url: 'https://visir.is', color: '#f97316' },
]

export default function QuickLinksWidget() {
  return (
    <div className="card">
      <h3 className="font-semibold text-sm mb-3">Flýtileiðir</h3>
      <div className="grid grid-cols-4 gap-2">
        {LINKS.map(link => (
          <a
            key={link.label}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-1.5 py-2.5 px-1 rounded-xl transition-all hover:scale-105 active:scale-95"
            style={{ background: 'var(--surface2)' }}
          >
            <span className="text-xl leading-none">{link.icon}</span>
            <span className="text-xs text-center leading-tight" style={{ color: 'var(--muted)', fontSize: 10 }}>
              {link.label}
            </span>
          </a>
        ))}
      </div>
    </div>
  )
}
