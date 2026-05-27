import { daysUntil } from '../../utils/time'

// London Summer Day Party — ~June 27 2026
const LONDON_DATE = '2026-06-27T14:00:00+01:00'
const LONDON_LABEL = 'London Summer Party 🇬🇧'
const LONDON_SUB = '5 svið · 35+ DJs · dagveisla'

export default function CountdownWidget() {
  const days = daysUntil(LONDON_DATE)
  const isNear = days <= 7
  const isPast = days === 0

  if (isPast) {
    return (
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(0,212,170,0.1))', borderColor: 'rgba(139,92,246,0.3)' }}>
        <div className="flex items-center gap-3">
          <span className="text-2xl">🎉</span>
          <div>
            <div className="font-semibold">{LONDON_LABEL}</div>
            <div className="text-sm" style={{ color: 'var(--accent2)' }}>Í gangi núna! Party hard! 🕺</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="card overflow-hidden relative" style={{
      background: 'linear-gradient(135deg, rgba(139,92,246,0.15) 0%, rgba(0,212,170,0.08) 100%)',
      borderColor: 'rgba(139,92,246,0.35)'
    }}>
      {/* Background glow */}
      <div style={{
        position: 'absolute', top: -20, right: -20,
        width: 120, height: 120,
        background: 'radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none'
      }} />

      <div className="relative flex items-center gap-4">
        <div className="flex flex-col items-center justify-center shrink-0"
             style={{
               width: 64, height: 64,
               background: 'rgba(139,92,246,0.2)',
               borderRadius: 16,
               border: '1px solid rgba(139,92,246,0.4)'
             }}>
          <span className="text-2xl font-bold" style={{ color: '#a78bfa', lineHeight: 1 }}>{days}</span>
          <span className="text-xs" style={{ color: 'rgba(167,139,250,0.8)' }}>dagar</span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            {isNear && <span className="animate-pulse-soft text-xs" style={{ color: '#f97316' }}>● BRÁÐLEGA</span>}
          </div>
          <div className="font-semibold text-sm">{LONDON_LABEL}</div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{LONDON_SUB}</div>
          <div className="text-xs mt-1" style={{ color: 'rgba(167,139,250,0.7)' }}>
            27. júní 2026
          </div>
        </div>

        <span className="text-3xl shrink-0">✈️</span>
      </div>
    </div>
  )
}
