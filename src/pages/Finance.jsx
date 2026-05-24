import { useState } from 'react'
import { useFinance } from '../hooks/useFinance'
import { useSubscriptions } from '../hooks/useSubscriptions'
import { formatISK, formatShortISK, EXPENSE_CATEGORIES } from '../utils/currency'
import { Plus, Trash2, X, ToggleLeft, ToggleRight } from 'lucide-react'

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

function SubCard({ sub, onToggle, onRemove, catColor }) {
  return (
    <div className="flex items-center gap-3 py-2.5 px-3 rounded-xl"
         style={{ background: 'var(--surface2)', opacity: sub.active ? 1 : 0.5 }}>
      <span className="text-lg shrink-0">{sub.icon}</span>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate">{sub.name}</div>
        <div className="text-xs" style={{ color: 'var(--muted)' }}>
          {formatISK(sub.amount)}/mán
          {sub.cycle === 'yearly' ? ' (árleg)' : ''}
        </div>
      </div>
      <button onClick={() => onToggle(sub.id)} className="shrink-0" style={{ color: sub.active ? catColor : 'var(--muted)' }}>
        {sub.active ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
      </button>
      <button onClick={() => onRemove(sub.id)} style={{ color: 'var(--muted)' }} className="shrink-0">
        <Trash2 size={13} />
      </button>
    </div>
  )
}

export default function Finance() {
  const { addExpense, removeExpense, budget, setBudget, monthlyTotal, byCategory, remaining, recentExpenses } = useFinance()
  const { subs, add: addSub, remove: removeSub, toggle: toggleSub, monthlyTotal: subMonthly, yearlyTotal, SUB_CATEGORIES } = useSubscriptions()

  const [showForm, setShowForm] = useState(false)
  const [showBudgetEdit, setShowBudgetEdit] = useState(false)
  const [showSubForm, setShowSubForm] = useState(false)
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('food')
  const [note, setNote] = useState('')
  const [tab, setTab] = useState('overview')

  const [subName, setSubName] = useState('')
  const [subAmount, setSubAmount] = useState('')
  const [subCycle, setSubCycle] = useState('monthly')
  const [subCat, setSubCat] = useState('tech')
  const [subIcon, setSubIcon] = useState('📱')

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
    if (!subName.trim() || !subAmount) return
    addSub({ name: subName, amount: Number(subAmount), cycle: subCycle, category: subCat, icon: subIcon, active: true })
    setSubName('')
    setSubAmount('')
    setShowSubForm(false)
  }

  const subsByCategory = Object.entries(SUB_CATEGORIES).map(([id, cat]) => ({
    id, ...cat,
    items: subs.filter(s => s.category === id),
  })).filter(c => c.items.length > 0)

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
      {tab !== 'subscriptions' && (
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
      )}

      {/* Subscription overview card */}
      {tab === 'subscriptions' && (
        <div className="card" style={{ background: 'linear-gradient(135deg, rgba(236,72,153,0.06), rgba(139,92,246,0.06))' }}>
          <div className="flex justify-between items-start mb-2">
            <div>
              <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Mánaðarlegar áskriftir</div>
              <div className="text-3xl font-semibold">{formatISK(subMonthly())}</div>
            </div>
            <div className="flex flex-col items-end">
              <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Á ári</div>
              <div className="text-lg font-semibold" style={{ color: 'var(--accent)' }}>
                {formatISK(yearlyTotal())}
              </div>
            </div>
          </div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>
            {subs.filter(s => s.active).length} virkar · {subs.filter(s => !s.active).length} óvirkar
          </div>
        </div>
      )}

      {/* Add expense form */}
      {showForm && tab !== 'subscriptions' && (
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
      {showSubForm && tab === 'subscriptions' && (
        <form onSubmit={handleAddSub} className="card flex flex-col gap-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Bæta við áskrift</h3>
            <button type="button" onClick={() => setShowSubForm(false)}><X size={16} style={{ color: 'var(--muted)' }} /></button>
          </div>
          <div className="flex gap-2">
            <input className="input text-sm w-16 shrink-0" placeholder="🏷️" value={subIcon}
                   onChange={e => setSubIcon(e.target.value)} />
            <input className="input text-sm flex-1" placeholder="Nafn" value={subName}
                   onChange={e => setSubName(e.target.value)} autoFocus />
          </div>
          <input className="input" type="number" placeholder="Upphæð (ISK)" value={subAmount}
                 onChange={e => setSubAmount(e.target.value)} />
          <div className="flex gap-2">
            {[['monthly', 'Mánaðarlegt'], ['yearly', 'Árleg']].map(([v, l]) => (
              <button key={v} type="button" onClick={() => setSubCycle(v)}
                className="flex-1 py-1.5 rounded-lg text-xs font-medium"
                style={{
                  background: subCycle === v ? 'rgba(0,212,170,0.15)' : 'var(--surface2)',
                  color: subCycle === v ? 'var(--accent)' : 'var(--muted)',
                  border: `1px solid ${subCycle === v ? 'rgba(0,212,170,0.3)' : 'transparent'}`,
                }}>{l}</button>
            ))}
          </div>
          <button type="submit" className="btn btn-primary w-full justify-center">Bæta við</button>
        </form>
      )}

      {/* Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {[['overview', 'Yfirlit'], ['transactions', 'Færslur'], ['subscriptions', '📱 Áskriftir']].map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)}
            className="btn text-xs flex-1 justify-center shrink-0 py-1.5"
            style={{
              background: tab === t ? 'rgba(0,212,170,0.12)' : 'var(--surface)',
              color: tab === t ? 'var(--accent)' : 'var(--muted)',
              border: `1px solid ${tab === t ? 'rgba(0,212,170,0.25)' : 'var(--border)'}`,
              minWidth: tab === 'subscriptions' ? 100 : 80,
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
          {subsByCategory.map(catGroup => (
            <div key={catGroup.id} className="card flex flex-col gap-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold" style={{ color: catGroup.color }}>{catGroup.label}</span>
                <span className="text-xs" style={{ color: 'var(--muted)' }}>
                  {formatISK(catGroup.items.filter(s => s.active).reduce((t, s) => t + s.amount, 0))}/mán
                </span>
              </div>
              {catGroup.items.map(sub => (
                <SubCard key={sub.id} sub={sub} onToggle={toggleSub} onRemove={removeSub} catColor={catGroup.color} />
              ))}
            </div>
          ))}
          {subs.length === 0 && (
            <div className="card text-center py-8" style={{ color: 'var(--muted)' }}>Engar áskriftir</div>
          )}
        </div>
      )}
    </div>
  )
}
