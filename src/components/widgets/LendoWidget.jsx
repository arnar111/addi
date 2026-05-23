import { useState } from 'react'
import { useLendo, LENDO_ITEMS } from '../../hooks/useLendo'
import { formatISK, formatShortISK } from '../../utils/currency'
import { Plus, X, TrendingUp } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function LendoWidget() {
  const { monthlyTotal, progressPct, remaining, rentalCount, monthlyGoal, addRental } = useLendo()
  const [showQuickAdd, setShowQuickAdd] = useState(false)
  const [item, setItem] = useState('veislusett')
  const [amount, setAmount] = useState('7000')
  const navigate = useNavigate()

  const pct = progressPct()
  const total = monthlyTotal()
  const isGoalMet = total >= monthlyGoal

  const handleQuickAdd = (e) => {
    e.preventDefault()
    if (!amount || isNaN(Number(amount))) return
    addRental({ amount, item })
    setShowQuickAdd(false)
    setAmount('7000')
    setItem('veislusett')
  }

  const selectedItem = LENDO_ITEMS.find(i => i.id === item)

  return (
    <div className="card" style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.07), rgba(34,197,94,0.05))' }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-base">🏠</span>
          <div>
            <div className="text-sm font-semibold">Lendó</div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>
              {rentalCount()} leiga{rentalCount() !== 1 ? 'r' : ''} þennan mánuð
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowQuickAdd(!showQuickAdd)}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
            style={{ background: 'rgba(0,212,170,0.15)', color: 'var(--accent)' }}>
            {showQuickAdd ? <X size={14} /> : <Plus size={14} />}
          </button>
        </div>
      </div>

      {showQuickAdd && (
        <form onSubmit={handleQuickAdd} className="mb-3 p-3 rounded-xl flex flex-col gap-2 animate-slide-up"
              style={{ background: 'var(--surface2)', border: '1px solid var(--border)' }}>
          <div className="grid grid-cols-2 gap-1.5">
            {LENDO_ITEMS.map(it => (
              <button key={it.id} type="button" onClick={() => { setItem(it.id); if (it.price) setAmount(String(it.price)) }}
                className="py-1.5 px-2 rounded-lg text-xs text-left transition-all"
                style={{
                  background: item === it.id ? 'rgba(0,212,170,0.15)' : 'var(--surface)',
                  border: `1px solid ${item === it.id ? 'rgba(0,212,170,0.4)' : 'var(--border)'}`,
                  color: item === it.id ? 'var(--accent)' : 'var(--muted)',
                }}>
                {it.label}
              </button>
            ))}
          </div>
          <input className="input text-sm py-2" type="number" placeholder="Upphæð (ISK)"
            value={amount} onChange={e => setAmount(e.target.value)} />
          <button type="submit" className="btn btn-primary w-full justify-center py-2 text-sm">
            Skrá leigutekjur
          </button>
        </form>
      )}

      <div className="flex items-end justify-between mb-2">
        <div>
          <div className="text-2xl font-bold" style={{ color: isGoalMet ? 'var(--success)' : 'var(--text)' }}>
            {formatShortISK(total)}
          </div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>
            af {formatShortISK(monthlyGoal)} mánaðarmarkmiði
          </div>
        </div>
        {isGoalMet ? (
          <span className="text-xs px-2 py-1 rounded-lg font-semibold"
                style={{ background: 'rgba(34,197,94,0.15)', color: 'var(--success)' }}>
            🎉 Marki náð!
          </span>
        ) : (
          <span className="text-xs" style={{ color: 'var(--muted)' }}>
            {formatShortISK(remaining())} eftir
          </span>
        )}
      </div>

      <div className="h-2 rounded-full overflow-hidden mb-1" style={{ background: 'var(--surface2)' }}>
        <div className="h-full rounded-full transition-all duration-700"
             style={{
               width: `${pct}%`,
               background: isGoalMet ? 'var(--success)' : pct > 75 ? 'var(--accent)' : 'linear-gradient(90deg, var(--accent), #00b894)',
             }} />
      </div>
      <div className="flex justify-between items-center mt-1">
        <span className="text-xs" style={{ color: 'var(--muted)' }}>{pct}% af markmiði</span>
        <button onClick={() => navigate('/finance')} className="text-xs" style={{ color: 'var(--accent)' }}>
          Sjá allt →
        </button>
      </div>
    </div>
  )
}
