import { useState } from 'react'
import { useFinance } from '../hooks/useFinance'
import { useIncome, INCOME_SOURCES } from '../hooks/useIncome'
import { formatISK, formatShortISK, EXPENSE_CATEGORIES } from '../utils/currency'
import { Plus, Trash2, X, TrendingDown, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react'

function CategoryBar({ cat, spent, budget }) {
  const pct = budget ? Math.min(100, Math.round((spent / budget) * 100)) : 0
  const isOver = spent > budget && budget > 0
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between text-xs">
        <span>{cat.icon} {cat.label}</span>
        <span style={{ color: isOver ? 'var(--danger)' : 'var(--muted)' }}>
          {formatShortISK(spent)} {budget ? `/ ${formatShortISK(budget)}` : ''}
        </span>
      </div>
      {budget > 0 && (
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--surface2)' }}>
          <div className="h-full rounded-full transition-all"
            style={{ width: `${pct}%`, background: isOver ? 'var(--danger)' : cat.color }} />
        </div>
      )}
    </div>
  )
}

export default function Finance() {
  const { addExpense, removeExpense, budget, setBudget, monthlyTotal, byCategory, remaining, recentExpenses } = useFinance()
  const { income, add: addIncome, remove: removeIncome, currentMonth: currentMonthIncome, monthlyTotal: incomeMonthlyTotal, bySource: incomeBySource } = useIncome()
  const [showExpenseForm, setShowExpenseForm] = useState(false)
  const [showIncomeForm, setShowIncomeForm] = useState(false)
  const [showBudgetEdit, setShowBudgetEdit] = useState(false)
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('food')
  const [note, setNote] = useState('')
  const [incomeAmount, setIncomeAmount] = useState('')
  const [incomeSource, setIncomeSource] = useState('lendo')
  const [incomeNote, setIncomeNote] = useState('')
  const [tab, setTab] = useState('overview')

  const total = monthlyTotal()
  const cats = byCategory()
  const left = remaining()
  const isOver = left < 0
  const pct = Math.min(100, Math.round((total / budget.monthly) * 100))
  const totalIncome = incomeMonthlyTotal()
  const netBalance = totalIncome - total

  const handleAddExpense = (e) => {
    e.preventDefault()
    if (!amount || isNaN(Number(amount))) return
    addExpense(Number(amount), category, note)
    setAmount('')
    setNote('')
    setShowExpenseForm(false)
  }

  const handleAddIncome = (e) => {
    e.preventDefault()
    if (!incomeAmount || isNaN(Number(incomeAmount))) return
    addIncome(Number(incomeAmount), incomeSource, incomeNote)
    setIncomeAmount('')
    setIncomeNote('')
    setShowIncomeForm(false)
  }

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold">Fjármál</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            {new Date().toLocaleDateString('is-IS', { month: 'long', year: 'numeric' })}
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => { setShowIncomeForm(!showIncomeForm); setShowExpenseForm(false) }}
            className="btn" style={{ background: 'rgba(34,197,94,0.12)', color: 'var(--success)', border: '1px solid rgba(34,197,94,0.2)' }}>
            <ArrowUpRight size={16} /> Tekjur
          </button>
          <button onClick={() => { setShowExpenseForm(!showExpenseForm); setShowIncomeForm(false) }}
            className="btn btn-primary">
            <Plus size={16} /> Gjald
          </button>
        </div>
      </div>

      {/* Net balance + overview */}
      <div className="grid grid-cols-3 gap-2">
        <div className="card py-3 text-center">
          <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Tekjur</div>
          <div className="text-base font-semibold" style={{ color: 'var(--success)' }}>{formatShortISK(totalIncome)}</div>
        </div>
        <div className="card py-3 text-center">
          <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Útgjöld</div>
          <div className="text-base font-semibold" style={{ color: isOver ? 'var(--danger)' : 'var(--text)' }}>{formatShortISK(total)}</div>
        </div>
        <div className="card py-3 text-center">
          <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Nettó</div>
          <div className="text-base font-semibold" style={{ color: netBalance >= 0 ? 'var(--success)' : 'var(--danger)' }}>
            {netBalance >= 0 ? '+' : ''}{formatShortISK(netBalance)}
          </div>
        </div>
      </div>

      {/* Budget progress */}
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.06), rgba(139,92,246,0.06))' }}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Útgjöld þessa mánaðar</div>
            <div className="text-3xl font-semibold">{formatISK(total)}</div>
          </div>
          <div className="flex flex-col items-end">
            <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Eftir af fjárhagsáætlun</div>
            <div className="text-lg font-semibold" style={{ color: isOver ? 'var(--danger)' : 'var(--success)' }}>
              {isOver ? '-' : ''}{formatISK(Math.abs(left))}
            </div>
          </div>
        </div>
        <div className="h-2.5 rounded-full overflow-hidden mb-1" style={{ background: 'var(--surface2)' }}>
          <div className="h-full rounded-full transition-all"
            style={{ width: `${pct}%`, background: isOver ? 'var(--danger)' : pct > 80 ? '#f97316' : 'var(--accent)' }} />
        </div>
        <div className="flex justify-between text-xs" style={{ color: 'var(--muted)' }}>
          <span>{pct}% notað</span>
          <span>Fjárhagsáætlun: {formatISK(budget.monthly)}</span>
        </div>
      </div>

      {/* Add expense form */}
      {showExpenseForm && (
        <form onSubmit={handleAddExpense} className="card flex flex-col gap-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Bæta við gjaldi</h3>
            <button type="button" onClick={() => setShowExpenseForm(false)}><X size={16} style={{ color: 'var(--muted)' }} /></button>
          </div>
          <input className="input" type="number" placeholder="Upphæð (ISK)" value={amount}
            onChange={e => setAmount(e.target.value)} autoFocus />
          <input className="input" placeholder="Skýring (valkvæmt)" value={note}
            onChange={e => setNote(e.target.value)} />
          <div className="grid grid-cols-4 gap-1.5">
            {EXPENSE_CATEGORIES.map(c => (
              <button key={c.id} type="button" onClick={() => setCategory(c.id)}
                className="flex flex-col items-center gap-0.5 py-2 rounded-xl text-xs transition-all"
                style={{
                  background: category === c.id ? `${c.color}22` : 'var(--surface2)',
                  border: `1px solid ${category === c.id ? c.color + '55' : 'transparent'}`,
                }}>
                <span>{c.icon}</span>
                <span style={{ color: category === c.id ? c.color : 'var(--muted)', fontSize: 10 }}>{c.label}</span>
              </button>
            ))}
          </div>
          <button type="submit" className="btn btn-primary w-full justify-center">Bæta við gjaldi</button>
        </form>
      )}

      {/* Add income form */}
      {showIncomeForm && (
        <form onSubmit={handleAddIncome} className="card flex flex-col gap-3 animate-slide-up"
          style={{ border: '1px solid rgba(34,197,94,0.2)' }}>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm" style={{ color: 'var(--success)' }}>Skrá tekjur</h3>
            <button type="button" onClick={() => setShowIncomeForm(false)}><X size={16} style={{ color: 'var(--muted)' }} /></button>
          </div>
          <input className="input" type="number" placeholder="Upphæð (ISK)" value={incomeAmount}
            onChange={e => setIncomeAmount(e.target.value)} autoFocus />
          <input className="input" placeholder="Skýring (valkvæmt)" value={incomeNote}
            onChange={e => setIncomeNote(e.target.value)} />
          <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-5">
            {INCOME_SOURCES.map(s => (
              <button key={s.id} type="button" onClick={() => setIncomeSource(s.id)}
                className="flex flex-col items-center gap-0.5 py-2 rounded-xl text-xs transition-all"
                style={{
                  background: incomeSource === s.id ? `${s.color}22` : 'var(--surface2)',
                  border: `1px solid ${incomeSource === s.id ? s.color + '55' : 'transparent'}`,
                }}>
                <span>{s.icon}</span>
                <span style={{ color: incomeSource === s.id ? s.color : 'var(--muted)', fontSize: 10 }}>{s.label}</span>
              </button>
            ))}
          </div>
          <button type="submit" className="btn w-full justify-center"
            style={{ background: 'rgba(34,197,94,0.15)', color: 'var(--success)', border: '1px solid rgba(34,197,94,0.3)' }}>
            <ArrowUpRight size={14} /> Skrá tekjur
          </button>
        </form>
      )}

      {/* Tabs */}
      <div className="flex gap-2">
        {[['overview', 'Yfirlit'], ['transactions', 'Gjöld'], ['income', 'Tekjur']].map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)}
            className="btn text-sm flex-1 justify-center"
            style={{
              background: tab === t ? 'rgba(0,212,170,0.12)' : 'var(--surface)',
              color: tab === t ? 'var(--accent)' : 'var(--muted)',
              border: `1px solid ${tab === t ? 'rgba(0,212,170,0.25)' : 'var(--border)'}`,
            }}>{l}</button>
        ))}
      </div>

      {/* Overview tab */}
      {tab === 'overview' && (
        <div className="card flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Eftir flokkum</h3>
            <button onClick={() => setShowBudgetEdit(!showBudgetEdit)} className="text-xs"
              style={{ color: 'var(--accent)' }}>Breyta fjárhagsáætlun</button>
          </div>
          {showBudgetEdit && (
            <div className="flex flex-col gap-2 p-3 rounded-xl" style={{ background: 'var(--surface2)' }}>
              <div className="text-xs font-medium mb-1" style={{ color: 'var(--muted)' }}>Mánaðarleg fjárhagsáætlun (ISK)</div>
              <input className="input text-sm" type="number" value={budget.monthly}
                onChange={e => setBudget(b => ({ ...b, monthly: Number(e.target.value) }))} />
              <div className="grid grid-cols-2 gap-2">
                {EXPENSE_CATEGORIES.map(c => (
                  <div key={c.id} className="flex flex-col gap-0.5">
                    <label className="text-xs" style={{ color: 'var(--muted)' }}>{c.icon} {c.label}</label>
                    <input className="input text-xs py-1.5" type="number"
                      value={budget.categories[c.id] || ''}
                      onChange={e => setBudget(b => ({ ...b, categories: { ...b.categories, [c.id]: Number(e.target.value) } }))} />
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="flex flex-col gap-3">
            {EXPENSE_CATEGORIES.map(c => (
              <CategoryBar key={c.id} cat={c} spent={cats[c.id] || 0} budget={budget.categories[c.id]} />
            ))}
          </div>
        </div>
      )}

      {/* Transactions tab */}
      {tab === 'transactions' && (
        <div className="flex flex-col gap-2">
          {recentExpenses.length === 0 ? (
            <div className="card text-center py-8" style={{ color: 'var(--muted)' }}>Engar færslur ennþá</div>
          ) : recentExpenses.map(e => {
            const cat = EXPENSE_CATEGORIES.find(c => c.id === e.category) || EXPENSE_CATEGORIES[7]
            return (
              <div key={e.id} className="card flex items-center gap-3 py-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-base"
                  style={{ background: `${cat.color}22` }}>{cat.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">{formatISK(e.amount)}</div>
                  <div className="text-xs" style={{ color: 'var(--muted)' }}>
                    {cat.label}{e.note ? ` · ${e.note}` : ''} · {new Date(e.date).toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
                <button onClick={() => removeExpense(e.id)} style={{ color: 'var(--muted)' }}><Trash2 size={14} /></button>
              </div>
            )
          })}
        </div>
      )}

      {/* Income tab */}
      {tab === 'income' && (
        <div className="flex flex-col gap-2">
          <div className="card" style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.15)' }}>
            <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Heildartekjur þessa mánaðar</div>
            <div className="text-2xl font-semibold" style={{ color: 'var(--success)' }}>{formatISK(totalIncome)}</div>
            {totalIncome > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {Object.entries(incomeBySource()).map(([src, amt]) => {
                  const s = INCOME_SOURCES.find(x => x.id === src)
                  return s ? (
                    <span key={src} className="text-xs flex items-center gap-1 px-2 py-1 rounded-full"
                      style={{ background: `${s.color}15`, color: s.color }}>
                      {s.icon} {s.label}: {formatShortISK(amt)}
                    </span>
                  ) : null
                })}
              </div>
            )}
          </div>
          {currentMonthIncome().length === 0 ? (
            <div className="card text-center py-8" style={{ color: 'var(--muted)' }}>
              <p>Engar tekjur skráðar þennan mánuð</p>
              <button onClick={() => { setShowIncomeForm(true); setTab('overview') }}
                className="btn btn-primary mt-3 mx-auto">
                <Plus size={14} /> Skrá tekjur
              </button>
            </div>
          ) : currentMonthIncome().map(i => {
            const src = INCOME_SOURCES.find(s => s.id === i.source) || INCOME_SOURCES[4]
            return (
              <div key={i.id} className="card flex items-center gap-3 py-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-base"
                  style={{ background: `${src.color}22` }}>{src.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold" style={{ color: 'var(--success)' }}>+{formatISK(i.amount)}</div>
                  <div className="text-xs" style={{ color: 'var(--muted)' }}>
                    {src.label}{i.note ? ` · ${i.note}` : ''} · {new Date(i.date).toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
                <button onClick={() => removeIncome(i.id)} style={{ color: 'var(--muted)' }}><Trash2 size={14} /></button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

