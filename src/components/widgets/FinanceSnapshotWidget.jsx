import { useFinance } from '../../hooks/useFinance'
import { formatShortISK } from '../../utils/currency'
import { Link } from 'react-router-dom'
import { ChevronRight, TrendingDown, TrendingUp } from 'lucide-react'

export default function FinanceSnapshotWidget() {
  const { monthlyTotal, monthlyIncomeTotal, monthlyNet, remaining, budget } = useFinance()
  const total = monthlyTotal()
  const income = monthlyIncomeTotal()
  const net = monthlyNet()
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
          <span className="text-xs" style={{ color: 'var(--muted)' }}>Útgjöld</span>
          <span className="text-sm font-bold" style={{ color: 'var(--danger)' }}>{formatShortISK(total)}</span>
        </div>
        <div className="flex flex-col gap-0.5 p-2 rounded-xl" style={{ background: 'var(--surface2)' }}>
          <span className="text-xs" style={{ color: 'var(--muted)' }}>Tekjur</span>
          <span className="text-sm font-bold" style={{ color: 'var(--success)' }}>{formatShortISK(income)}</span>
        </div>
        <div className="flex flex-col gap-0.5 p-2 rounded-xl" style={{ background: 'var(--surface2)' }}>
          <span className="text-xs" style={{ color: 'var(--muted)' }}>Nettó</span>
          <span className="text-sm font-bold" style={{ color: net >= 0 ? 'var(--accent)' : 'var(--danger)' }}>
            {net >= 0 ? '+' : ''}{formatShortISK(net)}
          </span>
        </div>
      </div>

      <div className="flex justify-between items-center mb-2">
        <span className="text-xs" style={{ color: 'var(--muted)' }}>af {formatShortISK(budget.monthly)} áætlun</span>
        <div className={`flex items-center gap-1 text-xs font-medium`}
             style={{ color: isOver ? 'var(--danger)' : 'var(--success)' }}>
          {isOver ? <TrendingDown size={13} /> : <TrendingUp size={13} />}
          {formatShortISK(Math.abs(left))} {isOver ? 'yfir' : 'eftir'}
        </div>
      </div>

      <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--surface2)' }}>
        <div className="h-full rounded-full transition-all duration-500"
             style={{
               width: `${pct}%`,
               background: isOver ? 'var(--danger)' : pct > 80 ? '#f97316' : 'var(--accent)',
             }} />
      </div>
      <div className="text-xs mt-1 text-right" style={{ color: 'var(--muted)' }}>{pct}% notað</div>
    </div>
  )
}
