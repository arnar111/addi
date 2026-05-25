import { useState } from 'react'
import { useFinance } from '../hooks/useFinance'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { formatISK, formatShortISK, EXPENSE_CATEGORIES } from '../utils/currency'
import { Plus, Trash2, X, Calendar } from 'lucide-react'

const DEFAULT_SUBS = [
  { id: 's1', name: 'Apple iCloud+', amount: 1499, icon: '🍎', billing: 'monthly', due: 23 },
  { id: 's2', name: 'Huel', amount: 9900, icon: '🥤', billing: 'monthly', due: 15 },
  { id: 's3', name: 'The Athletic', amount: 2490, icon: '⚽', billing: 'monthly', due: 1 },
  { id: 's4', name: 'Patreon', amount: 1500, icon: '🎬', billing: 'monthly', due: 10 },
  { id: 's5', name: 'Nicco', amount: 3500, icon: '📦', billing: 'monthly', due: 20 },
  { id: 's6', name: 'Netlify', amount: 3200, icon: '🌐', billing: 'monthly', due: 24 },
]

function SubscriptionsTab() {
  const [subs, setSubs] = useLocalStorage('addi_subscriptions', DEFAULT_SUBS)
  const [showAdd, setShowAdd] = useState(false)
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [icon, setIcon] = useState('📱')
  const [due, setDue] = useState('')

  const total = subs.reduce((s, sub) => s + sub.amount, 0)
  const today = new Date().getDate()

  const handleAdd = (e) => {
    e.preventDefault()
    if (!name || !amount) return
    setSubs(prev => [...prev, {
      id: Date.now().toString(),
      name, amount: Number(amount), icon,
      billing: 'monthly', due: Number(due) || 1,
    }])
    setName(''); setAmount(''); setDue(''); setShowAdd(false)
  }

  const upcomingDays = 7
  const upcoming = subs.filter(s => {
    const daysUntil = s.due >= today ? s.due - today : (31 - today) + s.due
    return daysUntil <= upcomingDays
  })

  return (
    <div className="flex flex-col gap-3">
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.08), rgba(0,212,170,0.06))' }}>
        <div className="flex justify-between items-center">
          <div>
            <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Mánaðarlegar áskriftir</div>
            <div className="text-2xl font-semibold">{formatISK(total)}</div>
          </div>
          <div className="text-3xl">📱</div>
        </div>
      </div>

      {upcoming.length > 0 && (
        <div className="card" style={{ borderColor: 'rgba(249,115,22,0.3)', background: 'rgba(249,115,22,0.05)' }}>
          <div className="flex items-center gap-2 mb-2">
            <Calendar size={14} style={{ color: '#f97316' }} />
            <span className="text-xs font-semibold" style={{ color: '#f97316' }}>Koma á næstu {upcomingDays} dögum</span>
          </div>
          {upcoming.map(s => (
            <div key={s.id} className="flex items-center justify-between py-1.5"
                 style={{ borderBottom: '1px solid var(--border)' }}>
              <div className="flex items-center gap-2 text-sm">
                <span>{s.icon}</span>
                <span>{s.name}</span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span style={{ color: 'var(--muted)' }}>
                  {s.due >= today ? `${s.due - today}d` : 'á morgun'}
                </span>
                <span className="font-semibold">{formatShortISK(s.amount)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold px-1">Allar áskriftir</h3>
        <button onClick={() => setShowAdd(!showAdd)} className="btn btn-primary" style={{ padding: '6px 12px', fontSize: 12 }}>
          <Plus size={13} /> Bæta við
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleAdd} className="card flex flex-col gap-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Ný áskrift</h3>
            <button type="button" onClick={() => setShowAdd(false)}><X size={16} style={{ color: 'var(--muted)' }} /></button>
          </div>
          <div className="flex gap-2">
            <input className="input" style={{ width: 48 }} value={icon} onChange={e => setIcon(e.target.value)} placeholder="📱" />
            <input className="input flex-1" placeholder="Heiti (t.d. Netflix)" value={name} onChange={e => setName(e.target.value)} autoFocus />
          </div>
          <div className="flex gap-2">
            <input className="input flex-1" type="number" placeholder="Upphæð (ISK)" value={amount} onChange={e => setAmount(e.target.value)} />
            <input className="input w-20" type="number" placeholder="Dagur" min="1" max="31" value={due} onChange={e => setDue(e.target.value)} />
          </div>
          <button type="submit" className="btn btn-primary w-full justify-center">Bæta við</button>
        </form>
      )}

      <div className="flex flex-col gap-2">
        {subs.map(sub => (
          <div key={sub.id} className="card flex items-center gap-3 py-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0"
                 style={{ background: 'var(--surface2)' }}>{sub.icon}</div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold">{sub.name}</div>
              <div className="text-xs" style={{ color: 'var(--muted)' }}>
                Mánaðarlega · gjalddagi {sub.due}.
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold">{formatShortISK(sub.amount)}</span>
              <button onClick={() => setSubs(prev => prev.filter(s => s.id !== sub.id))}
                      style={{ color: 'var(--muted)' }}>
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

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

      <div className="flex gap-2">
        {[['overview', 'Yfirlit'], ['transactions', 'Færslur'], ['subscriptions', 'Áskriftir']].map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)}
            className="btn text-sm flex-1 justify-center"
            style={{
              background: tab === t ? 'rgba(0,212,170,0.12)' : 'var(--surface)',
              color: tab === t ? 'var(--accent)' : 'var(--muted)',
              border: `1px solid ${tab === t ? 'rgba(0,212,170,0.25)' : 'var(--border)'}`,
              padding: '8px 6px',
              fontSize: 13,
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
