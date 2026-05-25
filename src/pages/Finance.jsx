import { useState } from 'react'
import { useFinance } from '../hooks/useFinance'
import { formatISK, formatShortISK, EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../utils/currency'
import { Plus, Trash2, X, TrendingDown, TrendingUp } from 'lucide-react'

function CategoryBar({ cat, amount, budget }) {
  const pct = budget ? Math.min(100, Math.round((amount / budget) * 100)) : 0
  const isOver = budget && amount > budget
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between text-xs">
        <span>{cat.icon} {cat.label}</span>
        <span style={{ color: isOver ? 'var(--danger)' : 'var(--muted)' }}>
          {formatShortISK(amount)} {budget ? `/ ${formatShortISK(budget)}` : ''}
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
  const {
    addExpense, removeExpense, addIncome, removeIncome,
    budget, setBudget,
    incomeGoal, setIncomeGoal,
    monthlyTotal, monthlyIncome, netCashFlow,
    byCategory, incomeByCategory,
    remaining, recentExpenses, recentIncomes,
  } = useFinance()

  const [showExpenseForm, setShowExpenseForm] = useState(false)
  const [showIncomeForm, setShowIncomeForm] = useState(false)
  const [showBudgetEdit, setShowBudgetEdit] = useState(false)
  const [tab, setTab] = useState('overview')

  const [expAmount, setExpAmount] = useState('')
  const [expCategory, setExpCategory] = useState('food')
  const [expNote, setExpNote] = useState('')

  const [incAmount, setIncAmount] = useState('')
  const [incCategory, setIncCategory] = useState('lendo')
  const [incNote, setIncNote] = useState('')

  const total = monthlyTotal()
  const income = monthlyIncome()
  const net = netCashFlow()
  const cats = byCategory()
  const incCats = incomeByCategory()
  const left = remaining()
  const isOver = left < 0
  const expPct = Math.min(100, Math.round((total / budget.monthly) * 100))
  const incPct = Math.min(100, Math.round((income / incomeGoal) * 100))

  const handleAddExpense = (e) => {
    e.preventDefault()
    if (!expAmount || isNaN(Number(expAmount))) return
    addExpense(Number(expAmount), expCategory, expNote)
    setExpAmount(''); setExpNote(''); setShowExpenseForm(false)
  }

  const handleAddIncome = (e) => {
    e.preventDefault()
    if (!incAmount || isNaN(Number(incAmount))) return
    addIncome(Number(incAmount), incCategory, incNote)
    setIncAmount(''); setIncNote(''); setShowIncomeForm(false)
  }

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      {/* Header */}
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
            style={{ background: 'rgba(0,212,170,0.12)', color: 'var(--accent)', border: '1px solid rgba(0,212,170,0.25)' }}>
            <TrendingUp size={14} /> Tekja
          </button>
          <button onClick={() => { setShowExpenseForm(!showExpenseForm); setShowIncomeForm(false) }}
            className="btn btn-primary text-xs py-2 px-3">
            <Plus size={14} /> Gjald
          </button>
        </div>
      </div>

      {/* Net summary card */}
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.06), rgba(139,92,246,0.06))' }}>
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div>
            <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Tekjur</div>
            <div className="text-lg font-semibold" style={{ color: 'var(--accent)' }}>{formatShortISK(income)}</div>
          </div>
          <div className="text-center">
            <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Nettó</div>
            <div className="text-lg font-semibold" style={{ color: net >= 0 ? 'var(--success)' : 'var(--danger)' }}>
              {net >= 0 ? '+' : ''}{formatShortISK(net)}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Útgjöld</div>
            <div className="text-lg font-semibold">{formatShortISK(total)}</div>
          </div>
        </div>

        {/* Income progress */}
        <div className="mb-3">
          <div className="flex justify-between text-xs mb-1" style={{ color: 'var(--muted)' }}>
            <span>Tekjumark 🏠</span>
            <span>{incPct}% ({formatShortISK(income)} / {formatShortISK(incomeGoal)})</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--surface2)' }}>
            <div className="h-full rounded-full transition-all" style={{ width: `${incPct}%`, background: 'var(--accent)' }} />
          </div>
        </div>

        {/* Expense progress */}
        <div>
          <div className="flex justify-between text-xs mb-1" style={{ color: 'var(--muted)' }}>
            <span>Fjárhagsáætlun útgjalda</span>
            <span>{expPct}% · {formatShortISK(Math.abs(left))} {isOver ? 'yfir' : 'eftir'}</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--surface2)' }}>
            <div className="h-full rounded-full transition-all"
                 style={{ width: `${expPct}%`, background: isOver ? 'var(--danger)' : expPct > 80 ? '#f97316' : '#8b5cf6' }} />
          </div>
        </div>
      </div>

      {/* Income form */}
      {showIncomeForm && (
        <form onSubmit={handleAddIncome} className="card flex flex-col gap-3 animate-slide-up"
              style={{ border: '1px solid rgba(0,212,170,0.3)' }}>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm" style={{ color: 'var(--accent)' }}>Bæta við tekju</h3>
            <button type="button" onClick={() => setShowIncomeForm(false)}><X size={16} style={{ color: 'var(--muted)' }} /></button>
          </div>
          <input className="input" type="number" placeholder="Upphæð (ISK)" value={incAmount}
                 onChange={e => setIncAmount(e.target.value)} autoFocus />
          <input className="input" placeholder="Skýring (valkvæmt)" value={incNote}
                 onChange={e => setIncNote(e.target.value)} />
          <div className="grid grid-cols-3 gap-1.5">
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
                  style={{ background: 'var(--accent)', color: '#000' }}>Bæta við tekju</button>
        </form>
      )}

      {/* Expense form */}
      {showExpenseForm && (
        <form onSubmit={handleAddExpense} className="card flex flex-col gap-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Bæta við gjaldi</h3>
            <button type="button" onClick={() => setShowExpenseForm(false)}><X size={16} style={{ color: 'var(--muted)' }} /></button>
          </div>
          <input className="input" type="number" placeholder="Upphæð (ISK)" value={expAmount}
                 onChange={e => setExpAmount(e.target.value)} autoFocus />
          <input className="input" placeholder="Skýring (valkvæmt)" value={expNote}
                 onChange={e => setExpNote(e.target.value)} />
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
          <button type="submit" className="btn btn-primary w-full justify-center">Bæta við</button>
        </form>
      )}

      {/* Tabs */}
      <div className="flex gap-2">
        {[['overview', 'Yfirlit'], ['expenses', 'Útgjöld'], ['income', 'Tekjur']].map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)}
            className="btn text-sm flex-1 justify-center"
            style={{
              background: tab === t ? (t === 'income' ? 'rgba(0,212,170,0.12)' : 'rgba(139,92,246,0.12)') : 'var(--surface)',
              color: tab === t ? (t === 'income' ? 'var(--accent)' : 'var(--accent2)') : 'var(--muted)',
              border: `1px solid ${tab === t ? (t === 'income' ? 'rgba(0,212,170,0.25)' : 'rgba(139,92,246,0.25)') : 'var(--border)'}`,
            }}>{l}</button>
        ))}
      </div>

      {/* Overview tab */}
      {tab === 'overview' && (
        <div className="flex flex-col gap-3">
          {/* Income by category */}
          <div className="card">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm" style={{ color: 'var(--accent)' }}>Tekjur eftir flokkum</h3>
              <button onClick={() => setShowBudgetEdit(!showBudgetEdit)} className="text-xs" style={{ color: 'var(--muted)' }}>
                Breyta markmiðum
              </button>
            </div>
            {showBudgetEdit && (
              <div className="flex flex-col gap-2 p-3 rounded-xl mb-3" style={{ background: 'var(--surface2)' }}>
                <div className="text-xs font-medium" style={{ color: 'var(--muted)' }}>Mánaðarleg fjárhagsáætlun</div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs" style={{ color: 'var(--muted)' }}>Tekjumark (ISK)</label>
                  <input className="input text-sm" type="number" value={incomeGoal}
                         onChange={e => setIncomeGoal(Number(e.target.value))} />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs" style={{ color: 'var(--muted)' }}>Útgjaldamark (ISK)</label>
                  <input className="input text-sm" type="number" value={budget.monthly}
                         onChange={e => setBudget(b => ({ ...b, monthly: Number(e.target.value) }))} />
                </div>
              </div>
            )}
            <div className="flex flex-col gap-3">
              {INCOME_CATEGORIES.map(c => (
                <CategoryBar key={c.id} cat={c} amount={incCats[c.id] || 0} budget={null} />
              ))}
            </div>
          </div>
          {/* Expense by category */}
          <div className="card">
            <h3 className="font-semibold text-sm mb-3">Útgjöld eftir flokkum</h3>
            <div className="flex flex-col gap-3">
              {EXPENSE_CATEGORIES.map(c => (
                <CategoryBar key={c.id} cat={c} amount={cats[c.id] || 0} budget={budget.categories[c.id]} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Expenses tab */}
      {tab === 'expenses' && (
        <div className="flex flex-col gap-2">
          {recentExpenses.length === 0 ? (
            <div className="card text-center py-8" style={{ color: 'var(--muted)' }}>Engar útgjaldafærslur</div>
          ) : recentExpenses.map(e => {
            const cat = EXPENSE_CATEGORIES.find(c => c.id === e.category) || EXPENSE_CATEGORIES[7]
            return (
              <div key={e.id} className="card flex items-center gap-3 py-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-base"
                     style={{ background: `${cat.color}22` }}>{cat.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">{formatISK(e.amount)}</div>
                  <div className="text-xs" style={{ color: 'var(--muted)' }}>
                    {cat.label}{e.note ? ` · ${e.note}` : ''} · {new Date(e.date).toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
                <button onClick={() => removeExpense(e.id)} style={{ color: 'var(--muted)' }}>
                  <Trash2 size={14} />
                </button>
              </div>
            )
          })}
        </div>
      )}

      {/* Income tab */}
      {tab === 'income' && (
        <div className="flex flex-col gap-2">
          {recentIncomes.length === 0 ? (
            <div className="card text-center py-8" style={{ color: 'var(--muted)' }}>
              <div className="text-2xl mb-2">🏠</div>
              <div>Engar tekjufærslur ennþá</div>
              <div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>Skráðu fyrstu Lendo leiguna þína!</div>
            </div>
          ) : recentIncomes.map(i => {
            const cat = INCOME_CATEGORIES.find(c => c.id === i.category) || INCOME_CATEGORIES[5]
            return (
              <div key={i.id} className="card flex items-center gap-3 py-3"
                   style={{ border: '1px solid rgba(0,212,170,0.15)' }}>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-base"
                     style={{ background: `${cat.color}22` }}>{cat.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium" style={{ color: 'var(--accent)' }}>+{formatISK(i.amount)}</div>
                  <div className="text-xs" style={{ color: 'var(--muted)' }}>
                    {cat.label}{i.note ? ` · ${i.note}` : ''} · {new Date(i.date).toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
                <button onClick={() => removeIncome(i.id)} style={{ color: 'var(--muted)' }}>
                  <Trash2 size={14} />
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
