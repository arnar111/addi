import { useFinance } from '../../hooks/useFinance'
import { useSubscriptions } from '../../hooks/useSubscriptions'
import { formatShortISK } from '../../utils/currency'
import { Link } from 'react-router-dom'
import { ChevronRight, TrendingDown, TrendingUp, Repeat } from 'lucide-react'

export default function FinanceSnapshotWidget() {
  const { monthlyTotal, remaining, budget, monthlyIncome, savingsRate } = useFinance()
  const { monthlyTotal: subMonthly } = useSubscriptions()

  const total = monthlyTotal()
  const left = remaining()
  const pct = Math.min(100, Math.round((total / budget.monthly) * 100))
  const isOver = left < 0
  const income = monthlyIncome()
  const rate = savingsRate()
  const subTotal = subMonthly()

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm">Fjármál þessa mánaðar</h3>
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
        <div className="flex flex-col items-end gap-1">
          <div className={`flex items-center gap-1 text-sm font-medium`}
               style={{ color: isOver ? 'var(--danger)' : 'var(--success)' }}>
            {isOver ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
            {formatShortISK(Math.abs(left))} {isOver ? 'yfir' : 'eftir'}
          </div>
          {income > 0 && (
            <div className="text-xs" style={{ color: 'var(--accent)' }}>
              {rate}% sparað
            </div>
          )}
        </div>
      </div>

      <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--surface2)' }}>
        <div className="h-full rounded-full transition-all duration-500"
             style={{
               width: `${pct}%`,
               background: isOver ? 'var(--danger)' : pct > 80 ? '#f97316' : 'var(--accent)',
             }} />
      </div>
      <div className="flex justify-between text-xs mt-1.5" style={{ color: 'var(--muted)' }}>
        <span>{pct}% notað</span>
        {subTotal > 0 && (
          <Link to="/finance" className="flex items-center gap-1" style={{ color: 'var(--muted)' }}>
            <Repeat size={10} /> {formatShortISK(subTotal)}/mán áskriftir
          </Link>
        )}
      </div>
    </div>
  )
}
