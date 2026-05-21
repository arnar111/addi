import { useState } from 'react'
import { useFinance } from '../../hooks/useFinance'
import { formatShortISK } from '../../utils/currency'
import { Link } from 'react-router-dom'
import { ChevronRight, TrendingDown, TrendingUp, Plus, X } from 'lucide-react'
import { EXPENSE_CATEGORIES } from '../../utils/currency'

export default function FinanceSnapshotWidget() {
  const { monthlyTotal, remaining, budget, addExpense } = useFinance()
  const [showQuick, setShowQuick] = useState(false)
  const [amount, setAmount] = useState('')
  const [cat, setCat] = useState('food')

  const total = monthlyTotal()
  const left = remaining()
  const pct = Math.min(100, Math.round((total / budget.monthly) * 100))
  const isOver = left < 0

  const handleQuickExpense = (e) => {
    e.preventDefault()
    if (!amount || isNaN(Number(amount))) return
    addExpense(Number(amount), cat)
    setAmount('')
    setShowQuick(false)
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm">Fjármál þessa mánaðar</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowQuick(v => !v)}
            className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg transition-all"
            style={{
              background: showQuick ? 'rgba(0,212,170,0.15)' : 'var(--surface2)',
              color: showQuick ? 'var(--accent)' : 'var(--muted)',
            }}
          >
            <Plus size={12} /> Gjald
          </button>
          <Link to="/finance" className="flex items-center gap-0.5 text-xs" style={{ color: 'var(--accent)' }}>
            Sjá allt <ChevronRight size={12} />
          </Link>
        </div>
      </div>

      {showQuick && (
        <form
          onSubmit={handleQuickExpense}
          className="flex flex-col gap-2 mb-3 p-3 rounded-xl animate-slide-up"
          style={{ background: 'var(--surface2)' }}
        >
          <div className="flex gap-2">
            <input
              className="input text-sm flex-1"
              type="number"
              placeholder="Upphæð (ISK)"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              autoFocus
            />
            <button type="button" onClick={() => setShowQuick(false)} style={{ color: 'var(--muted)' }}>
              <X size={16} />
            </button>
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
            {EXPENSE_CATEGORIES.slice(0, 7).map(c => (
              <button
                key={c.id}
                type="button"
                onClick={() => setCat(c.id)}
                className="shrink-0 px-2.5 py-1.5 rounded-lg text-base transition-all"
                style={{
                  background: cat === c.id ? `${c.color}22` : 'var(--surface)',
                  border: `1px solid ${cat === c.id ? c.color + '44' : 'transparent'}`,
                }}
                title={c.label}
              >
                {c.icon}
              </button>
            ))}
          </div>
          <button type="submit" className="btn btn-primary w-full justify-center text-sm py-2">
            Bæta við gjaldi
          </button>
        </form>
      )}

      <div className="flex justify-between items-end mb-3">
        <div>
          <div className="text-2xl font-semibold">{formatShortISK(total)}</div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
            af {formatShortISK(budget.monthly)} fjárhagsáætlun
          </div>
        </div>
        <div
          className="flex items-center gap-1 text-sm font-medium"
          style={{ color: isOver ? 'var(--danger)' : 'var(--success)' }}
        >
          {isOver ? <TrendingDown size={16} /> : <TrendingUp size={16} />}
          {formatShortISK(Math.abs(left))} {isOver ? 'yfir' : 'eftir'}
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
      <div className="text-xs mt-1 text-right" style={{ color: 'var(--muted)' }}>{pct}% notað</div>
    </div>
  )
}
