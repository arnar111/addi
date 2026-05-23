import { useState } from 'react'
import { useFinance } from '../hooks/useFinance'
import { useLendo, LENDO_ITEMS } from '../hooks/useLendo'
import { formatISK, formatShortISK, EXPENSE_CATEGORIES } from '../utils/currency'
import { Plus, Trash2, X, TrendingUp, TrendingDown, Home } from 'lucide-react'

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

function ExpensesView() {
  const { addExpense, removeExpense, budget, setBudget, monthlyTotal, byCategory, remaining, recentExpenses } = useFinance()
  const [showForm, setShowForm] = useState(false)
  const [showBudgetEdit, setShowBudgetEdit] = useState(false)
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('food')
  const [note, setNote] = useState('')
  const [tab, setTab] = useState('overview')

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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold">Útgjöld</h2>
          <p className="text-xs" style={{ color: 'var(--muted)' }}>
            {new Date().toLocaleDateString('is-IS', { month: 'long', year: 'numeric' })}
          </p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          <Plus size={16} /> Gjald
        </button>
      </div>

      {/* Overview card */}
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
          <span>Fjárhagsáætlun: {formatISK(budget.monthly)}</span>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="card flex flex-col gap-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Bæta við gjaldi</h3>
            <button type="button" onClick={() => setShowForm(false)}><X size={16} style={{ color: 'var(--muted)' }} /></button>
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
          <button type="submit" className="btn btn-primary w-full justify-center">Bæta við</button>
        </form>
      )}

      <div className="flex gap-2">
        {[['overview', 'Yfirlit'], ['transactions', 'Færslur']].map(([t, l]) => (
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

function LendoView() {
  const {
    addRental, removeRental, monthlyTotal, rentalCount, progressPct,
    remaining, monthlyGoal, setMonthlyGoal, recentRentals, byMonth,
  } = useLendo()
  const [showForm, setShowForm] = useState(false)
  const [showGoalEdit, setShowGoalEdit] = useState(false)
  const [item, setItem] = useState('veislusett')
  const [amount, setAmount] = useState('7000')
  const [note, setNote] = useState('')
  const [date, setDate] = useState('')
  const [tab, setTab] = useState('overview')

  const total = monthlyTotal()
  const pct = progressPct()
  const isGoalMet = total >= monthlyGoal
  const monthlyHistory = byMonth()

  const handleAdd = (e) => {
    e.preventDefault()
    if (!amount || isNaN(Number(amount))) return
    addRental({ amount, item, note, date: date ? new Date(date).toISOString() : undefined })
    setAmount('7000')
    setNote('')
    setDate('')
    setShowForm(false)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold flex items-center gap-2">
            <Home size={16} style={{ color: 'var(--accent)' }} /> Lendó tekjur
          </h2>
          <p className="text-xs" style={{ color: 'var(--muted)' }}>
            {new Date().toLocaleDateString('is-IS', { month: 'long', year: 'numeric' })}
          </p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          <Plus size={16} /> Skrá leigutekjur
        </button>
      </div>

      {/* Overview card */}
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.07), rgba(34,197,94,0.05))' }}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Tekjur þennan mánuð</div>
            <div className="text-3xl font-bold" style={{ color: isGoalMet ? 'var(--success)' : 'var(--text)' }}>
              {formatISK(total)}
            </div>
            <div className="text-sm mt-0.5" style={{ color: 'var(--muted)' }}>
              {rentalCount()} leiga{rentalCount() !== 1 ? 'r' : ''} skráðar
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className="text-xs" style={{ color: 'var(--muted)' }}>
              {isGoalMet ? '🎉 Marki náð!' : `${formatShortISK(remaining())} eftir`}
            </div>
            <button onClick={() => setShowGoalEdit(!showGoalEdit)} className="text-xs"
                    style={{ color: 'var(--accent)' }}>
              Markmið: {formatShortISK(monthlyGoal)}
            </button>
          </div>
        </div>

        {showGoalEdit && (
          <div className="mb-3 flex gap-2 items-center">
            <input className="input text-sm py-2" type="number"
              defaultValue={monthlyGoal}
              onBlur={e => setMonthlyGoal(Number(e.target.value))}
              placeholder="Mánaðarmarkmið (ISK)" />
          </div>
        )}

        <div className="h-3 rounded-full overflow-hidden mb-1" style={{ background: 'var(--surface2)' }}>
          <div className="h-full rounded-full transition-all duration-700"
               style={{
                 width: `${pct}%`,
                 background: isGoalMet
                   ? 'var(--success)'
                   : 'linear-gradient(90deg, var(--accent), #00b894)',
               }} />
        </div>
        <div className="flex justify-between text-xs" style={{ color: 'var(--muted)' }}>
          <span>{pct}% af markmiði</span>
          <span>Markmið: {formatISK(monthlyGoal)}</span>
        </div>
      </div>

      {/* Add form */}
      {showForm && (
        <form onSubmit={handleAdd} className="card flex flex-col gap-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Skrá leigutekjur</h3>
            <button type="button" onClick={() => setShowForm(false)}><X size={16} style={{ color: 'var(--muted)' }} /></button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {LENDO_ITEMS.map(it => (
              <button key={it.id} type="button"
                onClick={() => { setItem(it.id); if (it.price) setAmount(String(it.price)) }}
                className="py-2 px-3 rounded-xl text-xs text-left transition-all"
                style={{
                  background: item === it.id ? 'rgba(0,212,170,0.12)' : 'var(--surface2)',
                  border: `1px solid ${item === it.id ? 'rgba(0,212,170,0.35)' : 'var(--border)'}`,
                  color: item === it.id ? 'var(--accent)' : 'var(--muted)',
                }}>
                <div className="font-medium">{it.label}</div>
                {it.price > 0 && <div style={{ color: 'var(--muted)', fontSize: 10 }}>{formatShortISK(it.price)}/dag</div>}
              </button>
            ))}
          </div>
          <input className="input" type="number" placeholder="Upphæð (ISK)" value={amount}
            onChange={e => setAmount(e.target.value)} />
          <input className="input text-sm" placeholder="Athugasemd (valkvæmt)" value={note}
            onChange={e => setNote(e.target.value)} />
          <input type="date" className="input text-sm" value={date} onChange={e => setDate(e.target.value)}
            placeholder="Dagsetning" />
          <button type="submit" className="btn btn-primary w-full justify-center">
            <TrendingUp size={14} /> Skrá
          </button>
        </form>
      )}

      {/* Tabs */}
      <div className="flex gap-2">
        {[['overview', 'Yfirlit'], ['history', 'Saga']].map(([t, l]) => (
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
          {monthlyHistory.length > 0 && (
            <div className="card flex flex-col gap-3">
              <h3 className="font-semibold text-sm">Mánaðarleg þróun</h3>
              {monthlyHistory.map(([month, total]) => {
                const pct = Math.min(100, Math.round((total / monthlyGoal) * 100))
                const [y, m] = month.split('-')
                const label = new Date(Number(y), Number(m) - 1).toLocaleDateString('is-IS', { month: 'long', year: 'numeric' })
                return (
                  <div key={month} className="flex flex-col gap-1">
                    <div className="flex justify-between text-xs">
                      <span style={{ color: 'var(--muted)' }}>{label}</span>
                      <span className="font-medium">{formatShortISK(total)}</span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--surface2)' }}>
                      <div className="h-full rounded-full"
                           style={{ width: `${pct}%`, background: total >= monthlyGoal ? 'var(--success)' : 'var(--accent)' }} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}

      {tab === 'history' && (
        <div className="flex flex-col gap-2">
          {recentRentals.length === 0 ? (
            <div className="card text-center py-8" style={{ color: 'var(--muted)' }}>
              Engar leigutekjur skráðar ennþá
            </div>
          ) : recentRentals.map(r => {
            const itemDef = LENDO_ITEMS.find(i => i.id === r.item) || LENDO_ITEMS[3]
            return (
              <div key={r.id} className="card flex items-center gap-3 py-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-base"
                     style={{ background: 'rgba(0,212,170,0.12)' }}>🏠</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold" style={{ color: 'var(--success)' }}>
                    +{formatISK(r.amount)}
                  </div>
                  <div className="text-xs" style={{ color: 'var(--muted)' }}>
                    {itemDef.label}{r.note ? ` · ${r.note}` : ''} · {new Date(r.date).toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
                <button onClick={() => removeRental(r.id)} style={{ color: 'var(--muted)' }}>
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

export default function Finance() {
  const [mainTab, setMainTab] = useState('expenses')
  const { monthlyTotal: lendoTotal } = useLendo()
  const { monthlyTotal: expenseTotal } = useFinance()

  const netTotal = lendoTotal() - expenseTotal()

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="px-1 pt-2">
        <h1 className="text-xl font-semibold">Fjármál</h1>
        <p className="text-sm" style={{ color: netTotal >= 0 ? 'var(--success)' : 'var(--danger)' }}>
          Nettó þennan mánuð: {netTotal >= 0 ? '+' : ''}{new Intl.NumberFormat('is-IS', { style: 'currency', currency: 'ISK', maximumFractionDigits: 0 }).format(netTotal)}
        </p>
      </div>

      {/* Main tabs */}
      <div className="flex gap-2">
        {[['expenses', '💸 Útgjöld'], ['lendo', '🏠 Lendó']].map(([t, l]) => (
          <button key={t} onClick={() => setMainTab(t)}
            className="btn text-sm flex-1 justify-center"
            style={{
              background: mainTab === t ? 'rgba(0,212,170,0.12)' : 'var(--surface)',
              color: mainTab === t ? 'var(--accent)' : 'var(--muted)',
              border: `1px solid ${mainTab === t ? 'rgba(0,212,170,0.25)' : 'var(--border)'}`,
            }}>{l}</button>
        ))}
      </div>

      {mainTab === 'expenses' ? <ExpensesView /> : <LendoView />}
    </div>
  )
}
