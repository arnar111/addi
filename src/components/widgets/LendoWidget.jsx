import { useIncome } from '../../hooks/useIncome'
import { formatShortISK } from '../../utils/currency'
import { Link } from 'react-router-dom'
import { ChevronRight, Plus } from 'lucide-react'
import { useState } from 'react'

export default function LendoWidget() {
  const { lendoTotal, lendoCount, goal, add } = useIncome()
  const [showQuick, setShowQuick] = useState(false)
  const [amount, setAmount] = useState('')

  const total = lendoTotal()
  const count = lendoCount()
  const pct = goal ? Math.min(100, Math.round((total / goal) * 100)) : 0

  const handleQuickAdd = (e) => {
    e.preventDefault()
    if (!amount || isNaN(Number(amount))) return
    add(Number(amount), 'lendo', '')
    setAmount('')
    setShowQuick(false)
  }

  return (
    <div className="card" style={{
      background: 'linear-gradient(135deg, rgba(0,212,170,0.1), rgba(0,212,170,0.04))',
      border: '1px solid rgba(0,212,170,0.25)',
    }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">🏠</span>
          <h3 className="font-semibold text-sm">Lendó</h3>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowQuick(!showQuick)}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
            style={{ background: 'rgba(0,212,170,0.15)', color: 'var(--accent)' }}>
            <Plus size={14} />
          </button>
          <Link to="/finance" className="flex items-center gap-0.5 text-xs" style={{ color: 'var(--accent)' }}>
            Sjá <ChevronRight size={12} />
          </Link>
        </div>
      </div>

      {showQuick && (
        <form onSubmit={handleQuickAdd} className="flex gap-2 mb-3">
          <input className="input text-sm flex-1" type="number" placeholder="Upphæð leigu (ISK)"
            value={amount} onChange={e => setAmount(e.target.value)} autoFocus />
          <button type="submit" className="btn btn-primary shrink-0" style={{ padding: '8px 12px' }}>
            <Plus size={14} />
          </button>
        </form>
      )}

      <div className="flex justify-between items-end mb-2">
        <div>
          <div className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>{formatShortISK(total)}</div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
            {count} leiga{count !== 1 ? 'r' : ''} þennan mánuð
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs" style={{ color: 'var(--muted)' }}>Markmið</div>
          <div className="text-sm font-semibold">{formatShortISK(goal)}</div>
        </div>
      </div>

      <div className="h-2 rounded-full overflow-hidden mb-1" style={{ background: 'var(--surface2)' }}>
        <div className="h-full rounded-full transition-all duration-700"
             style={{ width: `${pct}%`, background: pct >= 100 ? 'var(--success)' : 'var(--accent)' }} />
      </div>
      <div className="text-xs" style={{ color: 'var(--muted)' }}>
        {pct}% af mánaðarmarkmiði
        {pct >= 100 && <span style={{ color: 'var(--success)' }}> · 🎉 Náð!</span>}
      </div>
    </div>
  )
}
