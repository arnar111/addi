import { useFinance } from '../../hooks/useFinance'
import { useLendo } from '../../hooks/useLendo'
import { formatShortISK } from '../../utils/currency'
import { Link } from 'react-router-dom'
import { ChevronRight, TrendingDown, TrendingUp } from 'lucide-react'

export default function FinanceSnapshotWidget() {
  const { monthlyTotal, remaining, budget } = useFinance()
  const { total: lendoTotal, pct: lendoPct, goal } = useLendo()
  const total = monthlyTotal()
  const left = remaining()
  const pct = Math.min(100, Math.round((total / budget.monthly) * 100))
  const isOver = left < 0

  return (
    <div className="card flex flex-col gap-4">
      {/* Expenses */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-sm">Útgjöld þessa mánaðar</h3>
          <Link to="/finance" className="flex items-center gap-0.5 text-xs" style={{ color: 'var(--accent)' }}>
            Sjá allt <ChevronRight size={12} />
          </Link>
        </div>
        <div className="flex justify-between items-end mb-3">
          <div>
            <div className="text-2xl font-semibold">{formatShortISK(total)}</div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
              af {formatShortISK(budget.monthly)} fjárhagsáætlun
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm font-medium"
               style={{ color: isOver ? 'var(--danger)' : 'var(--success)' }}>
            {isOver ? <TrendingDown size={16} /> : <TrendingUp size={16} />}
            {formatShortISK(Math.abs(left))} {isOver ? 'yfir' : 'eftir'}
          </div>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--surface2)' }}>
          <div className="h-full rounded-full transition-all duration-500"
               style={{ width: `${pct}%`, background: isOver ? 'var(--danger)' : pct > 80 ? '#f97316' : 'var(--accent)' }} />
        </div>
        <div className="text-xs mt-1 text-right" style={{ color: 'var(--muted)' }}>{pct}% notað</div>
      </div>

      {/* Lendó income */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12 }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">🪑 Lendó tekjur</span>
          <Link to="/business" className="flex items-center gap-0.5 text-xs" style={{ color: '#f97316' }}>
            Sjá allt <ChevronRight size={12} />
          </Link>
        </div>
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-base font-semibold" style={{ color: '#f97316' }}>{formatShortISK(lendoTotal)}</span>
          <span className="text-xs" style={{ color: 'var(--muted)' }}>af {formatShortISK(goal)} markmiði</span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--surface2)' }}>
          <div className="h-full rounded-full transition-all duration-500"
               style={{ width: `${lendoPct}%`, background: lendoPct >= 100 ? 'var(--success)' : '#f97316' }} />
        </div>
      </div>
    </div>
  )
}
