import { useLendo } from '../../hooks/useLendo'
import { formatShortISK } from '../../utils/currency'
import { useNavigate } from 'react-router-dom'
import { TrendingUp, Plus } from 'lucide-react'

export default function LendoWidget() {
  const { monthTotal, goal, monthRentals } = useLendo()
  const navigate = useNavigate()

  const total = monthTotal()
  const pct = Math.min(100, Math.round((total / goal) * 100))
  const rentals = monthRentals()
  const now = new Date()
  const monthName = now.toLocaleDateString('is-IS', { month: 'long' })

  return (
    <div className="card cursor-pointer" onClick={() => navigate('/lendo')}
         style={{ background: 'linear-gradient(135deg, rgba(249,115,22,0.06), rgba(139,92,246,0.06))',
                  borderColor: 'rgba(249,115,22,0.2)' }}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-base">🏷️</span>
            <span className="text-xs font-semibold" style={{ color: 'var(--muted)' }}>LENDÓ</span>
          </div>
          <div className="text-2xl font-semibold">{formatShortISK(total)}</div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
            {monthName} · Markmið: {formatShortISK(goal)}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="text-sm font-bold" style={{ color: pct >= 100 ? 'var(--success)' : 'var(--accent)' }}>
            {pct}%
          </div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>{rentals.length} leigur</div>
        </div>
      </div>

      <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--surface2)' }}>
        <div className="h-full rounded-full transition-all"
             style={{ width: `${pct}%`,
                      background: pct >= 100 ? 'var(--success)' : 'linear-gradient(90deg, #f97316, #8b5cf6)' }} />
      </div>

      <div className="flex items-center justify-between mt-2">
        <span className="text-xs" style={{ color: 'var(--muted)' }}>
          {pct >= 100 ? '🎉 Markmiðið náð!' : `${formatShortISK(goal - total)} eftir í markmiðið`}
        </span>
        <span className="text-xs" style={{ color: 'var(--accent)' }}>→</span>
      </div>
    </div>
  )
}
