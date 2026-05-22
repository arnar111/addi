import { useState } from 'react'
import { useFinance } from '../hooks/useFinance'
import { useSubscriptions } from '../hooks/useSubscriptions'
import { formatISK, formatShortISK, EXPENSE_CATEGORIES } from '../utils/currency'
import { monthlyTotal as subMonthly, yearlyTotal as subYearly, SUB_CATEGORIES } from '../utils/subscriptions'
import { Plus, Trash2, X, TrendingDown, TrendingUp, DollarSign, CreditCard, ToggleLeft, ToggleRight, ExternalLink, AlertTriangle } from 'lucide-react'

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

function SubscriptionsTab() {
  const { subs, addSub, removeSub, toggleActive } = useSubscriptions()
  const [showForm, setShowForm] = useState(false)
  const [newSub, setNewSub] = useState({ name: '', icon: '💳', cost: '', billing: 'monthly', category: 'other', active: true })
  const [filterCat, setFilterCat] = useState('all')

  const monthly = subMonthly(subs)
  const yearly = subYearly(subs)
  const warnings = subs.filter(s => s.note && s.note.includes('⚠️'))
  const paused = subs.filter(s => !s.active)
  const filtered = filterCat === 'all' ? subs : subs.filter(s => s.category === filterCat)

  const handleAdd = (e) => {
    e.preventDefault()
    if (!newSub.name || !newSub.cost) return
    addSub({ ...newSub, cost: Number(newSub.cost) })
    setNewSub({ name: '', icon: '💳', cost: '', billing: 'monthly', category: 'other', active: true })
    setShowForm(false)
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Summary */}
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.08), rgba(0,0,0,0))' }}>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Mánaðarlegt</div>
            <div className="text-2xl font-semibold">{formatISK(monthly)}</div>
          </div>
          <div>
            <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Á ári</div>
            <div className="text-2xl font-semibold">{formatISK(yearly)}</div>
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs flex-wrap">
          <span className="flex items-center gap-1" style={{ color: 'var(--success)' }}>
            ✓ {subs.filter(s => s.active).length} virk áskrift
          </span>
          {paused.length > 0 && (
            <span className="flex items-center gap-1" style={{ color: 'var(--muted)' }}>
              ⏸ {paused.length} hlé
            </span>
          )}
          {warnings.length > 0 && (
            <span className="flex items-center gap-1" style={{ color: 'var(--danger)' }}>
              <AlertTriangle size={10} /> {warnings.length} þarfnast athygli
            </span>
          )}
        </div>
      </div>

      {/* Warnings */}
      {warnings.map(s => (
        <div key={s.id} className="flex items-start gap-2 p-3 rounded-xl"
             style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
          <AlertTriangle size={14} style={{ color: 'var(--danger)', flexShrink: 0, marginTop: 1 }} />
          <div className="text-xs">
            <span className="font-medium">{s.icon} {s.name}: </span>
            <span style={{ color: 'var(--muted)' }}>{s.note}</span>
          </div>
        </div>
      ))}

      {/* Category filter */}
      <div className="flex gap-1.5 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {SUB_CATEGORIES.map(c => (
          <button key={c.id} onClick={() => setFilterCat(c.id)}
            className="text-xs px-3 py-1 rounded-lg shrink-0 transition-all"
            style={{
              background: filterCat === c.id ? `${c.color}22` : 'var(--surface2)',
              color: filterCat === c.id ? c.color : 'var(--muted)',
              border: `1px solid ${filterCat === c.id ? c.color + '44' : 'transparent'}`,
            }}>
            {c.label}
          </button>
        ))}
      </div>

      {/* Add button */}
      <button onClick={() => setShowForm(!showForm)} className="btn btn-ghost w-full justify-center text-sm">
        <Plus size={14} /> Bæta við áskrift
      </button>

      {/* Add form */}
      {showForm && (
        <form onSubmit={handleAdd} className="card flex flex-col gap-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Ný áskrift</h3>
            <button type="button" onClick={() => setShowForm(false)}><X size={16} style={{ color: 'var(--muted)' }} /></button>
          </div>
          <div className="flex gap-2">
            <input className="input w-14 text-center text-lg" value={newSub.icon}
              onChange={e => setNewSub(p => ({ ...p, icon: e.target.value }))} placeholder="🎵" />
            <input className="input flex-1" placeholder="Heiti áskriftar" value={newSub.name}
              onChange={e => setNewSub(p => ({ ...p, name: e.target.value }))} autoFocus />
          </div>
          <div className="flex gap-2">
            <input className="input flex-1" type="number" placeholder="Verð (ISK)" value={newSub.cost}
              onChange={e => setNewSub(p => ({ ...p, cost: e.target.value }))} />
            <select className="input w-32" value={newSub.billing}
              onChange={e => setNewSub(p => ({ ...p, billing: e.target.value }))}>
              <option value="monthly">Mánaðarlegt</option>
              <option value="yearly">Árlegt</option>
            </select>
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {SUB_CATEGORIES.filter(c => c.id !== 'all').map(c => (
              <button key={c.id} type="button" onClick={() => setNewSub(p => ({ ...p, category: c.id }))}
                className="text-xs px-2 py-1 rounded-lg transition-all"
                style={{
                  background: newSub.category === c.id ? `${c.color}22` : 'var(--surface2)',
                  color: newSub.category === c.id ? c.color : 'var(--muted)',
                }}>
                {c.label}
              </button>
            ))}
          </div>
          <button type="submit" className="btn btn-primary w-full justify-center">Bæta við</button>
        </form>
      )}

      {/* Subscription list */}
      <div className="flex flex-col gap-2">
        {filtered.map(s => {
          const catColor = SUB_CATEGORIES.find(c => c.id === s.category)?.color || '#64748b'
          const mCost = s.billing === 'yearly' ? Math.round(s.cost / 12) : s.cost
          return (
            <div key={s.id} className="card flex items-center gap-3 py-3"
                 style={{ opacity: s.active ? 1 : 0.5 }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-lg"
                   style={{ background: `${catColor}20` }}>
                {s.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-medium truncate">{s.name}</span>
                  {!s.active && <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'var(--surface2)', color: 'var(--muted)' }}>Hlé</span>}
                </div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                  {formatISK(mCost)}/mán
                  {s.billing === 'yearly' ? ` (${formatISK(s.cost)}/ár)` : ''}
                  {s.note ? ` · ${s.note}` : ''}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => toggleActive(s.id)} style={{ color: s.active ? 'var(--accent)' : 'var(--muted)' }}>
                  {s.active ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
                </button>
                <button onClick={() => removeSub(s.id)} style={{ color: 'var(--muted)' }}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function Finance() {
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
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold">Fjármál</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
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
          <div className={`flex flex-col items-end`}>
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
        {[['overview', 'Yfirlit'], ['transactions', 'Færslur'], ['subs', '💳 Áskriftir']].map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)}
            className="btn text-sm shrink-0 justify-center"
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

      {tab === 'subs' && <SubscriptionsTab />}
    </div>
  )
}
