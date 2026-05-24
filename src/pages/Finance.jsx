import { useState } from 'react'
import { useFinance } from '../hooks/useFinance'
import { useSubscriptions, POPULAR_SUBS } from '../hooks/useSubscriptions'
import { formatISK, formatShortISK, EXPENSE_CATEGORIES } from '../utils/currency'
import { Plus, Trash2, X, ChevronDown, ArrowDownLeft } from 'lucide-react'

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
          <div className="h-full rounded-full" style={{ width: `${pct}%`, background: isOver ? 'var(--danger)' : cat.color }} />
        </div>
      )}
    </div>
  )
}

function ToggleSwitch({ active, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className="relative shrink-0 transition-all"
      style={{ width: 36, height: 20, borderRadius: 10, background: active ? 'var(--accent)' : 'var(--surface2)' }}
    >
      <div
        className="absolute top-1 w-4 h-4 rounded-full bg-white transition-all"
        style={{ left: active ? 18 : 2 }}
      />
    </button>
  )
}

function SubscriptionsTab() {
  const { subs, add, remove, setStatus, monthlyISK, toMonthlyISK } = useSubscriptions()
  const [showForm, setShowForm] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [name, setName] = useState('')
  const [icon, setIcon] = useState('📱')
  const [amount, setAmount] = useState('')

  const handleAdd = (e) => {
    e.preventDefault()
    if (!name.trim() || !amount) return
    add({ name: name.trim(), icon, amount: Number(amount), currency: 'ISK', period: 'monthly', status: 'active', color: '#64748b' })
    setName('')
    setIcon('📱')
    setAmount('')
    setShowForm(false)
    setShowSuggestions(false)
  }

  const quickAdd = (sub) => {
    add({ name: sub.name, icon: sub.icon, amount: sub.amount, currency: 'ISK', period: 'monthly', status: 'active', color: sub.color || '#64748b' })
  }

  const activeSubs = subs.filter(s => s.status !== 'cancelled')

  return (
    <div className="flex flex-col gap-4">
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.08), rgba(0,212,170,0.06))' }}>
        <div className="flex justify-between items-start mb-1">
          <div>
            <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Mánaðarlegar áskriftir</div>
            <div className="text-3xl font-semibold">{formatISK(monthlyISK)}</div>
          </div>
          <div className="text-right">
            <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Á ári</div>
            <div className="text-lg font-semibold" style={{ color: 'var(--accent)' }}>
              {formatShortISK(monthlyISK * 12)}
            </div>
          </div>
        </div>
        <div className="text-xs" style={{ color: 'var(--muted)' }}>
          {activeSubs.length} virkar · {subs.filter(s => s.status === 'cancelled').length} aflýstar
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="card flex flex-col gap-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Ný áskrift</h3>
            <button type="button" onClick={() => setShowForm(false)}>
              <X size={16} style={{ color: 'var(--muted)' }} />
            </button>
          </div>
          <div className="flex gap-2">
            <input className="input text-sm text-center" style={{ width: 52 }} placeholder="📱"
                   value={icon} onChange={e => setIcon(e.target.value)} maxLength={2} />
            <input className="input text-sm flex-1" placeholder="Nafn áskriftar" value={name}
                   onChange={e => setName(e.target.value)} autoFocus />
          </div>
          <input className="input text-sm" type="number" placeholder="Upphæð á mánuði (ISK)"
                 value={amount} onChange={e => setAmount(e.target.value)} />
          <button type="submit" className="btn btn-primary w-full justify-center">Bæta við</button>

          <button type="button" onClick={() => setShowSuggestions(s => !s)}
                  className="flex items-center justify-center gap-1 text-xs" style={{ color: 'var(--muted)' }}>
            Vinsælar áskriftir <ChevronDown size={12} />
          </button>
          {showSuggestions && (
            <div className="grid grid-cols-2 gap-1.5">
              {POPULAR_SUBS.filter(p => !subs.find(s => s.name === p.name)).map(p => (
                <button key={p.name} type="button" onClick={() => quickAdd(p)}
                        className="flex items-center gap-2 p-2 rounded-xl text-left text-xs"
                        style={{ background: 'var(--surface2)' }}>
                  <span>{p.icon}</span>
                  <div className="min-w-0">
                    <div className="font-medium truncate">{p.name}</div>
                    <div style={{ color: 'var(--muted)' }}>{formatShortISK(p.amount)}/mán</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </form>
      )}

      <div className="flex flex-col gap-2">
        {subs.map(s => {
          const isActive = s.status === 'active'
          return (
            <div key={s.id} className="card flex items-center gap-3 py-3"
                 style={{ opacity: s.status === 'cancelled' ? 0.4 : 1 }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0"
                   style={{ background: `${s.color || '#64748b'}22` }}>
                {s.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold">{s.name}</div>
                <div className="text-xs" style={{ color: 'var(--muted)' }}>
                  {formatISK(toMonthlyISK(s))}/mán · {formatShortISK(toMonthlyISK(s) * 12)}/ár
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <ToggleSwitch active={isActive} onToggle={() => setStatus(s.id, isActive ? 'cancelled' : 'active')} />
                <button onClick={() => remove(s.id)} style={{ color: 'var(--muted)' }}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {!showForm && (
        <button onClick={() => setShowForm(true)} className="btn btn-ghost w-full justify-center text-sm">
          <Plus size={15} /> Bæta við áskrift
        </button>
      )}
    </div>
  )
}

export default function Finance() {
  const {
    addExpense, removeExpense, addIncome, removeIncome,
    budget, setBudget,
    monthlyTotal, monthlyIncome, byCategory, remaining, netSavings,
    recentExpenses, income,
  } = useFinance()
  const { monthlyISK: monthlySubTotal } = useSubscriptions()
  const [showForm, setShowForm] = useState(false)
  const [showIncomeForm, setShowIncomeForm] = useState(false)
  const [showBudgetEdit, setShowBudgetEdit] = useState(false)
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('food')
  const [note, setNote] = useState('')
  const [incomeAmount, setIncomeAmount] = useState('')
  const [incomeSource, setIncomeSource] = useState('Laun')
  const [tab, setTab] = useState('overview')

  const total = monthlyTotal()
  const cats = byCategory()
  const left = remaining()
  const isOver = left < 0
  const pct = Math.min(100, Math.round((total / budget.monthly) * 100))
  const net = netSavings()
  const effectiveIncome = monthlyIncome() || budget.salary || 0

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
    addIncome(Number(incomeAmount), incomeSource)
    setIncomeAmount('')
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
          {tab !== 'subscriptions' && (
            <>
              <button onClick={() => { setShowIncomeForm(!showIncomeForm); setShowForm(false) }}
                      className="btn btn-ghost text-sm">
                <ArrowDownLeft size={14} style={{ color: 'var(--success)' }} /> Tekjur
              </button>
              <button onClick={() => { setShowForm(!showForm); setShowIncomeForm(false) }} className="btn btn-primary">
                <Plus size={16} /> Gjald
              </button>
            </>
          )}
        </div>
      </div>

      {/* Net summary */}
      <div className="grid grid-cols-3 gap-2">
        <div className="card-sm flex flex-col gap-0.5">
          <div className="text-xs" style={{ color: 'var(--muted)' }}>Tekjur</div>
          <div className="text-sm font-semibold tabular-nums" style={{ color: 'var(--success)' }}>
            {effectiveIncome >= 1000000
              ? `${(effectiveIncome / 1000000).toFixed(1)}M`
              : effectiveIncome >= 1000
              ? `${Math.round(effectiveIncome / 1000)}k`
              : effectiveIncome} kr
          </div>
          {!monthlyIncome() && budget.salary > 0 && (
            <div style={{ fontSize: 9, color: 'var(--muted)' }}>Áætlun</div>
          )}
        </div>
        <div className="card-sm flex flex-col gap-0.5">
          <div className="text-xs" style={{ color: 'var(--muted)' }}>Útgjöld</div>
          <div className="text-sm font-semibold tabular-nums" style={{ color: isOver ? 'var(--danger)' : 'var(--text)' }}>
            {total >= 1000000
              ? `${(total / 1000000).toFixed(1)}M`
              : total >= 1000
              ? `${Math.round(total / 1000)}k`
              : total} kr
          </div>
        </div>
        <div className="card-sm flex flex-col gap-0.5">
          <div className="text-xs" style={{ color: 'var(--muted)' }}>Sparnaður</div>
          <div className="text-sm font-semibold tabular-nums" style={{ color: net >= 0 ? 'var(--accent)' : 'var(--danger)' }}>
            {net >= 0 ? '+' : ''}{net >= 1000000
              ? `${(net / 1000000).toFixed(1)}M`
              : net >= 1000 || net <= -1000
              ? `${Math.round(net / 1000)}k`
              : net} kr
          </div>
        </div>
      </div>

      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.06), rgba(139,92,246,0.06))' }}>
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
          <span>Áætlun: {formatISK(budget.monthly)}</span>
        </div>
        {monthlySubTotal > 0 && (
          <div className="mt-2 text-xs" style={{ color: 'var(--muted)' }}>
            Áskriftir: {formatISK(Math.round(monthlySubTotal))} á mánuði innifalið
          </div>
        )}
      </div>

      {showIncomeForm && (
        <form onSubmit={handleAddIncome} className="card flex flex-col gap-3 animate-slide-up"
              style={{ border: '1px solid rgba(34,197,94,0.2)' }}>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm" style={{ color: 'var(--success)' }}>Skrá tekjur</h3>
            <button type="button" onClick={() => setShowIncomeForm(false)}><X size={16} style={{ color: 'var(--muted)' }} /></button>
          </div>
          <input className="input" type="number" placeholder="Upphæð (ISK)" value={incomeAmount}
                 onChange={e => setIncomeAmount(e.target.value)} autoFocus inputMode="numeric" />
          <div className="flex gap-2 flex-wrap">
            {['Laun', 'Hlutafjárhagnaður', 'Aukatekjur', 'Annað'].map(s => (
              <button key={s} type="button" onClick={() => setIncomeSource(s)}
                className="flex-1 py-1.5 rounded-lg text-xs transition-all"
                style={{
                  background: incomeSource === s ? 'rgba(34,197,94,0.15)' : 'var(--surface2)',
                  color: incomeSource === s ? 'var(--success)' : 'var(--muted)',
                  border: `1px solid ${incomeSource === s ? 'rgba(34,197,94,0.3)' : 'transparent'}`,
                }}>{s}</button>
            ))}
          </div>
          <button type="submit" className="btn w-full justify-center"
                  style={{ background: 'var(--success)', color: '#000' }}>Skrá tekjur</button>
        </form>
      )}

      {showForm && (
        <form onSubmit={handleAdd} className="card flex flex-col gap-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Bæta við gjaldi</h3>
            <button type="button" onClick={() => setShowForm(false)}>
              <X size={16} style={{ color: 'var(--muted)' }} />
            </button>
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

      <div className="flex gap-1.5 overflow-x-auto pb-0.5" style={{ scrollbarWidth: 'none' }}>
        {[['overview', 'Yfirlit'], ['transactions', 'Gjöld'], ['income_tab', 'Tekjur'], ['subscriptions', 'Áskriftir']].map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)}
            className="btn text-sm flex-1 justify-center shrink-0"
            style={{
              background: tab === t ? 'rgba(0,212,170,0.12)' : 'var(--surface)',
              color: tab === t ? 'var(--accent)' : 'var(--muted)',
              border: `1px solid ${tab === t ? 'rgba(0,212,170,0.25)' : 'var(--border)'}`,
              fontSize: 12,
              padding: '7px 6px',
            }}>
            {l}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="card flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Eftir flokkum</h3>
            <button onClick={() => setShowBudgetEdit(!showBudgetEdit)} className="text-xs"
                    style={{ color: 'var(--accent)' }}>
              Breyta áætlun
            </button>
          </div>
          {showBudgetEdit && (
            <div className="flex flex-col gap-2 p-3 rounded-xl" style={{ background: 'var(--surface2)' }}>
              <div className="text-xs font-medium mb-1" style={{ color: 'var(--muted)' }}>
                Mánaðarleg fjárhagsáætlun (ISK)
              </div>
              <input className="input text-sm" type="number" value={budget.monthly}
                     onChange={e => setBudget(b => ({ ...b, monthly: Number(e.target.value) }))} />
              <div className="grid grid-cols-2 gap-2">
                {EXPENSE_CATEGORIES.map(c => (
                  <div key={c.id} className="flex flex-col gap-0.5">
                    <label className="text-xs" style={{ color: 'var(--muted)' }}>{c.icon} {c.label}</label>
                    <input className="input text-xs py-1.5" type="number"
                           value={budget.categories[c.id] || ''}
                           onChange={e => setBudget(b => ({
                             ...b,
                             categories: { ...b.categories, [c.id]: Number(e.target.value) },
                           }))} />
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

      {tab === 'income_tab' && (
        <div className="flex flex-col gap-2">
          <button onClick={() => { setShowIncomeForm(true) }}
                  className="btn w-full justify-center"
                  style={{ background: 'rgba(34,197,94,0.1)', color: 'var(--success)', border: '1px solid rgba(34,197,94,0.2)' }}>
            <Plus size={14} /> Skrá tekjur
          </button>
          {(income || []).length === 0 ? (
            <div className="card text-center py-8" style={{ color: 'var(--muted)' }}>
              <div className="text-3xl mb-2">💰</div>
              <div>Engar tekjur skráðar ennþá</div>
              {budget.salary > 0 && (
                <div className="text-xs mt-1">Laun í áætlun: {formatISK(budget.salary)}/mán</div>
              )}
            </div>
          ) : (income || []).slice(0, 20).map(e => (
            <div key={e.id} className="card flex items-center gap-3 py-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                   style={{ background: 'rgba(34,197,94,0.15)' }}>
                <ArrowDownLeft size={16} style={{ color: 'var(--success)' }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold" style={{ color: 'var(--success)' }}>
                  +{formatISK(e.amount)}
                </div>
                <div className="text-xs truncate" style={{ color: 'var(--muted)' }}>
                  {e.source} · {new Date(e.date).toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })}
                </div>
              </div>
              <button onClick={() => removeIncome(e.id)} className="p-1" style={{ color: 'var(--muted)' }}>
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {tab === 'subscriptions' && <SubscriptionsTab />}
    </div>
  )
}
