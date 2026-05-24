import { useRental } from '../../hooks/useRental'
import { formatShortISK } from '../../utils/currency'
import { Link } from 'react-router-dom'
import { ChevronRight, Package } from 'lucide-react'

export default function RentalWidget() {
  const { monthlyIncome, monthlyGoal, activeRentals } = useRental()
  const income = monthlyIncome()
  const pct = Math.min(100, Math.round((income / monthlyGoal) * 100))

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <span className="text-base">🏠</span>
          <h3 className="font-semibold text-sm">Lendó</h3>
        </div>
        <Link to="/rental" className="flex items-center gap-0.5 text-xs" style={{ color: 'var(--accent)' }}>
          Sjá allt <ChevronRight size={12} />
        </Link>
      </div>

      <div className="flex justify-between items-end mb-2">
        <div>
          <div className="text-2xl font-semibold">{formatShortISK(income)}</div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
            af {formatShortISK(monthlyGoal)} markmiði
          </div>
        </div>
        {activeRentals.length > 0 && (
          <div className="flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-lg"
               style={{ background: 'rgba(0,212,170,0.12)', color: 'var(--accent)' }}>
            <Package size={12} />
            {activeRentals.length} virk
          </div>
        )}
      </div>

      <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--surface2)' }}>
        <div className="h-full rounded-full transition-all duration-500"
             style={{ width: `${pct}%`, background: pct >= 100 ? 'var(--success)' : 'var(--accent)' }} />
      </div>
      <div className="text-xs mt-1 text-right" style={{ color: 'var(--muted)' }}>{pct}% af markmiði</div>
    </div>
  )
}
