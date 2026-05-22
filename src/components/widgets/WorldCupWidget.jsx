import { useMemo } from 'react'

const START = new Date('2026-06-12T00:00:00')
const END   = new Date('2026-07-19T23:59:59')

export default function WorldCupWidget() {
  const now = new Date()
  const ended   = now > END
  const started = now >= START

  const daysUntil = useMemo(() => {
    const diff = START - new Date()
    return Math.max(0, Math.ceil(diff / 86400000))
  }, [])

  if (ended) return null

  return (
    <div className="card" style={{
      background: 'linear-gradient(135deg, rgba(220,38,38,0.07), rgba(234,179,8,0.06))',
      border: '1px solid rgba(234,179,8,0.18)',
    }}>
      <div className="flex items-center gap-3">
        <div className="text-3xl shrink-0">🏆</div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold">FIFA Heimsmeistarakeppnin 2026</div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
            Bandaríkin · Kanada · Mexíkó
          </div>
        </div>
        {!started && (
          <div className="flex flex-col items-end shrink-0">
            <div className="text-2xl font-bold tabular-nums" style={{ color: '#eab308' }}>
              {daysUntil}
            </div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>dagar</div>
          </div>
        )}
        {started && (
          <div className="text-xs font-semibold px-2 py-1 rounded-full"
               style={{ background: 'rgba(220,38,38,0.2)', color: '#f87171' }}>
            LIVE
          </div>
        )}
      </div>

      {!started && (
        <div className="mt-3 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--surface2)' }}>
          <div className="h-full rounded-full" style={{
            width: `${Math.round(((365 - daysUntil) / 365) * 100)}%`,
            background: 'linear-gradient(90deg, #ef4444, #eab308)',
          }} />
        </div>
      )}

      <div className="mt-2 flex gap-3 text-xs" style={{ color: 'var(--muted)' }}>
        <span>12 júní – 19 júlí</span>
        <span>·</span>
        <span>48 lið</span>
        <span>·</span>
        <span>104 leikir</span>
      </div>
    </div>
  )
}
