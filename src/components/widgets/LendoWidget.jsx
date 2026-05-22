import { useState } from 'react'
import { useLendo } from '../../hooks/useLendo'
import { formatShortISK } from '../../utils/currency'
import { Plus, X, ExternalLink, Trash2 } from 'lucide-react'

export default function LendoWidget() {
  const { rentals, addRental, removeRental, monthlyRevenue, monthlyGoal, rentalCount } = useLendo()
  const [showForm, setShowForm] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [amount, setAmount] = useState('')
  const [item, setItem] = useState('')

  const revenue = monthlyRevenue()
  const pct = Math.min(100, Math.round((revenue / monthlyGoal) * 100))
  const count = rentalCount()
  const recent = rentals.slice(0, 5)

  const handleAdd = (e) => {
    e.preventDefault()
    if (!amount || isNaN(Number(amount))) return
    addRental(Number(amount), item)
    setAmount('')
    setItem('')
    setShowForm(false)
  }

  return (
    <div className="card" style={{
      background: 'linear-gradient(135deg, rgba(249,115,22,0.07), rgba(234,179,8,0.05))',
      borderColor: 'rgba(249,115,22,0.2)',
    }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">🏠</span>
          <span className="font-semibold text-sm">Lendó</span>
          {count > 0 && (
            <span className="badge" style={{ background: 'rgba(249,115,22,0.15)', color: '#f97316', fontSize: 10 }}>
              {count} leigur
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <a href="https://lendoapp.is" target="_blank" rel="noopener noreferrer"
             style={{ color: 'var(--muted)' }}>
            <ExternalLink size={13} />
          </a>
          <button onClick={() => setShowForm(!showForm)}
            className="btn btn-primary" style={{ padding: '5px 10px', fontSize: 12 }}>
            <Plus size={13} /> Tekjur
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="flex flex-col gap-2 mb-3 p-3 rounded-xl animate-slide-up"
              style={{ background: 'var(--surface2)' }}>
          <div className="flex gap-2">
            <input className="input text-sm flex-1" type="number" placeholder="Upphæð (ISK)"
              value={amount} onChange={e => setAmount(e.target.value)} autoFocus />
            <button type="button" onClick={() => setShowForm(false)} style={{ color: 'var(--muted)' }}>
              <X size={16} />
            </button>
          </div>
          <input className="input text-sm" placeholder="Hlutur (t.d. borð+stólar)" value={item} onChange={e => setItem(e.target.value)} />
          <button type="submit" className="btn btn-primary justify-center text-sm">Skrá leigutekjur</button>
        </form>
      )}

      <div className="flex justify-between items-end mb-2">
        <div>
          <div className="text-2xl font-bold" style={{ color: '#f97316' }}>{formatShortISK(revenue)}</div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
            af {formatShortISK(monthlyGoal)} mánaðarmarki
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-semibold" style={{ color: pct >= 100 ? 'var(--success)' : pct > 60 ? '#f97316' : 'var(--muted)' }}>
            {pct}%
          </div>
          {pct >= 100 && <div className="text-xs" style={{ color: 'var(--success)' }}>🎯 Marki náð!</div>}
        </div>
      </div>

      <div className="h-2 rounded-full overflow-hidden mb-1" style={{ background: 'var(--surface2)' }}>
        <div className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: pct >= 100 ? 'var(--success)' : 'linear-gradient(90deg, #f97316, #eab308)' }} />
      </div>

      {recent.length > 0 && (
        <button onClick={() => setShowHistory(!showHistory)}
          className="text-xs mt-1 w-full text-left" style={{ color: 'var(--muted)' }}>
          {showHistory ? '▲' : '▼'} Síðustu færslur
        </button>
      )}

      {showHistory && recent.length > 0 && (
        <div className="flex flex-col gap-1.5 mt-2 animate-slide-up">
          {recent.map(r => (
            <div key={r.id} className="flex items-center gap-2 px-2 py-1.5 rounded-lg"
                 style={{ background: 'var(--surface2)' }}>
              <span className="text-sm font-semibold flex-1" style={{ color: '#f97316' }}>
                +{formatShortISK(r.amount)}
              </span>
              {r.item && <span className="text-xs" style={{ color: 'var(--muted)' }}>{r.item}</span>}
              <span className="text-xs" style={{ color: 'var(--muted)' }}>
                {new Date(r.date).toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })}
              </span>
              <button onClick={() => removeRental(r.id)} style={{ color: 'var(--muted)' }}>
                <Trash2 size={11} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
