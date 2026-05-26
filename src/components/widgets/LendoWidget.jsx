import { useNavigate } from 'react-router-dom'
import { useLendo } from '../../hooks/useLendo'
import { formatShortISK } from '../../utils/currency'
import { ChevronRight, TrendingUp } from 'lucide-react'

export default function LendoWidget() {
  const navigate = useNavigate()
  const { monthlyTotal, monthlyRentals, goal } = useLendo()
  const total = monthlyTotal()
  const pct = goal ? Math.min(100, Math.round((total / goal) * 100)) : 0

  return (
    <button onClick={() => navigate('/finance?tab=lendo')} className="card w-full text-left"
            style={{ background: 'linear-gradient(135deg, rgba(249,115,22,0.06), rgba(0,212,170,0.04))' }}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <TrendingUp size={14} style={{ color: '#f97316' }} />
          <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--muted)' }}>Lendó Tekjur</span>
        </div>
        <ChevronRight size={14} style={{ color: 'var(--muted)' }} />
      </div>
      <div className="flex items-end justify-between mb-2">
        <div>
          <div className="text-2xl font-semibold">{formatShortISK(total)}</div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>{monthlyRentals()} leiga{monthlyRentals() !== 1 ? 'r' : ''} þennan mánuð</div>
        </div>
        {goal > 0 && (
          <div className="text-right">
            <div className="text-xs" style={{ color: pct >= 100 ? 'var(--success)' : 'var(--muted)' }}>{pct}%</div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>af {formatShortISK(goal)}</div>
          </div>
        )}
      </div>
      {goal > 0 && (
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--surface2)' }}>
          <div className="h-full rounded-full transition-all"
               style={{ width: `${pct}%`, background: pct >= 100 ? 'var(--success)' : '#f97316' }} />
        </div>
      )}
    </button>
  )
}
