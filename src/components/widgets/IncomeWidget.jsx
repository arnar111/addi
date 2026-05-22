import { useState } from 'react'
import { useIncome } from '../../hooks/useIncome'
import { formatShortISK } from '../../utils/currency'
import { Link } from 'react-router-dom'
import { ChevronRight, Plus, X } from 'lucide-react'

export default function IncomeWidget() {
  const { monthlyTotal, monthlyGoal, add } = useIncome()
  const [showAdd, setShowAdd] = useState(false)
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')

  const total = monthlyTotal()
  const pct = Math.min(100, Math.round((total / monthlyGoal) * 100))

  const handleAdd = (e) => {
    e.preventDefault()
    if (!amount || isNaN(Number(amount))) return
    add(Number(amount), 'lendo', note)
    setAmount('')
    setNote('')
    setShowAdd(false)
  }

  const barColor = pct >= 100 ? 'var(--success)' : pct >= 50 ? 'var(--accent)' : '#f97316'

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-base">🏠</span>
          <h3 className="font-semibold text-sm">Lendó Tekjur</h3>
        </div>
        <div className="flex items-center gap-1.5">
          <button onClick={() => setShowAdd(s => !s)} className="p-1.5 rounded-lg transition-all"
                  style={{ background: showAdd ? 'rgba(0,212,170,0.12)' : 'transparent', color: showAdd ? 'var(--accent)' : 'var(--muted)' }}>
            {showAdd ? <X size={14} /> : <Plus size={14} />}
          </button>
          <Link to="/finance" className="flex items-center gap-0.5 text-xs" style={{ color: 'var(--accent)' }}>
            Sjá allt <ChevronRight size={12} />
          </Link>
        </div>
      </div>

      {showAdd && (
        <form onSubmit={handleAdd} className="flex gap-2 mb-3 animate-slide-up">
          <input className="input text-sm" type="number" placeholder="Upphæð (ISK)"
                 value={amount} onChange={e => setAmount(e.target.value)} autoFocus />
          <input className="input text-sm" placeholder="Lýsing"
                 value={note} onChange={e => setNote(e.target.value)} />
          <button type="submit" className="btn btn-primary shrink-0" style={{ padding: '8px 12px' }}>
            <Plus size={14} />
          </button>
        </form>
      )}

      <div className="flex justify-between items-end mb-2">
        <div>
          <div className="text-2xl font-semibold" style={{ color: 'var(--success)' }}>
            {formatShortISK(total)}
          </div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
            af {formatShortISK(monthlyGoal)} markmiði
          </div>
        </div>
        <div className="text-right">
          <div className="text-xl font-bold" style={{ color: barColor }}>{pct}%</div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>náð</div>
        </div>
      </div>

      <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'var(--surface2)' }}>
        <div className="h-full rounded-full transition-all duration-700"
             style={{ width: `${pct}%`, background: barColor }} />
      </div>
    </div>
  )
}
