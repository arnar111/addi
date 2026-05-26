import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useFinance } from '../hooks/useFinance'
import { useLendo, LENDO_ITEMS } from '../hooks/useLendo'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { formatISK, formatShortISK, EXPENSE_CATEGORIES } from '../utils/currency'
import { Plus, Trash2, X, TrendingDown, TrendingUp, Target } from 'lucide-react'

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

// ─── Expenses tab ───────────────────────────────────────────────────────────
function ExpensesTab() {
  const { addExpense, removeExpense, budget, setBudget, monthlyTotal, byCategory, remaining, recentExpenses } = useFinance()
  const [showForm, setShowForm] = useState(false)
  const [showBudgetEdit, setShowBudgetEdit] = useState(false)
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('food')
  const [note, setNote] = useState('')
  const [view, setView] = useState('overview')

  const total = monthlyTotal()
  const cats = byCategory()
  const left = remaining()
  const isOver = left < 0
  const pct = Math.min(100, Math.round((total / budget.monthly) * 100))

  const handleAdd = (e) => {
    e.preventDefault()
    if (!amount || isNaN(Number(amount))) return
    addExpense(Number(amount), category, note)
    setAmount(''); setNote(''); setShowForm(false)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>
            {new Date().toLocaleDateString('is-IS', { month: 'long', year: 'numeric' })}
          </div>
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

      {/* Sub-tabs */}
      <div className="flex gap-2">
        {[['overview', 'Yfirlit'], ['transactions', 'Færslur']].map(([t, l]) => (
          <button key={t} onClick={() => setView(t)}
            className="btn text-sm flex-1 justify-center"
            style={{
              background: view === t ? 'rgba(0,212,170,0.12)' : 'var(--surface)',
              color: view === t ? 'var(--accent)' : 'var(--muted)',
              border: `1px solid ${view === t ? 'rgba(0,212,170,0.25)' : 'var(--border)'}`,
            }}>{l}</button>
        ))}
      </div>

      {view === 'overview' && (
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

      {view === 'transactions' && (
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

// ─── Lendó tab ───────────────────────────────────────────────────────────────
function LendoTab() {
  const { rentals, addRental, removeRental, monthlyTotal, allTimeTotal, totalRentals, monthlyRentals, goal, setGoal, recent } = useLendo()
  const [showForm, setShowForm] = useState(false)
  const [amount, setAmount] = useState('')
  const [itemId, setItemId] = useState('set')
  const [note, setNote] = useState('')
  const [days, setDays] = useState('1')

  const mTotal = monthlyTotal()
  const pct = goal ? Math.min(100, Math.round((mTotal / goal) * 100)) : 0

  const handleAdd = (e) => {
    e.preventDefault()
    const item = LENDO_ITEMS.find(i => i.id === itemId)
    const finalAmount = amount ? Number(amount) : (item?.defaultPrice || 0) * Number(days)
    if (!finalAmount) return
    addRental(finalAmount, itemId, note, days)
    setAmount(''); setNote(''); setDays('1'); setShowForm(false)
  }

  const onItemChange = (id) => {
    setItemId(id)
    const item = LENDO_ITEMS.find(i => i.id === id)
    if (item?.defaultPrice) setAmount(String(item.defaultPrice * Number(days)))
  }

  const onDaysChange = (d) => {
    setDays(d)
    const item = LENDO_ITEMS.find(i => i.id === itemId)
    if (item?.defaultPrice && !amount) setAmount(String(item.defaultPrice * Number(d)))
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Income overview */}
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(249,115,22,0.08), rgba(0,212,170,0.04))' }}>
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Þessi mánuður</div>
            <div className="text-3xl font-semibold" style={{ color: '#f97316' }}>{formatISK(mTotal)}</div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{monthlyRentals()} leiga{monthlyRentals() !== 1 ? 'r' : ''}</div>
          </div>
          <div className="text-right">
            <div className="text-xs mb-0.5" style={{ color: 'var(--muted)' }}>Samtals</div>
            <div className="text-lg font-semibold">{formatShortISK(allTimeTotal())}</div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>{totalRentals()} leigur</div>
          </div>
        </div>
        {goal > 0 && (
          <>
            <div className="h-2 rounded-full overflow-hidden mb-1" style={{ background: 'var(--surface2)' }}>
              <div className="h-full rounded-full transition-all"
                   style={{ width: `${pct}%`, background: pct >= 100 ? 'var(--success)' : '#f97316' }} />
            </div>
            <div className="flex justify-between text-xs" style={{ color: 'var(--muted)' }}>
              <span>{pct}% af marki</span>
              <span>Markmið: {formatShortISK(goal)}</span>
            </div>
          </>
        )}
      </div>

      <div className="flex gap-2">
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary flex-1 justify-center">
          <Plus size={16} /> Skrá leigu
        </button>
        <button onClick={() => {
          const v = prompt('Mánaðarleg markmiðstekjur (ISK):', goal)
          if (v && !isNaN(Number(v))) setGoal(Number(v))
        }} className="btn btn-ghost" style={{ padding: '8px 12px' }}>
          <Target size={16} />
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="card flex flex-col gap-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Skrá leigu</h3>
            <button type="button" onClick={() => setShowForm(false)}><X size={16} style={{ color: 'var(--muted)' }} /></button>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {LENDO_ITEMS.map(item => (
              <button key={item.id} type="button" onClick={() => onItemChange(item.id)}
                      className="flex items-center gap-2 p-2.5 rounded-xl text-xs transition-all"
                      style={{
                        background: itemId === item.id ? 'rgba(249,115,22,0.12)' : 'var(--surface2)',
                        border: `1px solid ${itemId === item.id ? 'rgba(249,115,22,0.4)' : 'transparent'}`,
                        color: itemId === item.id ? '#f97316' : 'var(--muted)',
                      }}>
                <span className="text-base">{item.icon}</span>
                <span className="truncate">{item.label}</span>
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <label className="text-xs" style={{ color: 'var(--muted)' }}>Dagar</label>
              <input className="input" type="number" min="1" value={days}
                     onChange={e => onDaysChange(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs" style={{ color: 'var(--muted)' }}>Upphæð (ISK)</label>
              <input className="input" type="number" placeholder="7000" value={amount}
                     onChange={e => setAmount(e.target.value)} />
            </div>
          </div>
          <input className="input" placeholder="Athugasemd (valkvæmt)" value={note}
                 onChange={e => setNote(e.target.value)} />
          <button type="submit" className="btn btn-primary w-full justify-center">Skrá</button>
        </form>
      )}

      {/* Rental history */}
      <div className="flex flex-col gap-2">
        {recent.length === 0 ? (
          <div className="card text-center py-8" style={{ color: 'var(--muted)' }}>
            Engar leigur skráðar.<br />
            <span className="text-xs">Skráðu fyrstu leigu þína!</span>
          </div>
        ) : recent.map(r => {
          const item = LENDO_ITEMS.find(i => i.id === r.itemId) || LENDO_ITEMS[3]
          return (
            <div key={r.id} className="card flex items-center gap-3 py-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-base"
                   style={{ background: 'rgba(249,115,22,0.12)' }}>{item.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium" style={{ color: '#f97316' }}>+{formatISK(r.amount)}</div>
                <div className="text-xs" style={{ color: 'var(--muted)' }}>
                  {item.label}{r.note ? ` · ${r.note}` : ''} · {r.days > 1 ? `${r.days} dagar · ` : ''}{new Date(r.date).toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })}
                </div>
              </div>
              <button onClick={() => removeRental(r.id)} style={{ color: 'var(--muted)' }}>
                <Trash2 size={14} />
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Subscriptions tab ────────────────────────────────────────────────────────
const DEFAULT_SUBS = [
  { id: 'netflix', name: 'Netflix', icon: '🎬', amount: 0, cycle: 'month' },
  { id: 'audible', name: 'Audible', icon: '🎧', amount: 0, cycle: 'month' },
  { id: 'linkedin', name: 'LinkedIn Premium', icon: '💼', amount: 0, cycle: 'month' },
  { id: 'athletic', name: 'The Athletic', icon: '📰', amount: 0, cycle: 'month' },
  { id: 'kimi', name: 'Kimi AI', icon: '🤖', amount: 0, cycle: 'month' },
  { id: 'spotify', name: 'Spotify', icon: '🎵', amount: 0, cycle: 'month' },
]

function SubsTab() {
  const [subs, setSubs] = useLocalStorage('addi_subs', DEFAULT_SUBS)
  const [editing, setEditing] = useState(null)
  const [newName, setNewName] = useState('')
  const [newAmount, setNewAmount] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [addName, setAddName] = useState('')
  const [addIcon, setAddIcon] = useState('💳')
  const [addAmount, setAddAmount] = useState('')

  const monthly = subs.reduce((s, sub) => s + (sub.amount || 0), 0)

  const updateSub = (id, amount) => {
    setSubs(prev => prev.map(s => s.id === id ? { ...s, amount: Number(amount) } : s))
    setEditing(null)
  }

  const removeSub = (id) => setSubs(prev => prev.filter(s => s.id !== id))

  const addSub = (e) => {
    e.preventDefault()
    if (!addName) return
    setSubs(prev => [...prev, {
      id: Date.now().toString(),
      name: addName,
      icon: addIcon,
      amount: Number(addAmount) || 0,
      cycle: 'month',
    }])
    setAddName(''); setAddAmount(''); setAddIcon('💳'); setShowAddForm(false)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.08), rgba(0,212,170,0.04))' }}>
        <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Mánaðarleg áskriftaútgjöld</div>
        <div className="text-3xl font-semibold" style={{ color: '#8b5cf6' }}>{formatISK(monthly)}</div>
        <div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>{subs.length} áskriftir</div>
      </div>

      <div className="flex flex-col gap-2">
        {subs.map(sub => (
          <div key={sub.id} className="card flex items-center gap-3 py-3">
            <span className="text-xl shrink-0">{sub.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium">{sub.name}</div>
              {editing === sub.id ? (
                <form onSubmit={e => { e.preventDefault(); updateSub(sub.id, newAmount) }}
                      className="flex gap-2 mt-1">
                  <input className="input text-xs py-1" type="number" placeholder="ISK/mán"
                         value={newAmount} onChange={e => setNewAmount(e.target.value)} autoFocus />
                  <button type="submit" className="btn btn-primary text-xs py-1 px-3">Vista</button>
                  <button type="button" onClick={() => setEditing(null)} className="btn btn-ghost text-xs py-1 px-2">Hætta</button>
                </form>
              ) : (
                <button onClick={() => { setEditing(sub.id); setNewAmount(String(sub.amount || '')) }}
                        className="text-xs" style={{ color: sub.amount ? 'var(--muted)' : 'var(--accent)' }}>
                  {sub.amount ? formatISK(sub.amount) + '/mán' : '+ Setja verð'}
                </button>
              )}
            </div>
            <button onClick={() => removeSub(sub.id)} style={{ color: 'var(--muted)' }}>
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>

      {showAddForm ? (
        <form onSubmit={addSub} className="card flex flex-col gap-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Bæta við áskrift</h3>
            <button type="button" onClick={() => setShowAddForm(false)}><X size={16} style={{ color: 'var(--muted)' }} /></button>
          </div>
          <div className="flex gap-2">
            <input className="input w-14 text-center" value={addIcon} onChange={e => setAddIcon(e.target.value)} placeholder="🎵" />
            <input className="input flex-1" placeholder="Nafn áskriftar" value={addName} onChange={e => setAddName(e.target.value)} autoFocus />
          </div>
          <input className="input" type="number" placeholder="Upphæð ISK/mán" value={addAmount} onChange={e => setAddAmount(e.target.value)} />
          <button type="submit" className="btn btn-primary w-full justify-center">Bæta við</button>
        </form>
      ) : (
        <button onClick={() => setShowAddForm(true)} className="btn btn-ghost w-full justify-center">
          <Plus size={16} /> Bæta við áskrift
        </button>
      )}
    </div>
  )
}

// ─── Main Finance page ────────────────────────────────────────────────────────
const TABS = [
  { id: 'expenses', label: '💸 Útgjöld' },
  { id: 'lendo', label: '🏠 Lendó' },
  { id: 'subs', label: '📱 Áskriftir' },
]

export default function Finance() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initTab = searchParams.get('tab') || 'expenses'
  const [tab, setTab] = useState(initTab)

  const switchTab = (t) => {
    setTab(t)
    setSearchParams(t !== 'expenses' ? { tab: t } : {}, { replace: true })
  }

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="px-1 pt-2">
        <h1 className="text-xl font-semibold">Fjármál</h1>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>Útgjöld · Tekjur · Áskriftir</p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1.5 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => switchTab(t.id)}
            className="btn shrink-0 text-sm"
            style={{
              background: tab === t.id ? 'rgba(0,212,170,0.12)' : 'var(--surface)',
              color: tab === t.id ? 'var(--accent)' : 'var(--muted)',
              border: `1px solid ${tab === t.id ? 'rgba(0,212,170,0.25)' : 'var(--border)'}`,
              padding: '7px 14px',
            }}>{t.label}</button>
        ))}
      </div>

      {tab === 'expenses' && <ExpensesTab />}
      {tab === 'lendo' && <LendoTab />}
      {tab === 'subs' && <SubsTab />}
    </div>
  )
}
