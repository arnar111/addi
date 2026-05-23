import { useLendo } from '../../hooks/useLendo'
import { formatISK, formatShortISK } from '../../utils/currency'
import { Building2, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function LendoWidget() {
  const { monthlyPaid, monthlyPending, goal, goalPct, monthlyCount } = useLendo()

  const paid = monthlyPaid()
  const pending = monthlyPending()
  const pct = goalPct()
  const isGoalMet = paid >= goal
  const count = monthlyCount()

  return (
    <Link to="/lendo" className="card block" style={{ textDecoration: 'none' }}>
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: 'rgba(0,212,170,0.15)' }}
          >
            <Building2 size={14} style={{ color: 'var(--accent)' }} />
          </div>
          <span className="text-sm font-medium">Lendó</span>
        </div>
        <ChevronRight size={14} style={{ color: 'var(--muted)' }} />
      </div>

      <div className="flex items-baseline justify-between mb-2">
        <div>
          <div className="text-2xl font-semibold tabular-nums" style={{ color: 'var(--accent)' }}>
            {formatISK(paid)}
          </div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>
            {count} leig{count === 1 ? 'a' : 'ur'} · af {formatShortISK(goal)} markmiðinu
          </div>
        </div>
        <div className="text-right">
          <div
            className="text-lg font-bold"
            style={{ color: isGoalMet ? 'var(--success)' : pct >= 50 ? 'var(--text)' : 'var(--muted)' }}
          >
            {pct}%
          </div>
          {pending > 0 && (
            <div className="text-xs" style={{ color: '#f97316' }}>+{formatShortISK(pending)} bið</div>
          )}
        </div>
      </div>

      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--surface2)' }}>
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${pct}%`,
            background: isGoalMet ? 'var(--success)' : 'var(--accent)',
          }}
        />
      </div>

      {isGoalMet && (
        <div className="text-xs mt-1.5 text-center" style={{ color: 'var(--success)' }}>
          🎉 Markmiðið náð!
        </div>
      )}
    </Link>
  )
}
