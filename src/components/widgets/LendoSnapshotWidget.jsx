import { Link } from 'react-router-dom'
import { useLendo } from '../../hooks/useLendo'
import { formatShortISK } from '../../utils/currency'
import { ArrowRight } from 'lucide-react'

export default function LendoSnapshotWidget() {
  const { monthlyGoal, monthlyIncome, upcomingBookings } = useLendo()

  const income = monthlyIncome()
  const pct = Math.min(100, Math.round((income / monthlyGoal) * 100))
  const upcoming = upcomingBookings()
  const next = upcoming[0]

  return (
    <div className="card" style={{ border: '1px solid rgba(0,212,170,0.2)' }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">🪑</span>
          <span className="font-semibold text-sm">Lendó</span>
        </div>
        <Link to="/lendo" className="flex items-center gap-1 text-xs" style={{ color: 'var(--accent)' }}>
          Sjá allt <ArrowRight size={12} />
        </Link>
      </div>

      <div className="flex justify-between text-xs mb-1.5" style={{ color: 'var(--muted)' }}>
        <span>Tekjur þennan mánuð</span>
        <span style={{ color: pct >= 100 ? 'var(--success)' : 'var(--text)' }}>
          {formatShortISK(income)} / {formatShortISK(monthlyGoal)}
        </span>
      </div>
      <div className="h-2 rounded-full overflow-hidden mb-3" style={{ background: 'var(--surface2)' }}>
        <div className="h-full rounded-full transition-all"
             style={{ width: `${pct}%`, background: pct >= 100 ? 'var(--success)' : 'var(--accent)' }} />
      </div>

      {next ? (
        <div className="flex items-center gap-2 text-xs p-2 rounded-xl" style={{ background: 'var(--surface2)' }}>
          <span>📅</span>
          <div className="flex-1">
            <span style={{ color: 'var(--muted)' }}>Næsta bókun: </span>
            <span className="font-medium">
              {new Date(next.date).toLocaleDateString('is-IS', { weekday: 'short', month: 'short', day: 'numeric' })}
            </span>
            {next.customer && <span style={{ color: 'var(--muted)' }}> · {next.customer}</span>}
          </div>
          {!next.paid && (
            <span className="badge" style={{ background: 'rgba(249,115,22,0.15)', color: '#f97316' }}>Ógreitt</span>
          )}
        </div>
      ) : (
        <div className="text-xs text-center py-1" style={{ color: 'var(--muted)' }}>
          Engar kommandi bókanir
        </div>
      )}
    </div>
  )
}
