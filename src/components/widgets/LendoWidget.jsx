import { NavLink } from 'react-router-dom'
import { useLendo } from '../../hooks/useLendo'
import { formatISK, formatShortISK } from '../../utils/currency'
import { ChevronRight, TrendingUp } from 'lucide-react'

export default function LendoWidget() {
  const { monthlyGoal, currentMonthIncome, incomeForDays, reviews, nextBooking, items } = useLendo()

  const monthIncome = currentMonthIncome()
  const pct = Math.min(100, Math.round((monthIncome / monthlyGoal) * 100))
  const isGoalMet = monthIncome >= monthlyGoal
  const next = nextBooking()
  const weekIncome = incomeForDays(7)

  return (
    <NavLink to="/lendo" className="card block"
      style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.07), rgba(16,185,129,0.05))', textDecoration: 'none' }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
               style={{ background: 'rgba(0,212,170,0.15)' }}>
            <span style={{ fontSize: 16 }}>🏠</span>
          </div>
          <div>
            <div className="text-sm font-semibold">Lendó</div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>⭐ {reviews.rating} · {reviews.count} umsagnir</div>
          </div>
        </div>
        <ChevronRight size={16} style={{ color: 'var(--muted)' }} />
      </div>

      <div className="flex items-end justify-between mb-2">
        <div>
          <div className="text-xs mb-0.5" style={{ color: 'var(--muted)' }}>Þessi mánuður</div>
          <div className="text-2xl font-bold" style={{ color: isGoalMet ? 'var(--success)' : 'var(--text)' }}>
            {formatShortISK(monthIncome)}
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs mb-0.5" style={{ color: 'var(--muted)' }}>Markmið</div>
          <div className="text-sm font-semibold" style={{ color: 'var(--muted)' }}>{formatShortISK(monthlyGoal)}</div>
        </div>
      </div>

      <div className="h-2 rounded-full overflow-hidden mb-3" style={{ background: 'var(--surface2)' }}>
        <div className="h-full rounded-full transition-all"
             style={{ width: `${pct}%`, background: isGoalMet ? 'var(--success)' : 'var(--accent)' }} />
      </div>

      <div className="flex items-center justify-between text-xs" style={{ color: 'var(--muted)' }}>
        <span style={{ color: pct >= 100 ? 'var(--success)' : 'inherit' }}>
          {pct}% af markmiði
        </span>
        {weekIncome > 0 && (
          <span className="flex items-center gap-1">
            <TrendingUp size={11} />
            {formatShortISK(weekIncome)} í viku
          </span>
        )}
        {weekIncome === 0 && next && (
          <span>
            Næst: {new Date(next.date).toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })}
          </span>
        )}
      </div>
    </NavLink>
  )
}
