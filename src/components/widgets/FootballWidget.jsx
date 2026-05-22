import { Link } from 'react-router-dom'

const WC_START = new Date('2026-06-11T00:00:00')

function daysUntil(target) {
  const now = new Date()
  const diff = target - now
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

const FIXTURES = [
  { home: 'Argentína', away: 'Kanada', date: 'Jun 11', group: 'A', time: '21:00' },
  { home: 'Mexíkó', away: 'Þjóðverjaland', date: 'Jun 13', group: 'B', time: '21:00' },
  { home: 'England', away: 'Senega', date: 'Jun 15', group: 'C', time: '21:00' },
]

export default function FootballWidget() {
  const days = daysUntil(WC_START)
  const started = days === 0

  return (
    <div className="card overflow-hidden" style={{
      background: 'linear-gradient(135deg, rgba(0,100,0,0.12) 0%, rgba(0,212,170,0.06) 100%)',
      border: '1px solid rgba(0,180,80,0.2)',
    }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">⚽</span>
          <div>
            <div className="text-sm font-semibold">FIFA World Cup 2026</div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>USA · Kanada · Mexíkó</div>
          </div>
        </div>
        {!started && (
          <div className="flex flex-col items-end">
            <div className="text-2xl font-bold tabular-nums" style={{ color: '#22c55e' }}>{days}</div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>dagar eftir</div>
          </div>
        )}
        {started && (
          <span className="badge text-xs" style={{ background: 'rgba(34,197,94,0.2)', color: '#22c55e' }}>
            LIVE
          </span>
        )}
      </div>

      {/* Favorite teams */}
      <div className="flex gap-2 mb-3">
        {[
          { flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', name: 'England', status: 'Hlutdeildarleikur C' },
          { flag: '🇮🇹', name: 'Ítalía', status: 'Hlutdeildarleikur D' },
        ].map(t => (
          <div key={t.name} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs"
               style={{ background: 'var(--surface2)' }}>
            <span>{t.flag}</span>
            <span className="font-medium">{t.name}</span>
          </div>
        ))}
      </div>

      {/* Inter news */}
      <div className="px-3 py-2 rounded-xl text-xs flex items-center gap-2"
           style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(0,100,220,0.25)' }}>
        <span>🔵⚫</span>
        <span style={{ color: 'var(--muted)' }}>
          Inter Milan — <span className="font-semibold" style={{ color: '#60a5fa' }}>Serie A + Coppa Italia 🏆🏆</span>
        </span>
      </div>
    </div>
  )
}
