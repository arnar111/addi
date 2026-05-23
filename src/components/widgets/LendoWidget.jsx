import { Link } from 'react-router-dom'
import { useLendo } from '../../hooks/useLendo'
import { formatISK, formatShortISK } from '../../utils/currency'
import { TrendingUp, ArrowRight } from 'lucide-react'

export default function LendoWidget() {
  const { monthlyIncome, monthlyGoal, goalPct, thisMonthBookings } = useLendo()

  const income = monthlyIncome()
  const pct = goalPct()
  const bookings = thisMonthBookings()
  const isGoalMet = income >= monthlyGoal

  return (
    <Link to="/lendo" style={{ textDecoration: 'none' }}>
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.07), rgba(0,180,140,0.03))' }}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-base">🏠</span>
            <span className="text-sm font-semibold">Lendó</span>
          </div>
          <ArrowRight size={14} style={{ color: 'var(--muted)' }} />
        </div>
        <div className="flex items-end justify-between mb-2">
          <div>
            <div className="text-2xl font-bold" style={{ color: isGoalMet ? 'var(--accent)' : 'var(--text)' }}>
              {formatShortISK(income)}
            </div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>
              af {formatShortISK(monthlyGoal)} markmiði
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold" style={{ color: 'var(--accent)' }}>{pct}%</div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>{bookings.length} bókun{bookings.length !== 1 ? 'ar' : ''}</div>
          </div>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--surface2)' }}>
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${pct}%`,
              background: isGoalMet ? 'linear-gradient(90deg, #00d4aa, #8b5cf6)' : 'var(--accent)',
            }}
          />
        </div>
      </div>
    </Link>
  )
}
