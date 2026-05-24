const LINKS = [
  { label: 'Lendo', url: 'https://lendoapp.is', icon: '🏦', color: '#00d4aa' },
  { label: 'Spiran', url: 'https://spiran.netlify.app', icon: '🌿', color: '#22c55e' },
  { label: 'Draumakaup', url: 'https://draumakaup.netlify.app', icon: '⚽', color: '#da020a' },
  { label: 'The Athletic', url: 'https://theathletic.com', icon: '📰', color: '#f97316' },
  { label: 'Mamma', url: 'https://mamma-recipes-arnar.netlify.app', icon: '🍳', color: '#eab308' },
  { label: 'Netlify', url: 'https://app.netlify.com', icon: '⚡', color: '#8b5cf6' },
]

export default function QuickLinksWidget() {
  return (
    <div className="card">
      <h3 className="font-semibold text-sm mb-3">Flýtileiðir</h3>
      <div className="grid grid-cols-3 gap-2">
        {LINKS.map(link => (
          <a
            key={link.label}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all active:scale-95"
            style={{
              background: `${link.color}12`,
              border: `1px solid ${link.color}25`,
              textDecoration: 'none',
            }}
          >
            <span style={{ fontSize: 22 }}>{link.icon}</span>
            <span style={{ fontSize: 10, color: 'var(--text)', fontWeight: 500, textAlign: 'center' }}>
              {link.label}
            </span>
          </a>
        ))}
      </div>
    </div>
  )
}
