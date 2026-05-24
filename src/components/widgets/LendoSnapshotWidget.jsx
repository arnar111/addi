import { useNavigate } from 'react-router-dom'
import { useLendo } from '../../hooks/useLendo'
import { formatShortISK } from '../../utils/currency'
import { ChevronRight, TrendingUp } from 'lucide-react'

export default function LendoSnapshotWidget() {
  const navigate = useNavigate()
  const { monthlyIncome, goalProgress, monthlyGoal, upcomingBookings, getMonthBookings } = useLendo()

  const income = monthlyIncome()
  const pct = goalProgress()
  const upcoming = upcomingBookings()
  const monthCount = getMonthBookings().filter(b => b.status !== 'cancelled').length

  return (
    <button onClick={() => navigate('/lendo')} className="card w-full text-left transition-all hover:border-orange-500/30">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'rgba(249,115,22,0.15)' }}>
            <TrendingUp size={16} style={{ color: '#f97316' }} />
          </div>
          <div>
            <div className="text-sm font-medium">Lendó</div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>
              {monthCount} bókan{monthCount !== 1 ? 'ir' : ''} þennan mánuð
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-base font-semibold" style={{ color: '#f97316' }}>
            {formatShortISK(income)}
          </span>
          <ChevronRight size={14} style={{ color: 'var(--muted)' }} />
        </div>
      </div>

      <div className="h-1.5 rounded-full overflow-hidden mb-1" style={{ background: 'var(--surface2)' }}>
        <div className="h-full rounded-full transition-all"
          style={{ width: `${pct}%`, background: pct >= 100 ? 'var(--success)' : '#f97316' }} />
      </div>
      <div className="flex justify-between text-xs" style={{ color: 'var(--muted)' }}>
        <span>{pct}% af {formatShortISK(monthlyGoal)} markmiði</span>
        {upcoming.length > 0 && (
          <span style={{ color: '#f97316' }}>
            {upcoming.length} komandi
          </span>
        )}
      </div>
    </button>
  )
}
