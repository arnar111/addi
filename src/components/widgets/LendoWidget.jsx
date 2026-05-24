import { useLendo } from '../../hooks/useLendo'
import { Link } from 'react-router-dom'
import { ChevronRight, Package } from 'lucide-react'

function fmtISK(n) {
  return n.toLocaleString('is-IS') + ' kr'
}

export default function LendoWidget() {
  const { thisMonthRevenue, goal, upcomingBookings } = useLendo()
  const pct = Math.min(100, Math.round((thisMonthRevenue / goal) * 100))
  const next = upcomingBookings[0]
  const isOver = thisMonthRevenue >= goal

  return (
    <div className="card"
         style={{ background: 'linear-gradient(135deg, rgba(249,115,22,0.06), rgba(139,92,246,0.05))' }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl flex items-center justify-center"
               style={{ background: 'rgba(249,115,22,0.15)' }}>
            <Package size={13} style={{ color: 'var(--accent3)' }} />
          </div>
          <h3 className="font-semibold text-sm">Lendó</h3>
        </div>
        <Link to="/lendo" className="flex items-center gap-0.5 text-xs" style={{ color: 'var(--accent3)' }}>
          Sjá allt <ChevronRight size={12} />
        </Link>
      </div>

      <div className="flex justify-between items-end mb-2">
        <div>
          <div className="text-xl font-semibold" style={{ color: 'var(--accent3)' }}>
            {fmtISK(thisMonthRevenue)}
          </div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>af {fmtISK(goal)} marki</div>
        </div>
        <div className="text-2xl font-bold" style={{ color: isOver ? 'var(--success)' : 'var(--accent3)' }}>
          {pct}%
        </div>
      </div>

      <div className="h-2 rounded-full overflow-hidden mb-3" style={{ background: 'var(--surface2)' }}>
        <div className="h-full rounded-full transition-all duration-700"
             style={{
               width: `${pct}%`,
               background: isOver
                 ? 'var(--success)'
                 : 'linear-gradient(90deg, var(--accent3), #ec4899)',
             }} />
      </div>

      {next ? (
        <div className="flex items-center gap-2 px-2.5 py-2 rounded-xl"
             style={{ background: 'var(--surface2)' }}>
          <span className="text-xs font-medium shrink-0" style={{ color: 'var(--accent3)' }}>Næst:</span>
          <span className="text-xs truncate">
            {new Date(next.date).toLocaleDateString('is-IS', { weekday: 'short', month: 'short', day: 'numeric' })} · {next.customer}
          </span>
          <span className="text-xs ml-auto shrink-0 font-semibold" style={{ color: 'var(--accent3)' }}>
            {next.amount.toLocaleString('is-IS')} kr
          </span>
        </div>
      ) : (
        <div className="text-xs text-center py-0.5" style={{ color: 'var(--muted)' }}>
          Engar komandi bókanir · <Link to="/lendo" style={{ color: 'var(--accent3)' }}>Bæta við</Link>
        </div>
      )}
    </div>
  )
}
