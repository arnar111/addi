import { useLendo } from '../../hooks/useLendo'
import { formatISK } from '../../utils/currency'
import { useNavigate } from 'react-router-dom'

export default function LendoWidget() {
  const { monthlyTotal, goal, goalPct, currentMonth } = useLendo()
  const navigate = useNavigate()
  const total = monthlyTotal()
  const pct = goalPct()
  const month = currentMonth()
  const isOver = pct >= 100

  return (
    <div className="card cursor-pointer transition-all hover:border-[rgba(0,212,170,0.25)]"
         onClick={() => navigate('/lendo')}
         style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.07), rgba(0,212,170,0.02))' }}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-base">🏠</span>
          <span className="text-sm font-semibold">Lendó</span>
        </div>
        <div className="text-xs px-2 py-0.5 rounded-full"
             style={{ background: 'rgba(0,212,170,0.12)', color: 'var(--accent)' }}>
          {month.length} leigur
        </div>
      </div>
      <div className="flex items-end justify-between mb-2">
        <div>
          <div className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>{formatISK(total)}</div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>af {formatISK(goal)} markmiði</div>
        </div>
        <div className="text-xl font-bold"
             style={{ color: isOver ? 'var(--success)' : 'var(--muted)' }}>
          {pct}%{isOver ? ' 🎉' : ''}
        </div>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--surface2)' }}>
        <div className="h-full rounded-full transition-all duration-500"
             style={{ width: `${pct}%`, background: isOver ? 'var(--success)' : 'var(--accent)' }} />
      </div>
    </div>
  )
}
