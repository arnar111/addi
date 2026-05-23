import { useState, useEffect } from 'react'

const WC_START = new Date('2026-06-11T00:00:00')
const WC_END = new Date('2026-07-19T23:59:59')

export default function WorldCupWidget() {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60000)
    return () => clearInterval(t)
  }, [])

  const msUntil = WC_START - now
  const isLive = now >= WC_START && now <= WC_END
  const isOver = now > WC_END

  if (isOver) return null

  const days = Math.ceil(msUntil / (1000 * 60 * 60 * 24))
  const hours = Math.floor((msUntil % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

  if (isLive) {
    return (
      <div className="card flex items-center gap-4"
           style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.1), rgba(139,92,246,0.08))', border: '1px solid rgba(0,212,170,0.25)' }}>
        <div className="text-3xl">⚽</div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm">FIFA World Cup 2026</span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full animate-pulse-soft" style={{ background: 'var(--success)' }} />
              <span className="text-xs font-semibold" style={{ color: 'var(--success)' }}>LIVE</span>
            </span>
          </div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>Í gangi · Bandaríkin, Kanada, Mexíkó</div>
        </div>
      </div>
    )
  }

  return (
    <div className="card"
         style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(0,212,170,0.06))', border: '1px solid rgba(59,130,246,0.2)' }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-2xl">⚽</div>
          <div>
            <div className="font-semibold text-sm">FIFA World Cup 2026</div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>11. júní — 19. júlí · Bandaríkin</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold" style={{ color: '#3b82f6' }}>{days}</div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>
            {days === 1 ? 'dagur' : 'dagar'} eftir
          </div>
        </div>
      </div>
      {days <= 7 && (
        <div className="mt-2.5 pt-2.5 border-t flex items-center gap-1.5 text-xs" style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}>
          <span>⏰</span>
          <span>{hours}klst eftir auk þess · Byrjar {WC_START.toLocaleDateString('is-IS', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
        </div>
      )}
    </div>
  )
}
