const LINKS = [
  { label: 'Athletic', icon: '📰', url: 'https://theathletic.com', color: '#1a1a2e' },
  { label: 'Duolingo', icon: '🦉', url: 'https://www.duolingo.com', color: '#58cc02' },
  { label: 'Audible', icon: '🎧', url: 'https://www.audible.com', color: '#f47920' },
  { label: 'LinkedIn', icon: '💼', url: 'https://www.linkedin.com', color: '#0077b5' },
  { label: 'Heimildin', icon: '🇮🇸', url: 'https://heimildin.is', color: '#c0392b' },
  { label: 'Steam', icon: '🎮', url: 'https://store.steampowered.com', color: '#1b2838' },
  { label: 'Reddit', icon: '🔶', url: 'https://www.reddit.com/r/ClaudeAI', color: '#ff4500' },
  { label: 'ElevenLabs', icon: '🔊', url: 'https://elevenlabs.io', color: '#111' },
]

export default function QuickLinksWidget() {
  return (
    <div className="card">
      <div className="text-xs font-semibold mb-3" style={{ color: 'var(--muted)' }}>FLÝTILEIÐIR</div>
      <div className="grid grid-cols-4 gap-2">
        {LINKS.map(({ label, icon, url, color }) => (
          <a key={label} href={url} target="_blank" rel="noreferrer"
             className="flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all active:scale-95"
             style={{ background: 'var(--surface2)' }}>
            <span className="text-xl">{icon}</span>
            <span className="text-xs font-medium" style={{ color: 'var(--muted)', fontSize: 10 }}>{label}</span>
          </a>
        ))}
      </div>
    </div>
  )
}
