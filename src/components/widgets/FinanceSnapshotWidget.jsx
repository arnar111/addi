import { useFinance } from '../../hooks/useFinance'
import { formatShortISK } from '../../utils/currency'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

export default function FinanceSnapshotWidget() {
  const { monthlyTotal, monthlyIncome, netBalance, remaining, budget } = useFinance()
  const total = monthlyTotal()
  const income = monthlyIncome()
  const net = netBalance()
  const left = remaining()
  const pct = Math.min(100, Math.round((total / (budget.monthly || 1)) * 100))
  const incomePct = Math.min(100, Math.round((income / (budget.incomeGoal || 200000)) * 100))
  const isOver = left < 0

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm">Fjármál þessa mánaðar</h3>
        <Link to="/finance" className="flex items-center gap-0.5 text-xs" style={{ color: 'var(--accent)' }}>
          Sjá allt <ChevronRight size={12} />
        </Link>
      </div>

      {/* Income + Expenses row */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="flex flex-col gap-0.5">
          <div className="text-xs" style={{ color: 'var(--muted)' }}>Tekjur</div>
          <div className="text-sm font-semibold" style={{ color: 'var(--success)' }}>+{formatShortISK(income)}</div>
        </div>
        <div className="flex flex-col gap-0.5">
          <div className="text-xs" style={{ color: 'var(--muted)' }}>Útgjöld</div>
          <div className="text-sm font-semibold">{formatShortISK(total)}</div>
        </div>
        <div className="flex flex-col gap-0.5">
          <div className="text-xs" style={{ color: 'var(--muted)' }}>Nettó</div>
          <div className="text-sm font-semibold" style={{ color: net >= 0 ? 'var(--success)' : 'var(--danger)' }}>
            {net >= 0 ? '+' : ''}{formatShortISK(net)}
          </div>
        </div>
      </div>

      {/* Expense bar */}
      <div className="flex flex-col gap-1 mb-2">
        <div className="flex justify-between text-xs" style={{ color: 'var(--muted)' }}>
          <span>Útgjöld</span>
          <span>{pct}% · {formatShortISK(left >= 0 ? left : -left)} {left >= 0 ? 'eftir' : 'yfir'}</span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--surface2)' }}>
          <div className="h-full rounded-full"
               style={{ width: `${pct}%`, background: isOver ? 'var(--danger)' : pct > 80 ? '#f97316' : 'var(--accent)' }} />
        </div>
      </div>

      {/* Income goal bar (Lendó) */}
      <div className="flex flex-col gap-1">
        <div className="flex justify-between text-xs" style={{ color: 'var(--muted)' }}>
          <span>🏠 Lendó mark</span>
          <span>{incomePct}% · {formatShortISK(income)} / {formatShortISK(budget.incomeGoal || 200000)}</span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--surface2)' }}>
          <div className="h-full rounded-full" style={{ width: `${incomePct}%`, background: 'var(--success)' }} />
        </div>
      </div>
    </div>
  )
}
