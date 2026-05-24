import { useLendo, MONTHLY_GOAL } from '../../hooks/useLendo'
import { formatShortISK } from '../../utils/currency'
import { Link } from 'react-router-dom'

export default function LendoWidget() {
  const { monthlyRevenue, monthlyBookings } = useLendo()
  const rev = monthlyRevenue()
  const bk = monthlyBookings()
  const pct = Math.min(100, Math.round((rev / MONTHLY_GOAL) * 100))
  const isGoal = rev >= MONTHLY_GOAL

  return (
    <Link to="/lendo" className="card-sm flex flex-col gap-2 no-underline block"
          style={{ textDecoration: 'none', color: 'inherit' }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-base">🏠</span>
          <span className="text-sm font-semibold">Lendó</span>
        </div>
        <span className="text-xs" style={{ color: isGoal ? 'var(--success)' : 'var(--muted)' }}>
          {bk} leiga{bk !== 1 ? 'r' : ''} þennan mánuð
        </span>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <div className="text-lg font-semibold" style={{ color: isGoal ? 'var(--success)' : 'var(--text)' }}>
            {formatShortISK(rev)}
          </div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>
            af {formatShortISK(MONTHLY_GOAL)} marki
          </div>
        </div>
        <div className="text-xs font-bold" style={{ color: isGoal ? 'var(--success)' : 'var(--accent)' }}>
          {pct}%
        </div>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--surface2)' }}>
        <div className="h-full rounded-full transition-all"
             style={{ width: `${pct}%`, background: isGoal ? 'var(--success)' : 'var(--accent)' }} />
      </div>
    </Link>
  )
}
