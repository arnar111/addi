import { useState } from 'react'
import { useLendo } from '../../hooks/useLendo'
import { formatISK, formatShortISK } from '../../utils/currency'
import { Plus, TrendingUp, X } from 'lucide-react'

export default function LendoWidget({ compact = false }) {
  const { monthlyTotal, goal, currentMonth, monthlyCount, projection, daysLeft, add } = useLendo()
  const [showAdd, setShowAdd] = useState(false)
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')

  const pct = Math.min(100, Math.round((monthlyTotal / goal) * 100))
  const onTrack = projection >= goal

  const handleAdd = (e) => {
    e.preventDefault()
    if (!amount || isNaN(Number(amount))) return
    add(Number(amount), note || '7.000 kr leiga')
    setAmount('')
    setNote('')
    setShowAdd(false)
  }

  return (
    <div className="card" style={{ background: 'linear-gradient(135deg, rgba(0,180,216,0.08), rgba(0,212,170,0.05))' }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-base"
               style={{ background: 'rgba(0,180,216,0.15)' }}>🏠</div>
          <span className="font-semibold text-sm">Lendó</span>
          <span className="badge text-xs" style={{ background: 'rgba(0,180,216,0.12)', color: 'var(--lendo)' }}>
            {monthlyCount} {monthlyCount === 1 ? 'leiga' : 'leigur'}
          </span>
        </div>
        <button onClick={() => setShowAdd(!showAdd)}
          className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
          style={{ background: showAdd ? 'rgba(0,180,216,0.2)' : 'rgba(0,180,216,0.1)', color: 'var(--lendo)' }}>
          {showAdd ? <X size={14} /> : <Plus size={14} />}
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleAdd} className="flex flex-col gap-2 mb-3 p-3 rounded-xl animate-slide-up"
              style={{ background: 'var(--surface2)' }}>
          <input className="input text-sm" type="number" placeholder="Upphæð (t.d. 7000)" value={amount}
                 onChange={e => setAmount(e.target.value)} autoFocus />
          <input className="input text-sm" placeholder="Skýring (valkvæmt)" value={note}
                 onChange={e => setNote(e.target.value)} />
          <div className="flex gap-2">
            {[7000, 10000, 14000, 21000].map(v => (
              <button key={v} type="button" onClick={() => setAmount(String(v))}
                className="flex-1 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={{ background: amount === String(v) ? 'rgba(0,180,216,0.2)' : 'var(--surface)', color: amount === String(v) ? 'var(--lendo)' : 'var(--muted)', border: '1px solid var(--border)' }}>
                {formatShortISK(v)}
              </button>
            ))}
          </div>
          <button type="submit" className="btn btn-primary w-full justify-center text-sm">Skrá tekjur</button>
        </form>
      )}

      <div className="flex items-end justify-between mb-2">
        <div>
          <div className="text-2xl font-bold" style={{ color: 'var(--lendo)' }}>{formatShortISK(monthlyTotal)}</div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>af {formatShortISK(goal)} mánaðarmarki</div>
        </div>
        <div className="flex items-center gap-1 text-xs" style={{ color: onTrack ? 'var(--success)' : 'var(--muted)' }}>
          <TrendingUp size={13} />
          <span>~{formatShortISK(projection)}</span>
        </div>
      </div>

      <div className="progress-bar mb-1.5">
        <div className="progress-fill" style={{ width: `${pct}%`, background: pct >= 100 ? 'var(--success)' : 'var(--lendo)' }} />
      </div>
      <div className="flex justify-between text-xs" style={{ color: 'var(--muted)' }}>
        <span style={{ color: pct >= 100 ? 'var(--success)' : undefined }}>{pct}% náð</span>
        <span>{daysLeft} {daysLeft === 1 ? 'dagur' : 'dagar'} eftir</span>
      </div>
    </div>
  )
}
