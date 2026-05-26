const LINKS = [
  { label: 'Wolt', icon: '🛵', url: 'https://wolt.com/is/isl/gardabaer', color: '#00c2e0', hint: 'Panta mat' },
  { label: 'indó', icon: '🛒', url: 'https://indo.is', color: '#5b21b6', hint: 'Matvörur' },
  { label: 'Dropp', icon: '📦', url: 'https://dropp.is', color: '#f97316', hint: 'Sækja pakka' },
  { label: 'Netflix', icon: '🎬', url: 'https://netflix.com', color: '#e50914', hint: 'Horfa' },
  { label: 'Lendo', icon: '💳', url: 'https://lendoapp.is', color: '#00d4aa', hint: 'Lánveitingar' },
  { label: 'GitHub', icon: '💻', url: 'https://github.com/arnar111', color: '#8b5cf6', hint: 'Kóðun' },
]

export default function QuickLinksWidget() {
  return (
    <div className="card">
      <div className="text-xs font-semibold mb-3" style={{ color: 'var(--muted)' }}>FLÝTILEIÐIR</div>
      <div className="grid grid-cols-3 gap-2">
        {LINKS.map(link => (
          <a
            key={link.label}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-1.5 py-3 rounded-2xl transition-all active:scale-95"
            style={{ background: `${link.color}11`, border: `1px solid ${link.color}22` }}
          >
            <span className="text-xl">{link.icon}</span>
            <span className="text-xs font-semibold" style={{ color: link.color }}>{link.label}</span>
            <span className="text-center leading-tight" style={{ fontSize: 9, color: 'var(--muted)' }}>{link.hint}</span>
          </a>
        ))}
      </div>
    </div>
  )
}
