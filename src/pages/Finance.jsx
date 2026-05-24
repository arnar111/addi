import { useState } from 'react'
import { useFinance } from '../hooks/useFinance'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { formatISK, formatShortISK, EXPENSE_CATEGORIES } from '../utils/currency'
import { Plus, Trash2, X, RefreshCw, ToggleLeft, ToggleRight } from 'lucide-react'

const DEFAULT_SUBS = [
  { id: '1', name: 'iCloud+', amount: 990, currency: 'ISK', cycle: 'monthly', active: true, icon: '☁️', category: 'Storage' },
  { id: '2', name: 'The Athletic', amount: 890, currency: 'ISK', cycle: 'monthly', active: true, icon: '⚽', category: 'Sports' },
  { id: '3', name: 'Netlify', amount: 2500, currency: 'ISK', cycle: 'monthly', active: true, icon: '🌐', category: 'Dev' },
  { id: '4', name: 'Huel', amount: 8000, currency: 'ISK', cycle: 'monthly', active: true, icon: '🥤', category: 'Health' },
  { id: '5', name: 'Calm', amount: 0, currency: 'ISK', cycle: 'yearly', active: false, icon: '🧘', category: 'Wellness' },
]

function SubscriptionsTab() {
  const [subs, setSubs] = useLocalStorage('addi_subscriptions', DEFAULT_SUBS)
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ name: '', amount: '', icon: '💳', cycle: 'monthly', active: true, category: '' })

  const active = subs.filter(s => s.active)
  const monthly = active.reduce((acc, s) => acc + (s.cycle === 'yearly' ? s.amount / 12 : s.amount), 0)
  const yearly = active.reduce((acc, s) => acc + (s.cycle === 'yearly' ? s.amount : s.amount * 12), 0)

  const toggle = (id) => setSubs(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s))
  const remove = (id) => setSubs(prev => prev.filter(s => s.id !== id))
  const add = (e) => {
    e.preventDefault()
    if (!form.name || !form.amount) return
    setSubs(prev => [...prev, { ...form, id: Date.now().toString(), amount: Number(form.amount) }])
    setForm({ name: '', amount: '', icon: '💳', cycle: 'monthly', active: true, category: '' })
    setShowAdd(false)
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="card flex justify-between items-center"
           style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.06), rgba(139,92,246,0.06))' }}>
        <div>
          <div className="text-xs mb-0.5" style={{ color: 'var(--muted)' }}>Virkar áskriftir / mánuður</div>
          <div className="text-2xl font-bold">{formatISK(Math.round(monthly))}</div>
        </div>
        <div className="text-right">
          <div className="text-xs mb-0.5" style={{ color: 'var(--muted)' }}>á ári</div>
          <div className="text-lg font-semibold" style={{ color: 'var(--muted)' }}>{formatISK(Math.round(yearly))}</div>
        </div>
      </div>

      <button onClick={() => setShowAdd(!showAdd)} className="btn btn-primary text-sm">
        <Plus size={14} /> Bæta við áskrift
      </button>

      {showAdd && (
        <form onSubmit={add} className="card flex flex-col gap-2 animate-slide-up">
          <div className="flex items-center justify-between mb-1">
            <span className="font-semibold text-sm">Ný áskrift</span>
            <button type="button" onClick={() => setShowAdd(false)}><X size={15} style={{ color: 'var(--muted)' }} /></button>
          </div>
          <div className="flex gap-2">
            <input className="input text-sm w-14 text-center" placeholder="🎯" value={form.icon}
                   onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} />
            <input className="input text-sm flex-1" placeholder="Nafn" value={form.name}
                   onChange={e => setForm(f => ({ ...f, name: e.target.value }))} autoFocus />
          </div>
          <div className="flex gap-2">
            <input className="input text-sm flex-1" type="number" placeholder="Upphæð (ISK)" value={form.amount}
                   onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} />
            <select className="input text-sm w-32" value={form.cycle}
                    onChange={e => setForm(f => ({ ...f, cycle: e.target.value }))}>
              <option value="monthly">Mánuðarlegt</option>
              <option value="yearly">Árlegt</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary w-full justify-center text-sm">Bæta við</button>
        </form>
      )}

      <div className="flex flex-col gap-2">
        {subs.map(s => (
          <div key={s.id} className="card flex items-center gap-3 py-3"
               style={{ opacity: s.active ? 1 : 0.5 }}>
            <div className="text-xl w-9 h-9 flex items-center justify-center rounded-xl shrink-0"
                 style={{ background: 'var(--surface2)' }}>{s.icon}</div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm">{s.name}</div>
              <div className="text-xs" style={{ color: 'var(--muted)' }}>
                {formatISK(s.amount)} / {s.cycle === 'monthly' ? 'mán' : 'ár'}
                {s.category && ` · ${s.category}`}
              </div>
            </div>
            <button onClick={() => toggle(s.id)} className="shrink-0" title={s.active ? 'Gera óvirkt' : 'Virkja'}>
              {s.active
                ? <ToggleRight size={22} style={{ color: 'var(--accent)' }} />
                : <ToggleLeft size={22} style={{ color: 'var(--muted)' }} />
              }
            </button>
            <button onClick={() => remove(s.id)} style={{ color: 'var(--muted)' }}>
              <Trash2 size={14} />
            </button>
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

      {/* Tabs */}
      <div className="flex gap-2">
        {[['overview', 'Yfirlit'], ['transactions', 'Færslur'], ['subscriptions', 'Áskriftir']].map(([t, l]) => (
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

      {tab === 'subscriptions' && <SubscriptionsTab />}
    </div>
  )
}
