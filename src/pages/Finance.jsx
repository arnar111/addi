import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useFinance } from '../hooks/useFinance'
import { useSubscriptions, SUB_STATUSES, SUB_CATEGORIES } from '../hooks/useSubscriptions'
import { formatISK, formatShortISK, EXPENSE_CATEGORIES } from '../utils/currency'
import { Plus, Trash2, X, AlertTriangle, CheckCircle, PauseCircle, XCircle, Edit2, Check } from 'lucide-react'

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

function StatusIcon({ status }) {
  if (status === 'active')    return <CheckCircle size={14} style={{ color: '#22c55e' }} />
  if (status === 'paused')    return <PauseCircle size={14} style={{ color: '#f97316' }} />
  if (status === 'failed')    return <AlertTriangle size={14} style={{ color: 'var(--danger)' }} />
  if (status === 'cancelled') return <XCircle size={14} style={{ color: 'var(--muted)' }} />
  return null
}

function SubCard({ sub, onUpdate, onRemove }) {
  const [editing, setEditing] = useState(false)
  const info = SUB_STATUSES[sub.status] || SUB_STATUSES.active
  const days = sub.nextBilling
    ? Math.ceil((new Date(sub.nextBilling) - new Date()) / (1000 * 60 * 60 * 24))
    : null
  const isFailed = sub.status === 'failed'
  const isExpired = days !== null && days < 0

  return (
    <div className="card py-3"
         style={{
           border: `1px solid ${isFailed ? 'rgba(239,68,68,0.3)' : 'var(--border)'}`,
           background: isFailed ? 'rgba(239,68,68,0.03)' : undefined,
         }}>
      <div className="flex items-center gap-3">
        <span className="text-2xl shrink-0">{sub.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">{sub.name}</span>
            <StatusIcon status={sub.status} />
          </div>
          <div className="text-xs mt-0.5" style={{ color: info.color }}>
            {info.label}
            {sub.note && ` · ${sub.note}`}
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="text-sm font-semibold">{formatShortISK(sub.amount)}</div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>
            {sub.cycle === 'annual' ? '/ár' : '/mán'}
          </div>
        </div>
      </div>

      {sub.nextBilling && (
        <div className="mt-2 pt-2 flex items-center justify-between"
             style={{ borderTop: '1px solid var(--border)' }}>
          <span className="text-xs" style={{ color: 'var(--muted)' }}>
            {isExpired ? 'Útrunnið' : 'Næst'}:
            {' '}{new Date(sub.nextBilling).toLocaleDateString('is-IS', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
          {days !== null && days >= 0 && days <= 7 && (
            <span className="badge" style={{ background: 'rgba(249,115,22,0.15)', color: '#f97316' }}>
              {days === 0 ? 'Í dag' : `${days}d`}
            </span>
          )}
        </div>
      )}

      <div className="mt-2 flex gap-2">
        {sub.status !== 'active' && (
          <button onClick={() => onUpdate(sub.id, { status: 'active' })}
                  className="btn text-xs py-1 flex-1 justify-center"
                  style={{ background: 'rgba(34,197,94,0.12)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.3)' }}>
            <CheckCircle size={11} /> Virkja
          </button>
        )}
        {sub.status === 'active' && (
          <button onClick={() => onUpdate(sub.id, { status: 'paused' })}
                  className="btn btn-ghost text-xs py-1 flex-1 justify-center">
            <PauseCircle size={11} /> Gera hlé
          </button>
        )}
        <button onClick={() => onRemove(sub.id)}
                className="btn btn-ghost text-xs py-1 px-3"
                style={{ color: 'var(--danger)' }}>
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  )
}

function AddSubForm({ onAdd, onClose }) {
  const [name, setName]             = useState('')
  const [icon, setIcon]             = useState('📱')
  const [amount, setAmount]         = useState('')
  const [cycle, setCycle]           = useState('monthly')
  const [status, setStatus]         = useState('active')
  const [nextBilling, setNextBilling] = useState('')
  const [category, setCategory]     = useState('other')

  const handle = (e) => {
    e.preventDefault()
    if (!name.trim() || !amount) return
    onAdd({ name: name.trim(), icon, amount: Number(amount), cycle, status, nextBilling: nextBilling || null, category, color: '#00d4aa' })
    onClose()
  }

  return (
    <form onSubmit={handle} className="card flex flex-col gap-3 animate-slide-up">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm">Ný áskrift</h3>
        <button type="button" onClick={onClose}><X size={16} style={{ color: 'var(--muted)' }} /></button>
      </div>
      <div className="flex gap-2">
        <input className="input text-sm w-16" placeholder="🎬" value={icon} onChange={e => setIcon(e.target.value)} />
        <input className="input text-sm flex-1" placeholder="Heiti áskriftar" value={name} onChange={e => setName(e.target.value)} autoFocus />
      </div>
      <input className="input text-sm" type="number" placeholder="Upphæð (kr)" value={amount} onChange={e => setAmount(e.target.value)} />
      <div className="flex gap-2">
        {['monthly', 'annual'].map(c => (
          <button key={c} type="button" onClick={() => setCycle(c)}
                  className="flex-1 py-1.5 rounded-lg text-xs font-medium transition-all"
                  style={{
                    background: cycle === c ? 'rgba(0,212,170,0.15)' : 'var(--surface2)',
                    color: cycle === c ? 'var(--accent)' : 'var(--muted)',
                    border: `1px solid ${cycle === c ? 'rgba(0,212,170,0.3)' : 'transparent'}`,
                  }}>
            {c === 'monthly' ? 'Mánaðarlegt' : 'Árlegt'}
          </button>
        ))}
      </div>
      <input type="date" className="input text-sm" value={nextBilling} onChange={e => setNextBilling(e.target.value)} />
      <button type="submit" className="btn btn-primary w-full justify-center">Bæta við</button>
    </form>
  )
}

export default function Finance() {
  const [searchParams] = useSearchParams()
  const initialTab = searchParams.get('tab') === 'subs' ? 'subscriptions' : 'overview'

  const { addExpense, removeExpense, budget, setBudget, monthlyTotal, byCategory, remaining, recentExpenses } = useFinance()
  const { subs, active, failed, monthlyTotal: subMonthly, annualTotal, update: updateSub, remove: removeSub, add: addSub } = useSubscriptions()

  const [showExpenseForm, setShowExpenseForm] = useState(false)
  const [showBudgetEdit, setShowBudgetEdit] = useState(false)
  const [showSubForm, setShowSubForm] = useState(false)
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('food')
  const [note, setNote] = useState('')
  const [tab, setTab] = useState(initialTab)

  useEffect(() => {
    if (searchParams.get('tab') === 'subs') setTab('subscriptions')
  }, [searchParams])

  const total = monthlyTotal()
  const cats = byCategory()
  const left = remaining()
  const isOver = left < 0
  const pct = Math.min(100, Math.round((total / budget.monthly) * 100))

  const handleAddExpense = (e) => {
    e.preventDefault()
    if (!amount || isNaN(Number(amount))) return
    addExpense(Number(amount), category, note)
    setAmount('')
    setNote('')
    setShowExpenseForm(false)
  }

  const TABS = [
    ['overview',      'Yfirlit'],
    ['transactions',  'Færslur'],
    ['subscriptions', `Áskriftir ${failed.length > 0 ? `🔴` : ''}`],
  ]

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold">Fjármál</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            {new Date().toLocaleDateString('is-IS', { month: 'long', year: 'numeric' })}
          </p>
        </div>
        {tab !== 'subscriptions' ? (
          <button onClick={() => setShowExpenseForm(!showExpenseForm)} className="btn btn-primary">
            <Plus size={16} /> Gjald
          </button>
        ) : (
          <button onClick={() => setShowSubForm(!showSubForm)} className="btn btn-primary">
            <Plus size={16} /> Áskrift
          </button>
        )}
      </div>

      {/* Budget overview card */}
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

      {/* Subscriptions summary card */}
      {tab === 'subscriptions' && (
        <div className="card" style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.06), rgba(139,92,246,0.06))' }}>
          <div className="flex justify-between items-start mb-2">
            <div>
              <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Virkar áskriftir/mán</div>
              <div className="text-3xl font-semibold">{formatISK(subMonthly)}</div>
            </div>
            <div className="flex flex-col items-end">
              <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Árlegt</div>
              <div className="text-lg font-semibold">{formatShortISK(annualTotal)}</div>
            </div>
          </div>
          <div className="flex gap-3 mt-2 text-xs">
            <span className="flex items-center gap-1" style={{ color: '#22c55e' }}>
              ● {active.filter(s => s.status === 'active').length} virkar
            </span>
            {failed.length > 0 && (
              <span className="flex items-center gap-1" style={{ color: 'var(--danger)' }}>
                ● {failed.length} mistókst
              </span>
            )}
            <span className="flex items-center gap-1" style={{ color: '#f97316' }}>
              ● {active.filter(s => s.status === 'paused').length} í bið
            </span>
          </div>
        </div>
      )}

      {showExpenseForm && (
        <form onSubmit={handleAddExpense} className="card flex flex-col gap-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Bæta við gjaldi</h3>
            <button type="button" onClick={() => setShowExpenseForm(false)}><X size={16} style={{ color: 'var(--muted)' }} /></button>
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

      {showSubForm && (
        <AddSubForm onAdd={addSub} onClose={() => setShowSubForm(false)} />
      )}

      {/* Tabs */}
      <div className="flex gap-2">
        {TABS.map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)}
            className="btn text-xs flex-1 justify-center py-2"
            style={{
              background: tab === t ? 'rgba(0,212,170,0.12)' : 'var(--surface)',
              color: tab === t ? 'var(--accent)' : 'var(--muted)',
              border: `1px solid ${tab === t ? 'rgba(0,212,170,0.25)' : 'var(--border)'}`,
            }}>
            {l}
          </button>
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
          {failed.length > 0 && (
            <div className="flex items-center gap-2 px-1">
              <AlertTriangle size={13} style={{ color: 'var(--danger)' }} />
              <span className="text-xs font-semibold" style={{ color: 'var(--danger)' }}>
                {failed.length} greiðslu mistókst — þarfnast athygli
              </span>
            </div>
          )}
          {subs
            .slice()
            .sort((a, b) => {
              const order = { failed: 0, paused: 1, active: 2, cancelled: 3 }
              return (order[a.status] ?? 4) - (order[b.status] ?? 4)
            })
            .map(s => (
              <SubCard key={s.id} sub={s} onUpdate={updateSub} onRemove={removeSub} />
            ))
          }
          {subs.length === 0 && (
            <div className="card text-center py-8" style={{ color: 'var(--muted)' }}>
              Engar áskriftir skráðar
            </div>
          )}
        </div>
      )}
    </div>
  )
}
