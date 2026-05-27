import { useLendo } from '../../hooks/useLendo'
import { formatShortISK } from '../../utils/currency'
import { Link } from 'react-router-dom'
import { ChevronRight, AlertCircle } from 'lucide-react'

export default function LendoWidget() {
  const { activeRentals, monthlyIncome, monthGoal, rentalsDueToday } = useLendo()
  const income = monthlyIncome()
  const goalPct = Math.min(100, Math.round((income / monthGoal) * 100))

  return (
    <div className="card" style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.07), rgba(0,212,170,0.07))' }}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm flex items-center gap-1.5">
          🏠 Lendó
        </h3>
        <Link to="/lendo" className="flex items-center gap-0.5 text-xs" style={{ color: 'var(--accent)' }}>
          Sjá allt <ChevronRight size={12} />
        </Link>
      </div>

      <div className="flex justify-between items-end mb-3">
        <div>
          <div className="text-2xl font-semibold" style={{ color: 'var(--accent)' }}>
            {formatShortISK(income)}
          </div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
            af {formatShortISK(monthGoal)} marki
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-xs font-semibold" style={{ color: activeRentals.length > 0 ? 'var(--accent)' : 'var(--muted)' }}>
            {activeRentals.length} virk leiga{activeRentals.length !== 1 ? 'r' : ''}
          </span>
          {rentalsDueToday.length > 0 && (
            <span className="flex items-center gap-1 text-xs" style={{ color: '#f97316' }}>
              <AlertCircle size={11} /> {rentalsDueToday.length} til skila
            </span>
          )}
        </div>
      </div>

      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--surface2)' }}>
        <div className="h-full rounded-full transition-all duration-700"
             style={{ width: `${goalPct}%`, background: goalPct >= 100 ? 'var(--success)' : 'var(--accent2)' }} />
      </div>
      <div className="text-xs mt-1 text-right" style={{ color: 'var(--muted)' }}>{goalPct}% af marki</div>
    </div>
  )
}
