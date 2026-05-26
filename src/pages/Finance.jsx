import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useFinance } from '../hooks/useFinance'
import { useLendo } from '../hooks/useLendo'
import { useSubscriptions } from '../hooks/useSubscriptions'
import { formatISK, formatShortISK, EXPENSE_CATEGORIES } from '../utils/currency'
import { Plus, Trash2, X, TrendingDown, TrendingUp, Package, CreditCard, ToggleLeft, ToggleRight } from 'lucide-react'

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
        <div className="progress-bar">
          <div className="progress-fill"
               style={{ width: `${pct}%`, background: isOver ? 'var(--danger)' : cat.color }} />
        </div>
      )}
    </div>
  )
}

function LendoTab() {
  const { items, bookings, monthTotal, monthlyGoal, goalPct, thisMonthBookings, addBooking, removeBooking, addItem, toggleItem, updateGoal } = useLendo()
  const [showForm, setShowForm] = useState(false)
  const [showNewItem, setShowNewItem] = useState(false)
  const [selectedItem, setSelectedItem] = useState(items[0]?.id || '')
  const [days, setDays] = useState(1)
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [note, setNote] = useState('')
  const [newItemName, setNewItemName] = useState('')
  const [newItemPrice, setNewItemPrice] = useState('')

  const item = items.find(i => i.id === selectedItem)
  const amount = item ? item.pricePerDay * days : 0

  function handleBook(e) {
    e.preventDefault()
    if (!item) return
    addBooking({ itemId: item.id, itemName: item.name, amount, days, date, note })
    setShowForm(false)
    setDays(1)
    setNote('')
  }

  function handleNewItem(e) {
    e.preventDefault()
    if (!newItemName || !newItemPrice) return
    addItem({ name: newItemName, pricePerDay: Number(newItemPrice) })
    setNewItemName('')
    setNewItemPrice('')
    setShowNewItem(false)
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Lendó overview */}
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(249,115,22,0.08), rgba(239,68,68,0.05))' }}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Lendó tekjur þessa mánaðar</div>
            <div className="text-3xl font-bold">{formatISK(monthTotal)}</div>
          </div>
          <div className="text-right">
            <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Af markmiði</div>
            <div className="text-xl font-bold" style={{ color: 'var(--accent3)' }}>{goalPct}%</div>
          </div>
        </div>
        <div className="progress-bar mb-2">
          <div className="progress-fill"
            style={{ width: `${goalPct}%`, background: goalPct >= 100 ? 'var(--success)' : 'linear-gradient(90deg, var(--accent3), #ef4444)' }} />
        </div>
        <div className="flex justify-between text-xs" style={{ color: 'var(--muted)' }}>
          <span>{thisMonthBookings.length} bókanir</span>
          <div className="flex items-center gap-2">
            <span>Markmið:</span>
            <input
              type="number"
              className="input text-xs py-0.5 px-2 w-28 inline"
              value={monthlyGoal}
              onChange={e => updateGoal(Number(e.target.value))}
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button onClick={() => setShowForm(!showForm)} className="btn btn-sm flex-1"
          style={{ background: 'rgba(249,115,22,0.15)', color: 'var(--accent3)', border: '1px solid rgba(249,115,22,0.3)' }}>
          <Plus size={13} /> Skrá bókun
        </button>
        <button onClick={() => setShowNewItem(!showNewItem)} className="btn btn-ghost btn-sm flex-1">
          <Package size={13} /> Nýr hlutur
        </button>
      </div>

      {/* Book form */}
      {showForm && (
        <form onSubmit={handleBook} className="card flex flex-col gap-3 animate-scale-in">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Skrá bókun</h3>
            <button type="button" onClick={() => setShowForm(false)}><X size={16} style={{ color: 'var(--muted)' }} /></button>
          </div>
          <select className="select w-full" value={selectedItem} onChange={e => setSelectedItem(e.target.value)}>
            {items.filter(i => i.active).map(i => (
              <option key={i.id} value={i.id}>{i.name} — {formatShortISK(i.pricePerDay)}/dag</option>
            ))}
          </select>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs mb-1 block" style={{ color: 'var(--muted)' }}>Dagar</label>
              <input type="number" className="input" min={1} max={30} value={days}
                onChange={e => setDays(Math.max(1, parseInt(e.target.value) || 1))} />
            </div>
            <div>
              <label className="text-xs mb-1 block" style={{ color: 'var(--muted)' }}>Dagsetning</label>
              <input type="date" className="input" value={date} onChange={e => setDate(e.target.value)} />
            </div>
          </div>
          <input className="input" placeholder="Athugasemd (valkvæmt)" value={note} onChange={e => setNote(e.target.value)} />
          <div className="p-3 rounded-xl text-center" style={{ background: 'var(--surface2)' }}>
            <div className="text-xs mb-0.5" style={{ color: 'var(--muted)' }}>Heildarupphæð</div>
            <div className="text-xl font-bold" style={{ color: 'var(--accent3)' }}>{formatISK(amount)}</div>
          </div>
          <button type="submit" className="btn w-full justify-center"
            style={{ background: 'var(--accent3)', color: '#fff' }}>
            Skrá {formatShortISK(amount)}
          </button>
        </form>
      )}

      {/* New item form */}
      {showNewItem && (
        <form onSubmit={handleNewItem} className="card flex flex-col gap-3 animate-scale-in">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Nýr hlutur</h3>
            <button type="button" onClick={() => setShowNewItem(false)}><X size={16} style={{ color: 'var(--muted)' }} /></button>
          </div>
          <input className="input" placeholder="Nafn hlutarins" value={newItemName} onChange={e => setNewItemName(e.target.value)} />
          <input type="number" className="input" placeholder="Verð á dag (ISK)" value={newItemPrice} onChange={e => setNewItemPrice(e.target.value)} />
          <button type="submit" className="btn btn-primary w-full justify-center">Bæta við</button>
        </form>
      )}

      {/* Items list */}
      <div className="card">
        <h3 className="font-semibold text-sm mb-3">Hlutir til leigu</h3>
        <div className="space-y-2">
          {items.map(i => (
            <div key={i.id} className="flex items-center justify-between py-2 px-3 rounded-xl"
              style={{ background: 'var(--surface2)' }}>
              <div>
                <div className="text-sm font-medium">{i.name}</div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                  {formatShortISK(i.pricePerDay)}/dag
                </div>
              </div>
              <button onClick={() => toggleItem(i.id)}>
                {i.active
                  ? <ToggleRight size={22} style={{ color: 'var(--accent3)' }} />
                  : <ToggleLeft size={22} style={{ color: 'var(--muted)' }} />
                }
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Bookings this month */}
      <div className="flex flex-col gap-2">
        <h3 className="font-semibold text-sm px-1">Bókanir þessa mánaðar</h3>
        {thisMonthBookings.length === 0 ? (
          <div className="card text-center py-6" style={{ color: 'var(--muted)' }}>Engar bókanir ennþá</div>
        ) : thisMonthBookings.map(b => (
          <div key={b.id} className="card flex items-center gap-3 py-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-base"
              style={{ background: 'rgba(249,115,22,0.15)' }}>📦</div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium">{formatISK(b.amount)}</div>
              <div className="text-xs" style={{ color: 'var(--muted)' }}>
                {b.itemName} · {b.days} dag{b.days !== 1 ? 'ar' : 'ur'} · {new Date(b.date).toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })}
                {b.note ? ` · ${b.note}` : ''}
              </div>
            </div>
            <button onClick={() => removeBooking(b.id)} style={{ color: 'var(--muted)' }}>
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

function SubscriptionsTab() {
  const { subs, activeSubs, monthlyTotal, duesSoon, addSub, removeSub, toggleSub } = useSubscriptions()
  const [showForm, setShowForm] = useState(false)
  const [newName, setNewName] = useState('')
  const [newIcon, setNewIcon] = useState('📱')
  const [newAmount, setNewAmount] = useState('')
  const [newDay, setNewDay] = useState(1)
  const [newCat, setNewCat] = useState('Annað')

  function handleAdd(e) {
    e.preventDefault()
    if (!newName || !newAmount) return
    addSub({ name: newName, icon: newIcon, amount: Number(newAmount), billingDay: Number(newDay), category: newCat })
    setNewName('')
    setNewAmount('')
    setShowForm(false)
  }

  const byCategory = subs.reduce((acc, s) => {
    if (!acc[s.category]) acc[s.category] = []
    acc[s.category].push(s)
    return acc
  }, {})

  return (
    <div className="flex flex-col gap-4">
      {/* Overview */}
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(139,92,246,0.05))' }}>
        <div className="flex justify-between items-start">
          <div>
            <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Heildar mánaðarleg áskrift</div>
            <div className="text-3xl font-bold">{formatISK(monthlyTotal)}</div>
          </div>
          <div className="text-right">
            <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Virkar áskriftir</div>
            <div className="text-2xl font-bold" style={{ color: 'var(--accent4)' }}>{activeSubs.length}</div>
          </div>
        </div>
        {duesSoon.length > 0 && (
          <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
            <div className="text-xs font-medium mb-2" style={{ color: 'var(--warning)' }}>⚠️ Greiðist bráðlega</div>
            {duesSoon.map(s => (
              <div key={s.id} className="flex justify-between text-xs py-1">
                <span>{s.icon} {s.name} {s.daysLeft === 0 ? '(í dag)' : s.daysLeft === 1 ? '(á morgun)' : `(${s.daysLeft} dagar)`}</span>
                <span style={{ color: 'var(--warning)' }}>{formatShortISK(s.amount)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <button onClick={() => setShowForm(!showForm)} className="btn btn-sm btn-ghost-accent w-full">
        <Plus size={13} /> Bæta við áskrift
      </button>

      {showForm && (
        <form onSubmit={handleAdd} className="card flex flex-col gap-3 animate-scale-in">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Ný áskrift</h3>
            <button type="button" onClick={() => setShowForm(false)}><X size={16} style={{ color: 'var(--muted)' }} /></button>
          </div>
          <div className="flex gap-2">
            <input className="input w-12 text-center" placeholder="🎮" value={newIcon} onChange={e => setNewIcon(e.target.value)} />
            <input className="input flex-1" placeholder="Nafn" value={newName} onChange={e => setNewName(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input type="number" className="input" placeholder="Upphæð (ISK)" value={newAmount} onChange={e => setNewAmount(e.target.value)} />
            <input type="number" className="input" placeholder="Dagur í mánuði" min={1} max={31} value={newDay} onChange={e => setNewDay(e.target.value)} />
          </div>
          <input className="input" placeholder="Flokkur" value={newCat} onChange={e => setNewCat(e.target.value)} />
          <button type="submit" className="btn btn-primary w-full justify-center">Bæta við</button>
        </form>
      )}

      {/* Subscriptions by category */}
      {Object.entries(byCategory).map(([cat, catSubs]) => (
        <div key={cat} className="card">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-xs" style={{ color: 'var(--muted)' }}>{cat.toUpperCase()}</h3>
            <span className="text-xs font-semibold">
              {formatShortISK(catSubs.filter(s => s.active).reduce((s, c) => s + c.amount, 0))}/mán
            </span>
          </div>
          <div className="space-y-2">
            {catSubs.map(s => (
              <div key={s.id} className={`flex items-center gap-3 py-2 px-3 rounded-xl transition-all ${!s.active ? 'opacity-40' : ''}`}
                style={{ background: 'var(--surface2)' }}>
                <span className="text-lg">{s.icon}</span>
                <div className="flex-1">
                  <div className="text-sm font-medium">{s.name}</div>
                  <div className="text-xs" style={{ color: 'var(--muted)' }}>
                    {s.billingDay}. hvers mánaðar · {formatShortISK(s.amount)}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => toggleSub(s.id)}>
                    {s.active
                      ? <ToggleRight size={20} style={{ color: 'var(--accent)' }} />
                      : <ToggleLeft size={20} style={{ color: 'var(--muted)' }} />
                    }
                  </button>
                  <button onClick={() => removeSub(s.id)} style={{ color: 'var(--muted)' }}>
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default function Finance() {
  const { addExpense, removeExpense, budget, setBudget, monthlyTotal, byCategory, remaining, recentExpenses } = useFinance()
  const [searchParams] = useSearchParams()
  const defaultTab = searchParams.get('tab') || 'overview'

  const [showForm, setShowForm] = useState(false)
  const [showBudgetEdit, setShowBudgetEdit] = useState(false)
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('food')
  const [note, setNote] = useState('')
  const [tab, setTab] = useState(defaultTab)

  const total = monthlyTotal()
  const cats = byCategory()
  const left = remaining()
  const isOver = left < 0
  const pct = Math.min(100, Math.round((total / budget.monthly) * 100))

  function handleAdd(e) {
    e.preventDefault()
    if (!amount || isNaN(Number(amount))) return
    addExpense(Number(amount), category, note)
    setAmount('')
    setNote('')
    setShowForm(false)
  }

  const TABS = [
    { id: 'overview', label: 'Útgjöld' },
    { id: 'lendo', label: '📦 Lendó' },
    { id: 'subs', label: '💳 Áskriftir' },
  ]

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-bold">Fjármál</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            {new Date().toLocaleDateString('is-IS', { month: 'long', year: 'numeric' })}
          </p>
        </div>
        {tab === 'overview' && (
          <button onClick={() => setShowForm(!showForm)} className="btn btn-primary btn-sm">
            <Plus size={15} /> Gjald
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="tab-bar">
        {TABS.map(t => (
          <button key={t.id} className={`tab-item ${tab === t.id ? 'active' : ''}`}
            onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* EXPENSES TAB */}
      {tab === 'overview' && (
        <>
          {/* Overview card */}
          <div className="card" style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.06), rgba(139,92,246,0.06))' }}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Útgjöld þessa mánaðar</div>
                <div className="text-3xl font-bold">{formatISK(total)}</div>
              </div>
              <div className="text-right">
                <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Eftir</div>
                <div className="text-lg font-bold" style={{ color: isOver ? 'var(--danger)' : 'var(--success)' }}>
                  {isOver ? '−' : ''}{formatISK(Math.abs(left))}
                </div>
              </div>
            </div>
            <div className="progress-bar mb-1.5">
              <div className="progress-fill"
                style={{ width: `${pct}%`, background: isOver ? 'var(--danger)' : pct > 80 ? '#f97316' : 'var(--accent)' }} />
            </div>
            <div className="flex justify-between text-xs" style={{ color: 'var(--muted)' }}>
              <span>{pct}% notað</span>
              <button onClick={() => setShowBudgetEdit(!showBudgetEdit)} style={{ color: 'var(--accent)' }}>
                Fjárhagsáætlun: {formatISK(budget.monthly)}
              </button>
            </div>
          </div>

          {/* Add expense form */}
          {showForm && (
            <form onSubmit={handleAdd} className="card flex flex-col gap-3 animate-scale-in">
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
                    className="flex flex-col items-center gap-0.5 py-2.5 rounded-xl text-xs transition-all"
                    style={{
                      background: category === c.id ? `${c.color}22` : 'var(--surface2)',
                      border: `1px solid ${category === c.id ? c.color + '55' : 'transparent'}`,
                    }}>
                    <span className="text-base">{c.icon}</span>
                    <span style={{ color: category === c.id ? c.color : 'var(--muted)', fontSize: 9 }}>{c.label}</span>
                  </button>
                ))}
              </div>
              <button type="submit" className="btn btn-primary w-full justify-center">Bæta við</button>
            </form>
          )}

          {/* Budget edit */}
          {showBudgetEdit && (
            <div className="card flex flex-col gap-3 animate-scale-in">
              <h3 className="font-semibold text-sm">Fjárhagsáætlun</h3>
              <div>
                <label className="text-xs mb-1 block" style={{ color: 'var(--muted)' }}>Mánaðarleg heildarsupphæð</label>
                <input className="input" type="number" value={budget.monthly}
                  onChange={e => setBudget(b => ({ ...b, monthly: Number(e.target.value) }))} />
              </div>
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

          {/* Category bars */}
          <div className="card flex flex-col gap-3">
            <h3 className="font-semibold text-sm">Eftir flokkum</h3>
            {EXPENSE_CATEGORIES.map(c => (
              <CategoryBar key={c.id} cat={c} spent={cats[c.id] || 0} budget={budget.categories[c.id]} />
            ))}
          </div>

          {/* Transactions */}
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-sm px-1">Nýlegar færslur</h3>
            {recentExpenses.length === 0 ? (
              <div className="card text-center py-8" style={{ color: 'var(--muted)' }}>Engar færslur ennþá</div>
            ) : recentExpenses.map(e => {
              const cat = EXPENSE_CATEGORIES.find(c => c.id === e.category) || EXPENSE_CATEGORIES[7]
              return (
                <div key={e.id} className="card flex items-center gap-3 py-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-lg"
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
        </>
      )}

      {tab === 'lendo' && <LendoTab />}
      {tab === 'subs' && <SubscriptionsTab />}
    </div>
  )
}
