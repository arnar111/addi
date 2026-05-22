import { Link } from 'react-router-dom'
import { ChevronRight, Trophy } from 'lucide-react'

const WC_START = new Date('2026-06-11T19:00:00Z')

function getCountdown() {
  const now = new Date()
  const diff = WC_START - now
  if (diff <= 0) return { days: 0, hours: 0, started: true }
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    started: false,
  }
}

export default function SportsWidget() {
  const cd = getCountdown()

  return (
    <div className="card" style={{
      background: 'linear-gradient(135deg, rgba(59,130,246,0.07), rgba(139,92,246,0.05))',
      borderColor: 'rgba(59,130,246,0.2)',
    }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-base">⚽</span>
          <h3 className="font-semibold text-sm">Íþróttir</h3>
        </div>
        <Link to="/sports" className="flex items-center gap-0.5 text-xs" style={{ color: 'var(--accent)' }}>
          Sjá allt <ChevronRight size={12} />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {/* World Cup countdown */}
        <div className="flex flex-col gap-1 p-3 rounded-xl"
             style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}>
          <span className="text-xs font-semibold" style={{ color: '#3b82f6' }}>🌍 World Cup 2026</span>
          {cd.started ? (
            <div className="text-sm font-bold" style={{ color: '#3b82f6' }}>Í gangi!</div>
          ) : (
            <>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold tabular-nums" style={{ color: '#3b82f6' }}>{cd.days}</span>
                <span className="text-xs" style={{ color: 'var(--muted)' }}>dagar</span>
              </div>
              <span className="text-xs" style={{ color: 'var(--muted)' }}>11 júní · USA/CAN/MEX</span>
            </>
          )}
        </div>

        {/* Inter Milan double */}
        <div className="flex flex-col gap-1 p-3 rounded-xl"
             style={{ background: 'rgba(0,0,50,0.3)', border: '1px solid rgba(100,100,200,0.2)' }}>
          <span className="text-xs font-semibold" style={{ color: '#888' }}>⚫🔵 Inter Milan</span>
          <div className="flex gap-1">
            <Trophy size={15} style={{ color: '#eab308' }} />
            <Trophy size={15} style={{ color: '#eab308' }} />
          </div>
          <span className="text-xs font-semibold" style={{ color: '#eab308' }}>Tvöfaldur 2025/26</span>
          <span className="text-xs" style={{ color: 'var(--muted)' }}>Serie A + Coppa</span>
        </div>
      </div>
    </div>
  )
}
