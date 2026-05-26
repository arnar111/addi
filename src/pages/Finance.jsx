import { useState } from 'react'
import { useFinance } from '../hooks/useFinance'
import { useSubscriptions } from '../hooks/useSubscriptions'
import { useRental } from '../hooks/useRental'
import { formatISK, formatShortISK, EXPENSE_CATEGORIES } from '../utils/currency'
import { Plus, Trash2, X, Home, CreditCard } from 'lucide-react'

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
  const { subs, monthlyTotal: subMonthly, yearlyTotal: subYearly, toggle: toggleSub, remove: removeSub, add: addSub, audibleCredits, setAudibleCredits } = useSubscriptions()
  const { income, addIncome, removeIncome, goal, setGoal, totalThisMonth, pct: rentalPct } = useRental()
  const [showForm, setShowForm] = useState(false)
  const [showBudgetEdit, setShowBudgetEdit] = useState(false)
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('food')
  const [note, setNote] = useState('')
  const [tab, setTab] = useState('overview')
  const [rentalAmount, setRentalAmount] = useState('')
  const [rentalNote, setRentalNote] = useState('')
  const [showRentalForm, setShowRentalForm] = useState(false)
  const [newSubName, setNewSubName] = useState('')
  const [newSubAmount, setNewSubAmount] = useState('')
  const [newSubIcon, setNewSubIcon] = useState('💳')
  const [showSubForm, setShowSubForm] = useState(false)

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
        {[['overview', 'Yfirlit'], ['transactions', 'Færslur'], ['rental', '🏠 Leiga'], ['subscriptions', '💳 Áskriftir']].map(([t, l]) => (
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

      {tab === 'rental' && (
        <div className="flex flex-col gap-4">
          {/* Rental progress */}
          <div className="card" style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.06), rgba(139,92,246,0.06))' }}>
            <div className="flex items-center gap-2 mb-3">
              <Home size={16} style={{ color: 'var(--accent)' }} />
              <span className="font-semibold text-sm">Lendó — Leigutekjur þessa mánaðar</span>
            </div>
            <div className="text-3xl font-bold mb-1">{formatISK(totalThisMonth)}</div>
            <div className="h-2 rounded-full overflow-hidden mb-1" style={{ background: 'var(--surface2)' }}>
              <div className="h-full rounded-full transition-all"
                   style={{ width: `${rentalPct}%`, background: rentalPct >= 100 ? 'var(--success)' : 'var(--accent)' }} />
            </div>
            <div className="flex justify-between text-xs" style={{ color: 'var(--muted)' }}>
              <span>{rentalPct}% af marki</span>
              <div className="flex items-center gap-1">
                <span>Markmið:</span>
                <input
                  className="input text-xs py-0.5 px-2"
                  type="number"
                  style={{ width: 90, display: 'inline' }}
                  value={goal}
                  onChange={e => setGoal(Number(e.target.value))} />
              </div>
            </div>
          </div>

          {/* Add rental income */}
          <button onClick={() => setShowRentalForm(!showRentalForm)} className="btn btn-primary w-full justify-center">
            <Plus size={16} /> Skrá leigutekjur
          </button>

          {showRentalForm && (
            <form onSubmit={(e) => {
              e.preventDefault()
              if (!rentalAmount || isNaN(Number(rentalAmount))) return
              addIncome(Number(rentalAmount), rentalNote)
              setRentalAmount('')
              setRentalNote('')
              setShowRentalForm(false)
            }} className="card flex flex-col gap-3 animate-slide-up">
              <input className="input" type="number" placeholder="Upphæð (ISK)" value={rentalAmount}
                     onChange={e => setRentalAmount(e.target.value)} autoFocus />
              <input className="input" placeholder="Skýring (t.d. Borðstollasett, 1 dagur)" value={rentalNote}
                     onChange={e => setRentalNote(e.target.value)} />
              <button type="submit" className="btn btn-primary w-full justify-center">Bæta við</button>
            </form>
          )}

          {/* Income list */}
          {income.length === 0 ? (
            <div className="card text-center py-8" style={{ color: 'var(--muted)' }}>Engar leigutekjur skráðar</div>
          ) : income.map(i => (
            <div key={i.id} className="card flex items-center gap-3 py-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-base"
                   style={{ background: 'rgba(0,212,170,0.12)' }}>🏠</div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium" style={{ color: 'var(--success)' }}>+{formatISK(i.amount)}</div>
                <div className="text-xs" style={{ color: 'var(--muted)' }}>
                  {i.note || 'Leigutekjur'} · {new Date(i.date).toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })}
                </div>
              </div>
              <button onClick={() => removeIncome(i.id)} style={{ color: 'var(--muted)' }}>
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {tab === 'subscriptions' && (
        <div className="flex flex-col gap-4">
          {/* Summary */}
          <div className="card" style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.08), rgba(0,212,170,0.06))' }}>
            <div className="flex items-center gap-2 mb-3">
              <CreditCard size={16} style={{ color: 'var(--accent2)' }} />
              <span className="font-semibold text-sm">Áskriftayfirlit</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-xs mb-0.5" style={{ color: 'var(--muted)' }}>Á mánuði</div>
                <div className="text-2xl font-bold">{formatISK(subMonthly)}</div>
              </div>
              <div>
                <div className="text-xs mb-0.5" style={{ color: 'var(--muted)' }}>Á ári</div>
                <div className="text-2xl font-bold" style={{ color: 'var(--accent2)' }}>{formatISK(subYearly)}</div>
              </div>
            </div>
            {/* Audible credits */}
            <div className="mt-3 pt-3 flex items-center justify-between" style={{ borderTop: '1px solid var(--border)' }}>
              <div>
                <div className="text-xs font-medium">🎧 Audible einingar: {audibleCredits.count}</div>
                {audibleCredits.expiringSoon > 0 && (
                  <div className="text-xs mt-0.5" style={{ color: '#f97316' }}>
                    ⚠️ {audibleCredits.expiringSoon} rennur út!
                  </div>
                )}
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => setAudibleCredits(p => ({ ...p, count: Math.max(0, p.count - 1), expiringSoon: Math.max(0, p.expiringSoon - 1) }))}
                  className="text-xs px-2 py-1 rounded-lg"
                  style={{ background: 'var(--surface2)', color: 'var(--muted)' }}>
                  −1
                </button>
                <button
                  onClick={() => setAudibleCredits(p => ({ ...p, count: p.count + 1 }))}
                  className="text-xs px-2 py-1 rounded-lg"
                  style={{ background: 'var(--surface2)', color: 'var(--muted)' }}>
                  +1
                </button>
                <button
                  onClick={() => setAudibleCredits(p => ({ ...p, expiringSoon: p.expiringSoon > 0 ? p.expiringSoon - 1 : p.expiringSoon + 1 }))}
                  className="text-xs px-2 py-1 rounded-lg"
                  style={{ background: 'rgba(249,115,22,0.15)', color: '#f97316' }}>
                  ⚠️
                </button>
              </div>
            </div>
          </div>

          {/* Subscription list */}
          <div className="flex flex-col gap-2">
            {subs.map(s => (
              <div key={s.id} className="card flex items-center gap-3 py-3"
                   style={{ opacity: s.active ? 1 : 0.5 }}>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-lg"
                     style={{ background: s.active ? 'rgba(139,92,246,0.15)' : 'var(--surface2)' }}>
                  {s.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">{s.name}</div>
                  <div className="text-xs" style={{ color: 'var(--muted)' }}>
                    {s.active ? formatISK(s.amount) + ' / mánuður' : 'Óvirk'}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => toggleSub(s.id)}
                    className="text-xs px-2 py-1 rounded-lg transition-all"
                    style={{
                      background: s.active ? 'rgba(0,212,170,0.12)' : 'var(--surface2)',
                      color: s.active ? 'var(--accent)' : 'var(--muted)',
                    }}>
                    {s.active ? 'Virk' : 'Óvirk'}
                  </button>
                  <button onClick={() => removeSub(s.id)} style={{ color: 'var(--muted)' }}>
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add subscription */}
          <button onClick={() => setShowSubForm(!showSubForm)} className="btn btn-ghost w-full justify-center">
            <Plus size={14} /> Bæta við áskrift
          </button>
          {showSubForm && (
            <form onSubmit={(e) => {
              e.preventDefault()
              if (!newSubName.trim() || isNaN(Number(newSubAmount))) return
              addSub({ name: newSubName.trim(), amount: Number(newSubAmount), cycle: 'monthly', icon: newSubIcon, active: true })
              setNewSubName('')
              setNewSubAmount('')
              setShowSubForm(false)
            }} className="card flex flex-col gap-3 animate-slide-up">
              <div className="flex gap-2">
                <input className="input text-sm" style={{ width: 50 }} value={newSubIcon}
                       onChange={e => setNewSubIcon(e.target.value)} />
                <input className="input text-sm flex-1" placeholder="Heiti" value={newSubName}
                       onChange={e => setNewSubName(e.target.value)} />
              </div>
              <input className="input text-sm" type="number" placeholder="Upphæð (ISK / mánuður)"
                     value={newSubAmount} onChange={e => setNewSubAmount(e.target.value)} />
              <button type="submit" className="btn btn-primary w-full justify-center">Bæta við</button>
            </form>
          )}
        </div>
      )}
    </div>
  )
}
