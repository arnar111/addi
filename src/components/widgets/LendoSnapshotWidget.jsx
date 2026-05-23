import { NavLink } from 'react-router-dom'
import { TrendingUp, ChevronRight } from 'lucide-react'
import { useLendo } from '../../hooks/useLendo'
import { formatISK, formatShortISK } from '../../utils/currency'

export default function LendoSnapshotWidget() {
  const { monthlyIncome, goal, currentMonthBookings, upcomingBookings } = useLendo()
  const income = monthlyIncome()
  const thisMonth = currentMonthBookings()
  const upcoming = upcomingBookings()
  const pct = goal > 0 ? Math.min(100, Math.round((income / goal) * 100)) : 0
  const isOnTrack = pct >= 50

  return (
    <NavLink to="/lendo"
      className="card block"
      style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.07), rgba(0,0,0,0))', textDecoration: 'none', color: 'inherit' }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-base">🏠</span>
          <span className="text-sm font-semibold">Lendó</span>
          <span className="badge" style={{
            background: isOnTrack ? 'rgba(34,197,94,0.15)' : 'rgba(249,115,22,0.15)',
            color: isOnTrack ? 'var(--success)' : '#f97316',
            fontSize: 10,
          }}>{pct}% af marki</span>
        </div>
        <ChevronRight size={14} style={{ color: 'var(--muted)' }} />
      </div>

      <div className="flex items-end justify-between mb-3">
        <div>
          <div className="text-2xl font-semibold">{formatISK(income)}</div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>
            {thisMonth.length} leiga þennan mánuð · Markmið: {formatShortISK(goal)}
          </div>
        </div>
        <TrendingUp size={18} style={{ color: 'var(--accent)' }} />
      </div>

      <div className="h-1.5 rounded-full overflow-hidden mb-3" style={{ background: 'var(--surface2)' }}>
        <div className="h-full rounded-full transition-all"
          style={{ width: `${pct}%`, background: isOnTrack ? 'var(--success)' : 'var(--accent)' }} />
      </div>

      {upcoming.length > 0 && (
        <div className="flex flex-col gap-1">
          {upcoming.slice(0, 2).map(b => (
            <div key={b.id} className="flex items-center gap-2 text-xs">
              <span>{b.itemIcon}</span>
              <span style={{ color: 'var(--muted)' }}>
                {new Date(b.startDate).toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })}
                {b.endDate !== b.startDate ? ` – ${new Date(b.endDate).toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })}` : ''}
              </span>
              <span className="ml-auto font-medium">{formatISK(b.amount)}</span>
            </div>
          ))}
        </div>
      )}
    </NavLink>
  )
}
