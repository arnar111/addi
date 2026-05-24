import { Link } from 'react-router-dom'
import { useLendo } from '../../hooks/useLendo'
import { formatShortISK } from '../../utils/currency'
import { ChevronRight, Calendar } from 'lucide-react'

export default function LendoWidget() {
  const { monthlyIncome, pendingIncome, monthlyGoal, upcomingBookings } = useLendo()
  const income = monthlyIncome()
  const pending = pendingIncome()
  const goal = monthlyGoal
  const pct = Math.min(100, Math.round((income / goal) * 100))
  const upcoming = upcomingBookings()
  const next = upcoming[0]

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-base">🏠</span>
          <h3 className="font-semibold text-sm">Lendó</h3>
        </div>
        <Link to="/lendo" className="flex items-center gap-0.5 text-xs" style={{ color: 'var(--accent)' }}>
          Sjá allt <ChevronRight size={12} />
        </Link>
      </div>

      <div className="flex justify-between items-end mb-3">
        <div>
          <div className="text-2xl font-semibold" style={{ color: 'var(--success)' }}>{formatShortISK(income)}</div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
            Greitt þennan mánuð
            {pending > 0 && <span style={{ color: '#f97316' }}> · {formatShortISK(pending)} í bið</span>}
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-medium">{pct}%</div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>af {formatShortISK(goal)}</div>
        </div>
      </div>

      <div className="h-1.5 rounded-full overflow-hidden mb-3" style={{ background: 'var(--surface2)' }}>
        <div className="h-full rounded-full transition-all duration-700"
             style={{ width: `${pct}%`, background: pct >= 100 ? 'var(--success)' : 'var(--accent)' }} />
      </div>

      {next ? (
        <div className="flex items-center gap-2 p-2.5 rounded-xl" style={{ background: 'var(--surface2)' }}>
          <Calendar size={13} style={{ color: 'var(--accent)', flexShrink: 0 }} />
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium truncate">{next.customer}</div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>
              {new Date(next.startDate).toLocaleDateString('is-IS', { weekday: 'short', month: 'short', day: 'numeric' })}
              {' '}· {formatShortISK(next.totalPrice || 0)}
            </div>
          </div>
          <span className="text-xs px-2 py-0.5 rounded-full shrink-0"
                style={{ background: next.paid ? 'rgba(34,197,94,0.12)' : 'rgba(249,115,22,0.12)',
                         color: next.paid ? 'var(--success)' : '#f97316' }}>
            {next.paid ? 'Greitt' : 'Ógreitt'}
          </span>
        </div>
      ) : (
        <div className="text-xs text-center py-1" style={{ color: 'var(--muted)' }}>
          Engar komandi bókanir
        </div>
      )}
    </div>
  )
}
