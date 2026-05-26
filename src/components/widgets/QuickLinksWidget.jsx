const LINKS = [
  { label: 'Lendó', icon: '🏠', url: 'https://lendo.is', color: '#00d4aa' },
  { label: 'The Athletic', icon: '🏆', url: 'https://theathletic.com', color: '#f97316' },
  { label: 'Heimildin', icon: '🗞️', url: 'https://heimildin.is', color: '#3b82f6' },
  { label: 'LinkedIn', icon: '💼', url: 'https://linkedin.com/in/', color: '#0077b5' },
  { label: 'Claude', icon: '🤖', url: 'https://claude.ai', color: '#8b5cf6' },
  { label: 'Audible', icon: '🎧', url: 'https://audible.com', color: '#f59e0b' },
  { label: 'BBC Sport', icon: '⚽', url: 'https://bbc.com/sport/football/premier-league', color: '#ef4444' },
  { label: 'ElevenLabs', icon: '🎙️', url: 'https://elevenlabs.io', color: '#22c55e' },
]

export default function QuickLinksWidget() {
  return (
    <div className="card">
      <h3 className="font-semibold text-sm mb-3">Flýtileiðir</h3>
      <div className="grid grid-cols-4 gap-2">
        {LINKS.map(link => (
          <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer"
            className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl transition-all hover:scale-105 active:scale-95"
            style={{ background: 'var(--surface2)', textDecoration: 'none' }}>
            <span className="text-2xl">{link.icon}</span>
            <span className="text-xs text-center leading-tight" style={{ color: 'var(--muted)', fontSize: 10 }}>
              {link.label}
            </span>
          </a>
        ))}
      </div>
    </div>
  )
}
