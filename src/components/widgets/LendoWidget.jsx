import { useState } from 'react'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { Plus, ExternalLink, TrendingUp, Trash2 } from 'lucide-react'

const MONTHLY_GOAL = 200000

function formatISKShort(n) {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}m`
  if (n >= 1000) return `${Math.round(n / 1000)}k`
  return String(n)
}

function formatISK(n) {
  return new Intl.NumberFormat('is-IS').format(n) + ' kr'
}

export default function LendoWidget() {
  const [bookings, setBookings] = useLocalStorage('lendo_bookings', [])
  const [showAdd, setShowAdd] = useState(false)
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')

  const now = new Date()
  const thisMonth = bookings.filter(b => {
    const d = new Date(b.date)
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  })

  const total = thisMonth.reduce((s, b) => s + b.amount, 0)
  const pct = Math.min(100, Math.round((total / MONTHLY_GOAL) * 100))
  const remaining = MONTHLY_GOAL - total

  const handleAdd = (e) => {
    e.preventDefault()
    const val = Number(amount)
    if (!val || isNaN(val)) return
    setBookings(prev => [...prev, {
      id: Date.now(),
      amount: val,
      note: note || 'Leiga',
      date: new Date().toISOString(),
    }])
    setAmount('')
    setNote('')
    setShowAdd(false)
  }

  const removeBooking = (id) => {
    setBookings(prev => prev.filter(b => b.id !== id))
  }

  return (
    <div className="card" style={{ border: '1px solid rgba(0,212,170,0.15)' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center"
               style={{ background: 'rgba(0,212,170,0.12)' }}>
            <span className="text-base">🪑</span>
          </div>
          <div>
            <div className="text-sm font-semibold">Lendó</div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>Leigustarfsemi</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="w-7 h-7 rounded-xl flex items-center justify-center transition-all"
            style={{ background: 'rgba(0,212,170,0.12)' }}>
            <Plus size={14} style={{ color: 'var(--accent)' }} />
          </button>
          <a href="https://lendoapp.netlify.app" target="_blank" rel="noopener noreferrer"
             className="w-7 h-7 rounded-xl flex items-center justify-center"
             style={{ background: 'var(--surface2)' }}>
            <ExternalLink size={13} style={{ color: 'var(--muted)' }} />
          </a>
        </div>
      </div>

      {/* Revenue & goal */}
      <div className="flex items-end justify-between mb-2">
        <div>
          <div className="text-2xl font-bold">{formatISK(total)}</div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
            {thisMonth.length} leiga{thisMonth.length !== 1 ? 'r' : ''} þetta mánaðar
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-semibold" style={{ color: pct >= 100 ? 'var(--success)' : pct >= 50 ? 'var(--accent)' : 'var(--muted)' }}>
            {pct}%
          </div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>
            {remaining > 0 ? `${formatISKShort(remaining)} eftir` : '🎯 Náð!'}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 rounded-full overflow-hidden mb-3" style={{ background: 'var(--surface2)' }}>
        <div className="h-full rounded-full transition-all duration-500"
             style={{
               width: `${pct}%`,
               background: pct >= 100
                 ? 'var(--success)'
                 : `linear-gradient(90deg, var(--accent), rgba(0,212,170,0.6))`
             }} />
      </div>
      <div className="text-xs flex justify-between mb-3" style={{ color: 'var(--muted)' }}>
        <span>{formatISKShort(total)}</span>
        <span>Markmið: {formatISKShort(MONTHLY_GOAL)}</span>
      </div>

      {/* Add form */}
      {showAdd && (
        <form onSubmit={handleAdd} className="flex flex-col gap-2 p-3 rounded-xl mb-2"
              style={{ background: 'var(--surface2)' }}>
          <input
            className="input text-sm py-2"
            type="number"
            placeholder="Upphæð (ISK) – t.d. 7000"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            autoFocus />
          <input
            className="input text-sm py-2"
            placeholder="Hvað var leigt? (valkvæmt)"
            value={note}
            onChange={e => setNote(e.target.value)} />
          <div className="flex gap-2">
            <button type="submit" className="btn btn-primary flex-1 justify-center text-sm py-2">
              <TrendingUp size={14} /> Skrá tekjur
            </button>
            <button type="button" onClick={() => setShowAdd(false)}
                    className="btn btn-ghost text-sm py-2">Hætta við</button>
          </div>
        </form>
      )}

      {/* Recent bookings */}
      {thisMonth.length > 0 && !showAdd && (
        <div className="flex flex-col gap-1">
          {thisMonth.slice(-4).reverse().map(b => (
            <div key={b.id} className="flex items-center justify-between py-1.5 px-2 rounded-lg group"
                 style={{ background: 'var(--surface2)' }}>
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-sm">🪑</span>
                <span className="text-xs truncate">{b.note}</span>
                <span className="text-xs shrink-0" style={{ color: 'var(--muted)' }}>
                  {new Date(b.date).toLocaleDateString('is-IS', { day: 'numeric', month: 'short' })}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-semibold" style={{ color: 'var(--success)' }}>+{formatISKShort(b.amount)}</span>
                <button onClick={() => removeBooking(b.id)} className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 size={11} style={{ color: 'var(--muted)' }} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
