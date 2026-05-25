const LINKS = [
  { label: 'Wolt', emoji: '🍕', url: 'https://wolt.com/is', color: '#01adc3' },
  { label: 'Dropp', emoji: '📦', url: 'https://dropp.is', color: '#00d4aa' },
  { label: 'indó', emoji: '💳', url: 'https://indo.is', color: '#8b5cf6' },
  { label: 'Lendo', emoji: '🏠', url: 'https://lendoapp.is', color: '#f97316' },
  { label: 'Trip', emoji: '✈️', url: 'https://trip.com', color: '#3b82f6' },
  { label: 'Tix', emoji: '🎟️', url: 'https://seatgeek.com', color: '#ec4899' },
]

export default function QuickLinksWidget() {
  return (
    <div className="card-sm">
      <div className="text-xs font-medium mb-2.5" style={{ color: 'var(--muted)' }}>Skjótir tenglar</div>
      <div className="grid grid-cols-6 gap-1.5">
        {LINKS.map(l => (
          <a key={l.label} href={l.url} target="_blank" rel="noreferrer"
             className="flex flex-col items-center gap-1 py-2.5 rounded-xl transition-all active:scale-95 hover:opacity-80"
             style={{ background: 'var(--surface2)', textDecoration: 'none' }}>
            <span style={{ fontSize: 20 }}>{l.emoji}</span>
            <span style={{ color: 'var(--muted)', fontSize: 9, fontWeight: 500 }}>{l.label}</span>
          </a>
        ))}
      </div>
    </div>
  )
}
