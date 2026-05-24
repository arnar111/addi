import { useState } from 'react'
import { Plus, X, TrendingUp, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useIncome, INCOME_CATEGORIES } from '../../hooks/useIncome'
import { formatShortISK, formatISK } from '../../utils/currency'

export default function IncomeWidget() {
  const { incomes, add, remove, monthlyTotal, incomeGoal } = useIncome()
  const [showForm, setShowForm] = useState(false)
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('lendo')
  const [note, setNote] = useState('')

  const total = monthlyTotal()
  const goal = incomeGoal.monthly || 200000
  const pct = Math.min(100, Math.round((total / goal) * 100))
  const recent = incomes.slice(0, 3)

  const handleAdd = (e) => {
    e.preventDefault()
    if (!amount || isNaN(Number(amount))) return
    add(Number(amount), category, note)
    setAmount('')
    setNote('')
    setShowForm(false)
  }

  return (
    <div className="card" style={{
      background: 'linear-gradient(135deg, rgba(0,212,170,0.06), rgba(59,130,246,0.04))',
    }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <TrendingUp size={15} style={{ color: 'var(--accent)' }} />
          <span className="font-semibold text-sm">Lendó tekjur</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right">
            <div className="text-base font-bold" style={{ color: 'var(--accent)' }}>
              {formatShortISK(total)}
            </div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>
              af {formatShortISK(goal)} markmið
            </div>
          </div>
          <button onClick={() => setShowForm(!showForm)}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
            style={{ background: showForm ? 'var(--surface2)' : 'rgba(0,212,170,0.15)', color: 'var(--accent)' }}>
            {showForm ? <X size={13} /> : <Plus size={13} />}
          </button>
        </div>
      </div>

      <div className="h-2 rounded-full overflow-hidden mb-1" style={{ background: 'var(--surface2)' }}>
        <div className="h-full rounded-full transition-all duration-500"
             style={{ width: `${pct}%`, background: pct >= 100 ? 'var(--success)' : 'var(--accent)' }} />
      </div>
      <div className="text-xs mb-3" style={{ color: 'var(--muted)' }}>
        {pct}% af mánaðarmarkmiði
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="flex flex-col gap-2 mb-3 p-3 rounded-xl animate-slide-up"
              style={{ background: 'var(--surface2)' }}>
          <div className="flex gap-2">
            <input className="input text-sm flex-1" type="number" placeholder="Upphæð (ISK)"
              value={amount} onChange={e => setAmount(e.target.value)} autoFocus />
            <input className="input text-sm flex-1" placeholder="Skýring" value={note}
              onChange={e => setNote(e.target.value)} />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {INCOME_CATEGORIES.map(c => (
              <button key={c.id} type="button" onClick={() => setCategory(c.id)}
                className="text-xs px-2.5 py-1 rounded-lg font-medium transition-all"
                style={{
                  background: category === c.id ? `${c.color}22` : 'var(--surface)',
                  color: category === c.id ? c.color : 'var(--muted)',
                  border: `1px solid ${category === c.id ? c.color + '44' : 'transparent'}`,
                }}>
                {c.icon} {c.label}
              </button>
            ))}
          </div>
          <button type="submit" className="btn btn-primary w-full justify-center text-sm py-2">
            Skrá tekjur
          </button>
        </form>
      )}

      {recent.length > 0 && (
        <div className="flex flex-col gap-1.5">
          {recent.map(i => {
            const cat = INCOME_CATEGORIES.find(c => c.id === i.category) || INCOME_CATEGORIES[3]
            return (
              <div key={i.id} className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl"
                   style={{ background: 'var(--surface2)' }}>
                <span className="text-sm">{cat.icon}</span>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-medium" style={{ color: cat.color }}>
                    +{formatShortISK(i.amount)}
                  </span>
                  {i.note && <span className="text-xs ml-1" style={{ color: 'var(--muted)' }}>{i.note}</span>}
                </div>
                <span className="text-xs shrink-0" style={{ color: 'var(--muted)' }}>
                  {new Date(i.date).toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })}
                </span>
                <button onClick={() => remove(i.id)} style={{ color: 'var(--muted)', padding: 2 }}>
                  <Trash2 size={11} />
                </button>
              </div>
            )
          })}
        </div>
      )}

      {recent.length === 0 && !showForm && (
        <p className="text-xs text-center py-2" style={{ color: 'var(--muted)' }}>
          Skrá fyrstu Lendó tekjurnar 💰
        </p>
      )}
    </div>
  )
}
