import { useFinance } from '../../hooks/useFinance'
import { formatShortISK } from '../../utils/currency'
import { Link } from 'react-router-dom'
import { ChevronRight, TrendingDown, TrendingUp, ArrowDownCircle, ArrowUpCircle } from 'lucide-react'

export default function FinanceSnapshotWidget() {
  const { monthlyTotal, monthlyIncome, netBalance, remaining, budget } = useFinance()
  const total = monthlyTotal()
  const income = monthlyIncome()
  const net = netBalance()
  const left = remaining()
  const pct = Math.min(100, Math.round((total / budget.monthly) * 100))
  const isOver = left < 0
  const netPositive = net >= 0

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm">Fjármál þessa mánaðar</h3>
        <Link to="/finance" className="flex items-center gap-0.5 text-xs" style={{ color: 'var(--accent)' }}>
          Sjá allt <ChevronRight size={12} />
        </Link>
      </div>

      {income > 0 ? (
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="flex flex-col gap-0.5 p-2.5 rounded-xl" style={{ background: 'rgba(34,197,94,0.08)' }}>
            <div className="flex items-center gap-1">
              <ArrowDownCircle size={11} style={{ color: 'var(--success)' }} />
              <span className="text-xs" style={{ color: 'var(--muted)' }}>Tekjur</span>
            </div>
            <div className="text-sm font-bold" style={{ color: 'var(--success)' }}>{formatShortISK(income)}</div>
          </div>
          <div className="flex flex-col gap-0.5 p-2.5 rounded-xl" style={{ background: 'rgba(239,68,68,0.08)' }}>
            <div className="flex items-center gap-1">
              <ArrowUpCircle size={11} style={{ color: 'var(--danger)' }} />
              <span className="text-xs" style={{ color: 'var(--muted)' }}>Útgjöld</span>
            </div>
            <div className="text-sm font-bold" style={{ color: 'var(--danger)' }}>{formatShortISK(total)}</div>
          </div>
          <div className="flex flex-col gap-0.5 p-2.5 rounded-xl"
               style={{ background: netPositive ? 'rgba(0,212,170,0.08)' : 'rgba(239,68,68,0.08)' }}>
            <div className="flex items-center gap-1">
              {netPositive ? <TrendingUp size={11} style={{ color: 'var(--accent)' }} /> : <TrendingDown size={11} style={{ color: 'var(--danger)' }} />}
              <span className="text-xs" style={{ color: 'var(--muted)' }}>Nettó</span>
            </div>
            <div className="text-sm font-bold" style={{ color: netPositive ? 'var(--accent)' : 'var(--danger)' }}>
              {netPositive ? '+' : ''}{formatShortISK(net)}
            </div>
          </div>
        </div>
      ) : (
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
      )}

      <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--surface2)' }}>
        <div className="h-full rounded-full transition-all duration-500"
             style={{
               width: `${pct}%`,
               background: isOver ? 'var(--danger)' : pct > 80 ? '#f97316' : 'var(--accent)',
             }} />
      </div>
      <div className="text-xs mt-1 text-right" style={{ color: 'var(--muted)' }}>
        {pct}% af fjárhagsáætlun notað
      </div>
    </div>
  )
}
