import { useState } from 'react'
import { useFinance } from '../../hooks/useFinance'
import { formatShortISK, formatISK } from '../../utils/currency'
import { Plus, X, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'

const LENDO_GOAL = 200000

export default function IncomeWidget() {
  const { lendoThisMonth, monthlyIncome, addIncome } = useFinance()
  const [showAdd, setShowAdd] = useState(false)
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')

  const lendo = lendoThisMonth()
  const total = monthlyIncome()
  const pct = Math.min(100, Math.round((lendo / LENDO_GOAL) * 100))

  const handleAdd = (e) => {
    e.preventDefault()
    if (!amount || isNaN(Number(amount))) return
    addIncome(Number(amount), 'lendo', note || 'Lendó leiga')
    setAmount('')
    setNote('')
    setShowAdd(false)
  }

  return (
    <div className="card" style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.08), rgba(139,92,246,0.06))' }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">🪑</span>
          <h3 className="font-semibold text-sm">Lendó Tekjur</h3>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/finance?tab=income" className="text-xs" style={{ color: 'var(--accent)' }}>Sjá allt</Link>
          <button onClick={() => setShowAdd(!showAdd)}
            className="w-7 h-7 rounded-xl flex items-center justify-center"
            style={{ background: 'var(--accent)', color: '#000' }}>
            {showAdd ? <X size={13} /> : <Plus size={13} />}
          </button>
        </div>
      </div>

      {showAdd && (
        <form onSubmit={handleAdd} className="flex flex-col gap-2 mb-3 p-3 rounded-xl" style={{ background: 'var(--surface2)' }}>
          <input className="input text-sm" type="number" placeholder="Upphæð (ISK)"
            value={amount} onChange={e => setAmount(e.target.value)} autoFocus />
          <input className="input text-sm" placeholder="Skýring (t.d. Borðaleiga helgi)"
            value={note} onChange={e => setNote(e.target.value)} />
          <button type="submit" className="btn btn-primary text-sm justify-center">Skrá tekjur</button>
        </form>
      )}

      <div className="flex justify-between items-end mb-2">
        <div>
          <div className="text-2xl font-semibold" style={{ color: 'var(--accent)' }}>
            {formatShortISK(lendo)}
          </div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>
            af {formatShortISK(LENDO_GOAL)} Lendó marki
          </div>
        </div>
        {total > 0 && (
          <div className="text-right">
            <div className="text-sm font-semibold flex items-center gap-1" style={{ color: 'var(--success)' }}>
              <TrendingUp size={13} /> {formatShortISK(total)}
            </div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>heildartekjur</div>
          </div>
        )}
      </div>

      <div className="h-2 rounded-full overflow-hidden mb-1" style={{ background: 'var(--surface2)' }}>
        <div className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: pct >= 100 ? 'var(--success)' : 'var(--accent)' }} />
      </div>
      <div className="flex justify-between text-xs" style={{ color: 'var(--muted)' }}>
        <span>{pct}% af marki</span>
        <span>{formatShortISK(Math.max(0, LENDO_GOAL - lendo))} eftir</span>
      </div>
    </div>
  )
}
