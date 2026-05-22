import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useFinance } from '../hooks/useFinance'
import { useSubscriptions } from '../hooks/useSubscriptions'
import { formatISK, formatShortISK, EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../utils/currency'
import { Plus, Trash2, X, TrendingDown, TrendingUp, AlertTriangle, CheckCircle, Minus } from 'lucide-react'

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

function ExpensesTab({ addExpense, removeExpense, budget, setBudget, monthlyTotal, byCategory, remaining, recentExpenses }) {
  const [showForm, setShowForm] = useState(false)
  const [showBudgetEdit, setShowBudgetEdit] = useState(false)
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('food')
  const [note, setNote] = useState('')

  const total = monthlyTotal()
  const cats = byCategory()
  const left = remaining()
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

  return (
    <div className="flex flex-col gap-4">
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.06), rgba(139,92,246,0.06))' }}>
        <div className="flex justify-between items-start mb-3">
          <div>
            <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Útgjöld þessa mánaðar</div>
            <div className="text-3xl font-semibold">{formatISK(total)}</div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className="text-xs" style={{ color: 'var(--muted)' }}>Eftir</div>
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

      <button onClick={() => setShowForm(!showForm)} className="btn btn-primary w-full justify-center">
        <Plus size={16} /> Skrá gjald
      </button>

      {showForm && (
        <form onSubmit={handleAdd} className="card flex flex-col gap-3 animate-slide-up">
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
                <span style={{ color: category === c.id ? c.color : 'var(--muted)', fontSize: 10 }}>{c.label}</span>
              </button>
            ))}
          </div>
          <button type="submit" className="btn btn-primary w-full justify-center">Bæta við</button>
        </form>
      )}

      <div className="card flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm">Eftir flokkum</h3>
          <button onClick={() => setShowBudgetEdit(!showBudgetEdit)} className="text-xs" style={{ color: 'var(--accent)' }}>
            Breyta áætlun
          </button>
        </div>
        {showBudgetEdit && (
          <div className="flex flex-col gap-2 p-3 rounded-xl" style={{ background: 'var(--surface2)' }}>
            <div className="text-xs font-medium mb-1" style={{ color: 'var(--muted)' }}>Mánaðarleg áætlun (ISK)</div>
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

      <div className="flex flex-col gap-2">
        <h3 className="font-semibold text-sm px-1">Nýlegar færslur</h3>
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
    </div>
  )
}

