import { useFinance } from '../../hooks/useFinance'
import { useIncome } from '../../hooks/useIncome'
import { formatShortISK } from '../../utils/currency'
import { Link } from 'react-router-dom'
import { ChevronRight, TrendingDown, TrendingUp } from 'lucide-react'

export default function FinanceSnapshotWidget() {
  const { monthlyTotal, remaining, budget } = useFinance()
  const { monthlyTotal: incomeMonthly, lendoTotal, lendoCount } = useIncome()
  const total = monthlyTotal()
  const left = remaining()
  const pct = Math.min(100, Math.round((total / budget.monthly) * 100))
  const isOver = left < 0
  const totalIncome = incomeMonthly()
  const net = totalIncome - total
  const lendo = lendoTotal()
  const lendoN = lendoCount()

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm">Fjármál þessa mánaðar</h3>
        <Link to="/finance" className="flex items-center gap-0.5 text-xs" style={{ color: 'var(--accent)' }}>
          Sjá allt <ChevronRight size={12} />
        </Link>
      </div>

      <div className="flex gap-3 mb-3">
        <div className="flex-1">
          <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Gjöld</div>
          <div className="text-xl font-semibold">{formatShortISK(total)}</div>
        </div>
        {totalIncome > 0 && (
          <div className="flex-1">
            <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Tekjur</div>
            <div className="text-xl font-semibold" style={{ color: 'var(--success)' }}>+{formatShortISK(totalIncome)}</div>
          </div>
        )}
        <div className="flex-1 text-right">
          <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>{totalIncome > 0 ? 'Nettó' : 'Eftir'}</div>
          <div className="text-xl font-semibold" style={{ color: isOver && totalIncome === 0 ? 'var(--danger)' : net >= 0 ? 'var(--success)' : 'var(--danger)' }}>
            {totalIncome > 0 ? (net >= 0 ? '+' : '') : isOver ? '-' : ''}{formatShortISK(totalIncome > 0 ? Math.abs(net) : Math.abs(left))}
          </div>
        </div>
      </div>

      {lendoN > 0 && (
        <div className="flex items-center gap-2 mb-3 px-2 py-1.5 rounded-xl"
             style={{ background: 'rgba(0,212,170,0.08)' }}>
          <span>🪑</span>
          <span className="text-xs flex-1" style={{ color: 'var(--muted)' }}>Lendó · {lendoN} leiga</span>
          <span className="text-xs font-semibold" style={{ color: 'var(--accent)' }}>+{formatShortISK(lendo)}</span>
        </div>
      )}

      <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--surface2)' }}>
        <div className="h-full rounded-full transition-all duration-500"
             style={{
               width: `${pct}%`,
               background: isOver ? 'var(--danger)' : pct > 80 ? '#f97316' : 'var(--accent)',
             }} />
      </div>
      <div className="flex justify-between text-xs mt-1" style={{ color: 'var(--muted)' }}>
        <span>{pct}% notað</span>
        <span>af {formatShortISK(budget.monthly)}</span>
      </div>
    </div>
  )
}
