import { useLendo } from '../../hooks/useLendo'
import { formatShortISK } from '../../utils/currency'
import { TrendingUp, Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function LendoWidget() {
  const { monthlyTotal, target, rentals, currentMonth } = useLendo()
  const navigate = useNavigate()
  const total = monthlyTotal()
  const pct = Math.min(100, Math.round((total / target) * 100))
  const thisMonth = currentMonth()

  return (
    <div className="card cursor-pointer" onClick={() => navigate('/lendo')}
         style={{ background: 'linear-gradient(135deg, rgba(249,115,22,0.06), rgba(139,92,246,0.06))', borderColor: 'rgba(249,115,22,0.2)' }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-base">🏠</span>
          <span className="text-sm font-semibold">Lendó</span>
        </div>
        <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--muted)' }}>
          <TrendingUp size={12} />
          <span>{thisMonth.length} leiga{thisMonth.length !== 1 ? 'r' : ''}</span>
        </div>
      </div>

      <div className="flex items-end justify-between mb-2">
        <div>
          <div className="text-2xl font-semibold">{formatShortISK(total)}</div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>af {formatShortISK(target)} marki</div>
        </div>
        <div className="text-right">
          <div className="text-lg font-semibold" style={{ color: 'var(--accent)' }}>{pct}%</div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>þessa mánuð</div>
        </div>
      </div>

      <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--surface2)' }}>
        <div className="h-full rounded-full transition-all"
             style={{ width: `${pct}%`, background: pct >= 100 ? 'var(--success)' : '#f97316' }} />
      </div>

      {total === 0 && (
        <div className="flex items-center gap-1 mt-2 text-xs" style={{ color: 'var(--muted)' }}>
          <Plus size={11} /> Skráðu fyrstu leiguna
        </div>
      )}
    </div>
  )
}
