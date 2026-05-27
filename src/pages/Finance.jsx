import { useState } from 'react'
import { useFinance } from '../hooks/useFinance'
import { useSubscriptions } from '../hooks/useSubscriptions'
import { formatISK, formatShortISK, EXPENSE_CATEGORIES } from '../utils/currency'
import { Plus, Trash2, X, AlertCircle } from 'lucide-react'

const SUB_ICONS = ['🌐', '🥤', '🎵', '☁️', '🤖', '📱', '🎬', '📰', '🎮', '💻']
const SUB_COLORS = ['#00d4aa', '#8b5cf6', '#f97316', '#3b82f6', '#ec4899', '#22c55e']

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
  const { subs, add: addSub, remove: removeSub, toggleActive, active: activeSubs, monthlyTotal: subsMonthly, yearlyTotal: subsYearly } = useSubscriptions()
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
  const [subIcon, setSubIcon] = useState('📱')
  const [subColor, setSubColor] = useState('#00d4aa')
  const [subNote, setSubNote] = useState('')

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
    if (!subName.trim() || !subAmount || isNaN(Number(subAmount))) return
    addSub(subName.trim(), Number(subAmount), subCycle, subIcon, subColor, subNote.trim())
    setSubName('')
    setSubAmount('')
    setSubCycle('monthly')
    setSubIcon('📱')
    setSubColor('#00d4aa')
    setSubNote('')
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
        {[['overview', 'Yfirlit'], ['transactions', 'Færslur'], ['subs', 'Áskriftir']].map(([t, l]) => (
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

      {tab === 'subs' && (
        <div className="flex flex-col gap-3">
          {/* Subs summary */}
          <div className="card" style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.06), rgba(0,212,170,0.06))' }}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-xs" style={{ color: 'var(--muted)' }}>
                  {activeSubs.length} virkar áskriftir
                </div>
                <div className="text-2xl font-semibold mt-1">{formatISK(subsMonthly)}<span className="text-sm font-normal" style={{ color: 'var(--muted)' }}> / mán</span></div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                  {formatISK(subsYearly)} / ár
                </div>
              </div>
              <button onClick={() => setShowSubForm(!showSubForm)} className="btn btn-primary">
                <Plus size={14} /> Áskrift
              </button>
            </div>
          </div>

          {/* Add sub form */}
          {showSubForm && (
            <form onSubmit={handleAddSub} className="card flex flex-col gap-3 animate-slide-up">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm">Ný áskrift</h3>
                <button type="button" onClick={() => setShowSubForm(false)}>
                  <X size={16} style={{ color: 'var(--muted)' }} />
                </button>
              </div>
              <input className="input" placeholder="Heiti (t.d. Apple TV+)" autoFocus
                value={subName} onChange={e => setSubName(e.target.value)} />
              <div className="grid grid-cols-2 gap-2">
                <input className="input" type="number" placeholder="Upphæð (ISK)"
                  value={subAmount} onChange={e => setSubAmount(e.target.value)} />
                <select className="input" value={subCycle} onChange={e => setSubCycle(e.target.value)}>
                  <option value="monthly">Mánaðarlega</option>
                  <option value="yearly">Árlega</option>
                </select>
              </div>
              <input className="input" placeholder="Athugasemd (valkvæmt)"
                value={subNote} onChange={e => setSubNote(e.target.value)} />

              <div className="flex flex-col gap-1.5">
                <label className="text-xs" style={{ color: 'var(--muted)' }}>Tákn</label>
                <div className="grid grid-cols-5 gap-1.5">
                  {SUB_ICONS.map(i => (
                    <button key={i} type="button" onClick={() => setSubIcon(i)}
                      className="aspect-square rounded-xl text-lg flex items-center justify-center transition-all"
                      style={{
                        background: subIcon === i ? `${subColor}22` : 'var(--surface2)',
                        border: `1px solid ${subIcon === i ? subColor + '55' : 'transparent'}`,
                      }}>{i}</button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs" style={{ color: 'var(--muted)' }}>Litur</label>
                <div className="flex gap-2">
                  {SUB_COLORS.map(c => (
                    <button key={c} type="button" onClick={() => setSubColor(c)}
                      className="w-8 h-8 rounded-full transition-all"
                      style={{
                        background: c,
                        border: `2px solid ${subColor === c ? '#fff' : 'transparent'}`,
                      }} />
                  ))}
                </div>
              </div>

              <button type="submit" className="btn btn-primary w-full justify-center">Bæta við</button>
            </form>
          )}

          {/* Sub list */}
          {subs.length === 0 ? (
            <div className="card text-center py-8" style={{ color: 'var(--muted)' }}>
              <div className="text-2xl mb-1">💳</div>
              <div className="text-sm">Engar áskriftir skráðar</div>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {subs.map(s => {
                const monthlyEq = s.cycle === 'yearly' ? Math.round(s.amount / 12) : s.amount
                return (
                  <div key={s.id} className="card flex items-center gap-3 py-3"
                       style={{ opacity: s.active ? 1 : 0.55 }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-lg"
                         style={{ background: `${s.color}22`, border: `1px solid ${s.color}44` }}>
                      {s.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm truncate">{s.name}</span>
                        {s.note && (
                          <span className="badge flex items-center gap-0.5"
                                style={{ background: 'rgba(239,68,68,0.12)', color: 'var(--danger)' }}>
                            <AlertCircle size={9} /> {s.note}
                          </span>
                        )}
                      </div>
                      <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                        {formatISK(s.amount)} / {s.cycle === 'yearly' ? 'ár' : 'mán'}
                        {s.cycle === 'yearly' && ` · ≈ ${formatShortISK(monthlyEq)}/mán`}
                      </div>
                    </div>
                    <button onClick={() => toggleActive(s.id)}
                      className="text-xs px-2 py-1 rounded-lg shrink-0"
                      style={{
                        background: s.active ? 'rgba(34,197,94,0.12)' : 'var(--surface2)',
                        color: s.active ? 'var(--success)' : 'var(--muted)',
                        border: `1px solid ${s.active ? 'rgba(34,197,94,0.25)' : 'var(--border)'}`,
                      }}>
                      {s.active ? 'Virk' : 'Af'}
                    </button>
                    <button onClick={() => {
                        if (confirm(`Eyða áskriftinni "${s.name}"?`)) removeSub(s.id)
                      }} style={{ color: 'var(--muted)' }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
