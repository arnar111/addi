import { useState } from 'react'
import { useFinance } from '../hooks/useFinance'
import { useSubscriptions } from '../hooks/useSubscriptions'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { formatISK, formatShortISK, EXPENSE_CATEGORIES } from '../utils/currency'
import { Plus, Trash2, X, TrendingDown, TrendingUp, Check, Edit2 } from 'lucide-react'

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
          <div className="h-full rounded-full transition-all duration-500"
               style={{ width: `${pct}%`, background: isOver ? 'var(--danger)' : cat.color }} />
        </div>
      )}
    </div>
  )
}

function SubscriptionsTab() {
  const { subs, toggle, add, remove, updateAmount, monthlyTotal, yearlyTotal } = useSubscriptions()
  const [showAdd, setShowAdd] = useState(false)
  const [newName, setNewName] = useState('')
  const [newIcon, setNewIcon] = useState('📱')
  const [newAmount, setNewAmount] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editAmount, setEditAmount] = useState('')

  const handleAdd = (e) => {
    e.preventDefault()
    if (!newName.trim() || !newAmount) return
    add(newName.trim(), newIcon, newAmount)
    setNewName('')
    setNewIcon('📱')
    setNewAmount('')
    setShowAdd(false)
  }

  const startEdit = (s) => {
    setEditingId(s.id)
    setEditAmount(String(s.amount))
  }

  const saveEdit = (id) => {
    if (editAmount) updateAmount(id, editAmount)
    setEditingId(null)
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Summary card */}
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.06), rgba(139,92,246,0.06))' }}>
        <div className="flex justify-between items-start mb-3">
          <div>
            <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Virkar áskriftir / mánuð</div>
            <div className="text-3xl font-semibold">{formatISK(monthlyTotal)}</div>
          </div>
          <div className="flex flex-col items-end">
            <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Á ári</div>
            <div className="text-lg font-semibold" style={{ color: 'var(--accent)' }}>{formatShortISK(yearlyTotal)}</div>
          </div>
        </div>
        <div className="text-xs" style={{ color: 'var(--muted)' }}>
          {subs.filter(s => s.active).length} virkar · {subs.filter(s => !s.active).length} óvirkar
        </div>
      </div>

      {/* Add button */}
      <button onClick={() => setShowAdd(!showAdd)} className="btn btn-primary w-full justify-center">
        <Plus size={16} /> Bæta við áskrift
      </button>

      {showAdd && (
        <form onSubmit={handleAdd} className="card flex flex-col gap-3 animate-slide-up">
          <div className="flex gap-2">
            <input className="input text-sm" style={{ width: 60 }} placeholder="📱" value={newIcon}
              onChange={e => setNewIcon(e.target.value)} />
            <input className="input text-sm flex-1" placeholder="Nafn áskriftar" value={newName}
              onChange={e => setNewName(e.target.value)} autoFocus />
          </div>
          <input className="input text-sm" type="number" placeholder="Mánaðarlegt verð (ISK)" value={newAmount}
            onChange={e => setNewAmount(e.target.value)} />
          <div className="flex gap-2">
            <button type="submit" className="btn btn-primary flex-1 justify-center">Vista</button>
            <button type="button" onClick={() => setShowAdd(false)} className="btn btn-ghost"><X size={16} /></button>
          </div>
        </form>
      )}

      {/* Sub list */}
      <div className="flex flex-col gap-2">
        {subs.map(s => (
          <div key={s.id} className="card flex items-center gap-3 py-3 transition-all"
               style={{ opacity: s.active ? 1 : 0.5 }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0"
                 style={{ background: `${s.color}22` }}>
              {s.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium flex items-center gap-2">
                {s.name}
                {s.active && (
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--success)' }} />
                )}
              </div>
              {editingId === s.id ? (
                <div className="flex items-center gap-1 mt-1">
                  <input className="input text-xs py-1 px-2" style={{ width: 100 }} type="number"
                    value={editAmount} onChange={e => setEditAmount(e.target.value)}
                    onBlur={() => saveEdit(s.id)} autoFocus />
                  <button onClick={() => saveEdit(s.id)} style={{ color: 'var(--accent)' }}>
                    <Check size={12} />
                  </button>
                </div>
              ) : (
                <div className="text-xs flex items-center gap-1 mt-0.5" style={{ color: 'var(--muted)' }}>
                  {formatISK(s.amount)}/mán
                  <button onClick={() => startEdit(s)} style={{ color: 'var(--muted)', padding: 2 }}>
                    <Edit2 size={10} />
                  </button>
                </div>
              )}
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => toggle(s.id)}
                className="text-xs px-2 py-1 rounded-lg font-medium transition-all"
                style={{
                  background: s.active ? 'rgba(0,212,170,0.12)' : 'var(--surface2)',
                  color: s.active ? 'var(--accent)' : 'var(--muted)',
                }}>
                {s.active ? 'Virk' : 'Óvirk'}
              </button>
              <button onClick={() => remove(s.id)} style={{ color: 'var(--muted)', padding: 4 }}>
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Finance() {
  const { addExpense, removeExpense, budget, setBudget, monthlyTotal, byCategory, remaining, recentExpenses } = useFinance()
  const [income] = useLocalStorage('addi_income', 0)
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
  const netSavings = income > 0 ? income - total : null

  const handleAdd = (e) => {
    e.preventDefault()
    if (!amount || isNaN(Number(amount))) return
    addExpense(Number(amount), category, note)
    setAmount('')
    setNote('')
    setShowForm(false)
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
        {tab !== 'subscriptions' && (
          <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
            <Plus size={16} /> Gjald
          </button>
        )}
      </div>

      {/* Overview card */}
      {tab !== 'subscriptions' && (
        <div className="card" style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.06), rgba(139,92,246,0.06))' }}>
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Útgjöld þessa mánaðar</div>
              <div className="text-3xl font-semibold">{formatISK(total)}</div>
              {income > 0 && (
                <div className="text-xs mt-1 flex items-center gap-1"
                     style={{ color: netSavings >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                  {netSavings >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {netSavings >= 0 ? '+' : ''}{formatShortISK(netSavings)} sparnaður
                </div>
              )}
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
      )}

      {/* Add expense form */}
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

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {[['overview', 'Yfirlit'], ['transactions', 'Færslur'], ['subscriptions', '📱 Áskriftir']].map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)}
            className="btn text-sm flex-1 justify-center shrink-0 min-w-0"
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

      {tab === 'subscriptions' && <SubscriptionsTab />}
    </div>
  )
}
