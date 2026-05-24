import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useFinance } from '../hooks/useFinance'
import { useIncome, RENTAL_ITEMS } from '../hooks/useIncome'
import { formatISK, formatShortISK, EXPENSE_CATEGORIES } from '../utils/currency'
import { Plus, Trash2, X, TrendingDown, TrendingUp, Target } from 'lucide-react'

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

  const handleAdd = e => {
    e.preventDefault()
    if (!amount || isNaN(Number(amount))) return
    addExpense(Number(amount), category, note)
    setAmount('')
    setNote('')
    setShowForm(false)
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Overview card */}
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.06), rgba(139,92,246,0.06))' }}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Útgjöld þessa mánaðar</div>
            <div className="text-3xl font-semibold">{formatISK(total)}</div>
          </div>
          <div>
            <div className="text-xs mb-1 text-right" style={{ color: 'var(--muted)' }}>Eftir</div>
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

      {/* Add button */}
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

      {/* Categories */}
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

      {/* Transactions */}
      <h3 className="font-semibold text-sm px-1">Nýlegar færslur</h3>
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
    </div>
  )
}

function IncomeTab() {
  const {
    addBooking, removeBooking, monthlyGoal, setMonthlyGoal,
    monthlyTotal, remaining, progress, byItem, recentBookings, currentMonthBookings
  } = useIncome()
  const [showForm, setShowForm] = useState(false)
  const [showGoalEdit, setShowGoalEdit] = useState(false)
  const [selectedItem, setSelectedItem] = useState('veislusett')
  const [amount, setAmount] = useState('7000')
  const [note, setNote] = useState('')

  const total = monthlyTotal()
  const pct = progress()
  const left = remaining()
  const isGoalMet = total >= monthlyGoal
  const itemBreakdown = byItem()
  const bookings = currentMonthBookings()

  const handleItemSelect = (itemId) => {
    setSelectedItem(itemId)
    const item = RENTAL_ITEMS.find(i => i.id === itemId)
    if (item) setAmount(String(item.defaultPrice))
  }

  const handleAdd = e => {
    e.preventDefault()
    if (!amount || isNaN(Number(amount))) return
    addBooking(selectedItem, Number(amount), note)
    setNote('')
    setShowForm(false)
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Goal card */}
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.08), rgba(34,197,94,0.05))' }}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="text-xs mb-1 flex items-center gap-1.5" style={{ color: 'var(--muted)' }}>
              🪑 Lendó tekjur þessa mánaðar
            </div>
            <div className="text-3xl font-semibold" style={{ color: 'var(--success)' }}>
              {formatISK(total)}
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className="text-xs" style={{ color: 'var(--muted)' }}>
              {isGoalMet ? '🎉 Marki náð!' : 'Eftir af marki'}
            </div>
            <div className="text-lg font-semibold" style={{ color: isGoalMet ? 'var(--success)' : 'var(--accent)' }}>
              {isGoalMet ? '+' : ''}{formatISK(Math.abs(left))}
            </div>
          </div>
        </div>
        <div className="h-3 rounded-full overflow-hidden mb-2" style={{ background: 'var(--surface2)' }}>
          <div className="h-full rounded-full transition-all duration-700"
               style={{
                 width: `${pct}%`,
                 background: isGoalMet ? 'var(--success)' : pct >= 75 ? '#f97316' : 'var(--accent)',
               }} />
        </div>
        <div className="flex justify-between text-xs">
          <span style={{ color: 'var(--muted)' }}>{bookings.length} bókanir · {pct}%</span>
          <button onClick={() => setShowGoalEdit(!showGoalEdit)} style={{ color: 'var(--accent)' }}>
            Mark: {formatShortISK(monthlyGoal)}
          </button>
        </div>
        {showGoalEdit && (
          <div className="mt-3 flex gap-2">
            <input className="input text-sm flex-1" type="number" value={monthlyGoal}
              onChange={e => setMonthlyGoal(Number(e.target.value))}
              placeholder="Mánaðarlegt mark (ISK)" />
          </div>
        )}
      </div>

      {/* Add booking */}
      <button onClick={() => setShowForm(!showForm)} className="btn btn-primary w-full justify-center"
              style={{ background: 'var(--success)', color: '#000' }}>
        <Plus size={16} /> Skrá bókun
      </button>

      {showForm && (
        <form onSubmit={handleAdd} className="card flex flex-col gap-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Ný bókun</h3>
            <button type="button" onClick={() => setShowForm(false)}>
              <X size={16} style={{ color: 'var(--muted)' }} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {RENTAL_ITEMS.map(item => (
              <button key={item.id} type="button" onClick={() => handleItemSelect(item.id)}
                className="flex flex-col items-center gap-1 py-3 rounded-xl text-xs transition-all"
                style={{
                  background: selectedItem === item.id ? 'rgba(0,212,170,0.12)' : 'var(--surface2)',
                  border: `1px solid ${selectedItem === item.id ? 'rgba(0,212,170,0.4)' : 'transparent'}`,
                }}>
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium leading-tight text-center">{item.label}</span>
                <span style={{ color: 'var(--accent)' }}>{formatShortISK(item.defaultPrice)}/dag</span>
              </button>
            ))}
          </div>
          <input className="input" type="number" placeholder="Upphæð (ISK)" value={amount}
            onChange={e => setAmount(e.target.value)} />
          <input className="input" placeholder="Athugasemd (valkvæmt)" value={note}
            onChange={e => setNote(e.target.value)} />
          <button type="submit" className="btn w-full justify-center"
                  style={{ background: 'var(--success)', color: '#000' }}>
            Vista bókun
          </button>
        </form>
      )}

      {/* Item breakdown */}
      {Object.keys(itemBreakdown).length > 0 && (
        <div className="card flex flex-col gap-3">
          <h3 className="font-semibold text-sm">Tekjur eftir hlutum</h3>
          {RENTAL_ITEMS.filter(i => itemBreakdown[i.id]).map(item => (
            <div key={item.id} className="flex items-center justify-between">
              <span className="text-sm">{item.icon} {item.label}</span>
              <span className="text-sm font-semibold" style={{ color: 'var(--success)' }}>
                {formatISK(itemBreakdown[item.id])}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Bookings list */}
      <h3 className="font-semibold text-sm px-1">Bókanir</h3>
      <div className="flex flex-col gap-2">
        {recentBookings.length === 0 ? (
          <div className="card text-center py-8" style={{ color: 'var(--muted)' }}>
            <div className="text-3xl mb-2">🪑</div>
            Engar bókanir ennþá
          </div>
        ) : recentBookings.map(b => {
          const item = RENTAL_ITEMS.find(i => i.id === b.itemId) || RENTAL_ITEMS[0]
          return (
            <div key={b.id} className="card flex items-center gap-3 py-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-base"
                   style={{ background: 'rgba(34,197,94,0.12)' }}>{item.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium" style={{ color: 'var(--success)' }}>
                  +{formatISK(b.amount)}
                </div>
                <div className="text-xs" style={{ color: 'var(--muted)' }}>
                  {item.label}{b.note ? ` · ${b.note}` : ''} · {new Date(b.date).toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })}
                </div>
              </div>
              <button onClick={() => removeBooking(b.id)} style={{ color: 'var(--muted)' }}>
                <Trash2 size={14} />
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function Finance() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [tab, setTab] = useState(searchParams.get('tab') || 'expenses')
  const finance = useFinance()

  const switchTab = t => {
    setTab(t)
    setSearchParams(t === 'expenses' ? {} : { tab: t })
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
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {[['expenses', '💸 Útgjöld'], ['income', '🪑 Lendó'], ['net', '📊 Yfirlit']].map(([t, l]) => (
          <button key={t} onClick={() => switchTab(t)}
            className="btn text-xs flex-1 justify-center"
            style={{
              background: tab === t ? 'rgba(0,212,170,0.12)' : 'var(--surface)',
              color: tab === t ? 'var(--accent)' : 'var(--muted)',
              border: `1px solid ${tab === t ? 'rgba(0,212,170,0.25)' : 'var(--border)'}`,
              padding: '8px 4px',
            }}>{l}</button>
        ))}
      </div>

      {tab === 'expenses' && <ExpensesTab {...finance} />}
      {tab === 'income' && <IncomeTab />}
      {tab === 'net' && <NetOverview finance={finance} />}
    </div>
  )
}

function NetOverview({ finance }) {
  const income = useIncome()
  const totalIncome = income.monthlyTotal()
  const totalExpenses = finance.monthlyTotal()
  const net = totalIncome - totalExpenses
  const isPositive = net >= 0

  return (
    <div className="flex flex-col gap-4">
      <div className="card" style={{
        background: `linear-gradient(135deg, ${isPositive ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)'}, rgba(10,14,26,0))`
      }}>
        <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Nettó þennan mánuð</div>
        <div className="text-4xl font-bold mb-4" style={{ color: isPositive ? 'var(--success)' : 'var(--danger)' }}>
          {isPositive ? '+' : ''}{formatISK(net)}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl" style={{ background: 'rgba(34,197,94,0.1)' }}>
            <div className="text-xs mb-1 flex items-center gap-1" style={{ color: 'var(--success)' }}>
              <TrendingUp size={12} /> Tekjur
            </div>
            <div className="font-bold" style={{ color: 'var(--success)' }}>{formatISK(totalIncome)}</div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>Lendó · {income.progress()}% af marki</div>
          </div>
          <div className="p-3 rounded-xl" style={{ background: 'rgba(239,68,68,0.1)' }}>
            <div className="text-xs mb-1 flex items-center gap-1" style={{ color: 'var(--danger)' }}>
              <TrendingDown size={12} /> Útgjöld
            </div>
            <div className="font-bold" style={{ color: 'var(--danger)' }}>{formatISK(totalExpenses)}</div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>
              af {formatShortISK(finance.budget.monthly)} fjárh.
            </div>
          </div>
        </div>
      </div>

      <div className="card flex flex-col gap-2">
        <h3 className="font-semibold text-sm">Lendó framvinda</h3>
        <div className="flex items-center justify-between text-sm">
          <span style={{ color: 'var(--muted)' }}>Mark: {formatISK(income.monthlyGoal)}</span>
          <span style={{ color: 'var(--accent)' }}>{income.progress()}%</span>
        </div>
        <div className="h-3 rounded-full overflow-hidden" style={{ background: 'var(--surface2)' }}>
          <div className="h-full rounded-full" style={{ width: `${income.progress()}%`, background: 'var(--success)' }} />
        </div>
        <div className="text-xs" style={{ color: 'var(--muted)' }}>
          {income.currentMonthBookings().length} bókanir · {formatISK(income.remaining())} eftir
        </div>
      </div>
    </div>
  )
}
