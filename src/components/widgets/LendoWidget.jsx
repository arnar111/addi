import { useState } from 'react'
import { useLendo } from '../../hooks/useLendo'
import { Plus, TrendingUp } from 'lucide-react'

function iskFormat(n) {
  return new Intl.NumberFormat('is-IS').format(Math.round(n)) + ' kr'
}

export default function LendoWidget() {
  const { monthlyIncome, monthlyGoal, goalProgress, listings, addEntry } = useLendo()
  const [adding, setAdding] = useState(false)
  const [amount, setAmount] = useState('')
  const [listing, setListing] = useState('')

  function handleAdd(e) {
    e.preventDefault()
    if (!amount || isNaN(amount)) return
    addEntry({ amount: Number(amount), listing: listing || 'Leiga', type: 'income' })
    setAmount('')
    setListing('')
    setAdding(false)
  }

  const progressColor = goalProgress >= 100 ? '#22c55e' : goalProgress >= 70 ? '#00d4aa' : '#f97316'

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-base">🏠</span>
          <div>
            <div className="text-sm font-semibold">Lendó Tekjur</div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>Þessi mánuður</div>
          </div>
        </div>
        <button
          onClick={() => setAdding(a => !a)}
          className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg"
          style={{ background: 'rgba(0,212,170,0.12)', color: 'var(--accent)' }}
        >
          <Plus size={12} /> Skrá
        </button>
      </div>

      {/* Income vs goal */}
      <div className="flex items-end justify-between mb-2">
        <div>
          <div className="text-2xl font-bold">{iskFormat(monthlyIncome)}</div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
            af {iskFormat(monthlyGoal)} markmiði
          </div>
        </div>
        <div className="flex items-center gap-1 text-sm font-semibold"
             style={{ color: progressColor }}>
          <TrendingUp size={16} />
          {goalProgress.toFixed(0)}%
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative h-2 rounded-full overflow-hidden mb-3" style={{ background: 'var(--surface2)' }}>
        <div className="absolute inset-y-0 left-0 rounded-full transition-all"
             style={{ width: `${goalProgress}%`, background: progressColor }} />
      </div>

      {/* Active listings */}
      {listings.filter(l => l.active).length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {listings.filter(l => l.active).map(l => (
            <span key={l.id} className="text-xs px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(0,212,170,0.1)', color: 'var(--accent)', border: '1px solid rgba(0,212,170,0.2)' }}>
              {l.name} · {iskFormat(l.pricePerDay)}/dag
            </span>
          ))}
        </div>
      )}

      {/* Add entry form */}
      {adding && (
        <form onSubmit={handleAdd} className="flex gap-2 mt-2">
          <input
            className="input flex-1"
            type="number"
            placeholder="Upphæð (kr)"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            autoFocus
            style={{ fontSize: 13 }}
          />
          <button type="submit" className="btn btn-primary" style={{ fontSize: 13, padding: '8px 14px' }}>
            +
          </button>
        </form>
      )}
    </div>
  )
}
