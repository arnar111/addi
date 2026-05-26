const LINKS = [
  { label: 'Wolt', icon: '🛵', url: 'https://wolt.com/is', color: '#009de0' },
  { label: 'indó', icon: '🛒', url: 'https://indo.is', color: '#00a86b' },
  { label: 'Dropp', icon: '📦', url: 'https://dropp.is', color: '#ff6b35' },
  { label: 'GitHub', icon: '🐙', url: 'https://github.com/arnar111', color: '#e2e8f0' },
  { label: 'Athletic', icon: '⚽', url: 'https://theathletic.com', color: '#de4600' },
  { label: 'LinkedIn', icon: '💼', url: 'https://linkedin.com', color: '#0a66c2' },
]

export default function QuickLinksWidget() {
  return (
    <div className="card">
      <h3 className="font-semibold text-sm mb-3">Flýtilyklar</h3>
      <div className="grid grid-cols-3 gap-2">
        {LINKS.map(l => (
          <a
            key={l.label}
            href={l.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-1.5 py-2.5 rounded-xl transition-all"
            style={{ background: 'var(--surface2)', textDecoration: 'none' }}
          >
            <span className="text-xl">{l.icon}</span>
            <span className="text-xs font-medium" style={{ color: l.color }}>{l.label}</span>
          </a>
        ))}
      </div>
    </div>
  )
}
