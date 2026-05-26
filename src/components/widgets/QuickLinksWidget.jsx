const LINKS = [
  { label: 'dropp', icon: '📦', url: 'https://dropp.is', color: '#f97316' },
  { label: 'indó', icon: '🛒', url: 'https://indo.is', color: '#8b5cf6' },
  { label: 'Athletic', icon: '🏟️', url: 'https://theathletic.com', color: '#00d4aa' },
  { label: 'Netflix', icon: '🎬', url: 'https://netflix.com', color: '#ef4444' },
  { label: 'Reddit', icon: '🤖', url: 'https://reddit.com/r/artificial', color: '#ff4500' },
  { label: 'Kimi AI', icon: '🌙', url: 'https://kimi.ai', color: '#8b5cf6' },
  { label: 'Inter', icon: '⚽', url: 'https://inter.it', color: '#0068A8' },
  { label: 'Trip.com', icon: '✈️', url: 'https://trip.com', color: '#3b82f6' },
]

export default function QuickLinksWidget() {
  return (
    <div className="card">
      <h3 className="font-semibold text-sm mb-3">Flýtitenglar</h3>
      <div className="grid grid-cols-4 gap-2">
        {LINKS.map(({ label, icon, url, color }) => (
          <a key={label} href={url} target="_blank" rel="noopener noreferrer"
             className="flex flex-col items-center gap-1.5 py-3 rounded-xl transition-all active:scale-95"
             style={{ background: 'var(--surface2)', textDecoration: 'none' }}>
            <span className="text-xl">{icon}</span>
            <span className="text-xs font-medium" style={{ color }}>{label}</span>
          </a>
        ))}
      </div>
    </div>
  )
}
