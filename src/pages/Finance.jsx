import { useState } from 'react'
import { useFinance } from '../hooks/useFinance'
import { formatISK, formatShortISK, EXPENSE_CATEGORIES, INCOME_SOURCES } from '../utils/currency'
import { Plus, Trash2, X, TrendingDown, TrendingUp, ArrowDownCircle, ArrowUpCircle } from 'lucide-react'

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
    monthlyTotal, byCategory, remaining, recentExpenses,
    addIncome, removeIncome, monthlyIncome, netBalance, bySource, recentIncome,
  } = useFinance()

  const [mainTab, setMainTab] = useState('overview')
  const [showExpenseForm, setShowExpenseForm] = useState(false)
  const [showIncomeForm, setShowIncomeForm] = useState(false)
  const [showBudgetEdit, setShowBudgetEdit] = useState(false)
  const [subTab, setSubTab] = useState('overview')

  // Expense form
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('food')
  const [note, setNote] = useState('')

  // Income form
  const [incAmount, setIncAmount] = useState('')
  const [source, setSource] = useState('lendo')
  const [incNote, setIncNote] = useState('')

  const total = monthlyTotal()
  const income = monthlyIncome()
  const net = netBalance()
  const cats = byCategory()
  const sources = bySource()
  const left = remaining()
  const isOver = left < 0
  const pct = Math.min(100, Math.round((total / budget.monthly) * 100))
  const netPositive = net >= 0

  const handleAddExpense = (e) => {
    e.preventDefault()
    if (!amount || isNaN(Number(amount))) return
    addExpense(Number(amount), category, note)
    setAmount(''); setNote(''); setShowExpenseForm(false)
  }

  const handleAddIncome = (e) => {
    e.preventDefault()
    if (!incAmount || isNaN(Number(incAmount))) return
    addIncome(Number(incAmount), source, incNote)
    setIncAmount(''); setIncNote(''); setShowIncomeForm(false)
  }

  const MAIN_TABS = [
    ['overview', 'Yfirlit'],
    ['expenses', 'Útgjöld'],
    ['income', 'Tekjur'],
  ]

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
                  className="btn text-sm py-2 px-3"
                  style={{ background: 'rgba(34,197,94,0.12)', color: 'var(--success)', border: '1px solid rgba(34,197,94,0.25)' }}>
            <Plus size={14} /> Tekjur
          </button>
          <button onClick={() => { setShowExpenseForm(!showExpenseForm); setShowIncomeForm(false) }}
                  className="btn btn-primary text-sm py-2 px-3">
            <Plus size={14} /> Gjald
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-2">
        <div className="card flex flex-col gap-1 p-3" style={{ background: 'rgba(34,197,94,0.07)', border: '1px solid rgba(34,197,94,0.15)' }}>
          <div className="flex items-center gap-1">
            <ArrowDownCircle size={12} style={{ color: 'var(--success)' }} />
            <span className="text-xs" style={{ color: 'var(--muted)' }}>Tekjur</span>
          </div>
          <div className="font-bold text-base" style={{ color: 'var(--success)' }}>{formatShortISK(income)}</div>
        </div>
        <div className="card flex flex-col gap-1 p-3" style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.15)' }}>
          <div className="flex items-center gap-1">
            <ArrowUpCircle size={12} style={{ color: 'var(--danger)' }} />
            <span className="text-xs" style={{ color: 'var(--muted)' }}>Útgjöld</span>
          </div>
          <div className="font-bold text-base" style={{ color: 'var(--danger)' }}>{formatShortISK(total)}</div>
        </div>
        <div className="card flex flex-col gap-1 p-3"
             style={{
               background: netPositive ? 'rgba(0,212,170,0.07)' : 'rgba(239,68,68,0.07)',
               border: `1px solid ${netPositive ? 'rgba(0,212,170,0.2)' : 'rgba(239,68,68,0.2)'}`,
             }}>
          <div className="flex items-center gap-1">
            {netPositive ? <TrendingUp size={12} style={{ color: 'var(--accent)' }} /> : <TrendingDown size={12} style={{ color: 'var(--danger)' }} />}
            <span className="text-xs" style={{ color: 'var(--muted)' }}>Nettó</span>
          </div>
          <div className="font-bold text-base" style={{ color: netPositive ? 'var(--accent)' : 'var(--danger)' }}>
            {netPositive ? '+' : ''}{formatShortISK(net)}
          </div>
        </div>
      </div>

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
          <button type="submit" className="btn btn-primary w-full justify-center">Bæta við gjaldi</button>
        </form>
      )}

      {/* Income form */}
      {showIncomeForm && (
        <form onSubmit={handleAddIncome} className="card flex flex-col gap-3 animate-slide-up"
              style={{ border: '1px solid rgba(34,197,94,0.25)' }}>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm" style={{ color: 'var(--success)' }}>Bæta við tekjum</h3>
            <button type="button" onClick={() => setShowIncomeForm(false)}><X size={16} style={{ color: 'var(--muted)' }} /></button>
          </div>
          <input className="input" type="number" placeholder="Upphæð (ISK)" value={incAmount}
                 onChange={e => setIncAmount(e.target.value)} autoFocus />
          <input className="input" placeholder="Skýring (valkvæmt)" value={incNote}
                 onChange={e => setIncNote(e.target.value)} />
          <div className="grid grid-cols-5 gap-1.5">
            {INCOME_SOURCES.map(s => (
              <button key={s.id} type="button" onClick={() => setSource(s.id)}
                className="flex flex-col items-center gap-0.5 py-2 rounded-xl text-xs transition-all"
                style={{
                  background: source === s.id ? `${s.color}22` : 'var(--surface2)',
                  border: `1px solid ${source === s.id ? s.color + '55' : 'transparent'}`,
                }}>
                <span>{s.icon}</span>
                <span style={{ color: source === s.id ? s.color : 'var(--muted)', fontSize: 10 }}>{s.label}</span>
              </button>
            ))}
          </div>
          <button type="submit" className="btn w-full justify-center"
                  style={{ background: 'var(--success)', color: '#000' }}>Bæta við tekjum</button>
        </form>
      )}

      {/* Main tabs */}
      <div className="flex gap-1.5">
        {MAIN_TABS.map(([t, l]) => (
          <button key={t} onClick={() => setMainTab(t)}
            className="btn text-sm flex-1 justify-center py-2"
            style={{
              background: mainTab === t ? 'rgba(0,212,170,0.12)' : 'var(--surface)',
              color: mainTab === t ? 'var(--accent)' : 'var(--muted)',
              border: `1px solid ${mainTab === t ? 'rgba(0,212,170,0.25)' : 'var(--border)'}`,
            }}>{l}
          </button>
        ))}
      </div>

      {/* Overview tab */}
      {mainTab === 'overview' && (
        <>
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

          <div className="card flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">Eftir flokkum</h3>
              <button onClick={() => setShowBudgetEdit(!showBudgetEdit)}
                      className="text-xs" style={{ color: 'var(--accent)' }}>
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

      {/* Expenses tab */}
      {mainTab === 'expenses' && (
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

      {/* Income tab */}
      {mainTab === 'income' && (
        <div className="flex flex-col gap-3">
          {/* Source breakdown */}
          {Object.keys(sources).length > 0 && (
            <div className="card flex flex-col gap-3">
              <h3 className="font-semibold text-sm">Eftir uppruna</h3>
              {INCOME_SOURCES.filter(s => sources[s.id]).map(s => {
                const amt = sources[s.id] || 0
                return (
                  <div key={s.id} className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm shrink-0"
                         style={{ background: `${s.color}22` }}>{s.icon}</div>
                    <div className="flex-1 text-sm">{s.label}</div>
                    <div className="text-sm font-semibold" style={{ color: 'var(--success)' }}>{formatShortISK(amt)}</div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Income list */}
          {recentIncome.length === 0 ? (
            <div className="card text-center py-8" style={{ color: 'var(--muted)' }}>
              <div className="text-2xl mb-2">🏡</div>
              <div>Engar tekjur skráðar ennþá</div>
              <div className="text-xs mt-1">Bættu við Lendó leigutekjum eða öðrum tekjum</div>
            </div>
          ) : recentIncome.map(e => {
            const src = INCOME_SOURCES.find(s => s.id === e.source) || INCOME_SOURCES[4]
            return (
              <div key={e.id} className="card flex items-center gap-3 py-3"
                   style={{ border: '1px solid rgba(34,197,94,0.12)' }}>
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
