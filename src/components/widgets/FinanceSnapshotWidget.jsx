import { useFinance } from '../../hooks/useFinance'
import { formatShortISK } from '../../utils/currency'
import { Link } from 'react-router-dom'
import { ChevronRight, TrendingDown, TrendingUp, PiggyBank } from 'lucide-react'

export default function FinanceSnapshotWidget() {
  const { monthlyTotal, monthlyIncome, monthlySavings, remaining, budget } = useFinance()
  const total = monthlyTotal()
  const income = monthlyIncome()
  const savings = monthlySavings()
  const left = remaining()
  const pct = Math.min(100, Math.round((total / budget.monthly) * 100))
  const isOver = left < 0

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm">Fjármál þessa mánaðar</h3>
        <Link to="/finance" className="flex items-center gap-0.5 text-xs" style={{ color: 'var(--accent)' }}>
          Sjá allt <ChevronRight size={12} />
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="flex flex-col gap-0.5 p-2 rounded-xl" style={{ background: 'var(--surface2)' }}>
          <span className="text-xs" style={{ color: 'var(--muted)' }}>Tekjur</span>
          <span className="text-sm font-semibold" style={{ color: 'var(--success)' }}>{formatShortISK(income)}</span>
        </div>
        <div className="flex flex-col gap-0.5 p-2 rounded-xl" style={{ background: 'var(--surface2)' }}>
          <span className="text-xs" style={{ color: 'var(--muted)' }}>Útgjöld</span>
          <span className="text-sm font-semibold">{formatShortISK(total)}</span>
        </div>
        <div className="flex flex-col gap-0.5 p-2 rounded-xl" style={{ background: 'var(--surface2)' }}>
          <span className="text-xs" style={{ color: 'var(--muted)' }}>Sparað</span>
          <span className="text-sm font-semibold" style={{ color: savings >= 0 ? 'var(--accent)' : 'var(--danger)' }}>
            {formatShortISK(savings)}
          </span>
        </div>
      </div>

      <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--surface2)' }}>
        <div className="h-full rounded-full transition-all duration-500"
             style={{
               width: `${pct}%`,
               background: isOver ? 'var(--danger)' : pct > 80 ? '#f97316' : 'var(--accent)',
             }} />
      </div>
      <div className="flex justify-between text-xs mt-1" style={{ color: 'var(--muted)' }}>
        <span>{pct}% notað</span>
        <span>Áætlun: {formatShortISK(budget.monthly)}</span>
      </div>
    </div>
  )
}
