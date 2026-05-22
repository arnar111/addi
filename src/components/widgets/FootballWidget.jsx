import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const WC_START = new Date('2026-06-11T00:00:00')
const WC_FINAL = new Date('2026-07-19T00:00:00')

export default function FootballWidget() {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60000)
    return () => clearInterval(t)
  }, [])

  const started = now >= WC_START
  const ended = now >= WC_FINAL
  const target = started ? WC_FINAL : WC_START
  const diff = Math.max(0, target - now)
  const days = Math.floor(diff / 86400000)
  const hours = Math.floor((diff % 86400000) / 3600000)

  return (
    <Link to="/football" style={{ textDecoration: 'none' }}>
      <div className="card flex items-center gap-3 py-3"
           style={{ background: 'linear-gradient(135deg, rgba(251,191,36,0.07), rgba(239,68,68,0.04))', border: '1px solid rgba(251,191,36,0.2)' }}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-xl"
             style={{ background: 'rgba(251,191,36,0.12)' }}>
          {ended ? '🏆' : '⚽'}
        </div>
        <div className="flex-1 min-w-0">
          {ended ? (
            <>
              <div className="text-sm font-medium">HM 2026 lokið</div>
              <div className="text-xs" style={{ color: 'var(--muted)' }}>Sjá niðurstöður →</div>
            </>
          ) : started ? (
            <>
              <div className="text-sm font-medium" style={{ color: '#fbbf24' }}>🔥 HM 2026 í gangi!</div>
              <div className="text-xs" style={{ color: 'var(--muted)' }}>
                {days > 0 ? `${days}d ${hours}t` : `${hours}t`} eftir í úrslitaleik
              </div>
            </>
          ) : (
            <>
              <div className="text-sm font-medium">FIFA World Cup 2026</div>
              <div className="text-xs" style={{ color: 'var(--muted)' }}>
                {days === 0 ? '🔥 Kynningarleikur í dag!' : days === 1 ? '1 dagur eftir!' : `${days} dagar eftir`}
              </div>
            </>
          )}
        </div>
        <div className="text-right shrink-0">
          {!ended && !started && (
            <>
              <div className="text-lg font-bold tabular-nums" style={{ color: '#fbbf24' }}>{days}</div>
              <div className="text-xs" style={{ color: 'var(--muted)' }}>dagar</div>
            </>
          )}
          <span className="text-xs" style={{ color: 'var(--muted)' }}>→</span>
        </div>
      </div>
    </Link>
  )
}
