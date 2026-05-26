import { Link } from 'react-router-dom'
import { useLendo } from '../../hooks/useLendo'
import { formatISK, formatShortISK } from '../../utils/currency'
import { ChevronRight, Plus } from 'lucide-react'

export default function LendoWidget() {
  const { monthlyRevenue, goal, totalBookingsThisMonth, recentBookings, last7Days } = useLendo()
  const revenue = monthlyRevenue()
  const pct = Math.min(100, Math.round((revenue / goal) * 100))
  const count = totalBookingsThisMonth()
  const lastBooking = recentBookings[0]
  const chart = last7Days()
  const maxRev = Math.max(...chart.map(d => d.revenue), 1)

  return (
    <Link to="/lendo" className="card block no-underline hover:border-[rgba(0,212,170,0.3)] transition-colors"
      style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.07), rgba(0,212,170,0.02))' }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span>🏷️</span>
          <span className="text-sm font-semibold">Lendo</span>
          {count > 0 && (
            <span className="badge" style={{ background: 'rgba(0,212,170,0.15)', color: 'var(--accent)' }}>
              {count} bók.
            </span>
          )}
        </div>
        <ChevronRight size={14} style={{ color: 'var(--muted)' }} />
      </div>

      <div className="text-2xl font-semibold tabular-nums mb-2">{formatISK(revenue)}</div>

      {/* Mini chart */}
      <div className="flex items-end gap-0.5 mb-2" style={{ height: 24 }}>
        {chart.map((d, i) => (
          <div key={d.date} className="flex-1 rounded-t-sm"
            style={{
              height: `${Math.max(15, Math.round((d.revenue / maxRev) * 100))}%`,
              background: i === chart.length - 1
                ? 'var(--accent)'
                : d.revenue > 0 ? 'rgba(0,212,170,0.3)' : 'var(--surface2)',
            }} />
        ))}
      </div>

      <div className="h-1.5 rounded-full overflow-hidden mb-1.5" style={{ background: 'var(--surface2)' }}>
        <div className="h-full rounded-full transition-all"
          style={{ width: `${pct}%`, background: pct >= 100 ? 'var(--success)' : 'var(--accent)' }} />
      </div>
      <div className="flex justify-between text-xs" style={{ color: 'var(--muted)' }}>
        <span>{pct}% af {formatShortISK(goal)}</span>
        {lastBooking && (
          <span>
            Síðast: {formatShortISK(lastBooking.amount)} · {new Date(lastBooking.date).toLocaleDateString('is-IS', { day: 'numeric', month: 'short' })}
          </span>
        )}
        {!lastBooking && <span>Engar bókanir ennþá</span>}
      </div>
    </Link>
  )
}
