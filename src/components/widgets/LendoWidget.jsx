import { Link } from 'react-router-dom'
import { useLendo } from '../../hooks/useLendo'
import { formatISK } from '../../utils/currency'
import { ChevronRight, Package } from 'lucide-react'

export default function LendoWidget() {
  const { monthlyIncome, pendingAmount, monthlyGoal, upcomingBookings } = useLendo()

  const income = monthlyIncome()
  const pending = pendingAmount()
  const pct = Math.min(100, Math.round((income / monthlyGoal) * 100))
  const upcoming = upcomingBookings().slice(0, 2)

  return (
    <Link to="/lendo" className="card no-underline block transition-all"
          style={{ background: 'rgba(0,212,170,0.04)', borderColor: 'rgba(0,212,170,0.15)' }}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Package size={15} style={{ color: 'var(--accent)' }} />
          <span className="font-semibold text-sm">Lendó</span>
        </div>
        <ChevronRight size={14} style={{ color: 'var(--muted)' }} />
      </div>
      <div className="flex items-end justify-between mb-1.5">
        <span className="text-xl font-bold">{formatISK(income)}</span>
        <span className="text-xs" style={{ color: 'var(--muted)' }}>{pct}% af {Math.round(monthlyGoal / 1000)}k</span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden mb-2" style={{ background: 'var(--surface2)' }}>
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: 'var(--accent)' }} />
      </div>
      {pending > 0 && (
        <div className="text-xs mb-2" style={{ color: '#f97316' }}>
          {formatISK(pending)} ógreitt
        </div>
      )}
      {upcoming.length > 0 && (
        <div className="flex flex-col gap-1">
          {upcoming.map(b => (
            <div key={b.id} className="flex items-center justify-between text-xs">
              <span style={{ color: 'var(--muted)' }}>
                {new Date(b.startDate).toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })} · {b.customerName}
              </span>
              <span className="font-medium" style={{ color: b.paid ? 'var(--success)' : '#f97316' }}>
                {formatISK(b.totalPrice)}
              </span>
            </div>
          ))}
        </div>
      )}
      {upcoming.length === 0 && income === 0 && (
        <p className="text-xs" style={{ color: 'var(--muted)' }}>Engar bókanir þennan mánuð ennþá</p>
      )}
    </Link>
  )
}
