const LINKS = [
  { label: 'Claude', icon: '🤖', url: 'https://claude.ai' },
  { label: 'GitHub', icon: '🐙', url: 'https://github.com/arnar111' },
  { label: 'Netlify', icon: '🌐', url: 'https://app.netlify.com' },
  { label: 'LinkedIn', icon: '💼', url: 'https://linkedin.com/feed' },
  { label: 'Athletic', icon: '⚽', url: 'https://theathletic.com' },
  { label: 'NY Times', icon: '📰', url: 'https://nytimes.com' },
  { label: 'Spotify', icon: '🎵', url: 'https://open.spotify.com' },
  { label: 'Vísir', icon: '🗞️', url: 'https://visir.is' },
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
            className="flex flex-col items-center gap-1.5 py-2.5 px-1 rounded-xl transition-all active:scale-95"
            style={{ background: 'var(--surface2)', textDecoration: 'none' }}
          >
            <span className="text-xl leading-none">{link.icon}</span>
            <span className="text-center" style={{ color: 'var(--muted)', fontSize: 10 }}>{link.label}</span>
          </a>
        ))}
      </div>
    </div>
  )
}
