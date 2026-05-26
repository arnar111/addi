import { Link } from 'react-router-dom'
import { ChevronRight, TrendingUp, Flame } from 'lucide-react'
import { useLendo } from '../../hooks/useLendo'
import { formatShortISK } from '../../utils/currency'

export default function LendoWidget() {
  const { monthlyRevenue, goal, thisMonthBookings, streak } = useLendo()
  const revenue = monthlyRevenue()
  const pct = Math.min(100, Math.round((revenue / goal) * 100))
  const isOnTrack = revenue >= goal * 0.5

  return (
    <div className="card" style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.06), rgba(139,92,246,0.04))' }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-base">🏠</span>
          <h3 className="font-semibold text-sm">Lendo</h3>
          {streak > 0 && (
            <span className="flex items-center gap-0.5 text-xs" style={{ color: '#f97316' }}>
              <Flame size={12} />{streak}d
            </span>
          )}
        </div>
        <Link to="/lendo" className="flex items-center gap-0.5 text-xs" style={{ color: 'var(--accent)' }}>
          Sjá allt <ChevronRight size={12} />
        </Link>
      </div>

      <div className="flex items-end justify-between mb-2">
        <div>
          <div className="text-2xl font-semibold">{formatShortISK(revenue)}</div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
            af {formatShortISK(goal)} mánaðarmarkmiði
          </div>
        </div>
        <div className="flex flex-col items-end gap-0.5">
          <div className="flex items-center gap-1 text-xs" style={{ color: isOnTrack ? 'var(--success)' : 'var(--muted)' }}>
            <TrendingUp size={12} />
            {thisMonthBookings.length} leigur
          </div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>þennan mánuð</div>
        </div>
      </div>

      <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--surface2)' }}>
        <div className="h-full rounded-full transition-all duration-700"
             style={{ width: `${pct}%`, background: pct >= 100 ? 'var(--success)' : 'var(--accent)' }} />
      </div>
      <div className="text-xs mt-1 text-right" style={{ color: 'var(--muted)' }}>{pct}% af markmiði</div>
    </div>
  )
}
