import { useState } from 'react'
import { useFinance } from '../hooks/useFinance'
import { useLendo } from '../hooks/useLendo'
import { formatISK, formatShortISK, EXPENSE_CATEGORIES } from '../utils/currency'
import { Plus, Trash2, X, TrendingDown, TrendingUp, Home } from 'lucide-react'

const INCOME_SOURCES = [
  { id: 'lendo',   label: 'Lendó',       icon: '🏠', color: '#00b4d8' },
  { id: 'salary',  label: 'Laun',         icon: '💼', color: '#22c55e' },
  { id: 'other',   label: 'Annað',        icon: '💰', color: '#8b5cf6' },
  { id: 'freelance', label: 'Freelance',  icon: '💻', color: '#f97316' },
]

function CategoryBar({ cat, spent, budget }) {
  const pct = budget ? Math.min(100, Math.round((spent / budget) * 100)) : 0
  const isOver = spent > budget && budget > 0
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between text-xs">
        <span>{cat.icon} {cat.label}</span>
        <span style={{ color: isOver ? 'var(--danger)' : 'var(--muted)' }}>
          {formatShortISK(spent)}{budget ? ` / ${formatShortISK(budget)}` : ''}
        </span>
      </div>
      {budget > 0 && (
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${pct}%`, background: isOver ? 'var(--danger)' : cat.color }} />
        </div>
      )}
    </div>
  )
}

export default function Finance() {
  const finance = useFinance()
  const lendo = useLendo()
  const { addExpense, removeExpense, budget, setBudget, monthlyTotal, byCategory, remaining, recentExpenses, addIncome, removeIncome, recentIncome, monthlyIncome, netBalance } = finance

  const [tab, setTab] = useState('overview')
  const [showExpForm, setShowExpForm] = useState(false)
  const [showIncForm, setShowIncForm] = useState(false)
  const [showBudgetEdit, setShowBudgetEdit] = useState(false)

  const [expAmount, setExpAmount] = useState('')
  const [expCategory, setExpCategory] = useState('food')
  const [expNote, setExpNote] = useState('')

  const [incAmount, setIncAmount] = useState('')
  const [incSource, setIncSource] = useState('lendo')
  const [incNote, setIncNote] = useState('')

  const total = monthlyTotal()
  const income = monthlyIncome()
  const net = netBalance()
  const cats = byCategory()
  const left = remaining()
  const isOver = left < 0
  const pct = Math.min(100, Math.round((total / budget.monthly) * 100))

  const handleAddExp = (e) => {
    e.preventDefault()
    if (!expAmount || isNaN(Number(expAmount))) return
    addExpense(Number(expAmount), expCategory, expNote)
    setExpAmount(''); setExpNote(''); setShowExpForm(false)
  }

  const handleAddInc = (e) => {
    e.preventDefault()
    if (!incAmount || isNaN(Number(incAmount))) return
    addIncome(Number(incAmount), incSource, incNote)
    setIncAmount(''); setIncNote(''); setShowIncForm(false)
  }

  return (
    <div className="flex flex-col gap-4 pb-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between px-1 pt-4">
        <div>
          <h1 className="text-xl font-bold">Fjármál</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            {new Date().toLocaleDateString('is-IS', { month: 'long', year: 'numeric' })}
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => { setShowIncForm(!showIncForm); setShowExpForm(false) }}
            className="btn text-sm"
            style={{ background: 'rgba(34,197,94,0.12)', color: 'var(--success)', border: '1px solid rgba(34,197,94,0.25)' }}>
            <TrendingUp size={14} /> Tekjur
          </button>
          <button onClick={() => { setShowExpForm(!showExpForm); setShowIncForm(false) }}
            className="btn btn-primary text-sm">
            <Plus size={14} /> Gjald
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-2">
        <div className="card" style={{ padding: '12px' }}>
          <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Útgjöld</div>
          <div className="text-lg font-bold" style={{ color: 'var(--danger)' }}>{formatShortISK(total)}</div>
        </div>
        <div className="card" style={{ padding: '12px' }}>
          <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Tekjur</div>
          <div className="text-lg font-bold" style={{ color: 'var(--success)' }}>{formatShortISK(income)}</div>
        </div>
        <div className="card" style={{ padding: '12px' }}>
          <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Nettó</div>
          <div className="text-lg font-bold" style={{ color: net >= 0 ? 'var(--success)' : 'var(--danger)' }}>
            {net >= 0 ? '+' : ''}{formatShortISK(net)}
          </div>
        </div>
      </div>

      {/* Budget progress */}
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.06), rgba(139,92,246,0.06))' }}>
        <div className="flex justify-between items-center mb-3">
          <div>
            <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Útgjöld af fjárhagsáætlun</div>
            <div className="text-2xl font-bold">{formatISK(total)}</div>
          </div>
          <div>
            <div className="text-xs mb-1 text-right" style={{ color: 'var(--muted)' }}>Eftir</div>
            <div className="text-lg font-semibold" style={{ color: isOver ? 'var(--danger)' : 'var(--success)' }}>
              {isOver ? '-' : ''}{formatISK(Math.abs(left))}
            </div>
          </div>
        </div>
        <div className="progress-bar mb-1">
          <div className="progress-fill" style={{ width: `${pct}%`, background: isOver ? 'var(--danger)' : pct > 80 ? '#f97316' : 'var(--accent)' }} />
        </div>
        <div className="flex justify-between text-xs" style={{ color: 'var(--muted)' }}>
          <span>{pct}% notað</span>
          <span>Fjárh: {formatISK(budget.monthly)}</span>
        </div>
      </div>

      {/* Lendó summary in Finance */}
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(0,180,216,0.08), rgba(0,212,170,0.04))' }}>
        <div className="flex items-center gap-2 mb-2">
          <Home size={16} style={{ color: 'var(--lendo)' }} />
          <span className="font-semibold text-sm">Lendó leigutekjur</span>
        </div>
        <div className="flex justify-between items-end">
          <div>
            <div className="text-xl font-bold" style={{ color: 'var(--lendo)' }}>{formatShortISK(lendo.monthlyTotal)}</div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>af {formatShortISK(lendo.goal)} marki</div>
          </div>
          <div className="text-xs text-right" style={{ color: 'var(--muted)' }}>
            <div>{lendo.monthlyCount} {lendo.monthlyCount === 1 ? 'leiga' : 'leigur'}</div>
            <div>{lendo.daysLeft} dagar eftir</div>
          </div>
        </div>
        <div className="progress-bar mt-2">
          <div className="progress-fill" style={{
            width: `${Math.min(100, Math.round((lendo.monthlyTotal / lendo.goal) * 100))}%`,
            background: 'var(--lendo)'
          }} />
        </div>
      </div>

      {/* Add expense form */}
      {showExpForm && (
        <form onSubmit={handleAddExp} className="card flex flex-col gap-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Bæta við gjaldi</h3>
            <button type="button" onClick={() => setShowExpForm(false)}><X size={16} style={{ color: 'var(--muted)' }} /></button>
          </div>
          <input className="input" type="number" placeholder="Upphæð (ISK)" value={expAmount}
                 onChange={e => setExpAmount(e.target.value)} autoFocus />
          <input className="input" placeholder="Skýring (valkvæmt)" value={expNote}
                 onChange={e => setExpNote(e.target.value)} />
          <div className="grid grid-cols-4 gap-1.5">
            {EXPENSE_CATEGORIES.map(c => (
              <button key={c.id} type="button" onClick={() => setExpCategory(c.id)}
                className="flex flex-col items-center gap-0.5 py-2 rounded-xl text-xs transition-all"
                style={{
                  background: expCategory === c.id ? `${c.color}22` : 'var(--surface2)',
                  border: `1px solid ${expCategory === c.id ? c.color + '55' : 'transparent'}`,
                }}>
                <span>{c.icon}</span>
                <span style={{ color: expCategory === c.id ? c.color : 'var(--muted)', fontSize: 10 }}>{c.label}</span>
              </button>
            ))}
          </div>
          <button type="submit" className="btn btn-primary w-full justify-center">Bæta við</button>
        </form>
      )}

      {/* Add income form */}
      {showIncForm && (
        <form onSubmit={handleAddInc} className="card flex flex-col gap-3 animate-slide-up"
              style={{ borderColor: 'rgba(34,197,94,0.3)' }}>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm" style={{ color: 'var(--success)' }}>Skrá tekjur</h3>
            <button type="button" onClick={() => setShowIncForm(false)}><X size={16} style={{ color: 'var(--muted)' }} /></button>
          </div>
          <input className="input" type="number" placeholder="Upphæð (ISK)" value={incAmount}
                 onChange={e => setIncAmount(e.target.value)} autoFocus />
          <input className="input" placeholder="Skýring (valkvæmt)" value={incNote}
                 onChange={e => setIncNote(e.target.value)} />
          <div className="grid grid-cols-4 gap-1.5">
            {INCOME_SOURCES.map(s => (
              <button key={s.id} type="button" onClick={() => setIncSource(s.id)}
                className="flex flex-col items-center gap-0.5 py-2 rounded-xl text-xs transition-all"
                style={{
                  background: incSource === s.id ? `${s.color}22` : 'var(--surface2)',
                  border: `1px solid ${incSource === s.id ? s.color + '55' : 'transparent'}`,
                }}>
                <span>{s.icon}</span>
                <span style={{ color: incSource === s.id ? s.color : 'var(--muted)', fontSize: 10 }}>{s.label}</span>
              </button>
            ))}
          </div>
          {/* Quick amounts for Lendó */}
          {incSource === 'lendo' && (
            <div className="flex gap-1.5">
              {[7000, 14000, 21000].map(v => (
                <button key={v} type="button" onClick={() => setIncAmount(String(v))}
                  className="flex-1 py-1.5 rounded-lg text-xs font-medium transition-all"
                  style={{ background: incAmount === String(v) ? 'rgba(0,180,216,0.2)' : 'var(--surface2)', color: incAmount === String(v) ? 'var(--lendo)' : 'var(--muted)', border: '1px solid var(--border)' }}>
                  {formatShortISK(v)}
                </button>
              ))}
            </div>
          )}
          <button type="submit" className="btn w-full justify-center" style={{ background: 'rgba(34,197,94,0.15)', color: 'var(--success)', border: '1px solid rgba(34,197,94,0.3)' }}>
            Skrá tekjur
          </button>
        </form>
      )}

      {/* Tabs */}
      <div className="flex gap-1.5 p-1.5 rounded-xl" style={{ background: 'var(--surface)' }}>
        {[['overview', 'Yfirlit'], ['expenses', 'Gjöld'], ['income', 'Tekjur']].map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)}
            className={`tab-btn ${tab === t ? 'active' : ''}`}>{l}</button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="card flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Gjöld eftir flokkum</h3>
            <button onClick={() => setShowBudgetEdit(!showBudgetEdit)} className="text-xs"
                    style={{ color: 'var(--accent)' }}>Breyta fjárhagsáætlun</button>
          </div>
          {showBudgetEdit && (
            <div className="flex flex-col gap-2 p-3 rounded-xl" style={{ background: 'var(--surface2)' }}>
              <div className="text-xs font-medium mb-1" style={{ color: 'var(--muted)' }}>Mánaðarleg fjárhagsáætlun (ISK)</div>
              <input className="input text-sm" type="number" value={budget.monthly}
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

      {tab === 'expenses' && (
        <div className="flex flex-col gap-2">
          {recentExpenses.length === 0 ? (
            <div className="card text-center py-8" style={{ color: 'var(--muted)' }}>Engar gjaldsfærslur enn</div>
          ) : recentExpenses.map(e => {
            const cat = EXPENSE_CATEGORIES.find(c => c.id === e.category) || EXPENSE_CATEGORIES[7]
            return (
              <div key={e.id} className="card flex items-center gap-3 py-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-lg"
                     style={{ background: `${cat.color}20` }}>{cat.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold">{formatISK(e.amount)}</div>
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

      {tab === 'income' && (
        <div className="flex flex-col gap-2">
          {recentIncome.length === 0 ? (
            <div className="card text-center py-8" style={{ color: 'var(--muted)' }}>Engar tekjufærslur enn</div>
          ) : recentIncome.map(e => {
            const src = INCOME_SOURCES.find(s => s.id === e.source) || INCOME_SOURCES[2]
            return (
              <div key={e.id} className="card flex items-center gap-3 py-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-lg"
                     style={{ background: `${src.color}20` }}>{src.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold" style={{ color: 'var(--success)' }}>+{formatISK(e.amount)}</div>
                  <div className="text-xs" style={{ color: 'var(--muted)' }}>
                    {src.label}{e.note ? ` · ${e.note}` : ''} · {new Date(e.date).toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
                <button onClick={() => removeIncome(e.id)} style={{ color: 'var(--muted)' }}>
                  <Trash2 size={14} />
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