function IncomeTab({ addIncome, removeIncome, budget, setBudget, monthlyIncome, byIncomeCategory, recentIncome }) {
  const [showForm, setShowForm] = useState(false)
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('lendo')
  const [note, setNote] = useState('')

  const total = monthlyIncome()
  const goal = budget.incomeGoal || 200000
  const pct = Math.min(100, Math.round((total / goal) * 100))
  const cats = byIncomeCategory()

  const handleAdd = (e) => {
    e.preventDefault()
    if (!amount || isNaN(Number(amount))) return
    addIncome(Number(amount), category, note)
    setAmount('')
    setNote('')
    setShowForm(false)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.08), rgba(0,212,170,0.06))' }}>
        <div className="flex justify-between items-start mb-3">
          <div>
            <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Heildartekjur þessa mánaðar</div>
            <div className="text-3xl font-semibold" style={{ color: 'var(--success)' }}>{formatISK(total)}</div>
          </div>
          <div className="text-right">
            <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Lendó markmið</div>
            <div className="text-lg font-semibold" style={{ color: 'var(--accent)' }}>{formatISK(goal)}</div>
          </div>
        </div>
        <div className="h-2.5 rounded-full overflow-hidden mb-1" style={{ background: 'var(--surface2)' }}>
          <div className="h-full rounded-full transition-all"
            style={{ width: `${pct}%`, background: pct >= 100 ? 'var(--success)' : 'var(--accent)' }} />
        </div>
        <div className="flex justify-between text-xs" style={{ color: 'var(--muted)' }}>
          <span>{pct}% af marki</span>
          <button onClick={() => setBudget(b => ({ ...b, incomeGoal: Number(prompt('Tekjumark (ISK):', goal) || goal) }))}
            className="text-xs" style={{ color: 'var(--accent)' }}>Breyta marki</button>
        </div>
      </div>

      <button onClick={() => setShowForm(!showForm)} className="btn btn-primary w-full justify-center"
        style={{ background: 'var(--success)', color: '#000' }}>
        <Plus size={16} /> Skrá tekjur
      </button>

      {showForm && (
        <form onSubmit={handleAdd} className="card flex flex-col gap-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Bæta við tekjum</h3>
            <button type="button" onClick={() => setShowForm(false)}><X size={16} style={{ color: 'var(--muted)' }} /></button>
          </div>
          <input className="input" type="number" placeholder="Upphæð (ISK)" value={amount}
            onChange={e => setAmount(e.target.value)} autoFocus />
          <input className="input" placeholder="Skýring (t.d. Borðaleiga helgi)" value={note} onChange={e => setNote(e.target.value)} />
          <div className="grid grid-cols-3 gap-1.5">
            {INCOME_CATEGORIES.map(c => (
              <button key={c.id} type="button" onClick={() => setCategory(c.id)}
                className="flex flex-col items-center gap-0.5 py-2.5 rounded-xl text-xs transition-all"
                style={{
                  background: category === c.id ? `${c.color}22` : 'var(--surface2)',
                  border: `1px solid ${category === c.id ? c.color + '55' : 'transparent'}`,
                }}>
                <span className="text-lg">{c.icon}</span>
                <span style={{ color: category === c.id ? c.color : 'var(--muted)', fontSize: 10 }}>{c.label}</span>
              </button>
            ))}
          </div>
          <button type="submit" className="btn btn-primary w-full justify-center"
            style={{ background: 'var(--success)', color: '#000' }}>Bæta við</button>
        </form>
      )}

      <div className="card flex flex-col gap-3">
        <h3 className="font-semibold text-sm">Eftir flokkum</h3>
        {INCOME_CATEGORIES.map(c => {
          const amt = cats[c.id] || 0
          if (amt === 0 && c.id !== 'lendo') return null
          return (
            <div key={c.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <span>{c.icon}</span>
                <span>{c.label}</span>
              </div>
              <span className="text-sm font-semibold" style={{ color: amt > 0 ? 'var(--success)' : 'var(--muted)' }}>
                {formatShortISK(amt)}
              </span>
            </div>
          )
        })}
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="font-semibold text-sm px-1">Nýlegar tekjur</h3>
        {recentIncome.length === 0 ? (
          <div className="card text-center py-8" style={{ color: 'var(--muted)' }}>
            Engar tekjur skráðar ennþá 🪑
          </div>
        ) : recentIncome.map(e => {
          const cat = INCOME_CATEGORIES.find(c => c.id === e.category) || INCOME_CATEGORIES[4]
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
    </div>
  )
}

function SubscriptionsTab() {
  const { subs, add, remove, updateStatus, monthlyTotal, alerts } = useSubscriptions()
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [icon, setIcon] = useState('📱')
  const [amount, setAmount] = useState('')

  const handleAdd = (e) => {
    e.preventDefault()
    if (!name.trim() || !amount) return
    add(name.trim(), icon, amount)
    setName('')
    setIcon('📱')
    setAmount('')
    setShowForm(false)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.06), rgba(139,92,246,0.06))' }}>
        <div className="flex justify-between items-center mb-1">
          <div className="text-xs" style={{ color: 'var(--muted)' }}>Samtals á mánuði</div>
          {alerts.length > 0 && (
            <span className="badge" style={{ background: 'rgba(239,68,68,0.15)', color: 'var(--danger)' }}>
              {alerts.length} vandamál
            </span>
          )}
        </div>
        <div className="text-3xl font-semibold">{formatISK(monthlyTotal())}</div>
        <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
          {subs.length} áskriftir
        </div>
      </div>

      <button onClick={() => setShowForm(!showForm)} className="btn btn-primary w-full justify-center">
        <Plus size={16} /> Bæta við áskrift
      </button>

      {showForm && (
        <form onSubmit={handleAdd} className="card flex flex-col gap-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Ný áskrift</h3>
            <button type="button" onClick={() => setShowForm(false)}><X size={16} style={{ color: 'var(--muted)' }} /></button>
          </div>
          <div className="flex gap-2">
            <input className="input text-sm" style={{ width: 60 }} placeholder="🎵" value={icon}
              onChange={e => setIcon(e.target.value)} maxLength={2} />
            <input className="input text-sm flex-1" placeholder="Nafn áskriftar" value={name}
              onChange={e => setName(e.target.value)} autoFocus />
          </div>
          <input className="input text-sm" type="number" placeholder="Mánaðarlegt gjald (ISK)"
            value={amount} onChange={e => setAmount(e.target.value)} />
          <button type="submit" className="btn btn-primary w-full justify-center">Bæta við</button>
        </form>
      )}

      <div className="flex flex-col gap-2">
        {subs.map(s => (
          <div key={s.id} className="card flex items-center gap-3 py-3"
            style={{ borderColor: s.status === 'error' ? 'rgba(239,68,68,0.3)' : s.status === 'warning' ? 'rgba(249,115,22,0.3)' : 'var(--border)' }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0"
              style={{ background: s.status === 'error' ? 'rgba(239,68,68,0.1)' : 'var(--surface2)' }}>
              {s.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-medium">{s.name}</span>
                {s.status !== 'ok' && (
                  <AlertTriangle size={13} style={{ color: s.status === 'error' ? 'var(--danger)' : '#f97316', shrink: 0 }} />
                )}
              </div>
              {s.note ? (
                <div className="text-xs truncate" style={{ color: s.status === 'error' ? 'var(--danger)' : 'var(--muted)' }}>
                  {s.note}
                </div>
              ) : s.nextDate && (
                <div className="text-xs" style={{ color: 'var(--muted)' }}>
                  Næsta greiðsla: {new Date(s.nextDate).toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-sm font-semibold">{formatShortISK(s.amount)}</span>
              <button onClick={() => {
                const newStatus = s.status === 'ok' ? 'error' : 'ok'
                updateStatus(s.id, newStatus, newStatus === 'ok' ? '' : s.note)
              }}
                className="w-6 h-6 rounded-full flex items-center justify-center"
                style={{ background: s.status === 'ok' ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)' }}>
                {s.status === 'ok'
                  ? <CheckCircle size={14} style={{ color: 'var(--success)' }} />
                  : <AlertTriangle size={14} style={{ color: 'var(--danger)' }} />}
              </button>
              <button onClick={() => remove(s.id)} style={{ color: 'var(--muted)' }}>
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function OverviewTab({ monthlyTotal, monthlyIncome, netBalance, remaining, budget, byCategory, byIncomeCategory }) {
  const total = monthlyTotal()
  const income = monthlyIncome()
  const net = netBalance()
  const left = remaining()
  const isOver = left < 0
  const cats = byCategory()
  const incomeCats = byIncomeCategory()
  const expPct = Math.min(100, Math.round((total / budget.monthly) * 100))

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="card flex flex-col gap-1" style={{ border: '1px solid rgba(34,197,94,0.3)' }}>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>Tekjur</div>
          <div className="text-xl font-semibold" style={{ color: 'var(--success)' }}>{formatShortISK(income)}</div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>þennan mánuð</div>
        </div>
        <div className="card flex flex-col gap-1" style={{ border: `1px solid ${isOver ? 'rgba(239,68,68,0.3)' : 'var(--border)'}` }}>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>Útgjöld</div>
          <div className="text-xl font-semibold" style={{ color: isOver ? 'var(--danger)' : 'var(--text)' }}>{formatShortISK(total)}</div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>{expPct}% af áætlun</div>
        </div>
      </div>

      <div className="card flex flex-col gap-2"
        style={{ background: net >= 0 ? 'linear-gradient(135deg,rgba(34,197,94,0.08),rgba(0,212,170,0.06))' : 'linear-gradient(135deg,rgba(239,68,68,0.08),rgba(139,92,246,0.06))', border: `1px solid ${net >= 0 ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}` }}>
        <div className="text-xs" style={{ color: 'var(--muted)' }}>Nettóstaða þessa mánaðar</div>
        <div className="flex items-center gap-2">
          {net > 0 ? <TrendingUp size={20} style={{ color: 'var(--success)' }} />
            : net < 0 ? <TrendingDown size={20} style={{ color: 'var(--danger)' }} />
              : <Minus size={20} style={{ color: 'var(--muted)' }} />}
          <span className="text-3xl font-bold" style={{ color: net >= 0 ? 'var(--success)' : 'var(--danger)' }}>
            {net >= 0 ? '+' : ''}{formatISK(net)}
          </span>
        </div>
        <div className="text-xs" style={{ color: 'var(--muted)' }}>
          {net >= 0 ? 'Þú ert að skila hagnaði 🎉' : 'Útgjöld fara yfir tekjur'}
        </div>
      </div>

      <div className="card flex flex-col gap-3">
        <h3 className="font-semibold text-sm">Útgjöld eftir flokkum</h3>
        <div className="flex flex-col gap-3">
          {EXPENSE_CATEGORIES.map(c => (
            <CategoryBar key={c.id} cat={c} spent={cats[c.id] || 0} budget={budget.categories[c.id]} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Finance() {
  const [searchParams] = useSearchParams()
  const initialTab = searchParams.get('tab') === 'subs' ? 'subs'
    : searchParams.get('tab') === 'income' ? 'income'
      : 'overview'

  const [tab, setTab] = useState(initialTab)
  const finance = useFinance()

  const TABS = [
    { id: 'overview', label: 'Yfirlit' },
    { id: 'expenses', label: 'Útgjöld' },
    { id: 'income', label: 'Tekjur' },
    { id: 'subs', label: 'Áskriftir' },
  ]

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="px-1 pt-2">
        <h1 className="text-xl font-semibold">Fjármál</h1>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>
          {new Date().toLocaleDateString('is-IS', { month: 'long', year: 'numeric' })}
        </p>
      </div>

      <div className="flex gap-1.5 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className="btn shrink-0 text-sm"
            style={{
              background: tab === t.id ? 'rgba(0,212,170,0.12)' : 'var(--surface)',
              color: tab === t.id ? 'var(--accent)' : 'var(--muted)',
              border: `1px solid ${tab === t.id ? 'rgba(0,212,170,0.25)' : 'var(--border)'}`,
            }}>{t.label}</button>
        ))}
      </div>

      {tab === 'overview' && <OverviewTab {...finance} />}
      {tab === 'expenses' && <ExpensesTab {...finance} />}
      {tab === 'income' && <IncomeTab {...finance} />}
      {tab === 'subs' && <SubscriptionsTab />}
    </div>
  )
}
