const LINKS = [
  { label: 'Lendó', href: 'https://lendoapp.is', icon: '🏠', color: '#f97316' },
  { label: 'Alfred', href: 'https://alfred.is', icon: '💳', color: '#00d4aa' },
  { label: 'The Athletic', href: 'https://theathletic.com', icon: '⚽', color: '#3b82f6' },
  { label: 'Heimildin', href: 'https://heimildin.is', icon: '📰', color: '#8b5cf6' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com', icon: '💼', color: '#0077b5' },
  { label: 'Gmail', href: 'https://mail.google.com', icon: '📧', color: '#ea4335' },
]

export default function QuickLinksWidget() {
  return (
    <div className="card">
      <h3 className="font-semibold text-sm mb-3">Flýtileiðir</h3>
      <div className="grid grid-cols-3 gap-2">
        {LINKS.map(l => (
          <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer"
            className="flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all active:scale-95"
            style={{ background: 'var(--surface2)', textDecoration: 'none' }}>
            <span className="text-xl">{l.icon}</span>
            <span className="text-xs font-medium" style={{ color: 'var(--muted)' }}>{l.label}</span>
          </a>
        ))}
      </div>
    </div>
  )
}
