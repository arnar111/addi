import { Link } from 'react-router-dom'
import { useIncome } from '../../hooks/useIncome'
import { formatShortISK } from '../../utils/currency'
import { ChevronRight, TrendingUp } from 'lucide-react'

export default function IncomeSnapshotWidget() {
  const { monthlyTotal, monthlyGoal, progress, remaining, currentMonthBookings } = useIncome()
  const total = monthlyTotal()
  const pct = progress()
  const left = remaining()
  const bookings = currentMonthBookings()
  const isGoalMet = total >= monthlyGoal

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm">🪑 Lendó tekjur</h3>
        <Link to="/finance?tab=income" className="flex items-center gap-0.5 text-xs" style={{ color: 'var(--accent)' }}>
          Sjá allt <ChevronRight size={12} />
        </Link>
      </div>

      <div className="flex justify-between items-end mb-3">
        <div>
          <div className="text-2xl font-semibold" style={{ color: 'var(--success)' }}>
            {formatShortISK(total)}
          </div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
            af {formatShortISK(monthlyGoal)} marki
          </div>
        </div>
        <div className="flex items-center gap-1 text-sm font-medium"
             style={{ color: isGoalMet ? 'var(--success)' : 'var(--accent)' }}>
          <TrendingUp size={16} />
          {isGoalMet ? 'Marki náð! 🎉' : `${formatShortISK(left)} eftir`}
        </div>
      </div>

      <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--surface2)' }}>
        <div className="h-full rounded-full transition-all duration-500"
             style={{
               width: `${pct}%`,
               background: isGoalMet ? 'var(--success)' : pct >= 75 ? '#f97316' : 'var(--accent)',
             }} />
      </div>
      <div className="flex justify-between text-xs mt-1" style={{ color: 'var(--muted)' }}>
        <span>{bookings.length} bókun{bookings.length !== 1 ? 'ir' : ''}</span>
        <span>{pct}%</span>
      </div>
    </div>
  )
}
