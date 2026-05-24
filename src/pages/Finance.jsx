import { useState } from 'react'
import { useFinance, INCOME_SOURCES } from '../hooks/useFinance'
import { formatISK, formatShortISK, EXPENSE_CATEGORIES } from '../utils/currency'
import { Plus, Trash2, X, TrendingDown, TrendingUp } from 'lucide-react'

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

function NetBalanceCard({ income, expenses, net, incomeTarget }) {
  const netPositive = net >= 0
  const incomePct = incomeTarget ? Math.min(100, Math.round((income / incomeTarget) * 100)) : 0
  return (
    <div className="card" style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.06), rgba(139,92,246,0.06))' }}>
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="flex flex-col gap-0.5">
          <span className="text-xs" style={{ color: 'var(--muted)' }}>Tekjur</span>
          <span className="text-lg font-bold" style={{ color: 'var(--success)' }}>{formatShortISK(income)}</span>
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <span className="text-xs" style={{ color: 'var(--muted)' }}>Útgjöld</span>
          <span className="text-lg font-bold" style={{ color: 'var(--danger)' }}>{formatShortISK(expenses)}</span>
        </div>
        <div className="flex flex-col items-end gap-0.5">
          <span className="text-xs" style={{ color: 'var(--muted)' }}>Staða</span>
          <span className="text-lg font-bold" style={{ color: netPositive ? 'var(--accent)' : 'var(--danger)' }}>
            {netPositive ? '+' : ''}{formatShortISK(net)}
          </span>
        </div>
      </div>
      {incomeTarget > 0 && (
        <>
          <div className="h-2 rounded-full overflow-hidden mb-1" style={{ background: 'var(--surface2)' }}>
            <div className="h-full rounded-full" style={{ width: `${incomePct}%`, background: 'var(--success)' }} />
          </div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>
            {incomePct}% af tekjumarkmiði · {formatISK(incomeTarget)}
          </div>
        </>
      )}
    </div>
  )
}

