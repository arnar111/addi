import { useLocalStorage } from '../../hooks/useLocalStorage'

const todayKey = () => new Date().toISOString().split('T')[0]

const LINKS = [
  { label: 'Wolt', emoji: '🍕', url: 'https://wolt.com/is', color: '#01adc3', trackable: true },
  { label: 'Dropp', emoji: '📦', url: 'https://dropp.is', color: '#00d4aa' },
  { label: 'indó', emoji: '💳', url: 'https://indo.is', color: '#8b5cf6' },
  { label: 'Lendo', emoji: '🏠', url: 'https://lendoapp.is', color: '#f97316' },
  { label: 'Trip', emoji: '✈️', url: 'https://trip.com', color: '#3b82f6' },
  { label: 'Tix', emoji: '🎟️', url: 'https://seatgeek.com', color: '#ec4899' },
]

export default function QuickLinksWidget() {
  const [woltUsed, setWoltUsed] = useLocalStorage('addi_wolt_used', '')

  const woltUsedToday = woltUsed === todayKey()

  const handleWoltClick = () => {
    if (!woltUsedToday) setWoltUsed(todayKey())
    window.open('https://wolt.com/is', '_blank', 'noreferrer')
  }

  return (
    <div className="card-sm">
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-xs font-medium" style={{ color: 'var(--muted)' }}>Skjótir tenglar</span>
        {woltUsedToday ? (
          <span className="text-xs flex items-center gap-1" style={{ color: 'var(--success)' }}>
            <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: 'var(--success)' }} />
            Wolt notað í dag
          </span>
        ) : (
          <span className="text-xs" style={{ color: '#f97316' }}>
            ⚡ Notaðu Wolt pass!
          </span>
        )}
      </div>
      <div className="grid grid-cols-6 gap-1.5">
        {LINKS.map(l => {
          const isWolt = l.trackable
          const isUsed = isWolt && woltUsedToday
          return isWolt ? (
            <button
              key={l.label}
              onClick={handleWoltClick}
              className="flex flex-col items-center gap-1 py-2.5 rounded-xl transition-all active:scale-95 hover:opacity-80 border-0"
              style={{
                background: isUsed ? 'rgba(1,173,195,0.15)' : 'var(--surface2)',
                outline: isUsed ? '1px solid rgba(1,173,195,0.4)' : 'none',
                cursor: 'pointer',
              }}>
              <span style={{ fontSize: 20 }}>{l.emoji}</span>
              <span style={{ color: isUsed ? '#01adc3' : 'var(--muted)', fontSize: 9, fontWeight: 500 }}>{l.label}</span>
            </button>
          ) : (
            <a key={l.label} href={l.url} target="_blank" rel="noreferrer"
               className="flex flex-col items-center gap-1 py-2.5 rounded-xl transition-all active:scale-95 hover:opacity-80"
               style={{ background: 'var(--surface2)', textDecoration: 'none' }}>
              <span style={{ fontSize: 20 }}>{l.emoji}</span>
              <span style={{ color: 'var(--muted)', fontSize: 9, fontWeight: 500 }}>{l.label}</span>
            </a>
          )
        })}
      </div>
    </div>
  )
}
