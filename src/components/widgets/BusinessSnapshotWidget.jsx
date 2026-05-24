import { Link } from 'react-router-dom'
import { useBusiness } from '../../hooks/useBusiness'
import { formatShortISK } from '../../utils/currency'
import { ChevronRight } from 'lucide-react'

export default function BusinessSnapshotWidget() {
  const { thisMonthIncome, monthlyGoal, upcoming } = useBusiness()
  const income = thisMonthIncome()
  const pct = Math.min(100, Math.round((income / monthlyGoal) * 100))

  return (
    <Link to="/business" className="card no-underline">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-sm">🪑 Lendó</h3>
        <ChevronRight size={14} style={{ color: 'var(--muted)' }} />
      </div>
      <div className="flex items-end justify-between mb-2">
        <div>
          <div className="text-xl font-bold" style={{ color: 'var(--accent)' }}>{formatShortISK(income)}</div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>af {formatShortISK(monthlyGoal)} markmiði</div>
        </div>
        {upcoming.length > 0 && (
          <div className="text-xs px-2 py-1 rounded-lg font-medium"
               style={{ background: 'rgba(0,212,170,0.12)', color: 'var(--accent)' }}>
            {upcoming.length} komin{upcoming.length !== 1 ? 'ar' : ''}
          </div>
        )}
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--surface2)' }}>
        <div className="h-full rounded-full transition-all"
             style={{ width: `${pct}%`, background: pct >= 100 ? 'var(--success)' : 'var(--accent)' }} />
      </div>
    </Link>
  )
}