export default function Finance() {
  const {
    addExpense, removeExpense, budget, setBudget,
    monthlyTotal, byCategory, remaining, recentExpenses,
    addIncome, removeIncome, monthlyIncome, netBalance, recentIncomes,
  } = useFinance()

  const [tab, setTab] = useState('overview')
  const [showExpenseForm, setShowExpenseForm] = useState(false)
  const [showIncomeForm, setShowIncomeForm] = useState(false)
  const [showBudgetEdit, setShowBudgetEdit] = useState(false)

  const [expAmount, setExpAmount] = useState('')
  const [expCategory, setExpCategory] = useState('food')
  const [expNote, setExpNote] = useState('')

  const [incAmount, setIncAmount] = useState('')
  const [incSource, setIncSource] = useState('salary')
  const [incNote, setIncNote] = useState('')

  const total = monthlyTotal()
  const income = monthlyIncome()
  const net = netBalance()
  const cats = byCategory()
  const left = remaining()
  const isOver = left < 0
  const expPct = Math.min(100, Math.round((total / budget.monthly) * 100))

  const handleExpense = (e) => {
    e.preventDefault()
    if (!expAmount || isNaN(Number(expAmount))) return
    addExpense(Number(expAmount), expCategory, expNote)
    setExpAmount(''); setExpNote(''); setShowExpenseForm(false)
  }

  const handleIncome = (e) => {
    e.preventDefault()
    if (!incAmount || isNaN(Number(incAmount))) return
    addIncome(Number(incAmount), incSource, incNote)
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
          <button onClick={() => { setShowIncomeForm(f => !f); setShowExpenseForm(false) }}
            className="btn text-sm"
            style={{ background: 'rgba(34,197,94,0.12)', color: 'var(--success)', border: '1px solid rgba(34,197,94,0.25)' }}>
            <TrendingUp size={14} /> Tekjur
          </button>
          <button onClick={() => { setShowExpenseForm(f => !f); setShowIncomeForm(false) }}
            className="btn btn-primary text-sm">
            <TrendingDown size={14} /> Gjald
          </button>
        </div>
      </div>

      {/* Net balance overview */}
      <NetBalanceCard income={income} expenses={total} net={net} incomeTarget={budget.incomeTarget} />

      {/* Expense budget bar */}
      <div className="card-sm flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs">
          <span style={{ color: 'var(--muted)' }}>Útgjaldafjárhagsáætlun</span>
          <span style={{ color: isOver ? 'var(--danger)' : 'var(--muted)' }}>
            {isOver ? '-' : ''}{formatShortISK(Math.abs(left))} eftir
          </span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--surface2)' }}>
          <div className="h-full rounded-full"
               style={{ width: `${expPct}%`, background: isOver ? 'var(--danger)' : expPct > 80 ? '#f97316' : 'var(--accent)' }} />
        </div>
        <div className="text-xs" style={{ color: 'var(--muted)' }}>
          {expPct}% notað af {formatISK(budget.monthly)}
        </div>
      </div>

      {/* Add expense form */}
      {showExpenseForm && (
        <form onSubmit={handleExpense} className="card flex flex-col gap-3 animate-slide-up">
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

      {/* Add income form */}
      {showIncomeForm && (
        <form onSubmit={handleIncome} className="card flex flex-col gap-3 animate-slide-up"
          style={{ borderColor: 'rgba(34,197,94,0.25)' }}>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm" style={{ color: 'var(--success)' }}>Bæta við tekjum</h3>
            <button type="button" onClick={() => setShowIncomeForm(false)}><X size={16} style={{ color: 'var(--muted)' }} /></button>
          </div>
          <input className="input" type="number" placeholder="Upphæð (ISK)" value={incAmount}
            onChange={e => setIncAmount(e.target.value)} autoFocus />
          <input className="input" placeholder="Skýring (valkvæmt)" value={incNote}
            onChange={e => setIncNote(e.target.value)} />
          <div className="grid grid-cols-3 gap-1.5">
            {INCOME_SOURCES.map(s => (
              <button key={s.id} type="button" onClick={() => setIncSource(s.id)}
                className="flex flex-col items-center gap-0.5 py-2 rounded-xl text-xs transition-all"
                style={{
                  background: incSource === s.id ? `${s.color}22` : 'var(--surface2)',
                  border: `1px solid ${incSource === s.id ? s.color + '55' : 'transparent'}`,
                }}>
                <span>{s.icon}</span>
                <span style={{ color: incSource === s.id ? s.color : 'var(--muted)', fontSize: 10 }}>{s.label}</span>
              </button>
            ))}
          </div>
          <button type="submit" className="btn w-full justify-center"
            style={{ background: 'rgba(34,197,94,0.15)', color: 'var(--success)', border: '1px solid rgba(34,197,94,0.3)' }}>
            Bæta við tekjum
          </button>
        </form>
      )}

      {/* Tabs */}
      <div className="flex gap-2">
        {[['overview', 'Yfirlit'], ['expenses', 'Gjöld'], ['income', 'Tekjur']].map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)}
            className="btn text-sm flex-1 justify-center"
            style={{
              background: tab === t ? 'rgba(0,212,170,0.12)' : 'var(--surface)',
              color: tab === t ? 'var(--accent)' : 'var(--muted)',
              border: `1px solid ${tab === t ? 'rgba(0,212,170,0.25)' : 'var(--border)'}`,
            }}>{l}</button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="card flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Útgjöld eftir flokkum</h3>
            <button onClick={() => setShowBudgetEdit(!showBudgetEdit)} className="text-xs" style={{ color: 'var(--accent)' }}>
              Breyta
            </button>
          </div>
          {showBudgetEdit && (
            <div className="flex flex-col gap-3 p-3 rounded-xl" style={{ background: 'var(--surface2)' }}>
              <div>
                <label className="text-xs block mb-1" style={{ color: 'var(--muted)' }}>Mánaðarleg útgjaldaáætlun</label>
                <input className="input text-sm" type="number" value={budget.monthly}
                  onChange={e => setBudget(b => ({ ...b, monthly: Number(e.target.value) }))} />
              </div>
              <div>
                <label className="text-xs block mb-1" style={{ color: 'var(--muted)' }}>Tekjumarkmið á mánuði</label>
                <input className="input text-sm" type="number" value={budget.incomeTarget || ''}
                  onChange={e => setBudget(b => ({ ...b, incomeTarget: Number(e.target.value) }))} />
              </div>
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

      {tab === 'expenses' && (
        <div className="flex flex-col gap-2">
          {recentExpenses.length === 0 ? (
            <div className="card text-center py-8" style={{ color: 'var(--muted)' }}>Engar gjaldafærslur ennþá</div>
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

      {tab === 'income' && (
        <div className="flex flex-col gap-2">
          {recentIncomes.length === 0 ? (
            <div className="card text-center py-8" style={{ color: 'var(--muted)' }}>Engar tekjufærslur ennþá</div>
          ) : recentIncomes.map(e => {
            const src = INCOME_SOURCES.find(s => s.id === e.source) || INCOME_SOURCES[4]
            return (
              <div key={e.id} className="card flex items-center gap-3 py-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-base"
                     style={{ background: `${src.color}22` }}>{src.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium" style={{ color: 'var(--success)' }}>+{formatISK(e.amount)}</div>
                  <div className="text-xs" style={{ color: 'var(--muted)' }}>
                    {src.label}{e.note ? ` · ${e.note}` : ''} · {new Date(e.date).toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
                <button onClick={() => removeIncome(e.id)} style={{ color: 'var(--muted)' }}>
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
