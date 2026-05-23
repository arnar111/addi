import { useState } from 'react'
import { useFinance } from '../hooks/useFinance'
import { useIncome } from '../hooks/useIncome'
import { formatISK, formatShortISK, EXPENSE_CATEGORIES } from '../utils/currency'
import { INCOME_CATEGORIES } from '../hooks/useIncome'
import { Plus, Trash2, X, TrendingDown, TrendingUp } from 'lucide-react'

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
          <div className="h-full rounded-full"
               style={{ width: `${pct}%`, background: isOver ? 'var(--danger)' : cat.color }} />
        </div>
      )}
    </div>
  )
}

export default function Finance() {
  const { addExpense, removeExpense, budget, setBudget, monthlyTotal, byCategory, remaining, recentExpenses } = useFinance()
  const { add: addIncome, remove: removeIncome, goal, setGoal, monthlyTotal: incomeMonthly, lendoTotal, lendoCount, recent: recentIncome, byCategory: incomeByCategory } = useIncome()

  const [mainTab, setMainTab] = useState('overview')
  const [showExpenseForm, setShowExpenseForm] = useState(false)
  const [showIncomeForm, setShowIncomeForm] = useState(false)
  const [showBudgetEdit, setShowBudgetEdit] = useState(false)
  const [tab, setTab] = useState('overview')

  // Expense form
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('food')
  const [note, setNote] = useState('')

  // Income form
  const [incomeAmount, setIncomeAmount] = useState('')
  const [incomeCategory, setIncomeCategory] = useState('lendo')
  const [incomeNote, setIncomeNote] = useState('')

  const total = monthlyTotal()
  const cats = byCategory()
  const left = remaining()
  const isOver = left < 0
  const pct = Math.min(100, Math.round((total / budget.monthly) * 100))

  const totalIncome = incomeMonthly()
  const lendo = lendoTotal()
  const lendoN = lendoCount()
  const incomePct = Math.min(100, Math.round((totalIncome / goal) * 100))
  const net = totalIncome - total

  const handleAddExpense = (e) => {
    e.preventDefault()
    if (!amount || isNaN(Number(amount))) return
    addExpense(Number(amount), category, note)
    setAmount(''); setNote(''); setShowExpenseForm(false)
  }

  const handleAddIncome = (e) => {
    e.preventDefault()
    if (!incomeAmount || isNaN(Number(incomeAmount))) return
    addIncome(Number(incomeAmount), incomeCategory, incomeNote)
    setIncomeAmount(''); setIncomeNote(''); setShowIncomeForm(false)
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
            style={{ background: 'rgba(34,197,94,0.12)', color: 'var(--success)', border: '1px solid rgba(34,197,94,0.3)' }}>
            <TrendingUp size={14} /> Tekjur
          </button>
          <button onClick={() => { setShowExpenseForm(!showExpenseForm); setShowIncomeForm(false) }}
            className="btn btn-primary text-xs py-2 px-3">
            <Plus size={14} /> Gjald
          </button>
        </div>
      </div>

      {/* Net summary cards */}
      <div className="grid grid-cols-3 gap-2">
        <div className="card-sm text-center">
          <div className="text-xs mb-1" style={{ color: '#22c55e' }}>Tekjur</div>
          <div className="text-sm font-bold" style={{ color: '#22c55e' }}>{formatShortISK(totalIncome)}</div>
        </div>
        <div className="card-sm text-center">
          <div className="text-xs mb-1" style={{ color: 'var(--danger)' }}>Gjöld</div>
          <div className="text-sm font-bold" style={{ color: 'var(--danger)' }}>{formatShortISK(total)}</div>
        </div>
        <div className="card-sm text-center">
          <div className="text-xs mb-1" style={{ color: net >= 0 ? 'var(--accent)' : 'var(--muted)' }}>Nettó</div>
          <div className="text-sm font-bold" style={{ color: net >= 0 ? 'var(--accent)' : 'var(--danger)' }}>
            {net >= 0 ? '+' : ''}{formatShortISK(net)}
          </div>
        </div>
      </div>

      {/* Lendó highlight */}
      {lendoN > 0 && (
        <div className="card-sm flex items-center gap-3"
             style={{ background: 'rgba(0,212,170,0.06)', border: '1px solid rgba(0,212,170,0.25)' }}>
          <span className="text-2xl">🪑</span>
          <div className="flex-1">
            <div className="text-xs font-medium">Lendó leigutekjur</div>
            <div className="h-1.5 rounded-full mt-1.5 overflow-hidden" style={{ background: 'var(--surface2)' }}>
              <div className="h-full rounded-full" style={{ width: `${Math.min(100, Math.round((lendo/goal)*100))}%`, background: 'var(--accent)' }} />
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="font-semibold" style={{ color: 'var(--accent)' }}>{formatShortISK(lendo)}</div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>{lendoN} leiga · {Math.min(100, Math.round((lendo/goal)*100))}% af marki</div>
          </div>
        </div>
      )}

      {/* Income form */}
      {showIncomeForm && (
        <form onSubmit={handleAddIncome} className="card flex flex-col gap-3 animate-slide-up"
              style={{ borderColor: 'rgba(34,197,94,0.3)' }}>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <TrendingUp size={14} style={{ color: 'var(--success)' }} /> Bæta við tekjum
            </h3>
            <button type="button" onClick={() => setShowIncomeForm(false)}><X size={16} style={{ color: 'var(--muted)' }} /></button>
          </div>
          <input className="input" type="number" placeholder="Upphæð (ISK)" value={incomeAmount}
                 onChange={e => setIncomeAmount(e.target.value)} autoFocus />
          <input className="input" placeholder="Skýring (valkvæmt)" value={incomeNote}
                 onChange={e => setIncomeNote(e.target.value)} />
          <div className="grid grid-cols-4 gap-1.5">
            {INCOME_CATEGORIES.map(c => (
              <button key={c.id} type="button" onClick={() => setIncomeCategory(c.id)}
                className="flex flex-col items-center gap-0.5 py-2 rounded-xl text-xs transition-all"
                style={{
                  background: incomeCategory === c.id ? `${c.color}22` : 'var(--surface2)',
                  border: `1px solid ${incomeCategory === c.id ? c.color + '55' : 'transparent'}`,
                }}>
                <span>{c.icon}</span>
                <span style={{ color: incomeCategory === c.id ? c.color : 'var(--muted)', fontSize: 10 }}>{c.label}</span>
              </button>
            ))}
          </div>
          <button type="submit" className="btn w-full justify-center"
                  style={{ background: 'rgba(34,197,94,0.2)', color: 'var(--success)', border: '1px solid rgba(34,197,94,0.3)' }}>
            Bæta við tekjum
          </button>
        </form>
      )}

      {/* Expense form */}
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
          <button type="submit" className="btn btn-primary w-full justify-center">Bæta við</button>
        </form>
      )}

      {/* Tabs */}
      <div className="flex gap-2">
        {[['overview', 'Gjöld'], ['income', 'Tekjur'], ['transactions', 'Færslur']].map(([t, l]) => (
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
        <>
          {/* Expense overview card */}
          <div className="card" style={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.05), rgba(249,115,22,0.05))' }}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Útgjöld þessa mánaðar</div>
                <div className="text-3xl font-semibold">{formatISK(total)}</div>
              </div>
              <div className="flex flex-col items-end">
                <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Eftir</div>
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

          <div className="card flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">Eftir flokkum</h3>
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
        </>
      )}

      {tab === 'income' && (
        <>
          {/* Income overview card */}
          <div className="card" style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.06), rgba(0,212,170,0.06))' }}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Tekjur þessa mánaðar</div>
                <div className="text-3xl font-semibold" style={{ color: 'var(--success)' }}>{formatISK(totalIncome)}</div>
              </div>
              <div className="flex flex-col items-end">
                <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Mark</div>
                <div className="text-sm font-semibold">{formatShortISK(goal)}</div>
              </div>
            </div>
            <div className="h-2.5 rounded-full overflow-hidden mb-1" style={{ background: 'var(--surface2)' }}>
              <div className="h-full rounded-full transition-all"
                   style={{ width: `${incomePct}%`, background: 'var(--success)' }} />
            </div>
            <div className="flex justify-between text-xs" style={{ color: 'var(--muted)' }}>
              <span>{incomePct}% af marki</span>
              <button onClick={() => {
                const v = prompt('Tekjumark (ISK):', goal)
                if (v && !isNaN(Number(v))) setGoal(Number(v))
              }} style={{ color: 'var(--accent)' }}>Breyta marki</button>
            </div>
          </div>

          {/* Income by category */}
          <div className="card flex flex-col gap-3">
            <h3 className="font-semibold text-sm">Eftir flokkum</h3>
            {INCOME_CATEGORIES.map(c => {
              const spent = (incomeByCategory())[c.id] || 0
              return (
                <div key={c.id} className="flex items-center gap-3">
                  <span className="text-lg">{c.icon}</span>
                  <div className="flex-1">
                    <div className="flex justify-between text-xs mb-1">
                      <span>{c.label}</span>
                      <span style={{ color: spent > 0 ? 'var(--success)' : 'var(--muted)' }}>{formatShortISK(spent)}</span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--surface2)' }}>
                      <div className="h-full rounded-full" style={{ width: `${totalIncome ? Math.min(100, Math.round((spent/totalIncome)*100)) : 0}%`, background: c.color }} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Recent income */}
          <div className="flex flex-col gap-2">
            {recentIncome.length === 0 ? (
              <div className="card text-center py-8" style={{ color: 'var(--muted)' }}>Engar tekjur ennþá</div>
            ) : recentIncome.map(e => {
              const cat = INCOME_CATEGORIES.find(c => c.id === e.category) || INCOME_CATEGORIES[3]
              return (
                <div key={e.id} className="card flex items-center gap-3 py-3">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-base"
                       style={{ background: `${cat.color}22` }}>{cat.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium" style={{ color: 'var(--success)' }}>+{formatISK(e.amount)}</div>
                    <div className="text-xs" style={{ color: 'var(--muted)' }}>
                      {cat.label}{e.note ? ` · ${e.note}` : ''} · {new Date(e.date).toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                  <button onClick={() => removeIncome(e.id)} style={{ color: 'var(--muted)' }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              )
            })}
          </div>
        </>
      )}

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
                  <div className="text-sm font-medium">-{formatISK(e.amount)}</div>
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
