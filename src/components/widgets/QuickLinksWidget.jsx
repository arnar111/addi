const LINKS = [
  { name: 'The Athletic', url: 'https://theathletic.com', icon: '📰' },
  { name: 'LinkedIn', url: 'https://linkedin.com/in/', icon: '💼' },
  { name: 'GitHub', url: 'https://github.com/arnar111', icon: '⌨️' },
  { name: 'Patreon', url: 'https://patreon.com', icon: '🎬' },
  { name: 'Reddit', url: 'https://reddit.com', icon: '🔴' },
  { name: 'Sofascore', url: 'https://sofascore.com', icon: '⚽' },
  { name: 'Transfermarkt', url: 'https://transfermarkt.com', icon: '🔄' },
  { name: 'ChatGPT', url: 'https://chatgpt.com', icon: '🤖' },
]

export default function QuickLinksWidget() {
  return (
    <div className="card">
      <h3 className="font-semibold text-sm mb-3">Flýtitenglar</h3>
      <div className="grid grid-cols-4 gap-2">
        {LINKS.map(l => (
          <a key={l.name} href={l.url} target="_blank" rel="noopener noreferrer"
             className="flex flex-col items-center gap-1 p-2 rounded-xl transition-opacity hover:opacity-75"
             style={{ background: 'var(--surface2)', textDecoration: 'none' }}>
            <span className="text-xl">{l.icon}</span>
            <span className="text-center leading-tight" style={{ color: 'var(--muted)', fontSize: 10 }}>{l.name}</span>
          </a>
        ))}
      </div>
    </div>
  )
}
