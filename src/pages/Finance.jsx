import { useState } from 'react'
import { useFinance } from '../hooks/useFinance'
import { useIncome, INCOME_CATEGORIES } from '../hooks/useIncome'
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

export default function Finance() {
  const { addExpense, removeExpense, budget, setBudget, monthlyTotal, byCategory, remaining, recentExpenses } = useFinance()
  const { incomes, add: addIncome, remove: removeIncome, monthlyTotal: incomeMonthly, incomeGoal, setIncomeGoal } = useIncome()

  const [showForm, setShowForm] = useState(false)
  const [showIncomeForm, setShowIncomeForm] = useState(false)
  const [showBudgetEdit, setShowBudgetEdit] = useState(false)
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('food')
  const [note, setNote] = useState('')
  const [incomeAmount, setIncomeAmount] = useState('')
  const [incomeCategory, setIncomeCategory] = useState('lendo')
  const [incomeNote, setIncomeNote] = useState('')
  const [tab, setTab] = useState('overview')

  const total = monthlyTotal()
  const totalIncome = incomeMonthly()
  const cats = byCategory()
  const left = remaining()
  const isOver = left < 0
  const pct = Math.min(100, Math.round((total / budget.monthly) * 100))
  const incomePct = Math.min(100, Math.round((totalIncome / (incomeGoal.monthly || 200000)) * 100))
  const net = totalIncome - total

  const handleAddExpense = (e) => {
    e.preventDefault()
    if (!amount || isNaN(Number(amount))) return
    addExpense(Number(amount), category, note)
    setAmount('')
    setNote('')
    setShowForm(false)
  }

  const handleAddIncome = (e) => {
    e.preventDefault()
    if (!incomeAmount || isNaN(Number(incomeAmount))) return
    addIncome(Number(incomeAmount), incomeCategory, incomeNote)
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
          <button onClick={() => { setShowIncomeForm(!showIncomeForm); setShowForm(false) }}
            className="btn text-sm"
            style={{ background: 'rgba(0,212,170,0.12)', color: 'var(--accent)', border: '1px solid rgba(0,212,170,0.25)' }}>
            <TrendingUp size={14} /> Tekjur
          </button>
          <button onClick={() => { setShowForm(!showForm); setShowIncomeForm(false) }} className="btn btn-primary">
            <Plus size={16} /> Gjald
          </button>
        </div>
      </div>

      {/* Net overview card */}
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.06), rgba(139,92,246,0.06))' }}>
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="flex flex-col">
            <div className="text-xs mb-0.5" style={{ color: 'var(--muted)' }}>Tekjur</div>
            <div className="text-lg font-bold" style={{ color: 'var(--accent)' }}>
              {formatShortISK(totalIncome)}
            </div>
          </div>
          <div className="flex flex-col">
            <div className="text-xs mb-0.5" style={{ color: 'var(--muted)' }}>Útgjöld</div>
            <div className="text-lg font-bold">{formatShortISK(total)}</div>
          </div>
          <div className="flex flex-col items-end">
            <div className="text-xs mb-0.5" style={{ color: 'var(--muted)' }}>Nettó</div>
            <div className="text-lg font-bold" style={{ color: net >= 0 ? 'var(--success)' : 'var(--danger)' }}>
              {net >= 0 ? '+' : ''}{formatShortISK(net)}
            </div>
          </div>
        </div>

        {/* Expense progress */}
        <div className="mb-3">
          <div className="flex justify-between text-xs mb-1" style={{ color: 'var(--muted)' }}>
            <span>Útgjaldaáætlun</span>
            <span style={{ color: isOver ? 'var(--danger)' : 'var(--muted)' }}>
              {isOver ? `-${formatShortISK(Math.abs(left))} yfir` : `${formatShortISK(left)} eftir`}
            </span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--surface2)' }}>
            <div className="h-full rounded-full transition-all"
                 style={{ width: `${pct}%`, background: isOver ? 'var(--danger)' : pct > 80 ? '#f97316' : 'var(--accent)' }} />
          </div>
        </div>

        {/* Income progress */}
        <div>
          <div className="flex justify-between text-xs mb-1" style={{ color: 'var(--muted)' }}>
            <span>Lendó markmið</span>
            <span>{incomePct}% af {formatShortISK(incomeGoal.monthly || 200000)}</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--surface2)' }}>
            <div className="h-full rounded-full transition-all"
                 style={{ width: `${incomePct}%`, background: incomePct >= 100 ? 'var(--success)' : '#00d4aa99' }} />
          </div>
        </div>
      </div>

      {/* Add expense form */}
      {showForm && (
        <form onSubmit={handleAddExpense} className="card flex flex-col gap-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Bæta við gjaldi</h3>
            <button type="button" onClick={() => setShowForm(false)}><X size={16} style={{ color: 'var(--muted)' }} /></button>
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
          <button type="submit" className="btn btn-primary w-full justify-center">Bæta við</button>
        </form>
      )}

      {/* Add income form */}
      {showIncomeForm && (
        <form onSubmit={handleAddIncome} className="card flex flex-col gap-3 animate-slide-up"
              style={{ border: '1px solid rgba(0,212,170,0.25)' }}>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <TrendingUp size={14} style={{ color: 'var(--accent)' }} /> Skrá tekjur
            </h3>
            <button type="button" onClick={() => setShowIncomeForm(false)}><X size={16} style={{ color: 'var(--muted)' }} /></button>
          </div>
          <input className="input" type="number" placeholder="Upphæð (ISK)" value={incomeAmount}
            onChange={e => setIncomeAmount(e.target.value)} autoFocus />
          <input className="input" placeholder="Skýring (valkvæmt)" value={incomeNote}
            onChange={e => setIncomeNote(e.target.value)} />
          <div className="flex gap-2 flex-wrap">
            {INCOME_CATEGORIES.map(c => (
              <button key={c.id} type="button" onClick={() => setIncomeCategory(c.id)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs transition-all"
                style={{
                  background: incomeCategory === c.id ? `${c.color}22` : 'var(--surface2)',
                  border: `1px solid ${incomeCategory === c.id ? c.color + '55' : 'transparent'}`,
                  color: incomeCategory === c.id ? c.color : 'var(--muted)',
                }}>
                <span>{c.icon}</span> {c.label}
              </button>
            ))}
          </div>
          <button type="submit" className="btn w-full justify-center"
                  style={{ background: 'var(--accent)', color: '#000' }}>Skrá tekjur</button>
        </form>
      )}

      {/* Tabs */}
      <div className="flex gap-2">
        {[['overview', 'Yfirlit'], ['income', 'Tekjur'], ['transactions', 'Færslur']].map(([t, l]) => (
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
            <h3 className="font-semibold text-sm">Gjöld eftir flokkum</h3>
            <button onClick={() => setShowBudgetEdit(!showBudgetEdit)} className="text-xs" style={{ color: 'var(--accent)' }}>
              Breyta fjárhagsáætlun
            </button>
          </div>
          {showBudgetEdit && (
            <div className="flex flex-col gap-2 p-3 rounded-xl" style={{ background: 'var(--surface2)' }}>
              <div className="text-xs font-medium mb-1" style={{ color: 'var(--muted)' }}>Mánaðarleg fjárhagsáætlun (ISK)</div>
              <input className="input text-sm" type="number"
                value={budget.monthly}
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

      {/* Income tab */}
      {tab === 'income' && (
        <div className="flex flex-col gap-3">
          <div className="card" style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.06), rgba(59,130,246,0.04))' }}>
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Mánaðarlegar tekjur</div>
                <div className="text-3xl font-semibold" style={{ color: 'var(--accent)' }}>
                  {formatISK(totalIncome)}
                </div>
              </div>
              <div className="flex flex-col items-end">
                <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Markmið</div>
                <div className="text-lg font-semibold">{formatISK(incomeGoal.monthly || 200000)}</div>
              </div>
            </div>
            <div className="h-2.5 rounded-full overflow-hidden mb-1" style={{ background: 'var(--surface2)' }}>
              <div className="h-full rounded-full transition-all"
                   style={{ width: `${incomePct}%`, background: incomePct >= 100 ? 'var(--success)' : 'var(--accent)' }} />
            </div>
            <div className="flex justify-between text-xs" style={{ color: 'var(--muted)' }}>
              <span>{incomePct}% af markmiði</span>
              <button className="text-xs" style={{ color: 'var(--accent)' }}
                onClick={() => {
                  const val = prompt('Mánaðarmarkmið (ISK):', incomeGoal.monthly)
                  if (val && !isNaN(Number(val))) setIncomeGoal(g => ({ ...g, monthly: Number(val) }))
                }}>
                Breyta markmiði
              </button>
            </div>
          </div>

          {/* Income by category */}
          <div className="card flex flex-col gap-3">
            <h3 className="font-semibold text-sm">Eftir flokkum</h3>
            {INCOME_CATEGORIES.map(c => {
              const amt = incomes.filter(i => {
                const d = new Date(i.date)
                const now = new Date()
                return i.category === c.id && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
              }).reduce((s, i) => s + i.amount, 0)
              if (amt === 0) return null
              return (
                <div key={c.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span>{c.icon}</span>
                    <span className="text-sm">{c.label}</span>
                  </div>
                  <span className="font-semibold text-sm" style={{ color: c.color }}>
                    {formatShortISK(amt)}
                  </span>
                </div>
              )
            })}
            {totalIncome === 0 && (
              <p className="text-sm" style={{ color: 'var(--muted)' }}>Engar tekjur skráðar þennan mánuð</p>
            )}
          </div>

          {/* Income list */}
          <div className="flex flex-col gap-2">
            {incomes.slice(0, 20).map(i => {
              const cat = INCOME_CATEGORIES.find(c => c.id === i.category) || INCOME_CATEGORIES[3]
              return (
                <div key={i.id} className="card flex items-center gap-3 py-3">
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
            {incomes.length === 0 && (
              <div className="card text-center py-8" style={{ color: 'var(--muted)' }}>Engar tekjur ennþá</div>
            )}
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
    </div>
  )
}
