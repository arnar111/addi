import { useState } from 'react'
import { useFinance } from '../hooks/useFinance'
import { useSubscriptions } from '../hooks/useSubscriptions'
import { formatISK, formatShortISK, EXPENSE_CATEGORIES } from '../utils/currency'
import { Plus, Trash2, X, TrendingDown, TrendingUp, CreditCard, ToggleLeft, ToggleRight } from 'lucide-react'

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
          <div className="h-full rounded-full transition-all"
               style={{ width: `${pct}%`, background: isOver ? 'var(--danger)' : cat.color }} />
        </div>
      )}
    </div>
  )
}

const SUB_ICONS = ['🎵', '⚽', '🎧', '🎮', '🌐', '💼', '⛳', '🎟️', '📺', '🎬', '☁️', '📰', '🏋️', '📱', '💡', '🔒']
const SUB_COLORS = ['#1db954', '#00d4aa', '#f97316', '#107c10', '#00c7b7', '#0077b5', '#22c55e', '#ec4899', '#e50914', '#6441a5', '#0089d6', '#ff6000', '#ef4444', '#8b5cf6', '#eab308', '#64748b']

export default function Finance() {
  const { addExpense, removeExpense, budget, setBudget, monthlyTotal, byCategory, remaining, recentExpenses } = useFinance()
  const { subs, add: addSub, remove: removeSub, update: updateSub, monthlyTotal: subMonthly, yearlyTotal: subYearly } = useSubscriptions()

  const [showForm, setShowForm] = useState(false)
  const [showBudgetEdit, setShowBudgetEdit] = useState(false)
  const [showSubForm, setShowSubForm] = useState(false)
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('food')
  const [note, setNote] = useState('')
  const [tab, setTab] = useState('overview')

  // Subscription form state
  const [subName, setSubName] = useState('')
  const [subIcon, setSubIcon] = useState('📱')
  const [subColor, setSubColor] = useState('#8b5cf6')
  const [subAmount, setSubAmount] = useState('')
  const [subCycle, setSubCycle] = useState('monthly')

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
    addSub({ name: subName.trim(), icon: subIcon, color: subColor, amount: Number(subAmount), cycle: subCycle })
    setSubName('')
    setSubIcon('📱')
    setSubColor('#8b5cf6')
    setSubAmount('')
    setSubCycle('monthly')
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

      {/* Subscription summary card */}
      {tab === 'subscriptions' && (
        <div className="card" style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.07), rgba(0,212,170,0.05))' }}>
          <div className="flex justify-between items-start mb-2">
            <div>
              <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Mánaðarlegar áskriftir</div>
              <div className="text-3xl font-semibold">{formatISK(subMonthly())}</div>
            </div>
            <div className="text-right">
              <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Á ári</div>
              <div className="text-lg font-semibold" style={{ color: 'var(--accent2)' }}>
                {formatISK(subYearly())}
              </div>
            </div>
          </div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>
            {subs.filter(s => s.active && s.amount > 0).length} virkar áskriftir
          </div>
        </div>
      )}

      {/* Add expense form */}
      {showForm && tab !== 'subscriptions' && (
        <form onSubmit={handleAdd} className="card flex flex-col gap-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Bæta við gjaldi</h3>
            <button type="button" onClick={() => setShowForm(false)}>
              <X size={16} style={{ color: 'var(--muted)' }} />
            </button>
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

      {/* Add subscription form */}
      {showSubForm && tab === 'subscriptions' && (
        <form onSubmit={handleAddSub} className="card flex flex-col gap-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Bæta við áskrift</h3>
            <button type="button" onClick={() => setShowSubForm(false)}>
              <X size={16} style={{ color: 'var(--muted)' }} />
            </button>
          </div>
          <input className="input" placeholder="Nafn (t.d. Spotify)" value={subName}
            onChange={e => setSubName(e.target.value)} autoFocus />
          <input className="input" type="number" placeholder="Upphæð (ISK/mánuður)" value={subAmount}
            onChange={e => setSubAmount(e.target.value)} />
          <div className="flex gap-2">
            {[['monthly', 'Mánaðarlegt'], ['yearly', 'Árlegt']].map(([v, l]) => (
              <button key={v} type="button" onClick={() => setSubCycle(v)}
                className="flex-1 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={{
                  background: subCycle === v ? 'rgba(0,212,170,0.15)' : 'var(--surface2)',
                  color: subCycle === v ? 'var(--accent)' : 'var(--muted)',
                  border: `1px solid ${subCycle === v ? 'rgba(0,212,170,0.3)' : 'transparent'}`,
                }}>{l}</button>
            ))}
          </div>
          <div>
            <div className="text-xs mb-1.5" style={{ color: 'var(--muted)' }}>Tákn</div>
            <div className="flex flex-wrap gap-1.5">
              {SUB_ICONS.map(ic => (
                <button key={ic} type="button" onClick={() => setSubIcon(ic)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-base transition-all"
                  style={{
                    background: subIcon === ic ? 'rgba(0,212,170,0.15)' : 'var(--surface2)',
                    border: `1px solid ${subIcon === ic ? 'rgba(0,212,170,0.4)' : 'transparent'}`,
                  }}>
                  {ic}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs mb-1.5" style={{ color: 'var(--muted)' }}>Litur</div>
            <div className="flex flex-wrap gap-2">
              {SUB_COLORS.map(c => (
                <button key={c} type="button" onClick={() => setSubColor(c)}
                  className="w-6 h-6 rounded-full transition-all"
                  style={{
                    background: c,
                    border: `2px solid ${subColor === c ? '#fff' : 'transparent'}`,
                    transform: subColor === c ? 'scale(1.2)' : 'scale(1)',
                  }} />
              ))}
            </div>
          </div>
          <button type="submit" className="btn btn-primary w-full justify-center">Bæta við</button>
        </form>
      )}

      {/* Tabs */}
      <div className="flex gap-2">
        {[
          ['overview', 'Yfirlit'],
          ['transactions', 'Færslur'],
          ['subscriptions', 'Áskriftir'],
        ].map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)}
            className="btn text-xs flex-1 justify-center"
            style={{
              background: tab === t ? 'rgba(0,212,170,0.12)' : 'var(--surface)',
              color: tab === t ? 'var(--accent)' : 'var(--muted)',
              border: `1px solid ${tab === t ? 'rgba(0,212,170,0.25)' : 'var(--border)'}`,
            }}>{l}</button>
        ))}
      </div>

      {/* Overview tab */}
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

      {/* Transactions tab */}
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

      {/* Subscriptions tab */}
      {tab === 'subscriptions' && (
        <div className="flex flex-col gap-2">
          {subs.length === 0 ? (
            <div className="card text-center py-8" style={{ color: 'var(--muted)' }}>
              Engar áskriftir skráðar
            </div>
          ) : subs.map(s => (
            <div key={s.id} className="card flex items-center gap-3 py-3"
                 style={{ opacity: s.active ? 1 : 0.5 }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-lg"
                   style={{ background: `${s.color}22` }}>{s.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-semibold">{s.name}</span>
                  {!s.active && (
                    <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'var(--surface2)', color: 'var(--muted)' }}>
                      Óvirkur
                    </span>
                  )}
                </div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                  {s.amount > 0 ? `${formatISK(s.amount)}/${s.cycle === 'yearly' ? 'ár' : 'mán'}` : 'Ókeypis'}
                </div>
              </div>
              <button onClick={() => updateSub(s.id, { active: !s.active })}
                className="text-xs px-2 py-1.5 rounded-lg transition-all"
                style={{
                  background: s.active ? 'rgba(0,212,170,0.12)' : 'var(--surface2)',
                  color: s.active ? 'var(--accent)' : 'var(--muted)',
                }}>
                {s.active ? 'Virkt' : 'Óvirkt'}
              </button>
              <button onClick={() => removeSub(s.id)} style={{ color: 'var(--muted)', padding: 4 }}>
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
