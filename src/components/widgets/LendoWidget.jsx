import { useLendo } from '../../hooks/useLendo'
import { formatISK, formatShortISK } from '../../utils/currency'
import { useNavigate } from 'react-router-dom'
import { TrendingUp, Calendar } from 'lucide-react'

export default function LendoWidget() {
  const { currentMonthIncome, goal, goalPct, upcomingBookings, currentMonthBookings } = useLendo()
  const navigate = useNavigate()
  const upcoming = upcomingBookings()
  const monthCount = currentMonthBookings().length
  const isOver = currentMonthIncome >= goal

  return (
    <button onClick={() => navigate('/lendo')} className="card w-full text-left transition-all hover:border-[rgba(0,212,170,0.3)]"
            style={{ borderColor: isOver ? 'rgba(34,197,94,0.3)' : 'var(--border)' }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">🪑</span>
          <div>
            <div className="font-semibold text-sm">Lendó</div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>Veisluútleiga</div>
          </div>
        </div>
        <div className="text-right">
          <div className="font-semibold" style={{ color: isOver ? 'var(--success)' : 'var(--accent)' }}>
            {formatShortISK(currentMonthIncome)}
          </div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>{goalPct}% af {formatShortISK(goal)}</div>
        </div>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden mb-2" style={{ background: 'var(--surface2)' }}>
        <div className="h-full rounded-full transition-all"
             style={{ width: `${goalPct}%`, background: isOver ? 'var(--success)' : goalPct > 75 ? '#f97316' : 'var(--accent)' }} />
      </div>
      <div className="flex items-center justify-between text-xs" style={{ color: 'var(--muted)' }}>
        <span>{monthCount} bókanir í mánuðinum</span>
        {upcoming.length > 0 && (
          <span className="flex items-center gap-1" style={{ color: 'var(--accent)' }}>
            <Calendar size={11} /> {upcoming.length} komandi
          </span>
        )}
      </div>
    </button>
  )
}
