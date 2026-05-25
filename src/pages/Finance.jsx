import { useState } from 'react'
import { useFinance } from '../hooks/useFinance'
import { formatISK, formatShortISK, EXPENSE_CATEGORIES } from '../utils/currency'
import { Plus, Trash2, X, TrendingDown, TrendingUp, ToggleLeft, ToggleRight } from 'lucide-react'

const INCOME_SOURCES = [
  { id: 'lendo', label: 'Lendó', icon: '🏡' },
  { id: 'salary', label: 'Laun', icon: '💼' },
  { id: 'freelance', label: 'Verktöku', icon: '💻' },
  { id: 'other', label: 'Annað', icon: '💰' },
]

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
    addExpense, removeExpense, budget, setBudget, monthlyTotal, byCategory, remaining, recentExpenses,
    addIncome, removeIncome, monthlyIncome, monthlyBalance, recentIncome,
    subscriptions, setSubscriptions, activeSubscriptionTotal,
  } = useFinance()

  const [showForm, setShowForm] = useState(false)
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
  const income = monthlyIncome()
  const balance = monthlyBalance()
  const isOver = left < 0

  const pct = Math.min(100, Math.round((total / budget.monthly) * 100))

  const handleAdd = (e) => {
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
    addIncome(Number(incomeAmount), incomeSource, incomeNote)
    setIncomeAmount('')
    setIncomeNote('')
    setShowIncomeForm(false)
  }

  const toggleSub = (id) => {
    setSubscriptions(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s))
  }

  const TABS = [
    { id: 'overview', label: 'Yfirlit' },
    { id: 'transactions', label: 'Færslur' },
    { id: 'income', label: 'Tekjur' },
    { id: 'subscriptions', label: 'Áskriftir' },
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
          <button onClick={() => { setShowIncomeForm(!showIncomeForm); setShowForm(false) }}
                  className="btn btn-ghost text-sm" style={{ padding: '7px 12px' }}>
            <Plus size={15} /> Tekjur
          </button>
          <button onClick={() => { setShowForm(!showForm); setShowIncomeForm(false) }}
                  className="btn btn-primary">
            <Plus size={16} /> Gjald
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-2">
        <div className="card-sm flex flex-col gap-0.5">
          <div className="text-xs" style={{ color: 'var(--muted)' }}>Útgjöld</div>
          <div className="text-base font-bold" style={{ color: isOver ? 'var(--danger)' : 'var(--text)' }}>
            {formatShortISK(total)}
          </div>
        </div>
        <div className="card-sm flex flex-col gap-0.5">
          <div className="text-xs" style={{ color: 'var(--muted)' }}>Tekjur</div>
          <div className="text-base font-bold" style={{ color: 'var(--success)' }}>{formatShortISK(income)}</div>
        </div>
        <div className="card-sm flex flex-col gap-0.5">
          <div className="text-xs" style={{ color: 'var(--muted)' }}>Staða</div>
          <div className="text-base font-bold" style={{ color: balance >= 0 ? 'var(--accent)' : 'var(--danger)' }}>
            {balance >= 0 ? '+' : ''}{formatShortISK(balance)}
          </div>
        </div>
      </div>

      {/* Budget overview */}
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.06), rgba(139,92,246,0.06))' }}>
        <div className="flex justify-between items-start mb-3">
          <div>
            <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Útgjöld þessa mánaðar</div>
            <div className="text-3xl font-semibold">{formatISK(total)}</div>
          </div>
          <div className="flex flex-col items-end">
            <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Eftir af áætlun</div>
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
          <span>Áætlun: {formatISK(budget.monthly)}</span>
        </div>
      </div>

      {/* Add expense form */}
      {showForm && (
        <form onSubmit={handleAdd} className="card flex flex-col gap-3 animate-slide-up">
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
              style={{ border: '1px solid rgba(34,197,94,0.2)' }}>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Bæta við tekjum</h3>
            <button type="button" onClick={() => setShowIncomeForm(false)}><X size={16} style={{ color: 'var(--muted)' }} /></button>
          </div>
          <input className="input" type="number" placeholder="Upphæð (ISK)" value={incomeAmount}
                 onChange={e => setIncomeAmount(e.target.value)} autoFocus />
          <input className="input" placeholder="Skýring (valkvæmt)" value={incomeNote}
                 onChange={e => setIncomeNote(e.target.value)} />
          <div className="grid grid-cols-4 gap-1.5">
            {INCOME_SOURCES.map(s => (
              <button key={s.id} type="button" onClick={() => setIncomeSource(s.id)}
                className="flex flex-col items-center gap-0.5 py-2 rounded-xl text-xs transition-all"
                style={{
                  background: incomeSource === s.id ? 'rgba(34,197,94,0.12)' : 'var(--surface2)',
                  border: `1px solid ${incomeSource === s.id ? 'rgba(34,197,94,0.4)' : 'transparent'}`,
                }}>
                <span>{s.icon}</span>
                <span style={{ color: incomeSource === s.id ? 'var(--success)' : 'var(--muted)', fontSize: 10 }}>{s.label}</span>
              </button>
            ))}
          </div>
          <button type="submit" className="btn w-full justify-center"
                  style={{ background: 'var(--success)', color: '#000' }}>
            Bæta við tekjum
          </button>
        </form>
      )}

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-0.5" style={{ scrollbarWidth: 'none' }}>
        {TABS.map(({ id, label }) => (
          <button key={id} onClick={() => setTab(id)}
            className="btn text-sm shrink-0"
            style={{
              background: tab === id ? 'rgba(0,212,170,0.12)' : 'var(--surface)',
              color: tab === id ? 'var(--accent)' : 'var(--muted)',
              border: `1px solid ${tab === id ? 'rgba(0,212,170,0.25)' : 'var(--border)'}`,
            }}>{label}</button>
        ))}
      </div>

      {/* Overview tab */}
      {tab === 'overview' && (
        <div className="card flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Eftir flokkum</h3>
            <button onClick={() => setShowBudgetEdit(!showBudgetEdit)} className="text-xs" style={{ color: 'var(--accent)' }}>
              Breyta áætlun
            </button>
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
        <div className="flex flex-col gap-3">
          {/* Lendó highlight */}
          <div className="card" style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.08), rgba(0,212,170,0.05))', border: '1px solid rgba(34,197,94,0.15)' }}>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">🏡</span>
              <div>
                <div className="font-semibold text-sm">Lendó – Leigutekjur</div>
                <div className="text-xs" style={{ color: 'var(--muted)' }}>
                  Þetta månuð: <span className="font-bold" style={{ color: 'var(--success)' }}>
                    {formatISK(recentIncome.filter(i => i.source === 'lendo' && new Date(i.date).getMonth() === new Date().getMonth()).reduce((s, i) => s + i.amount, 0))}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm">Tekjur þessa mánaðar</h3>
              <span className="font-bold text-sm" style={{ color: 'var(--success)' }}>{formatISK(monthlyIncome())}</span>
            </div>
            {recentIncome.length === 0 ? (
              <div className="text-center py-6 text-sm" style={{ color: 'var(--muted)' }}>
                Engar tekjur skráðar ennþá
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {recentIncome.map(e => {
                  const src = INCOME_SOURCES.find(s => s.id === e.source) || INCOME_SOURCES[3]
                  return (
                    <div key={e.id} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-base"
                           style={{ background: 'rgba(34,197,94,0.12)' }}>{src.icon}</div>
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
        </div>
      )}

      {/* Subscriptions tab */}
      {tab === 'subscriptions' && (
        <div className="flex flex-col gap-3">
          <div className="card" style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.06), rgba(0,212,170,0.04))', border: '1px solid rgba(139,92,246,0.12)' }}>
            <div className="flex justify-between items-center">
              <div>
                <div className="text-xs" style={{ color: 'var(--muted)' }}>Virkar áskriftir / mánuð</div>
                <div className="text-2xl font-bold mt-0.5">{formatISK(activeSubscriptionTotal())}</div>
              </div>
              <div className="text-3xl">📱</div>
            </div>
          </div>

          <div className="card flex flex-col gap-3">
            {subscriptions.map(s => (
              <div key={s.id} className="flex items-center gap-3 py-1">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-lg"
                     style={{ background: s.active ? 'rgba(0,212,170,0.1)' : 'var(--surface2)' }}>
                  {s.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium" style={{ color: s.active ? 'var(--text)' : 'var(--muted)' }}>
                    {s.name}
                  </div>
                  <div className="text-xs" style={{ color: 'var(--muted)' }}>{formatISK(s.amount)} / mánuður</div>
                </div>
                <button onClick={() => toggleSub(s.id)} className="shrink-0 transition-all">
                  {s.active
                    ? <ToggleRight size={24} style={{ color: 'var(--accent)' }} />
                    : <ToggleLeft size={24} style={{ color: 'var(--muted)' }} />}
                </button>
              </div>
            ))}
          </div>

          <div className="card text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>
            💡 Kveiktu/slökktu á áskriftum til að sjá hvað þú ert að greiða í hverjum mánuði.
          </div>
        </div>
      )}
    </div>
  )
}
