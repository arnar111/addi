import { useState, useEffect } from 'react'
import { useFinance } from '../hooks/useFinance'
import { useSubscriptions } from '../hooks/useSubscriptions'
import { formatISK, formatShortISK, EXPENSE_CATEGORIES } from '../utils/currency'
import { Plus, Trash2, X, AlertCircle, Edit2, Check } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'

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

const STATUS_LABELS = { active: 'Virk', paused: 'Pausuð', cancelled: 'Afskráð', trial: 'Prófun' }
const STATUS_COLORS = { active: 'var(--success)', paused: 'var(--danger)', cancelled: 'var(--muted)', trial: 'var(--accent2)' }

function SubCard({ sub, onUpdate, onRemove, monthlyAmount }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(sub)
  const daysUntil = sub.renewDate ? Math.ceil((new Date(sub.renewDate) - new Date()) / (1000 * 60 * 60 * 24)) : null

  const save = () => { onUpdate(sub.id, draft); setEditing(false) }

  if (editing) {
    return (
      <div className="card flex flex-col gap-2 animate-slide-up">
        <div className="flex gap-2">
          <input className="input" style={{ width: 52 }} value={draft.icon}
            onChange={e => setDraft(d => ({ ...d, icon: e.target.value }))} placeholder="🏷️" />
          <input className="input flex-1" value={draft.name}
            onChange={e => setDraft(d => ({ ...d, name: e.target.value }))} placeholder="Nafn" />
        </div>
        <div className="flex gap-2">
          <input className="input flex-1" type="number" value={draft.amount}
            onChange={e => setDraft(d => ({ ...d, amount: Number(e.target.value) }))} placeholder="Upphæð (ISK)" />
          <select className="input" style={{ width: 120 }} value={draft.frequency}
            onChange={e => setDraft(d => ({ ...d, frequency: e.target.value }))}>
            <option value="monthly">Mánaðarlegt</option>
            <option value="annual">Árlegt</option>
          </select>
        </div>
        <div className="flex gap-2">
          <select className="input flex-1" value={draft.status}
            onChange={e => setDraft(d => ({ ...d, status: e.target.value }))}>
            <option value="active">Virk</option>
            <option value="paused">Pausuð</option>
            <option value="cancelled">Afskráð</option>
            <option value="trial">Prófun</option>
          </select>
          <input className="input flex-1" type="date" value={draft.renewDate || ''}
            onChange={e => setDraft(d => ({ ...d, renewDate: e.target.value || null }))} />
        </div>
        <input className="input text-sm" value={draft.note || ''} placeholder="Athugasemd..."
          onChange={e => setDraft(d => ({ ...d, note: e.target.value }))} />
        <div className="flex gap-2">
          <button onClick={save} className="btn btn-primary flex-1"><Check size={14} /> Vista</button>
          <button onClick={() => setEditing(false)} className="btn btn-ghost"><X size={14} /></button>
          <button onClick={() => onRemove(sub.id)} className="btn btn-danger"><Trash2 size={14} /></button>
        </div>
      </div>
    )
  }

  return (
    <div className="card flex items-center gap-3"
         style={sub.status === 'paused' ? { borderColor: 'rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.04)' } : {}}>
      {sub.status === 'paused' && (
        <AlertCircle size={16} style={{ color: 'var(--danger)', shrink: 0 }} />
      )}
      {sub.status !== 'paused' && (
        <span className="text-xl shrink-0">{sub.icon}</span>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium truncate">{sub.name}</span>
          <span className="text-xs px-1.5 py-0.5 rounded-full shrink-0"
                style={{ background: `${STATUS_COLORS[sub.status]}22`, color: STATUS_COLORS[sub.status] }}>
            {STATUS_LABELS[sub.status]}
          </span>
        </div>
        <div className="text-xs mt-0.5 flex gap-2" style={{ color: 'var(--muted)' }}>
          <span>{formatISK(monthlyAmount(sub))}/mán</span>
          {daysUntil !== null && daysUntil >= 0 && daysUntil <= 10 && (
            <span style={{ color: '#f97316' }}>· Endurnýjast eftir {daysUntil}d</span>
          )}
          {sub.note && <span>· {sub.note}</span>}
        </div>
      </div>
      <button onClick={() => setEditing(true)} style={{ color: 'var(--muted)' }}>
        <Edit2 size={14} />
      </button>
    </div>
  )
}

export default function Finance() {
  const { addExpense, removeExpense, budget, setBudget, monthlyTotal, byCategory, remaining, recentExpenses } = useFinance()
  const { subs, add: addSub, update: updateSub, remove: removeSub, totalMonthly, monthlyAmount, alerts } = useSubscriptions()
  const [searchParams] = useSearchParams()
  const [showForm, setShowForm] = useState(false)
  const [showBudgetEdit, setShowBudgetEdit] = useState(false)
  const [showSubForm, setShowSubForm] = useState(false)
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('food')
  const [note, setNote] = useState('')
  const [tab, setTab] = useState(searchParams.get('tab') === 'subs' ? 'subs' : 'overview')
  const [newSub, setNewSub] = useState({ name: '', icon: '📱', amount: '', frequency: 'monthly', status: 'active', renewDate: '', note: '' })

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
    if (!newSub.name || !newSub.amount) return
    addSub({ ...newSub, amount: Number(newSub.amount), renewDate: newSub.renewDate || null })
    setNewSub({ name: '', icon: '📱', amount: '', frequency: 'monthly', status: 'active', renewDate: '', note: '' })
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
        {tab !== 'subs' && (
          <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
            <Plus size={16} /> Gjald
          </button>
        )}
        {tab === 'subs' && (
          <button onClick={() => setShowSubForm(!showSubForm)} className="btn btn-primary">
            <Plus size={16} /> Áskrift
          </button>
        )}
      </div>

      {/* Subscription alert summary */}
      {alerts.length > 0 && tab !== 'subs' && (
        <button onClick={() => setTab('subs')}
          className="card flex items-center gap-3"
          style={{ borderColor: 'rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.06)' }}>
          <AlertCircle size={16} style={{ color: 'var(--danger)' }} />
          <span className="text-sm flex-1">{alerts.length} pausaðar áskriftir þurfa athygli</span>
          <span className="text-xs" style={{ color: 'var(--accent)' }}>Sjá →</span>
        </button>
      )}

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
        <div className="flex justify-between items-center mt-3 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>Áskriftir/mán</div>
          <div className="text-sm font-semibold">{formatISK(totalMonthly)}</div>
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
        {[['overview', 'Yfirlit'], ['transactions', 'Færslur'], ['subs', '📱 Áskriftir']].map(([t, l]) => (
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

      {tab === 'subs' && (
        <div className="flex flex-col gap-3">
          {/* Summary */}
          <div className="card"
               style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.06), rgba(139,92,246,0.06))' }}>
            <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Heildaráskriftir á mánuði</div>
            <div className="text-3xl font-bold mb-1">{formatISK(totalMonthly)}</div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>{subs.filter(s => s.status === 'active').length} virkar áskriftir</div>
          </div>

          {/* Add sub form */}
          {showSubForm && (
            <form onSubmit={handleAddSub} className="card flex flex-col gap-2 animate-slide-up">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-sm">Ný áskrift</span>
                <button type="button" onClick={() => setShowSubForm(false)}><X size={16} style={{ color: 'var(--muted)' }} /></button>
              </div>
              <div className="flex gap-2">
                <input className="input" style={{ width: 52 }} value={newSub.icon}
                  onChange={e => setNewSub(s => ({ ...s, icon: e.target.value }))} placeholder="🏷️" />
                <input className="input flex-1" value={newSub.name} required
                  onChange={e => setNewSub(s => ({ ...s, name: e.target.value }))} placeholder="Nafn" />
              </div>
              <div className="flex gap-2">
                <input className="input flex-1" type="number" value={newSub.amount} required
                  onChange={e => setNewSub(s => ({ ...s, amount: e.target.value }))} placeholder="Upphæð (ISK)" />
                <select className="input" style={{ width: 130 }} value={newSub.frequency}
                  onChange={e => setNewSub(s => ({ ...s, frequency: e.target.value }))}>
                  <option value="monthly">Mánaðarlegt</option>
                  <option value="annual">Árlegt</option>
                </select>
              </div>
              <input className="input text-sm" type="date" value={newSub.renewDate}
                onChange={e => setNewSub(s => ({ ...s, renewDate: e.target.value }))} placeholder="Endurnýjunardagur" />
              <button type="submit" className="btn btn-primary w-full justify-center">Bæta við</button>
            </form>
          )}

          {/* Alerts first */}
          {alerts.length > 0 && (
            <div className="flex flex-col gap-2">
              <div className="text-xs font-semibold px-1 flex items-center gap-1" style={{ color: 'var(--danger)' }}>
                <AlertCircle size={12} /> Þurfa athygli
              </div>
              {subs.filter(s => s.status === 'paused').map(s => (
                <SubCard key={s.id} sub={s} onUpdate={updateSub} onRemove={removeSub} monthlyAmount={monthlyAmount} />
              ))}
            </div>
          )}

          {/* Active subs */}
          <div className="flex flex-col gap-2">
            {alerts.length > 0 && <div className="text-xs font-semibold px-1" style={{ color: 'var(--muted)' }}>Virkar</div>}
            {subs.filter(s => s.status === 'active').map(s => (
              <SubCard key={s.id} sub={s} onUpdate={updateSub} onRemove={removeSub} monthlyAmount={monthlyAmount} />
            ))}
          </div>

          {/* Cancelled */}
          {subs.filter(s => s.status === 'cancelled').length > 0 && (
            <div className="flex flex-col gap-2">
              <div className="text-xs font-semibold px-1" style={{ color: 'var(--muted)' }}>Afskráðar</div>
              {subs.filter(s => s.status === 'cancelled').map(s => (
                <SubCard key={s.id} sub={s} onUpdate={updateSub} onRemove={removeSub} monthlyAmount={monthlyAmount} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
