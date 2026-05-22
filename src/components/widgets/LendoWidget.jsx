import { useNavigate } from 'react-router-dom'
import { useLendo } from '../../hooks/useLendo'
import { ChevronRight } from 'lucide-react'

function formatISK(n) {
  return n.toLocaleString('is-IS') + ' kr'
}

export default function LendoWidget() {
  const { monthlyIncome, monthlyGoal, monthlyBookings, items } = useLendo()
  const navigate = useNavigate()
  const pct = Math.min(100, Math.round((monthlyIncome / monthlyGoal) * 100))

  return (
    <button onClick={() => navigate('/lendo')}
            className="card w-full text-left transition-all hover:scale-[1.01] active:scale-[0.99]"
            style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.08), rgba(0,212,170,0.03))' }}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <span className="text-base">🏠</span>
          <span className="text-xs font-semibold" style={{ color: 'var(--muted)' }}>LENDÓ</span>
        </div>
        <ChevronRight size={14} style={{ color: 'var(--muted)' }} />
      </div>
      <div className="flex items-end justify-between mb-2">
        <div>
          <div className="text-xl font-bold" style={{ color: 'var(--accent)' }}>{formatISK(monthlyIncome)}</div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>af {Math.round(monthlyGoal / 1000)}þ kr markmiði</div>
        </div>
        <div className="text-right">
          <div className="text-base font-bold">{pct}%</div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>{monthlyBookings.length} bókan{monthlyBookings.length !== 1 ? 'ir' : ''}</div>
        </div>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--surface2)' }}>
        <div className="h-full rounded-full transition-all"
             style={{ width: `${pct}%`, background: pct >= 100 ? 'var(--success)' : 'var(--accent)' }} />
      </div>
    </button>
  )
}
