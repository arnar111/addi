const LINKS = [
  { label: 'The Athletic', icon: '⚽', url: 'https://theathletic.com', color: '#3b82f6' },
  { label: 'alfred.is', icon: '💼', url: 'https://alfred.is', color: '#8b5cf6' },
  { label: 'Golf+', icon: '🏌️', url: 'https://golfplusvr.com', color: '#22c55e' },
  { label: 'Xbox', icon: '🎮', url: 'https://xbox.com', color: '#107c10' },
  { label: 'Audible', icon: '🎧', url: 'https://audible.com', color: '#f97316' },
  { label: 'Reddit', icon: '🤖', url: 'https://reddit.com/r/ClaudeAI', color: '#ff4500' },
  { label: 'Costco', icon: '🛒', url: 'https://costco.is', color: '#00d4aa' },
  { label: 'Coursera', icon: '📖', url: 'https://coursera.org', color: '#0056d3' },
]

export default function QuickLinksWidget() {
  return (
    <div className="card">
      <h3 className="font-semibold text-sm mb-3">Flýtitenglar</h3>
      <div className="grid grid-cols-4 gap-2">
        {LINKS.map(link => (
          <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer"
             className="flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all"
             style={{ background: 'var(--surface2)' }}
             onMouseEnter={e => e.currentTarget.style.background = `${link.color}18`}
             onMouseLeave={e => e.currentTarget.style.background = 'var(--surface2)'}>
            <span className="text-xl">{link.icon}</span>
            <span className="text-center leading-tight" style={{ fontSize: 9, color: 'var(--muted)' }}>{link.label}</span>
          </a>
        ))}
      </div>
    </div>
  )
}
