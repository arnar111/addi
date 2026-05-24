import { useState } from 'react'
import { useFinance } from '../hooks/useFinance'
import { useCurrency } from '../hooks/useCurrency'
import { formatISK, formatShortISK, EXPENSE_CATEGORIES } from '../utils/currency'
import { Plus, Trash2, X, TrendingDown, TrendingUp, RefreshCw } from 'lucide-react'

const INCOME_SOURCES = [
  { id: 'salary', label: 'Laun', icon: '💼', color: '#22c55e' },
  { id: 'freelance', label: 'Frítímavinna', icon: '💻', color: '#3b82f6' },
  { id: 'investment', label: 'Fjárfestingar', icon: '📈', color: '#8b5cf6' },
  { id: 'other', label: 'Annað', icon: '💰', color: '#f97316' },
]

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

function CurrencyTab() {
  const { rates, loading, updatedAt, refresh } = useCurrency()
  const [amount, setAmount] = useState('1000')
  const [fromISK, setFromISK] = useState(true)
  const [targetCurrency, setTargetCurrency] = useState('EUR')

  const CURRENCIES = [
    { code: 'EUR', flag: '🇪🇺', name: 'Evra' },
    { code: 'USD', flag: '🇺🇸', name: 'Bandaríkjadalur' },
    { code: 'GBP', flag: '🇬🇧', name: 'Sterlingspund' },
    { code: 'DKK', flag: '🇩🇰', name: 'Danskt króna' },
    { code: 'NOK', flag: '🇳🇴', name: 'Norsk króna' },
    { code: 'SEK', flag: '🇸🇪', name: 'Sænsk króna' },
  ]

  const rate = rates?.[targetCurrency]

  const converted = () => {
    if (!rate || !amount) return null
    const n = parseFloat(amount)
    if (isNaN(n)) return null
    if (fromISK) return n * rate
    return n / rate
  }

  const result = converted()

  return (
    <div className="flex flex-col gap-4">
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-sm">Gengisreikni</h3>
          {updatedAt && (
            <button onClick={refresh} className="flex items-center gap-1 text-xs" style={{ color: 'var(--muted)' }}>
              <RefreshCw size={11} /> {updatedAt.toLocaleTimeString('is-IS', { hour: '2-digit', minute: '2-digit' })}
            </button>
          )}
        </div>
        <div className="flex gap-2 mb-3">
          <button onClick={() => setFromISK(true)}
            className="flex-1 py-2 rounded-xl text-sm font-medium transition-all"
            style={{
              background: fromISK ? 'rgba(0,212,170,0.15)' : 'var(--surface2)',
              color: fromISK ? 'var(--accent)' : 'var(--muted)',
              border: `1px solid ${fromISK ? 'rgba(0,212,170,0.3)' : 'transparent'}`,
            }}>ISK → {targetCurrency}</button>
          <button onClick={() => setFromISK(false)}
            className="flex-1 py-2 rounded-xl text-sm font-medium transition-all"
            style={{
              background: !fromISK ? 'rgba(0,212,170,0.15)' : 'var(--surface2)',
              color: !fromISK ? 'var(--accent)' : 'var(--muted)',
              border: `1px solid ${!fromISK ? 'rgba(0,212,170,0.3)' : 'transparent'}`,
            }}>{targetCurrency} → ISK</button>
        </div>
        <input className="input text-lg font-semibold mb-3" type="number"
               placeholder="Upphæð..." value={amount}
               onChange={e => setAmount(e.target.value)} />
        {loading ? (
          <div className="text-sm text-center py-2" style={{ color: 'var(--muted)' }}>Sæki gengi...</div>
        ) : result !== null ? (
          <div className="p-3 rounded-xl text-center" style={{ background: 'var(--surface2)' }}>
            <div className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>
              {fromISK
                ? `${result.toFixed(2)} ${targetCurrency}`
                : formatISK(result)}
            </div>
            <div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
              1 ISK = {rate?.toFixed(4)} {targetCurrency}
            </div>
          </div>
        ) : null}
      </div>

      <div className="card">
        <h3 className="font-semibold text-sm mb-3">Gengi gagnvart ISK</h3>
        <div className="flex gap-2 overflow-x-auto pb-1 mb-3" style={{ scrollbarWidth: 'none' }}>
          {CURRENCIES.map(c => (
            <button key={c.code} onClick={() => setTargetCurrency(c.code)}
              className="btn shrink-0 text-xs py-1.5"
              style={{
                background: targetCurrency === c.code ? 'rgba(0,212,170,0.15)' : 'var(--surface2)',
                color: targetCurrency === c.code ? 'var(--accent)' : 'var(--muted)',
                border: `1px solid ${targetCurrency === c.code ? 'rgba(0,212,170,0.3)' : 'transparent'}`,
              }}>{c.flag} {c.code}</button>
          ))}
        </div>
        {loading ? (
          <div className="text-sm text-center py-2" style={{ color: 'var(--muted)' }}>Sæki gengi...</div>
        ) : rates ? (
          <div className="grid grid-cols-2 gap-2">
            {CURRENCIES.map(c => (
              <div key={c.code} className="flex items-center justify-between p-2.5 rounded-xl"
                   style={{ background: 'var(--surface2)' }}>
                <span className="text-sm">{c.flag} {c.code}</span>
                <span className="text-sm font-semibold tabular-nums">
                  {rates[c.code]?.toFixed(4)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-center py-2" style={{ color: 'var(--danger)' }}>Ekki tókst að sækja gengi</div>
        )}
      </div>
    </div>
  )
}

export default function Finance() {
  const {
    addExpense, removeExpense, budget, setBudget, monthlyTotal, byCategory, remaining, recentExpenses,
    addIncome, removeIncome, income, monthlyIncome, netBalance,
  } = useFinance()
  const [showExpenseForm, setShowExpenseForm] = useState(false)
  const [showIncomeForm, setShowIncomeForm] = useState(false)
  const [showBudgetEdit, setShowBudgetEdit] = useState(false)
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('food')
  const [incomeSource, setIncomeSource] = useState('salary')
  const [note, setNote] = useState('')
  const [tab, setTab] = useState('overview')

  const total = monthlyTotal()
  const cats = byCategory()
  const left = remaining()
  const incomeTotal = monthlyIncome()
  const net = netBalance()
  const isOver = left < 0
  const pct = Math.min(100, Math.round((total / budget.monthly) * 100))

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
    if (!amount || isNaN(Number(amount))) return
    addIncome(Number(amount), incomeSource, note)
    setAmount('')
    setNote('')
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
            className="btn btn-ghost text-sm" style={{ color: 'var(--success)', borderColor: 'rgba(34,197,94,0.3)' }}>
            <TrendingUp size={14} /> Tekjur
          </button>
          <button onClick={() => { setShowExpenseForm(!showExpenseForm); setShowIncomeForm(false) }}
            className="btn btn-primary text-sm">
            <Plus size={14} /> Gjald
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-2">
        <div className="card-sm flex flex-col gap-0.5 text-center">
          <div className="text-xs" style={{ color: 'var(--muted)' }}>Tekjur</div>
          <div className="text-sm font-bold" style={{ color: 'var(--success)' }}>{formatShortISK(incomeTotal)}</div>
        </div>
        <div className="card-sm flex flex-col gap-0.5 text-center">
          <div className="text-xs" style={{ color: 'var(--muted)' }}>Gjöld</div>
          <div className="text-sm font-bold" style={{ color: isOver ? 'var(--danger)' : 'var(--text)' }}>{formatShortISK(total)}</div>
        </div>
        <div className="card-sm flex flex-col gap-0.5 text-center">
          <div className="text-xs" style={{ color: 'var(--muted)' }}>Staða</div>
          <div className="text-sm font-bold" style={{ color: net >= 0 ? 'var(--accent)' : 'var(--danger)' }}>
            {net >= 0 ? '+' : ''}{formatShortISK(net)}
          </div>
        </div>
      </div>

      {/* Budget progress card */}
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.06), rgba(139,92,246,0.06))' }}>
        <div className="flex justify-between items-start mb-3">
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
          <span>Áætlun: {formatISK(budget.monthly)}</span>
        </div>
      </div>

      {/* Add expense form */}
      {showExpenseForm && (
        <form onSubmit={handleAddExpense} className="card flex flex-col gap-3 animate-slide-up"
              style={{ border: '1px solid rgba(239,68,68,0.2)' }}>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Bæta við gjaldi</h3>
            <button type="button" onClick={() => setShowExpenseForm(false)}><X size={16} style={{ color: 'var(--muted)' }} /></button>
          </div>
          <input className="input" type="number" placeholder="Upphæð (ISK)" value={amount} onChange={e => setAmount(e.target.value)} autoFocus />
          <input className="input" placeholder="Skýring (valkvæmt)" value={note} onChange={e => setNote(e.target.value)} />
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
            <h3 className="font-semibold text-sm">Bæta við tekjum</h3>
            <button type="button" onClick={() => setShowIncomeForm(false)}><X size={16} style={{ color: 'var(--muted)' }} /></button>
          </div>
          <input className="input" type="number" placeholder="Upphæð (ISK)" value={amount} onChange={e => setAmount(e.target.value)} autoFocus />
          <input className="input" placeholder="Skýring (valkvæmt)" value={note} onChange={e => setNote(e.target.value)} />
          <div className="grid grid-cols-4 gap-1.5">
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
            Bæta við tekjum
          </button>
        </form>
      )}

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-0.5" style={{ scrollbarWidth: 'none' }}>
        {[['overview', 'Yfirlit'], ['transactions', 'Færslur'], ['income', 'Tekjur'], ['currency', 'Gengi']].map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)}
            className="btn text-xs shrink-0"
            style={{
              background: tab === t ? 'rgba(0,212,170,0.12)' : 'var(--surface)',
              color: tab === t ? 'var(--accent)' : 'var(--muted)',
              border: `1px solid ${tab === t ? 'rgba(0,212,170,0.25)' : 'var(--border)'}`,
              padding: '6px 12px',
            }}>{l}</button>
        ))}
      </div>

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

      {tab === 'transactions' && (
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
          {income.length === 0 ? (
            <div className="card text-center py-8" style={{ color: 'var(--muted)' }}>Engar tekjur skráðar ennþá</div>
          ) : income.map(e => {
            const src = INCOME_SOURCES.find(s => s.id === e.source) || INCOME_SOURCES[3]
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

      {tab === 'currency' && <CurrencyTab />}
    </div>
  )
}
