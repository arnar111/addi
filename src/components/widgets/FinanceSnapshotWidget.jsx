import { useFinance } from '../../hooks/useFinance'
import { formatShortISK } from '../../utils/currency'
import { Link } from 'react-router-dom'
import { ChevronRight, TrendingDown, TrendingUp } from 'lucide-react'

export default function FinanceSnapshotWidget() {
  const { monthlyTotal, remaining, budget, monthlyIncome, monthlyNet } = useFinance()
  const total = monthlyTotal()
  const income = monthlyIncome()
  const net = monthlyNet()
  const left = remaining()
  const pct = Math.min(100, Math.round((total / budget.monthly) * 100))
  const isOver = left < 0

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm">💰 Fjármál þessa mánaðar</h3>
        <Link to="/finance" className="flex items-center gap-0.5 text-xs" style={{ color: 'var(--accent)' }}>
          Sjá allt <ChevronRight size={12} />
        </Link>
      </div>

      {income > 0 && (
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="text-center p-2 rounded-xl" style={{ background: 'rgba(34,197,94,0.08)' }}>
            <div className="text-xs font-semibold" style={{ color: 'var(--success)' }}>+{formatShortISK(income)}</div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--muted)', fontSize: 10 }}>Tekjur</div>
          </div>
          <div className="text-center p-2 rounded-xl" style={{ background: 'rgba(239,68,68,0.08)' }}>
            <div className="text-xs font-semibold" style={{ color: 'var(--danger)' }}>-{formatShortISK(total)}</div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--muted)', fontSize: 10 }}>Gjöld</div>
          </div>
          <div className="text-center p-2 rounded-xl" style={{ background: net >= 0 ? 'rgba(0,212,170,0.08)' : 'rgba(239,68,68,0.08)' }}>
            <div className="text-xs font-semibold" style={{ color: net >= 0 ? 'var(--accent)' : 'var(--danger)' }}>
              {net >= 0 ? '+' : ''}{formatShortISK(net)}
            </div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--muted)', fontSize: 10 }}>Nettó</div>
          </div>
        </div>
      )}

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
             style={{
               width: `${pct}%`,
               background: isOver ? 'var(--danger)' : pct > 80 ? '#f97316' : 'var(--accent)',
             }} />
      </div>
      <div className="text-xs mt-1 text-right" style={{ color: 'var(--muted)' }}>{pct}% notað</div>
    </div>
  )
}
