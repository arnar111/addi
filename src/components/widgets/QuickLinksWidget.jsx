const LINKS = [
  { label: 'The Athletic', url: 'https://theathletic.com', icon: '📰' },
  { label: 'LinkedIn', url: 'https://linkedin.com/jobs', icon: '💼' },
  { label: 'Audible', url: 'https://audible.com', icon: '🎧' },
  { label: 'Xbox', url: 'https://xbox.com', icon: '🎮' },
  { label: 'Trip.com', url: 'https://trip.com', icon: '✈️' },
  { label: 'Reddit', url: 'https://reddit.com', icon: '🔴' },
  { label: 'Costco', url: 'https://costco.is', icon: '🛒' },
  { label: 'Alfred.is', url: 'https://alfred.is', icon: '🇮🇸' },
]

export default function QuickLinksWidget() {
  return (
    <div className="card" style={{ padding: '12px 16px' }}>
      <div className="text-xs font-semibold mb-2" style={{ color: 'var(--muted)' }}>HRAÐTENGLAR</div>
      <div className="flex gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {LINKS.map(l => (
          <a key={l.label} href={l.url} target="_blank" rel="noopener noreferrer"
             className="flex flex-col items-center gap-1 shrink-0 no-underline group">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl transition-all group-hover:scale-110 group-active:scale-95"
                 style={{ background: 'var(--surface2)' }}>
              {l.icon}
            </div>
            <span className="text-xs text-center leading-tight" style={{ color: 'var(--muted)', fontSize: 10, maxWidth: 44 }}>
              {l.label}
            </span>
          </a>
        ))}
      </div>
    </div>
  )
}
