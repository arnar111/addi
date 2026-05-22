import { useState } from 'react'
import { useFinance, INCOME_SOURCES } from '../hooks/useFinance'
import { formatISK, formatShortISK, EXPENSE_CATEGORIES } from '../utils/currency'
import { Plus, Trash2, X, TrendingDown, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react'

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
  const {
    addExpense, removeExpense, budget, setBudget,
    monthlyTotal, monthlyIncomeTotal, netBalance,
    byCategory, byIncomeSource, remaining, recentExpenses,
    addIncome, removeIncome, recentIncome,
  } = useFinance()

  const [showExpenseForm, setShowExpenseForm] = useState(false)
  const [showIncomeForm, setShowIncomeForm] = useState(false)
  const [showBudgetEdit, setShowBudgetEdit] = useState(false)
  const [expAmount, setExpAmount] = useState('')
  const [expCategory, setExpCategory] = useState('food')
  const [expNote, setExpNote] = useState('')
  const [incAmount, setIncAmount] = useState('')
  const [incSource, setIncSource] = useState('lendo')
  const [incNote, setIncNote] = useState('')
  const [tab, setTab] = useState('overview')

  const total = monthlyTotal()
  const incomeTotal = monthlyIncomeTotal()
  const net = netBalance()
  const cats = byCategory()
  const incBySrc = byIncomeSource()
  const left = remaining()
  const isOver = left < 0
  const pct = Math.min(100, Math.round((total / budget.monthly) * 100))
  const incomePct = budget.incomeGoal ? Math.min(100, Math.round((incomeTotal / budget.incomeGoal) * 100)) : 0

  const handleAddExpense = (e) => {
    e.preventDefault()
    if (!expAmount || isNaN(Number(expAmount))) return
    addExpense(Number(expAmount), expCategory, expNote)
    setExpAmount(''); setExpNote(''); setShowExpenseForm(false)
  }

  const handleAddIncome = (e) => {
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
          <button onClick={() => { setShowIncomeForm(!showIncomeForm); setShowExpenseForm(false) }}
                  className="btn text-sm" style={{ background: 'rgba(34,197,94,0.1)', color: 'var(--success)', border: '1px solid rgba(34,197,94,0.3)' }}>
            <ArrowUpRight size={15} /> Tekjur
          </button>
          <button onClick={() => { setShowExpenseForm(!showExpenseForm); setShowIncomeForm(false) }}
                  className="btn btn-primary text-sm">
            <ArrowDownRight size={15} /> Gjald
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-2">
        <div className="card text-center py-3 px-2">
          <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Tekjur</div>
          <div className="font-bold text-sm" style={{ color: 'var(--success)' }}>{formatShortISK(incomeTotal)}</div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{incomePct}% af marki</div>
        </div>
        <div className="card text-center py-3 px-2">
          <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Útgjöld</div>
          <div className="font-bold text-sm" style={{ color: isOver ? 'var(--danger)' : 'var(--text)' }}>{formatShortISK(total)}</div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{pct}% af áætlun</div>
        </div>
        <div className="card text-center py-3 px-2">
          <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Nettó</div>
          <div className="font-bold text-sm" style={{ color: net >= 0 ? 'var(--success)' : 'var(--danger)' }}>
            {net >= 0 ? '+' : ''}{formatShortISK(net)}
          </div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{net >= 0 ? 'í plús' : 'í mínus'}</div>
        </div>
      </div>

      {/* Overview bar */}
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.06), rgba(139,92,246,0.06))' }}>
        <div className="flex justify-between items-start mb-3">
          <div>
            <div className="text-xs mb-0.5" style={{ color: 'var(--muted)' }}>Útgjöld þessa mánaðar</div>
            <div className="text-2xl font-semibold">{formatISK(total)}</div>
          </div>
          <div className="flex flex-col items-end">
            <div className="text-xs mb-0.5" style={{ color: 'var(--muted)' }}>Eftir</div>
            <div className="text-base font-semibold" style={{ color: isOver ? 'var(--danger)' : 'var(--success)' }}>
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
          <span>Áætlun: {formatISK(budget.monthly)}</span>
        </div>
      </div>

      {/* Add income form */}
      {showIncomeForm && (
        <form onSubmit={handleAddIncome} className="card flex flex-col gap-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Bæta við tekjum</h3>
            <button type="button" onClick={() => setShowIncomeForm(false)}><X size={16} style={{ color: 'var(--muted)' }} /></button>
          </div>
          <input className="input" type="number" placeholder="Upphæð (ISK)" value={incAmount}
                 onChange={e => setIncAmount(e.target.value)} autoFocus />
          <input className="input" placeholder="Athugasemd (valkvæmt)" value={incNote}
                 onChange={e => setIncNote(e.target.value)} />
          <div className="grid grid-cols-4 gap-1.5">
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
                  style={{ background: 'rgba(34,197,94,0.2)', color: 'var(--success)', border: '1px solid rgba(34,197,94,0.3)' }}>
            Bæta við tekjum
          </button>
        </form>
      )}

      {/* Add expense form */}
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
        {[['overview', 'Yfirlit'], ['income', 'Tekjur'], ['transactions', 'Gjöld']].map(([t, l]) => (
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
              Breyta áætlun
            </button>
          </div>
          {showBudgetEdit && (
            <div className="flex flex-col gap-2 p-3 rounded-xl" style={{ background: 'var(--surface2)' }}>
              <div className="text-xs font-medium mb-1" style={{ color: 'var(--muted)' }}>Mánaðarleg fjárhagsáætlun (ISK)</div>
              <input className="input text-sm" type="number" value={budget.monthly}
                onChange={e => setBudget(b => ({ ...b, monthly: Number(e.target.value) }))} />
              <div className="text-xs font-medium mt-1" style={{ color: 'var(--muted)' }}>Tekjumark (ISK)</div>
              <input className="input text-sm" type="number" value={budget.incomeGoal || 200000}
                onChange={e => setBudget(b => ({ ...b, incomeGoal: Number(e.target.value) }))} />
              <div className="grid grid-cols-2 gap-2 mt-1">
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

      {tab === 'income' && (
        <div className="flex flex-col gap-3">
          {/* Income by source */}
          <div className="card flex flex-col gap-3">
            <h3 className="font-semibold text-sm">Tekjur eftir uppsprettu</h3>
            {INCOME_SOURCES.map(s => {
              const amt = incBySrc[s.id] || 0
              const pct = budget.incomeGoal ? Math.min(100, Math.round((amt / budget.incomeGoal) * 100)) : 0
              return (
                <div key={s.id} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-xs">
                    <span>{s.icon} {s.label}</span>
                    <span style={{ color: 'var(--muted)' }}>{formatShortISK(amt)}</span>
                  </div>
                  {amt > 0 && (
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--surface2)' }}>
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: s.color }} />
                    </div>
                  )}
                </div>
              )
            })}
            {budget.incomeGoal > 0 && (
              <div className="pt-2" style={{ borderTop: '1px solid var(--border)' }}>
                <div className="flex justify-between text-xs mb-1.5" style={{ color: 'var(--muted)' }}>
                  <span>Tekjumark mánaðarins</span>
                  <span style={{ color: incomeTotal >= budget.incomeGoal ? 'var(--success)' : 'var(--muted)' }}>
                    {formatShortISK(incomeTotal)} / {formatShortISK(budget.incomeGoal)}
                  </span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--surface2)' }}>
                  <div className="h-full rounded-full transition-all"
                       style={{ width: `${incomePct}%`, background: incomeTotal >= budget.incomeGoal ? 'var(--success)' : 'var(--accent)' }} />
                </div>
              </div>
            )}
          </div>

          {/* Income transactions */}
          {recentIncome.length === 0 ? (
            <div className="card text-center py-8" style={{ color: 'var(--muted)' }}>
              <div className="text-2xl mb-2">💰</div>
              <div className="text-sm">Engar tekjur skráðar</div>
              <div className="text-xs mt-1">Bættu við Lendó leigutekjum og öðrum tekjum</div>
            </div>
          ) : recentIncome.map(i => {
            const src = INCOME_SOURCES.find(s => s.id === i.source) || INCOME_SOURCES[3]
            return (
              <div key={i.id} className="card flex items-center gap-3 py-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-base"
                     style={{ background: `${src.color}22` }}>{src.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium" style={{ color: 'var(--success)' }}>+{formatISK(i.amount)}</div>
                  <div className="text-xs" style={{ color: 'var(--muted)' }}>
                    {src.label}{i.note ? ` · ${i.note}` : ''} · {new Date(i.date).toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })}
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
