import { useLendo } from '../../hooks/useLendo'
import { formatShortISK } from '../../utils/currency'
import { Link } from 'react-router-dom'
import { ChevronRight, Package } from 'lucide-react'

export default function LendoWidget() {
  const { monthlyRevenue, monthlyGoal, monthlyProgress, currentMonthBookings } = useLendo()
  const rev = monthlyRevenue()
  const pct = monthlyProgress()
  const bookings = currentMonthBookings()

  return (
    <div className="card" style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.07), rgba(59,130,246,0.05))' }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-base"
               style={{ background: 'rgba(0,212,170,0.15)' }}>🏡</div>
          <div>
            <h3 className="font-semibold text-sm leading-tight">Lendó</h3>
            <p className="text-xs leading-tight" style={{ color: 'var(--muted)' }}>
              {bookings.length} leiga{bookings.length !== 1 ? 'r' : ''} þetta mánuð
            </p>
          </div>
        </div>
        <Link to="/lendo" className="flex items-center gap-0.5 text-xs" style={{ color: 'var(--accent)' }}>
          Sjá <ChevronRight size={12} />
        </Link>
      </div>

      <div className="flex justify-between items-end mb-2">
        <div>
          <div className="text-2xl font-bold">{formatShortISK(rev)}</div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
            af {formatShortISK(monthlyGoal)} markmiði
          </div>
        </div>
        <div className="text-right">
          <div className="text-xl font-semibold" style={{ color: pct >= 100 ? 'var(--success)' : 'var(--accent)' }}>
            {pct}%
          </div>
        </div>
      </div>

      <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--surface2)' }}>
        <div className="h-full rounded-full transition-all duration-700"
             style={{ width: `${pct}%`, background: pct >= 100 ? 'var(--success)' : 'var(--accent)' }} />
      </div>

      {rev === 0 && (
        <p className="text-xs mt-2 text-center" style={{ color: 'var(--muted)' }}>
          Skráðu fyrstu leiguna — smelltu á "Sjá"
        </p>
      )}
    </div>
  )
}
