import { useState } from 'react'
import { useFinance } from '../hooks/useFinance'
import { formatISK, formatShortISK, EXPENSE_CATEGORIES } from '../utils/currency'
import { Plus, Trash2, X, TrendingDown, TrendingUp, Edit2, Check } from 'lucide-react'

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

function SubscriptionRow({ sub, onUpdate, onRemove }) {
  const [editing, setEditing] = useState(false)
  const [val, setVal] = useState(String(sub.amount))

  const save = () => {
    onUpdate(sub.id, { amount: Number(val) || 0 })
    setEditing(false)
  }

  return (
    <div className="flex items-center gap-3 py-2.5 px-3 rounded-xl transition-all"
         style={{ background: sub.active ? 'var(--surface2)' : 'rgba(100,116,139,0.1)', opacity: sub.active ? 1 : 0.6 }}>
      <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-base"
           style={{ background: sub.color + '22' }}>
        {sub.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-medium">{sub.name}</span>
          {!sub.active && <span className="text-xs" style={{ color: 'var(--muted)' }}>· óvirkt</span>}
        </div>
        {editing ? (
          <div className="flex items-center gap-1.5 mt-1">
            <input className="input text-xs py-1 px-2" type="number" style={{ maxWidth: 100 }}
              value={val} onChange={e => setVal(e.target.value)} autoFocus
              onKeyDown={e => e.key === 'Enter' && save()} />
            <span className="text-xs" style={{ color: 'var(--muted)' }}>ISK/mán</span>
            <button onClick={save} style={{ color: 'var(--success)' }}><Check size={13} /></button>
          </div>
        ) : (
          <div className="text-xs mt-0.5" style={{ color: sub.amount > 0 ? 'var(--text)' : 'var(--muted)' }}>
            {sub.amount > 0 ? `${formatShortISK(sub.amount)}/mán` : 'Stilltu upphæð'}
          </div>
        )}
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <button onClick={() => onUpdate(sub.id, { active: !sub.active })}
          className="w-8 h-5 rounded-full transition-all relative flex items-center"
          style={{ background: sub.active ? 'var(--accent)' : 'var(--surface)' }}>
          <div className="absolute w-3.5 h-3.5 rounded-full bg-white transition-all"
               style={{ left: sub.active ? 'calc(100% - 18px)' : 2 }} />
        </button>
        {!editing && (
          <button onClick={() => setEditing(true)} style={{ color: 'var(--muted)', padding: 4 }}>
            <Edit2 size={13} />
          </button>
        )}
        <button onClick={() => onRemove(sub.id)} style={{ color: 'var(--muted)', padding: 4 }}>
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  )
}

export default function Finance() {
  const {
    addExpense, removeExpense, budget, setBudget,
    monthlyTotal, byCategory, remaining, recentExpenses,
    subscriptions, addSubscription, updateSubscription, removeSubscription, subscriptionTotal,
  } = useFinance()
  const [showForm, setShowForm] = useState(false)
  const [showBudgetEdit, setShowBudgetEdit] = useState(false)
  const [showSubForm, setShowSubForm] = useState(false)
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('food')
  const [note, setNote] = useState('')
  const [tab, setTab] = useState('overview')
  const [newSubName, setNewSubName] = useState('')
  const [newSubIcon, setNewSubIcon] = useState('📱')
  const [newSubAmount, setNewSubAmount] = useState('')

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

  const handleAddSub = (e) => {
    e.preventDefault()
    if (!newSubName.trim()) return
    addSubscription(newSubName.trim(), newSubIcon, Number(newSubAmount) || 0)
    setNewSubName('')
    setNewSubIcon('📱')
    setNewSubAmount('')
    setShowSubForm(false)
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
        {tab === 'subscriptions' && (
          <button onClick={() => setShowSubForm(!showSubForm)} className="btn btn-primary">
            <Plus size={16} /> Áskrift
          </button>
        )}
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
        {subscriptionTotal > 0 && (
          <div className="flex items-center justify-between mt-3 pt-3 text-xs" style={{ borderTop: '1px solid var(--border)', color: 'var(--muted)' }}>
            <span>Áskriftir/mán</span>
            <span style={{ color: 'var(--text)' }}>{formatShortISK(subscriptionTotal)}</span>
          </div>
        )}
      </div>

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

      {/* Add subscription form */}
      {showSubForm && (
        <form onSubmit={handleAddSub} className="card flex flex-col gap-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Ný áskrift</h3>
            <button type="button" onClick={() => setShowSubForm(false)}><X size={16} style={{ color: 'var(--muted)' }} /></button>
          </div>
          <div className="flex gap-2">
            <input className="input text-sm" style={{ maxWidth: 56, textAlign: 'center', fontSize: 20, padding: '8px' }}
              value={newSubIcon} onChange={e => setNewSubIcon(e.target.value)} maxLength={2} />
            <input className="input text-sm flex-1" placeholder="Heiti áskriftar" value={newSubName}
              onChange={e => setNewSubName(e.target.value)} autoFocus />
          </div>
          <div className="flex gap-2 items-center">
            <input className="input text-sm flex-1" type="number" placeholder="Upphæð/mán (ISK)"
              value={newSubAmount} onChange={e => setNewSubAmount(e.target.value)} />
          </div>
          <button type="submit" className="btn btn-primary w-full justify-center">Bæta við</button>
        </form>
      )}

      {/* Tabs */}
      <div className="flex gap-2">
        {[['overview', 'Yfirlit'], ['transactions', 'Færslur'], ['subscriptions', 'Áskriftir']].map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)}
            className="btn text-xs flex-1 justify-center"
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

      {tab === 'subscriptions' && (
        <div className="flex flex-col gap-3">
          {subscriptionTotal > 0 && (
            <div className="card flex items-center justify-between"
                 style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.06), rgba(139,92,246,0.06))' }}>
              <div>
                <div className="text-xs mb-0.5" style={{ color: 'var(--muted)' }}>Samtals á mánuði</div>
                <div className="text-2xl font-semibold">{formatShortISK(subscriptionTotal)}</div>
              </div>
              <div>
                <div className="text-xs mb-0.5 text-right" style={{ color: 'var(--muted)' }}>Á ári</div>
                <div className="text-lg font-semibold" style={{ color: 'var(--accent)' }}>
                  {formatShortISK(subscriptionTotal * 12)}
                </div>
              </div>
            </div>
          )}
          <div className="card flex flex-col gap-2">
            {subscriptions.length === 0 ? (
              <p className="text-center text-sm py-4" style={{ color: 'var(--muted)' }}>Engar áskriftir skráðar</p>
            ) : subscriptions.map(s => (
              <SubscriptionRow key={s.id} sub={s}
                onUpdate={updateSubscription}
                onRemove={removeSubscription} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
