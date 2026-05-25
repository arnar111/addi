import { useState } from 'react'
import { useFinance } from '../../hooks/useFinance'
import { formatShortISK, INCOME_CATEGORIES } from '../../utils/currency'
import { Link } from 'react-router-dom'
import { ChevronRight, Plus, TrendingUp } from 'lucide-react'

export default function LendoWidget() {
  const { monthlyIncome, incomeGoal, currentMonthIncomes, addIncome } = useFinance()
  const [showQuickAdd, setShowQuickAdd] = useState(false)
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')

  const income = monthlyIncome()
  const goal = incomeGoal
  const pct = Math.min(100, Math.round((income / goal) * 100))

  const monthIncomes = currentMonthIncomes()
  const lendo = monthIncomes.filter(i => i.category === 'lendo').reduce((s, i) => s + i.amount, 0)
  const other = income - lendo

  const handleQuickAdd = (e) => {
    e.preventDefault()
    if (!amount || isNaN(Number(amount))) return
    addIncome(Number(amount), 'lendo', note || '')
    setAmount(''); setNote(''); setShowQuickAdd(false)
  }

  return (
    <div className="card" style={{
      background: 'linear-gradient(135deg, rgba(0,212,170,0.08), rgba(0,212,170,0.02))',
      border: '1px solid rgba(0,212,170,0.2)'
    }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
               style={{ background: 'rgba(0,212,170,0.15)' }}>
            <span className="text-base">🏠</span>
          </div>
          <div>
            <h3 className="font-semibold text-sm">Lendo tekjur</h3>
            <p className="text-xs" style={{ color: 'var(--muted)' }}>
              {new Date().toLocaleDateString('is-IS', { month: 'long' })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowQuickAdd(!showQuickAdd)}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
            style={{ background: 'rgba(0,212,170,0.15)', color: 'var(--accent)' }}>
            <Plus size={14} />
          </button>
          <Link to="/finance" className="flex items-center gap-0.5 text-xs" style={{ color: 'var(--accent)' }}>
            <ChevronRight size={14} />
          </Link>
        </div>
      </div>

      {showQuickAdd && (
        <form onSubmit={handleQuickAdd} className="flex flex-col gap-2 mb-3 p-3 rounded-xl"
              style={{ background: 'var(--surface2)' }}>
          <input
            className="input text-sm"
            type="number"
            placeholder="Upphæð (ISK)"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            autoFocus
          />
          <input
            className="input text-sm"
            placeholder="Skýring (t.d. borð + stólar)"
            value={note}
            onChange={e => setNote(e.target.value)}
          />
          <button type="submit" className="btn w-full justify-center text-sm"
                  style={{ background: 'var(--accent)', color: '#000' }}>
            Skrá Lendo leiga
          </button>
        </form>
      )}

      <div className="flex justify-between items-end mb-3">
        <div>
          <div className="text-2xl font-semibold" style={{ color: 'var(--accent)' }}>
            {formatShortISK(income)}
          </div>
          <div className="flex items-center gap-1 text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
            <TrendingUp size={11} />
            af {formatShortISK(goal)} marki
          </div>
        </div>
        {lendo > 0 && (
          <div className="text-right">
            <div className="text-sm font-medium">🏠 {formatShortISK(lendo)}</div>
            {other > 0 && <div className="text-xs" style={{ color: 'var(--muted)' }}>+ {formatShortISK(other)} annað</div>}
          </div>
        )}
        {income === 0 && (
          <div className="text-xs text-right" style={{ color: 'var(--muted)' }}>
            Smelltu á + til að<br />skrá tekju
          </div>
        )}
      </div>

      <div className="h-2 rounded-full overflow-hidden mb-1.5" style={{ background: 'var(--surface2)' }}>
        <div className="h-full rounded-full transition-all duration-700"
             style={{ width: `${pct}%`, background: pct >= 100 ? '#22c55e' : 'var(--accent)' }} />
      </div>
      <div className="flex justify-between text-xs" style={{ color: 'var(--muted)' }}>
        <span>{pct}% af marki</span>
        <span>{monthIncomes.length} leiga{monthIncomes.length === 1 ? '' : 'r'} í mánuðinum</span>
      </div>
    </div>
  )
}
