import { useLendo, LENDO_ITEMS } from '../../hooks/useLendo'
import { formatShortISK } from '../../utils/currency'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

export default function LendoWidget() {
  const { monthlyIncome, monthlyPending, goal, nextBooking, monthlyBookingCount } = useLendo()

  const income = monthlyIncome()
  const pending = monthlyPending()
  const count = monthlyBookingCount()
  const pct = goal ? Math.min(100, Math.round((income / goal) * 100)) : 0
  const isNear = pct >= 70
  const isOver = income >= goal

  const barColor = isOver ? 'var(--success)' : isNear ? '#f97316' : 'var(--accent)'

  return (
    <div className="card" style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.05), rgba(139,92,246,0.05))' }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">🪑</span>
          <span className="font-semibold text-sm">Lendó</span>
          {isOver && <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
            style={{ background: 'rgba(34,197,94,0.15)', color: 'var(--success)' }}>Markmið náð 🎉</span>}
        </div>
        <Link to="/lendo" className="flex items-center gap-0.5 text-xs" style={{ color: 'var(--accent)' }}>
          Sjá allt <ChevronRight size={12} />
        </Link>
      </div>

      <div className="flex justify-between items-end mb-2">
        <div>
          <div className="text-2xl font-semibold">{formatShortISK(income)}</div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
            af {formatShortISK(goal)} · {pct}% markmiðs
          </div>
        </div>
        {pending > 0 && (
          <div className="text-right">
            <div className="text-sm font-medium" style={{ color: '#f97316' }}>+{formatShortISK(pending)}</div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>ógreitt</div>
          </div>
        )}
      </div>

      <div className="h-2 rounded-full overflow-hidden mb-3" style={{ background: 'var(--surface2)' }}>
        <div className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: barColor }} />
      </div>

      <div className="flex items-center justify-between text-xs" style={{ color: 'var(--muted)' }}>
        <span>{count} bókanir þennan mánuð</span>
        {nextBooking ? (
          <span style={{ color: 'var(--accent)' }}>
            Næst: {new Date(nextBooking.date).toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })} · {nextBooking.name.split(' ')[0]}
          </span>
        ) : (
          <Link to="/lendo" className="text-xs" style={{ color: 'var(--accent)' }}>+ Ný bókun</Link>
        )}
      </div>
    </div>
  )
}
