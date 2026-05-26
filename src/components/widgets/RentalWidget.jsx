import { useState } from 'react'
import { useRental } from '../../hooks/useRental'
import { formatShortISK } from '../../utils/currency'
import { Plus, X, Home } from 'lucide-react'

const ITEMS = ['Cat', 'Borð + stólar', 'Tjald', 'Annað']

export default function RentalWidget() {
  const { monthlyTotal, remaining, pct, recent, add, MONTHLY_GOAL } = useRental()
  const [showForm, setShowForm] = useState(false)
  const [amount, setAmount] = useState('')
  const [item, setItem] = useState('Cat')
  const [note, setNote] = useState('')

  const total = monthlyTotal()
  const p = pct()
  const isGoalMet = total >= MONTHLY_GOAL

  const handleAdd = (e) => {
    e.preventDefault()
    if (!amount || isNaN(Number(amount))) return
    add(Number(amount), item, note)
    setAmount('')
    setNote('')
    setShowForm(false)
  }

  return (
    <div className="card" style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.07), rgba(0,212,170,0.05))' }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Home size={15} style={{ color: 'var(--accent2)' }} />
          <span className="font-semibold text-sm">Lendó leigutekjur</span>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg transition-all"
          style={{ background: 'rgba(139,92,246,0.15)', color: 'var(--accent2)' }}>
          <Plus size={12} /> Bæta við
        </button>
      </div>

      <div className="flex justify-between items-end mb-2">
        <div>
          <div className="text-2xl font-semibold">{formatShortISK(total)}</div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
            af {formatShortISK(MONTHLY_GOAL)} mánaðarmarki
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-semibold" style={{ color: isGoalMet ? 'var(--success)' : 'var(--accent2)' }}>
            {isGoalMet ? '✓ Marki náð' : `${formatShortISK(remaining())} eftir`}
          </div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>{p}% af marki</div>
        </div>
      </div>

      <div className="h-2 rounded-full overflow-hidden mb-3" style={{ background: 'var(--surface2)' }}>
        <div className="h-full rounded-full transition-all duration-700"
             style={{ width: `${p}%`, background: isGoalMet ? 'var(--success)' : 'var(--accent2)' }} />
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="flex flex-col gap-2 mb-3 p-3 rounded-xl animate-slide-up"
              style={{ background: 'var(--surface2)' }}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium">Leiga móttekin</span>
            <button type="button" onClick={() => setShowForm(false)}><X size={14} style={{ color: 'var(--muted)' }} /></button>
          </div>
          <input className="input text-sm" type="number" placeholder="Upphæð (ISK)" value={amount}
                 onChange={e => setAmount(e.target.value)} autoFocus />
          <div className="flex gap-1.5 flex-wrap">
            {ITEMS.map(i => (
              <button key={i} type="button" onClick={() => setItem(i)}
                className="text-xs px-2 py-1 rounded-lg transition-all"
                style={{
                  background: item === i ? 'rgba(139,92,246,0.25)' : 'var(--surface)',
                  color: item === i ? 'var(--accent2)' : 'var(--muted)',
                  border: `1px solid ${item === i ? 'rgba(139,92,246,0.4)' : 'transparent'}`,
                }}>{i}</button>
            ))}
          </div>
          <input className="input text-sm" placeholder="Athugasemd (valkvæmt)" value={note}
                 onChange={e => setNote(e.target.value)} />
          <button type="submit" className="btn btn-primary w-full justify-center text-sm">Vista</button>
        </form>
      )}

      {recent.length > 0 && (
        <div className="flex flex-col gap-1.5">
          {recent.slice(0, 3).map(r => (
            <div key={r.id} className="flex items-center justify-between text-xs">
              <span style={{ color: 'var(--muted)' }}>{r.item}{r.note ? ` · ${r.note}` : ''}</span>
              <span className="font-semibold" style={{ color: 'var(--success)' }}>+{formatShortISK(r.amount)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
