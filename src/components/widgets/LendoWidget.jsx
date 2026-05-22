import { useLendo } from '../../hooks/useLendo'
import { formatISK } from '../../utils/currency'
import { useNavigate } from 'react-router-dom'
import { TrendingUp, AlertCircle } from 'lucide-react'

export default function LendoWidget() {
  const { monthlyTotal, monthlyPending, monthlyGoal, upcoming, unpaidCount } = useLendo()
  const navigate = useNavigate()

  const earned = monthlyTotal()
  const pending = monthlyPending()
  const goal = monthlyGoal
  const pct = Math.min(100, Math.round((earned / goal) * 100))
  const nextUp = upcoming().slice(0, 2)

  return (
    <div className="card cursor-pointer" onClick={() => navigate('/lendo')}
         style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.07), rgba(139,92,246,0.05))' }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center"
               style={{ background: 'rgba(0,212,170,0.15)' }}>
            <TrendingUp size={15} style={{ color: 'var(--accent)' }} />
          </div>
          <span className="text-sm font-semibold">Lendó</span>
        </div>
        {unpaidCount() > 0 && (
          <div className="flex items-center gap-1 text-xs" style={{ color: '#f97316' }}>
            <AlertCircle size={12} />
            {unpaidCount()} ógreitt
          </div>
        )}
      </div>

      <div className="flex items-end gap-2 mb-2">
        <span className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>{formatISK(earned)}</span>
        <span className="text-xs mb-1" style={{ color: 'var(--muted)' }}>/ {formatISK(goal)}</span>
      </div>

      <div className="h-2 rounded-full overflow-hidden mb-1" style={{ background: 'var(--surface2)' }}>
        <div className="h-full rounded-full transition-all"
             style={{ width: `${pct}%`, background: pct >= 100 ? 'var(--success)' : 'var(--accent)' }} />
      </div>
      <div className="text-xs mb-3" style={{ color: 'var(--muted)' }}>{pct}% af mánaðarmarkmiði</div>

      {nextUp.length > 0 && (
        <div className="flex flex-col gap-1.5">
          {nextUp.map(b => (
            <div key={b.id} className="flex items-center justify-between text-xs">
              <span style={{ color: 'var(--muted)' }}>
                {new Date(b.startDate).toLocaleDateString('is-IS', { weekday: 'short', month: 'short', day: 'numeric' })} — {b.customer}
              </span>
              <span style={{ color: b.paid ? 'var(--success)' : 'var(--accent)' }}>{formatISK(b.total)}</span>
            </div>
          ))}
        </div>
      )}

      {nextUp.length === 0 && (
        <div className="text-xs" style={{ color: 'var(--muted)' }}>Engar væntanlegar leigur</div>
      )}
    </div>
  )
}
