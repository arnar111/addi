const LINKS = [
  { name: 'Lendo', url: 'https://lendoapp.is', icon: '💼', color: '#00d4aa' },
  { name: 'Alfred', url: 'https://alfred.is', icon: '🏢', color: '#8b5cf6' },
  { name: 'Athletic', url: 'https://theathletic.com', icon: '⚽', color: '#e63946' },
  { name: 'Reddit', url: 'https://reddit.com/r/ClaudeAI', icon: '🤖', color: '#ff4500' },
  { name: 'Xbox', url: 'https://www.xbox.com/play', icon: '🎮', color: '#107c10' },
  { name: 'Coursera', url: 'https://coursera.org', icon: '🎓', color: '#0056d2' },
]

export default function QuickLinksWidget() {
  return (
    <div className="card">
      <h3 className="font-semibold text-sm mb-3">Flýtileiðir</h3>
      <div className="grid grid-cols-3 gap-2">
        {LINKS.map(l => (
          <a key={l.name} href={l.url} target="_blank" rel="noopener noreferrer"
            className="flex flex-col items-center gap-1.5 py-3 rounded-xl transition-all active:scale-95"
            style={{ background: 'var(--surface2)', textDecoration: 'none' }}>
            <span className="text-xl">{l.icon}</span>
            <span className="text-xs" style={{ color: 'var(--text)' }}>{l.name}</span>
          </a>
        ))}
      </div>
    </div>
  )
}
