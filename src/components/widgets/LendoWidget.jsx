import { useLendo } from '../../hooks/useLendo'
import { formatShortISK } from '../../utils/currency'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

export default function LendoWidget() {
  const { monthlyTotal, monthlyGoalPct, goal, currentMonthBookings } = useLendo()
  const total = monthlyTotal()
  const pct = monthlyGoalPct()
  const bookings = currentMonthBookings()
  const isGoalMet = pct >= 100

  return (
    <div className="card" style={{
      background: 'linear-gradient(135deg, rgba(249,115,22,0.06), rgba(234,179,8,0.06))',
      border: `1px solid ${isGoalMet ? 'rgba(34,197,94,0.3)' : 'rgba(249,115,22,0.2)'}`,
    }}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">🪑</span>
          <div>
            <div className="text-sm font-semibold">Lendó tekjur</div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>
              {bookings.length} leiga{bookings.length !== 1 ? 'r' : ''} þennan mánuð
            </div>
          </div>
        </div>
        <Link to="/lendo" className="flex items-center gap-0.5 text-xs" style={{ color: 'var(--accent)' }}>
          Sjá allt <ChevronRight size={12} />
        </Link>
      </div>

      <div className="flex items-end justify-between mb-2">
        <div className="text-2xl font-semibold">{formatShortISK(total)}</div>
        <div className="text-xs text-right" style={{ color: 'var(--muted)' }}>
          Markmið: {formatShortISK(goal)}
        </div>
      </div>

      <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--surface2)' }}>
        <div className="h-full rounded-full transition-all duration-500"
             style={{
               width: `${pct}%`,
               background: isGoalMet ? 'var(--success)' : pct > 60 ? '#f97316' : '#eab308',
             }} />
      </div>
      <div className="flex justify-between text-xs mt-1" style={{ color: 'var(--muted)' }}>
        <span>{pct}% af marki</span>
        {!isGoalMet && <span>{formatShortISK(goal - total)} eftir</span>}
        {isGoalMet && <span style={{ color: 'var(--success)' }}>Marki náð! 🎉</span>}
      </div>
    </div>
  )
}
