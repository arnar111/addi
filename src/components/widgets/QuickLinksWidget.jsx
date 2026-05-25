const LINKS = [
  { label: 'Wolt', icon: '🛵', url: 'https://wolt.com', color: '#009de0' },
  { label: 'indó', icon: '🛒', url: 'https://indo.is', color: '#00d4aa' },
  { label: 'dropp', icon: '📦', url: 'https://dropp.is', color: '#8b5cf6' },
  { label: 'Lendó', icon: '🪑', url: 'https://www.lendo.is', color: '#f97316' },
  { label: 'The Athletic', icon: '📰', url: 'https://theathletic.com', color: '#e2e8f0' },
  { label: 'LinkedIn', icon: '💼', url: 'https://linkedin.com/in/', color: '#0a66c2' },
]

export default function QuickLinksWidget() {
  return (
    <div className="card">
      <h3 className="font-semibold text-sm mb-3">Flýtileiðir</h3>
      <div className="grid grid-cols-3 gap-2">
        {LINKS.map(({ label, icon, url, color }) => (
          <a
            key={label}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-1.5 py-3 rounded-xl transition-all hover:opacity-80 active:scale-95"
            style={{ background: 'var(--surface2)' }}
          >
            <span className="text-2xl">{icon}</span>
            <span className="text-xs font-medium" style={{ color }}>{label}</span>
          </a>
        ))}
      </div>
    </div>
  )
}
