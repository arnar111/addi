import { useFinance } from '../../hooks/useFinance'
import { useLendo } from '../../hooks/useLendo'
import { formatShortISK } from '../../utils/currency'
import { Link } from 'react-router-dom'
import { ChevronRight, TrendingDown, TrendingUp } from 'lucide-react'

export default function FinanceSnapshotWidget() {
  const { monthlyTotal, remaining, budget } = useFinance()
  const { monthlyPaid } = useLendo()

  const total = monthlyTotal()
  const income = monthlyPaid()
  const left = remaining()
  const pct = Math.min(100, Math.round((total / budget.monthly) * 100))
  const isOver = left < 0
  const net = income - total
  const isNetPositive = net >= 0

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
          <div className="text-xs" style={{ color: 'var(--muted)' }}>Tekjur</div>
          <div className="text-sm font-semibold" style={{ color: 'var(--success)' }}>
            {formatShortISK(income)}
          </div>
        </div>
        <div className="flex flex-col gap-0.5">
          <div className="text-xs" style={{ color: 'var(--muted)' }}>Útgjöld</div>
          <div className="text-sm font-semibold">{formatShortISK(total)}</div>
        </div>
        <div className="flex flex-col gap-0.5 items-end">
          <div className="text-xs" style={{ color: 'var(--muted)' }}>Nettó</div>
          <div
            className="text-sm font-semibold flex items-center gap-0.5"
            style={{ color: isNetPositive ? 'var(--success)' : 'var(--danger)' }}
          >
            {isNetPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {isNetPositive ? '+' : ''}{formatShortISK(net)}
          </div>
        </div>
      </div>

      <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--surface2)' }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${pct}%`,
            background: isOver ? 'var(--danger)' : pct > 80 ? '#f97316' : 'var(--accent)',
          }}
        />
      </div>
      <div className="flex justify-between text-xs mt-1" style={{ color: 'var(--muted)' }}>
        <span>{pct}% af fjárhagsáætlun notað</span>
        <span>{isOver ? '⚠️ Yfir' : `${formatShortISK(Math.abs(left))} eftir`}</span>
      </div>
    </div>
  )
}
