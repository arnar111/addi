import { useState } from 'react'
import { useIncome, INCOME_SOURCES } from '../../hooks/useIncome'
import { formatShortISK } from '../../utils/currency'
import { Link } from 'react-router-dom'
import { Plus, ChevronRight, X } from 'lucide-react'

export default function IncomeWidget() {
  const { monthlyTotal, goalProgress, rentalGoal, addIncome } = useIncome()
  const [showQuick, setShowQuick] = useState(false)
  const [amount, setAmount] = useState('')
  const [source, setSource] = useState('lendo')
  const [note, setNote] = useState('')

  const total = monthlyTotal()
  const pct = goalProgress()
  const remaining = rentalGoal - total

  const handleAdd = (e) => {
    e.preventDefault()
    if (!amount || isNaN(Number(amount))) return
    addIncome(Number(amount), source, note)
    setAmount('')
    setNote('')
    setShowQuick(false)
  }

  const quickAmounts = [7000, 10000, 15000, 20000]

  return (
    <div className="card" style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.08), rgba(0,212,170,0.03))', border: '1px solid rgba(0,212,170,0.2)' }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-base">🏷️</span>
          <h3 className="font-semibold text-sm">Tekjur í mánuði</h3>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowQuick(!showQuick)}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
            style={{ background: showQuick ? 'rgba(0,212,170,0.2)' : 'var(--surface2)', color: showQuick ? 'var(--accent)' : 'var(--muted)' }}>
            {showQuick ? <X size={14} /> : <Plus size={14} />}
          </button>
          <Link to="/finance?tab=tekjur" className="flex items-center gap-0.5 text-xs" style={{ color: 'var(--accent)' }}>
            <ChevronRight size={14} />
          </Link>
        </div>
      </div>

      <div className="flex items-end justify-between mb-2">
        <div>
          <div className="text-2xl font-semibold" style={{ color: 'var(--accent)' }}>{formatShortISK(total)}</div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>
            af {formatShortISK(rentalGoal)} marki · {remaining > 0 ? `${formatShortISK(remaining)} eftir` : 'Mark náð! 🎉'}
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold" style={{ color: pct >= 100 ? 'var(--success)' : pct >= 50 ? 'var(--accent)' : 'var(--muted)' }}>
            {pct}%
          </div>
        </div>
      </div>

      <div className="h-2 rounded-full overflow-hidden mb-3" style={{ background: 'var(--surface2)' }}>
        <div className="h-full rounded-full transition-all duration-700"
             style={{
               width: `${pct}%`,
               background: pct >= 100
                 ? 'var(--success)'
                 : `linear-gradient(90deg, var(--accent), #00f5c4)`,
             }} />
      </div>

      {showQuick && (
        <form onSubmit={handleAdd} className="flex flex-col gap-2 pt-2 animate-slide-up" style={{ borderTop: '1px solid var(--border)' }}>
          <div className="flex flex-wrap gap-1.5">
            {quickAmounts.map(a => (
              <button key={a} type="button" onClick={() => setAmount(String(a))}
                className="px-3 py-1 rounded-lg text-xs font-medium transition-all"
                style={{
                  background: amount === String(a) ? 'rgba(0,212,170,0.2)' : 'var(--surface2)',
                  color: amount === String(a) ? 'var(--accent)' : 'var(--muted)',
                  border: `1px solid ${amount === String(a) ? 'rgba(0,212,170,0.4)' : 'transparent'}`,
                }}>
                {formatShortISK(a)}
              </button>
            ))}
          </div>
          <input className="input text-sm" type="number" placeholder="Upphæð (ISK)"
            value={amount} onChange={e => setAmount(e.target.value)} />
          <div className="flex gap-1.5">
            {INCOME_SOURCES.map(s => (
              <button key={s.id} type="button" onClick={() => setSource(s.id)}
                className="flex-1 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={{
                  background: source === s.id ? `${s.color}22` : 'var(--surface2)',
                  color: source === s.id ? s.color : 'var(--muted)',
                  border: `1px solid ${source === s.id ? s.color + '44' : 'transparent'}`,
                }}>
                {s.icon} {s.label}
              </button>
            ))}
          </div>
          <input className="input text-sm" placeholder="Minnismiði (valkvæmt)" value={note} onChange={e => setNote(e.target.value)} />
          <button type="submit" className="btn btn-primary w-full justify-center text-sm py-2">
            <Plus size={14} /> Skrá tekjur
          </button>
        </form>
      )}
    </div>
  )
}
