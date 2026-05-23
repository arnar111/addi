import { useState } from 'react'
import { useFinance } from '../../hooks/useFinance'
import { useLendo } from '../../hooks/useLendo'
import { formatShortISK, EXPENSE_CATEGORIES } from '../../utils/currency'
import { Link } from 'react-router-dom'
import { ChevronRight, Plus, X, Check, TrendingDown, TrendingUp } from 'lucide-react'

export default function FinanceSnapshotWidget() {
  const { monthlyTotal, remaining, budget, addExpense } = useFinance()
  const { monthlyIncome } = useLendo()
  const [showAdd, setShowAdd] = useState(false)
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('food')

  const total = monthlyTotal()
  const left = remaining()
  const income = monthlyIncome()
  const net = income - total
  const pct = Math.min(100, Math.round((total / budget.monthly) * 100))
  const isOver = left < 0

  const handleAdd = (e) => {
    e.preventDefault()
    if (!amount || isNaN(Number(amount))) return
    addExpense(Number(amount), category)
    setAmount('')
    setShowAdd(false)
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm">Fjármál</h3>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowAdd(s => !s)}
            className="w-6 h-6 rounded-lg flex items-center justify-center transition-all"
            style={{ background: showAdd ? 'rgba(239,68,68,0.15)' : 'rgba(0,212,170,0.15)' }}>
            {showAdd ? <X size={13} style={{ color: 'var(--danger)' }} /> : <Plus size={13} style={{ color: 'var(--accent)' }} />}
          </button>
          <Link to="/finance" className="flex items-center gap-0.5 text-xs" style={{ color: 'var(--accent)' }}>
            Sjá allt <ChevronRight size={12} />
          </Link>
        </div>
      </div>

      {/* Quick expense inline form */}
      {showAdd && (
        <form onSubmit={handleAdd} className="flex flex-col gap-2 mb-3 p-3 rounded-xl animate-slide-up"
          style={{ background: 'var(--surface2)', border: '1px solid var(--border)' }}>
          <input className="input text-sm" type="number" placeholder="Upphæð (ISK)"
            value={amount} onChange={e => setAmount(e.target.value)} autoFocus />
          <div className="grid grid-cols-4 gap-1">
            {EXPENSE_CATEGORIES.map(c => (
              <button key={c.id} type="button" onClick={() => setCategory(c.id)}
                className="flex flex-col items-center gap-0.5 py-1.5 rounded-xl transition-all"
                style={{
                  background: category === c.id ? `${c.color}22` : 'var(--surface)',
                  border: `1px solid ${category === c.id ? c.color + '44' : 'transparent'}`,
                }}>
                <span className="text-sm">{c.icon}</span>
                <span style={{ color: category === c.id ? c.color : 'var(--muted)', fontSize: 9 }}>
                  {c.label.slice(0, 5)}
                </span>
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button type="submit" className="btn btn-primary flex-1 justify-center text-sm py-2">
              <Check size={13} /> Vista gjald
            </button>
            <button type="button" onClick={() => { setShowAdd(false); setAmount('') }}
              className="btn btn-ghost py-2"><X size={14} /></button>
          </div>
        </form>
      )}

      {/* Stats */}
      <div className="flex justify-between items-end mb-3">
        <div>
          <div className="text-2xl font-semibold">{formatShortISK(total)}</div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
            útgjöld af {formatShortISK(budget.monthly)} fjárhagsáætlun
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1 text-sm font-medium justify-end"
            style={{ color: isOver ? 'var(--danger)' : 'var(--success)' }}>
            {isOver ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
            {formatShortISK(Math.abs(left))} {isOver ? 'yfir' : 'eftir'}
          </div>
          {income > 0 && (
            <div className="text-xs mt-0.5" style={{ color: net >= 0 ? 'var(--success)' : 'var(--danger)' }}>
              Nettó: {net >= 0 ? '+' : ''}{formatShortISK(net)}
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
      <div className="text-xs mt-1 text-right" style={{ color: 'var(--muted)' }}>{pct}% notað</div>
    </div>
  )
}
