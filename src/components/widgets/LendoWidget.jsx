import { useState } from 'react'
import { useLendo, LENDO_ITEMS } from '../../hooks/useLendo'
import { formatShortISK } from '../../utils/currency'
import { Link } from 'react-router-dom'
import { ChevronRight, Plus, X, Flame } from 'lucide-react'

const C = '#f59e0b'

export default function LendoWidget() {
  const { monthlyEarnings, goal, currentMonth, addRental, streak } = useLendo()
  const [open, setOpen] = useState(false)
  const [item, setItem] = useState(LENDO_ITEMS[0])
  const [days, setDays] = useState('1')
  const [amount, setAmount] = useState('7000')
  const [note, setNote] = useState('')

  const earned = monthlyEarnings()
  const pct    = Math.min(100, Math.round((earned / goal) * 100))
  const count  = currentMonth().length
  const s      = streak()

  const handleAdd = (e) => {
    e.preventDefault()
    if (!amount) return
    addRental(item, days, amount, note)
    setDays('1'); setAmount('7000'); setNote('')
    setOpen(false)
  }

  return (
    <div className="card" style={{
      background: 'linear-gradient(135deg, rgba(245,158,11,0.08), rgba(217,119,6,0.05))',
      border: `1px solid rgba(245,158,11,0.22)`,
    }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">🏠</span>
          <span className="font-semibold text-sm">Lendó</span>
          {count > 0 && (
            <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{ background: 'rgba(245,158,11,0.15)', color: C }}>
              {count} leiga{count !== 1 ? 'r' : ''}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {s > 0 && (
            <span className="flex items-center gap-0.5 text-xs font-semibold"
                  style={{ color: '#f97316' }}>
              <Flame size={12} />{s}
            </span>
          )}
          <Link to="/lendo" className="flex items-center gap-0.5 text-xs" style={{ color: C }}>
            Sjá allt <ChevronRight size={12} />
          </Link>
        </div>
      </div>

      <div className="flex justify-between items-end mb-2">
        <div>
          <div className="text-2xl font-bold" style={{ color: C }}>{formatShortISK(earned)}</div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
            af {formatShortISK(goal)} markmiðs
          </div>
        </div>
        <div className="text-xl font-bold" style={{ color: pct >= 100 ? 'var(--success)' : C }}>
          {pct}%
        </div>
      </div>

      <div className="h-2 rounded-full overflow-hidden mb-3" style={{ background: 'var(--surface2)' }}>
        <div className="h-full rounded-full transition-all duration-700"
             style={{ width: `${pct}%`, background: pct >= 100 ? 'var(--success)' : `linear-gradient(90deg, ${C}, #f97316)` }} />
      </div>

      {open ? (
        <form onSubmit={handleAdd} className="flex flex-col gap-2 pt-2 animate-slide-up"
              style={{ borderTop: '1px solid var(--border)' }}>
          <select className="input text-sm" value={item} onChange={e => setItem(e.target.value)}>
            {LENDO_ITEMS.map(i => <option key={i} value={i}>{i}</option>)}
          </select>
          <div className="flex gap-2">
            <input className="input text-sm" type="number" placeholder="Dagar" min="1"
              value={days} onChange={e => setDays(e.target.value)} style={{ width: 72 }} />
            <input className="input text-sm flex-1" type="number" placeholder="Upphæð (ISK)"
              value={amount} onChange={e => setAmount(e.target.value)} />
          </div>
          <input className="input text-sm" placeholder="Athugasemd (valkvæmt)"
            value={note} onChange={e => setNote(e.target.value)} />
          <div className="flex gap-2">
            <button type="submit" className="btn flex-1 justify-center text-sm font-semibold"
                    style={{ background: C, color: '#000' }}>
              <Plus size={14} /> Skrá
            </button>
            <button type="button" onClick={() => setOpen(false)} className="btn btn-ghost px-3">
              <X size={14} />
            </button>
          </div>
        </form>
      ) : (
        <button onClick={() => setOpen(true)}
          className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-medium transition-all"
          style={{ background: 'rgba(245,158,11,0.1)', color: C, border: '1px dashed rgba(245,158,11,0.35)' }}>
          <Plus size={14} /> Skrá nýja leigu
        </button>
      )}
    </div>
  )
}
