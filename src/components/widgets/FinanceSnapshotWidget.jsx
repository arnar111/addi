import { useFinance } from '../../hooks/useFinance'
import { useIncome } from '../../hooks/useIncome'
import { formatShortISK } from '../../utils/currency'
import { Link } from 'react-router-dom'
import { ChevronRight, TrendingDown, TrendingUp } from 'lucide-react'

export default function FinanceSnapshotWidget() {
  const { monthlyTotal, remaining, budget } = useFinance()
  const { monthlyTotal: incomeTotal } = useIncome()

  const totalExp = monthlyTotal()
  const totalInc = incomeTotal()
  const net = totalInc - totalExp
  const left = remaining()
  const pct = Math.min(100, Math.round((totalExp / budget.monthly) * 100))
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
        <div className="flex flex-col gap-0.5">
          <div className="text-xs flex items-center gap-1" style={{ color: 'var(--muted)' }}>
            <TrendingUp size={11} style={{ color: 'var(--success)' }} /> Tekjur
          </div>
          <div className="text-sm font-semibold" style={{ color: 'var(--success)' }}>{formatShortISK(totalInc)}</div>
        </div>
        <div className="flex flex-col gap-0.5">
          <div className="text-xs flex items-center gap-1" style={{ color: 'var(--muted)' }}>
            <TrendingDown size={11} style={{ color: 'var(--danger)' }} /> Útgjöld
          </div>
          <div className="text-sm font-semibold" style={{ color: 'var(--danger)' }}>{formatShortISK(totalExp)}</div>
        </div>
        <div className="flex flex-col gap-0.5">
          <div className="text-xs" style={{ color: 'var(--muted)' }}>Nettó</div>
          <div className="text-sm font-semibold" style={{ color: net >= 0 ? 'var(--accent)' : 'var(--danger)' }}>
            {net >= 0 ? '+' : '-'}{formatShortISK(Math.abs(net))}
          </div>
        </div>
      </div>

      <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--surface2)' }}>
        <div className="h-full rounded-full transition-all duration-500"
             style={{
               width: `${pct}%`,
               background: isOver ? 'var(--danger)' : pct > 80 ? '#f97316' : '#f97316',
             }} />
      </div>
      <div className="flex justify-between text-xs mt-1" style={{ color: 'var(--muted)' }}>
        <span>{pct}% af fjárhagsáætlun</span>
        <span style={{ color: isOver ? 'var(--danger)' : 'var(--success)' }}>
          {isOver ? '-' : ''}{formatShortISK(Math.abs(left))} {isOver ? 'yfir' : 'eftir'}
        </span>
      </div>
    </div>
  )
}
