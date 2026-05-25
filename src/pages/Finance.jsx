import { useState } from 'react'
import { useFinance } from '../hooks/useFinance'
import { useIncome, INCOME_CATEGORIES } from '../hooks/useIncome'
import { formatISK, formatShortISK, EXPENSE_CATEGORIES } from '../utils/currency'
import { Plus, Trash2, X, TrendingDown, TrendingUp, ArrowUpRight, ArrowDownLeft } from 'lucide-react'

function CategoryBar({ cat, spent, budget }) {
  const pct = budget ? Math.min(100, Math.round((spent / budget) * 100)) : 0
  const isOver = spent > budget
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
          <div className="h-full rounded-full"
               style={{ width: `${pct}%`, background: isOver ? 'var(--danger)' : cat.color }} />
        </div>
      )}
    </div>
  )
}

export default function Finance() {
  const { addExpense, removeExpense, budget, setBudget, monthlyTotal, byCategory, remaining, recentExpenses } = useFinance()
  const { add: addIncome, remove: removeIncome, goal, setGoal, monthlyTotal: incomeTotal, lendoTotal, lendoCount, recentEntries: incomeEntries } = useIncome()

  const [tab, setTab] = useState('overview')
  const [showExpenseForm, setShowExpenseForm] = useState(false)
  const [showIncomeForm, setShowIncomeForm] = useState(false)
  const [showBudgetEdit, setShowBudgetEdit] = useState(false)

  const [expAmount, setExpAmount] = useState('')
  const [expCategory, setExpCategory] = useState('food')
  const [expNote, setExpNote] = useState('')

  const [incAmount, setIncAmount] = useState('')
  const [incCategory, setIncCategory] = useState('lendo')
  const [incNote, setIncNote] = useState('')

  const expenses = monthlyTotal()
  const income = incomeTotal()
  const net = income - expenses
  const cats = byCategory()
  const left = remaining()
  const isOver = left < 0
  const pct = Math.min(100, Math.round((expenses / budget.monthly) * 100))
  const goalPct = goal ? Math.min(100, Math.round((income / goal) * 100)) : 0

  const handleExpense = (e) => {
    e.preventDefault()
    if (!expAmount || isNaN(Number(expAmount))) return
    addExpense(Number(expAmount), expCategory, expNote)
    setExpAmount(''); setExpNote(''); setShowExpenseForm(false)
  }

  const handleIncome = (e) => {
    e.preventDefault()
    if (!incAmount || isNaN(Number(incAmount))) return
    addIncome(Number(incAmount), incCategory, incNote)
    setIncAmount(''); setIncNote(''); setShowIncomeForm(false)
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
            className="btn text-xs py-2 px-3"
            style={{ background: 'rgba(0,212,170,0.12)', color: 'var(--accent)', border: '1px solid rgba(0,212,170,0.3)' }}>
            <ArrowUpRight size={14} /> Tekjur
          </button>
          <button onClick={() => { setShowExpenseForm(!showExpenseForm); setShowIncomeForm(false) }}
            className="btn btn-primary text-xs py-2 px-3">
            <ArrowDownLeft size={14} /> Gjald
          </button>
        </div>
      </div>

      {/* Net position overview */}
      <div className="grid grid-cols-3 gap-2">
        <div className="card text-center py-3">
          <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Tekjur</div>
          <div className="font-bold text-sm" style={{ color: 'var(--success)' }}>{formatShortISK(income)}</div>
        </div>
        <div className="card text-center py-3">
          <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Gjöld</div>
          <div className="font-bold text-sm" style={{ color: 'var(--danger)' }}>{formatShortISK(expenses)}</div>
        </div>
        <div className="card text-center py-3"
             style={{ background: net >= 0 ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)', border: `1px solid ${net >= 0 ? 'rgba(34,197,94,0.25)' : 'rgba(239,68,68,0.25)'}` }}>
          <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Nettó</div>
          <div className="font-bold text-sm" style={{ color: net >= 0 ? 'var(--success)' : 'var(--danger)' }}>
            {net >= 0 ? '+' : ''}{formatShortISK(net)}
          </div>
        </div>
      </div>

      {/* Income form */}
      {showIncomeForm && (
        <form onSubmit={handleIncome} className="card flex flex-col gap-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Bæta við tekjum</h3>
            <button type="button" onClick={() => setShowIncomeForm(false)}><X size={16} style={{ color: 'var(--muted)' }} /></button>
          </div>
          <input className="input" type="number" placeholder="Upphæð (ISK)" value={incAmount} onChange={e => setIncAmount(e.target.value)} autoFocus />
          <input className="input" placeholder="Skýring (valkvæmt)" value={incNote} onChange={e => setIncNote(e.target.value)} />
          <div className="grid grid-cols-4 gap-1.5">
            {INCOME_CATEGORIES.map(c => (
              <button key={c.id} type="button" onClick={() => setIncCategory(c.id)}
                className="flex flex-col items-center gap-0.5 py-2 rounded-xl text-xs transition-all"
                style={{
                  background: incCategory === c.id ? `${c.color}22` : 'var(--surface2)',
                  border: `1px solid ${incCategory === c.id ? c.color + '55' : 'transparent'}`,
                }}>
                <span>{c.icon}</span>
                <span style={{ color: incCategory === c.id ? c.color : 'var(--muted)', fontSize: 10 }}>{c.label}</span>
              </button>
            ))}
          </div>
          <button type="submit" className="btn w-full justify-center"
            style={{ background: 'var(--success)', color: '#000' }}>Bæta við tekjum</button>
        </form>
      )}

      {/* Expense form */}
      {showExpenseForm && (
        <form onSubmit={handleExpense} className="card flex flex-col gap-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Bæta við gjaldi</h3>
            <button type="button" onClick={() => setShowExpenseForm(false)}><X size={16} style={{ color: 'var(--muted)' }} /></button>
          </div>
          <input className="input" type="number" placeholder="Upphæð (ISK)" value={expAmount} onChange={e => setExpAmount(e.target.value)} autoFocus />
          <input className="input" placeholder="Skýring (valkvæmt)" value={expNote} onChange={e => setExpNote(e.target.value)} />
          <div className="grid grid-cols-4 gap-1.5">
            {EXPENSE_CATEGORIES.map(c => (
              <button key={c.id} type="button" onClick={() => setExpCategory(c.id)}
                className="flex flex-col items-center gap-0.5 py-2 rounded-xl text-xs transition-all"
                style={{
                  background: expCategory === c.id ? `${c.color}22` : 'var(--surface2)',
                  border: `1px solid ${expCategory === c.id ? c.color + '55' : 'transparent'}`,
                }}>
                <span>{c.icon}</span>
                <span style={{ color: expCategory === c.id ? c.color : 'var(--muted)', fontSize: 10 }}>{c.label}</span>
              </button>
            ))}
          </div>
          <button type="submit" className="btn btn-primary w-full justify-center">Bæta við gjaldi</button>
        </form>
      )}

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'var(--surface2)' }}>
        {[['overview', '📊 Yfirlit'], ['income', '💰 Tekjur'], ['expenses', '💸 Gjöld'], ['transactions', '📋 Færslur']].map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)}
            className="flex-1 py-1.5 rounded-lg text-xs font-medium transition-all"
            style={{
              background: tab === t ? 'var(--surface)' : 'transparent',
              color: tab === t ? 'var(--text)' : 'var(--muted)',
            }}>{l}</button>
        ))}
      </div>

      {/* Overview tab */}
      {tab === 'overview' && (
        <div className="flex flex-col gap-3">
          {/* Lendó income goal */}
          <div className="card" style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.08), rgba(0,212,170,0.03))' }}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-xs" style={{ color: 'var(--muted)' }}>🏠 Lendó þessa mánaðar</div>
                <div className="text-2xl font-bold mt-0.5" style={{ color: 'var(--accent)' }}>{formatISK(lendoTotal())}</div>
              </div>
              <div className="text-right">
                <div className="text-xs" style={{ color: 'var(--muted)' }}>Markmið</div>
                <div className="text-sm font-semibold">{formatShortISK(goal)}</div>
              </div>
            </div>
            <div className="h-2.5 rounded-full overflow-hidden mb-1" style={{ background: 'var(--surface2)' }}>
              <div className="h-full rounded-full transition-all"
                   style={{ width: `${goalPct}%`, background: goalPct >= 100 ? 'var(--success)' : 'var(--accent)' }} />
            </div>
            <div className="flex justify-between text-xs" style={{ color: 'var(--muted)' }}>
              <span>{goalPct}% af markmiði</span>
              <span>{lendoCount()} leiga{lendoCount() !== 1 ? 'r' : ''}</span>
            </div>
          </div>

          {/* Expenses card */}
          <div className="card" style={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.05), rgba(139,92,246,0.05))' }}>
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Útgjöld þessa mánaðar</div>
                <div className="text-2xl font-semibold">{formatISK(expenses)}</div>
              </div>
              <div className="flex flex-col items-end">
                <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Eftir</div>
                <div className="text-lg font-semibold" style={{ color: isOver ? 'var(--danger)' : 'var(--success)' }}>
                  {isOver ? '-' : ''}{formatISK(Math.abs(left))}
                </div>
              </div>
            </div>
            <div className="h-2 rounded-full overflow-hidden mb-1" style={{ background: 'var(--surface2)' }}>
              <div className="h-full rounded-full transition-all"
                   style={{ width: `${pct}%`, background: isOver ? 'var(--danger)' : pct > 80 ? '#f97316' : 'var(--accent)' }} />
            </div>
            <div className="flex justify-between text-xs" style={{ color: 'var(--muted)' }}>
              <span>{pct}% notað</span>
              <button onClick={() => setShowBudgetEdit(!showBudgetEdit)} style={{ color: 'var(--accent)' }}>
                Fjárhagsáætlun: {formatShortISK(budget.monthly)}
              </button>
            </div>
          </div>

          {showBudgetEdit && (
            <div className="card flex flex-col gap-3">
              <div className="text-sm font-semibold">Breyta fjárhagsáætlun</div>
              <div className="flex flex-col gap-1">
                <label className="text-xs" style={{ color: 'var(--muted)' }}>Mánaðarleg fjárhagsáætlun (ISK)</label>
                <input className="input text-sm" type="number"
                  value={budget.monthly}
                  onChange={e => setBudget(b => ({ ...b, monthly: Number(e.target.value) }))} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs" style={{ color: 'var(--muted)' }}>Lendó tekjumarkmið (ISK)</label>
                <input className="input text-sm" type="number" value={goal}
                  onChange={e => setGoal(Number(e.target.value))} />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Income tab */}
      {tab === 'income' && (
        <div className="card flex flex-col gap-4">
          <h3 className="font-semibold text-sm">Tekjur eftir flokkum</h3>
          {INCOME_CATEGORIES.map(c => {
            const amt = incomeEntries.filter(e => {
              const d = new Date(e.date); const now = new Date()
              return e.category === c.id && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
            }).reduce((s, e) => s + e.amount, 0)
            return (
              <div key={c.id} className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-xs">
                  <span>{c.icon} {c.label}</span>
                  <span style={{ color: c.color }}>{formatShortISK(amt)}</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--surface2)' }}>
                  <div className="h-full rounded-full"
                       style={{ width: income ? `${Math.min(100, (amt / income) * 100)}%` : '0%', background: c.color }} />
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Expenses tab */}
      {tab === 'expenses' && (
        <div className="card flex flex-col gap-4">
          <h3 className="font-semibold text-sm">Gjöld eftir flokkum</h3>
          {EXPENSE_CATEGORIES.map(c => (
            <CategoryBar key={c.id} cat={c} spent={cats[c.id] || 0} budget={budget.categories[c.id]} />
          ))}
        </div>
      )}

      {/* Transactions tab */}
      {tab === 'transactions' && (
        <div className="flex flex-col gap-2">
          {/* Income entries */}
          {incomeEntries.filter(e => {
            const d = new Date(e.date); const now = new Date()
            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
          }).map(e => {
            const cat = INCOME_CATEGORIES.find(c => c.id === e.category) || INCOME_CATEGORIES[3]
            return (
              <div key={e.id} className="card flex items-center gap-3 py-3"
                   style={{ borderColor: 'rgba(34,197,94,0.2)' }}>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-base"
                     style={{ background: `${cat.color}22` }}>{cat.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium" style={{ color: 'var(--success)' }}>+{formatISK(e.amount)}</div>
                  <div className="text-xs" style={{ color: 'var(--muted)' }}>
                    {cat.label}{e.note ? ` · ${e.note}` : ''} · {new Date(e.date).toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
                <button onClick={() => removeIncome(e.id)} style={{ color: 'var(--muted)' }}><Trash2 size={14} /></button>
              </div>
            )
          })}
          {/* Expense entries */}
          {recentExpenses.filter(e => {
            const d = new Date(e.date); const now = new Date()
            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
          }).map(e => {
            const cat = EXPENSE_CATEGORIES.find(c => c.id === e.category) || EXPENSE_CATEGORIES[7]
            return (
              <div key={e.id} className="card flex items-center gap-3 py-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-base"
                     style={{ background: `${cat.color}22` }}>{cat.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium" style={{ color: 'var(--danger)' }}>-{formatISK(e.amount)}</div>
                  <div className="text-xs" style={{ color: 'var(--muted)' }}>
                    {cat.label}{e.note ? ` · ${e.note}` : ''} · {new Date(e.date).toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
                <button onClick={() => removeExpense(e.id)} style={{ color: 'var(--muted)' }}><Trash2 size={14} /></button>
              </div>
            )
          })}
          {incomeEntries.length === 0 && recentExpenses.length === 0 && (
            <div className="card text-center py-8" style={{ color: 'var(--muted)' }}>Engar færslur ennþá</div>
          )}
        </div>
      )}
    </div>
  )
}
