import { useState } from 'react'
import { useFinance } from '../hooks/useFinance'
import { useLendo } from '../hooks/useLendo'
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

const TABS = ['Yfirlit', 'Útgjöld', 'Tekjur']

export default function Finance() {
  const {
    addExpense, removeExpense, budget, setBudget,
    monthlyTotal, byCategory, remaining, recentExpenses
  } = useFinance()
  const lendo = useLendo()

  const [showForm, setShowForm] = useState(false)
  const [showBudgetEdit, setShowBudgetEdit] = useState(false)
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('food')
  const [note, setNote] = useState('')
  const [tab, setTab] = useState(0)

  // Lendó add form
  const [addingIncome, setAddingIncome] = useState(false)
  const [incomeAmount, setIncomeAmount] = useState('')
  const [incomeName, setIncomeName] = useState('')

  const total = monthlyTotal()
  const cats = byCategory()
  const left = remaining()
  const isOver = left < 0
  const pct = Math.min(100, Math.round((total / budget.monthly) * 100))

  const netBalance = lendo.monthlyIncome - total

  const handleAddExpense = (e) => {
    e.preventDefault()
    if (!amount || isNaN(Number(amount))) return
    addExpense(Number(amount), category, note)
    setAmount('')
    setNote('')
    setShowForm(false)
  }

  function handleAddIncome(e) {
    e.preventDefault()
    if (!incomeAmount) return
    lendo.addEntry({ amount: Number(incomeAmount), listing: incomeName || 'Leiga' })
    setIncomeAmount('')
    setIncomeName('')
    setAddingIncome(false)
  }

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-bold">Fjármál</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            {new Date().toLocaleDateString('is-IS', { month: 'long', year: 'numeric' })}
          </p>
        </div>
        <div className="flex gap-2">
          {tab === 2 ? (
            <button onClick={() => setAddingIncome(a => !a)} className="btn btn-primary" style={{ fontSize: 13 }}>
              <Plus size={15} /> Tekja
            </button>
          ) : (
            <button onClick={() => setShowForm(!showForm)} className="btn btn-primary" style={{ fontSize: 13 }}>
              <Plus size={15} /> Gjald
            </button>
          )}
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-2">
        <div className="card-sm">
          <div className="flex items-center gap-1 text-xs mb-1" style={{ color: 'var(--muted)' }}>
            <ArrowUpRight size={12} style={{ color: '#22c55e' }} /> Tekjur
          </div>
          <div className="font-bold text-base" style={{ color: '#22c55e' }}>
            {formatShortISK(lendo.monthlyIncome)}
          </div>
        </div>
        <div className="card-sm">
          <div className="flex items-center gap-1 text-xs mb-1" style={{ color: 'var(--muted)' }}>
            <ArrowDownRight size={12} style={{ color: 'var(--danger)' }} /> Útgjöld
          </div>
          <div className="font-bold text-base" style={{ color: 'var(--danger)' }}>
            {formatShortISK(total)}
          </div>
        </div>
        <div className="card-sm">
          <div className="flex items-center gap-1 text-xs mb-1" style={{ color: 'var(--muted)' }}>
            {netBalance >= 0 ? <TrendingUp size={12} style={{ color: 'var(--accent)' }} /> : <TrendingDown size={12} style={{ color: 'var(--danger)' }} />}
            Staða
          </div>
          <div className="font-bold text-base" style={{ color: netBalance >= 0 ? 'var(--accent)' : 'var(--danger)' }}>
            {netBalance >= 0 ? '+' : ''}{formatShortISK(netBalance)}
          </div>
        </div>
      </div>

      {/* Budget progress */}
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.06), rgba(139,92,246,0.06))' }}>
        <div className="flex justify-between items-start mb-3">
          <div>
            <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Útgjöld á móti fjárhagsáætlun</div>
            <div className="text-2xl font-bold">{formatISK(total)}</div>
          </div>
          <div className="text-right">
            <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Eftir</div>
            <div className="text-lg font-bold" style={{ color: isOver ? 'var(--danger)' : 'var(--success)' }}>
              {isOver ? '-' : ''}{formatISK(Math.abs(left))}
            </div>
          </div>
        </div>
        <div className="h-2.5 rounded-full overflow-hidden mb-1.5" style={{ background: 'var(--surface2)' }}>
          <div className="h-full rounded-full transition-all"
               style={{ width: `${pct}%`, background: isOver ? 'var(--danger)' : pct > 80 ? '#f97316' : 'var(--accent)' }} />
        </div>
        <div className="flex justify-between text-xs" style={{ color: 'var(--muted)' }}>
          <span>{pct}% notað</span>
          <button onClick={() => setShowBudgetEdit(!showBudgetEdit)} style={{ color: 'var(--accent)' }}>
            Áætlun: {formatISK(budget.monthly)} ✎
          </button>
        </div>
      </div>

      {/* Lendó income progress */}
      <div className="card" style={{ borderColor: 'rgba(34,197,94,0.2)', background: 'rgba(34,197,94,0.04)' }}>
        <div className="flex items-center gap-2 mb-2">
          <span>🏠</span>
          <span className="text-sm font-semibold">Lendó Tekjumarkmið</span>
        </div>
        <div className="flex justify-between mb-1.5">
          <span className="font-bold text-xl" style={{ color: '#22c55e' }}>{formatISK(lendo.monthlyIncome)}</span>
          <span className="text-sm" style={{ color: 'var(--muted)' }}>af {formatISK(lendo.monthlyGoal)}</span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--surface2)' }}>
          <div className="h-full rounded-full transition-all"
               style={{ width: `${lendo.goalProgress}%`, background: lendo.goalProgress >= 100 ? '#22c55e' : '#00d4aa' }} />
        </div>
        <div className="text-xs mt-1.5" style={{ color: 'var(--muted)' }}>
          {lendo.goalProgress.toFixed(0)}% náð — {formatISK(Math.max(0, lendo.monthlyGoal - lendo.monthlyIncome))} á eftir
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'var(--surface)' }}>
        {TABS.map((t, i) => (
          <button key={t} onClick={() => setTab(i)}
            className="flex-1 py-2 rounded-lg text-xs font-semibold transition-all"
            style={{
              background: tab === i ? 'var(--accent)' : 'transparent',
              color: tab === i ? '#000' : 'var(--muted)',
            }}>
            {t}
          </button>
        ))}
      </div>

      {/* Add expense form */}
      {showForm && tab !== 2 && (
        <form onSubmit={handleAddExpense} className="card flex flex-col gap-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Bæta við gjaldi</h3>
            <button type="button" onClick={() => setShowForm(false)}><X size={16} style={{ color: 'var(--muted)' }} /></button>
          </div>
          <input className="input" type="number" placeholder="Upphæð (ISK)" value={amount}
            onChange={e => setAmount(e.target.value)} autoFocus />
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
                <span style={{ color: category === c.id ? c.color : 'var(--muted)', fontSize: 9 }}>{c.label}</span>
              </button>
            ))}
          </div>
          <button type="submit" className="btn btn-primary w-full justify-center">Vista gjald</button>
        </form>
      )}

      {/* Budget edit */}
      {showBudgetEdit && (
        <div className="card flex flex-col gap-2 animate-slide-up">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold">Fjárhagsáætlun</span>
            <button onClick={() => setShowBudgetEdit(false)}>
              <X size={16} style={{ color: 'var(--muted)' }} />
            </button>
          </div>
          <div>
            <label className="text-xs" style={{ color: 'var(--muted)' }}>Mánaðarleg heildaráætlun (ISK)</label>
            <input className="input mt-1" type="number" value={budget.monthly}
              onChange={e => setBudget(b => ({ ...b, monthly: Number(e.target.value) }))} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            {EXPENSE_CATEGORIES.map(c => (
              <div key={c.id} className="flex flex-col gap-0.5">
                <label className="text-xs" style={{ color: 'var(--muted)' }}>{c.icon} {c.label}</label>
                <input className="input text-xs py-1.5" type="number"
                  value={budget.categories[c.id] || ''}
                  placeholder="0"
                  onChange={e => setBudget(b => ({ ...b, categories: { ...b.categories, [c.id]: Number(e.target.value) } }))} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 0: Overview */}
      {tab === 0 && (
        <div className="card flex flex-col gap-4">
          <div className="text-sm font-semibold">Útgjöld eftir flokkum</div>
          <div className="flex flex-col gap-3">
            {EXPENSE_CATEGORIES.map(c => (
              <CategoryBar key={c.id} cat={c} spent={cats[c.id] || 0} budget={budget.categories[c.id]} />
            ))}
          </div>
        </div>
      )}

      {/* Tab 1: Transactions */}
      {tab === 1 && (
        <div className="flex flex-col gap-2">
          {recentExpenses.length === 0 ? (
            <div className="card text-center py-8" style={{ color: 'var(--muted)' }}>
              <div className="text-3xl mb-2">💸</div>
              Engar færslur ennþá
            </div>
          ) : recentExpenses.map(e => {
            const cat = EXPENSE_CATEGORIES.find(c => c.id === e.category) || EXPENSE_CATEGORIES[7]
            return (
              <div key={e.id} className="card flex items-center gap-3 py-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-base"
                     style={{ background: `${cat.color}22` }}>{cat.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold">{formatISK(e.amount)}</div>
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

      {/* Tab 2: Income (Lendó) */}
      {tab === 2 && (
        <div className="flex flex-col gap-3">
          {addingIncome && (
            <form onSubmit={handleAddIncome} className="card flex flex-col gap-3 animate-slide-up">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">Bæta við tekju</span>
                <button type="button" onClick={() => setAddingIncome(false)}><X size={16} style={{ color: 'var(--muted)' }} /></button>
              </div>
              <input className="input" type="number" placeholder="Upphæð (ISK)" value={incomeAmount}
                onChange={e => setIncomeAmount(e.target.value)} autoFocus />
              <input className="input" placeholder="Skýring (t.d. Veislusett)" value={incomeName}
                onChange={e => setIncomeName(e.target.value)} />
              <button type="submit" className="btn btn-primary w-full justify-center">Vista tekju</button>
            </form>
          )}

          {/* Lendó listings */}
          <div className="card">
            <div className="text-sm font-semibold mb-3">🏠 Lendó skráningar</div>
            {lendo.listings.map(l => (
              <div key={l.id} className="flex items-center gap-3 py-2"
                   style={{ borderBottom: '1px solid var(--border)' }}>
                <div className="flex-1">
                  <div className="text-sm">{l.name}</div>
                  <div className="text-xs" style={{ color: 'var(--muted)' }}>
                    {formatISK(l.pricePerDay)}/dag
                  </div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${l.active ? 'text-green-400' : 'text-gray-500'}`}
                      style={{ background: l.active ? 'rgba(34,197,94,0.12)' : 'var(--surface2)' }}>
                  {l.active ? '● Virkt' : '○ Óvirkt'}
                </span>
              </div>
            ))}
          </div>

          {/* Income entries */}
          <div className="flex flex-col gap-2">
            {lendo.monthlyEntries.length === 0 ? (
              <div className="card text-center py-6" style={{ color: 'var(--muted)' }}>
                <div className="text-3xl mb-2">🏠</div>
                Engar tekjur skráðar þennan mánuð
              </div>
            ) : lendo.monthlyEntries.map(e => (
              <div key={e.id} className="card flex items-center gap-3 py-3"
                   style={{ borderLeft: '3px solid #22c55e' }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base"
                     style={{ background: 'rgba(34,197,94,0.12)' }}>🏠</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold" style={{ color: '#22c55e' }}>
                    +{formatISK(e.amount)}
                  </div>
                  <div className="text-xs" style={{ color: 'var(--muted)' }}>
                    {e.listing || 'Leiga'} · {new Date(e.date).toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
                <button onClick={() => lendo.removeEntry(e.id)} style={{ color: 'var(--muted)' }}>
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
