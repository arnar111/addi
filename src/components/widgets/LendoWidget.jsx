import { NavLink } from 'react-router-dom'
import { useLendo } from '../../hooks/useLendo'
import { formatISK, formatShortISK } from '../../utils/currency'
import { ChevronRight } from 'lucide-react'

export default function LendoWidget() {
  const { thisMonthIncome, goal, monthBookings, vsLastMonth } = useLendo()
  const monthly = thisMonthIncome
  const pct = Math.min(100, Math.round((monthly / goal) * 100))
  const bookingCount = monthBookings(0).length
  const isGoalMet = monthly >= goal

  return (
    <NavLink to="/lendo" className="card flex flex-col gap-3 no-underline" style={{ textDecoration: 'none' }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-base">🪑</span>
          <span className="text-sm font-semibold">Lendó</span>
          {isGoalMet && (
            <span className="text-xs px-1.5 py-0.5 rounded-full font-medium"
                  style={{ background: 'rgba(34,197,94,0.15)', color: 'var(--success)' }}>
              Markmið náð!
            </span>
          )}
        </div>
        <ChevronRight size={14} style={{ color: 'var(--muted)' }} />
      </div>

      <div className="flex justify-between items-end">
        <div>
          <div
            className="text-2xl font-bold"
            style={{ color: monthly > 0 ? 'var(--success)' : 'var(--muted)' }}
          >
            {formatShortISK(monthly)}
          </div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
            af {formatShortISK(goal)} markmiði · {bookingCount} bókanir
          </div>
        </div>
        <div className="text-right">
          <div className="text-xl font-bold" style={{ color: isGoalMet ? 'var(--success)' : 'var(--text)' }}>
            {pct}%
          </div>
        </div>
      </div>

      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--surface2)' }}>
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${pct}%`, background: isGoalMet ? 'var(--success)' : 'var(--accent)' }}
        />
      </div>
    </NavLink>
  )
}
