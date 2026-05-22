import { useLendo } from '../../hooks/useLendo'
import { useNavigate } from 'react-router-dom'
import { Home, ChevronRight, TrendingUp } from 'lucide-react'
import { formatShortISK } from '../../utils/currency'

export default function LendoWidget() {
  const { monthlyIncome, goal, upcomingBookings } = useLendo()
  const nav = useNavigate()
  const income = monthlyIncome()
  const pct = Math.min(100, Math.round((income / goal) * 100))
  const upcoming = upcomingBookings()

  return (
    <div className="card" style={{ background: 'linear-gradient(135deg, rgba(249,115,22,0.04), rgba(234,179,8,0.04))' }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Home size={15} style={{ color: '#f97316' }} />
          <span className="font-semibold text-sm">Lendó</span>
        </div>
        <button onClick={() => nav('/lendo')} className="flex items-center gap-0.5 text-xs" style={{ color: '#f97316' }}>
          Meira <ChevronRight size={12} />
        </button>
      </div>

      <div className="flex items-end justify-between mb-2">
        <div>
          <div className="text-xs mb-0.5" style={{ color: 'var(--muted)' }}>Tekjur þessa mánaðar</div>
          <div className="text-2xl font-bold" style={{ color: pct >= 100 ? 'var(--success)' : 'var(--text)' }}>
            {formatShortISK(income)}
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs" style={{ color: 'var(--muted)' }}>Markmið</div>
          <div className="text-sm font-semibold" style={{ color: 'var(--muted)' }}>{formatShortISK(goal)}</div>
        </div>
      </div>

      <div className="h-2 rounded-full overflow-hidden mb-2" style={{ background: 'var(--surface2)' }}>
        <div className="h-full rounded-full transition-all"
             style={{ width: `${pct}%`, background: pct >= 100 ? 'var(--success)' : 'linear-gradient(90deg, #f97316, #eab308)' }} />
      </div>

      <div className="text-xs mb-2" style={{ color: 'var(--muted)' }}>
        {pct}% af markmiði{pct >= 100 ? ' 🎉' : ''}
      </div>

      {upcoming.length > 0 && (
        <div className="flex flex-col gap-1.5 pt-2" style={{ borderTop: '1px solid var(--border)' }}>
          {upcoming.slice(0, 2).map(b => (
            <div key={b.id} className="flex items-center justify-between text-xs">
              <span className="truncate" style={{ color: 'var(--muted)' }}>
                {new Date(b.startDate).toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })} · {b.itemName || 'Leiga'}
              </span>
              <span className="font-medium" style={{ color: '#f97316' }}>{formatShortISK(b.amount)}</span>
            </div>
          ))}
        </div>
      )}

      {upcoming.length === 0 && income === 0 && (
        <div className="text-xs text-center py-1" style={{ color: 'var(--muted)' }}>
          Engar bókanir enn · <button onClick={() => nav('/lendo')} style={{ color: '#f97316' }}>Bæta við</button>
        </div>
      )}
    </div>
  )
}
