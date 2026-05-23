import { useState } from 'react'
import { useFinance, EXPENSE_CATEGORIES, INCOME_SOURCES } from '../hooks/useFinance'
import { formatISK, formatShortISK } from '../utils/currency'
import { Plus, Trash2, X } from 'lucide-react'

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
          <div className="h-full rounded-full" style={{ width: `${pct}%`, background: isOver ? 'var(--danger)' : cat.color }} />
        </div>
      )}
    </div>
  )
}

export default function Finance() {
  const {
    addExpense, removeExpense, budget, setBudget,
    monthlyTotal, byCategory, remaining, recentExpenses,
    addIncome, removeIncome, monthlyIncome, netBalance, recentIncome, bySource,
  } = useFinance()

  const [tab, setTab] = useState('overview')
  const [entryType, setEntryType] = useState('expense')
  const [showForm, setShowForm] = useState(false)
  const [showBudgetEdit, setShowBudgetEdit] = useState(false)
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('food')
  const [source, setSource] = useState('lendo')
  const [note, setNote] = useState('')

  const total = monthlyTotal()
  const totalIncome = monthlyIncome()
  const net = netBalance()
  const cats = byCategory()
  const sources = bySource()
  const left = remaining()
  const isOver = left < 0
  const pct = Math.min(100, Math.round((total / (budget.monthly || 1)) * 100))
  const incomePct = Math.min(100, Math.round((totalIncome / (budget.incomeGoal || 200000)) * 100))

  const handleAdd = (e) => {
    e.preventDefault()
    if (!amount || isNaN(Number(amount))) return
    if (entryType === 'expense') {
      addExpense(Number(amount), category, note)
    } else {
      addIncome(Number(amount), source, note)
    }
    setAmount('')
    setNote('')
    setShowForm(false)
  }

  const TABS = [
    ['overview', 'Yfirlit'],
    ['income', 'Tekjur'],
    ['expenses', 'Útgjöld'],
  ]

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold">Fjármál</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            {new Date().toLocaleDateString('is-IS', { month: 'long', year: 'numeric' })}
          </p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          <Plus size={16} /> Bæta við
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-2">
        <div className="card-sm flex flex-col gap-0.5">
          <div className="text-xs" style={{ color: 'var(--muted)' }}>Tekjur</div>
          <div className="text-base font-semibold" style={{ color: 'var(--success)' }}>{formatShortISK(totalIncome)}</div>
        </div>
        <div className="card-sm flex flex-col gap-0.5">
          <div className="text-xs" style={{ color: 'var(--muted)' }}>Útgjöld</div>
          <div className="text-base font-semibold" style={{ color: isOver ? 'var(--danger)' : 'var(--text)' }}>{formatShortISK(total)}</div>
        </div>
        <div className="card-sm flex flex-col gap-0.5">
          <div className="text-xs" style={{ color: 'var(--muted)' }}>Nettó</div>
          <div className="text-base font-semibold" style={{ color: net >= 0 ? 'var(--success)' : 'var(--danger)' }}>
            {net >= 0 ? '+' : ''}{formatShortISK(net)}
          </div>
        </div>
      </div>

      {/* Add form */}
      {showForm && (
        <form onSubmit={handleAdd} className="card flex flex-col gap-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Bæta við</h3>
            <button type="button" onClick={() => setShowForm(false)}><X size={16} style={{ color: 'var(--muted)' }} /></button>
          </div>
          {/* Type toggle */}
          <div className="flex gap-2">
            {[['expense', '↑ Gjald', 'var(--danger)'], ['income', '↓ Tekjur', 'var(--success)']].map(([t, l, c]) => (
              <button key={t} type="button" onClick={() => setEntryType(t)}
                className="flex-1 py-2 rounded-xl text-sm font-medium transition-all"
                style={{
                  background: entryType === t ? `${c}22` : 'var(--surface2)',
                  color: entryType === t ? c : 'var(--muted)',
                  border: `1px solid ${entryType === t ? c + '55' : 'transparent'}`,
                }}>{l}</button>
            ))}
          </div>
          <input className="input" type="number" placeholder="Upphæð (ISK)" value={amount}
            onChange={e => setAmount(e.target.value)} autoFocus />
          <input className="input" placeholder="Skýring (valkvæmt)" value={note}
            onChange={e => setNote(e.target.value)} />
          {entryType === 'expense' ? (
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
          ) : (
            <div className="grid grid-cols-4 gap-1.5">
              {INCOME_SOURCES.map(s => (
                <button key={s.id} type="button" onClick={() => setSource(s.id)}
                  className="flex flex-col items-center gap-0.5 py-2 rounded-xl text-xs transition-all"
                  style={{
                    background: source === s.id ? `${s.color}22` : 'var(--surface2)',
                    border: `1px solid ${source === s.id ? s.color + '55' : 'transparent'}`,
                  }}>
                  <span>{s.icon}</span>
                  <span style={{ color: source === s.id ? s.color : 'var(--muted)', fontSize: 10 }}>{s.label}</span>
                </button>
              ))}
            </div>
          )}
          <button type="submit" className="btn btn-primary w-full justify-center">Bæta við</button>
        </form>
      )}

      {/* Tabs */}
      <div className="flex gap-2">
        {TABS.map(([t, l]) => (
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
        <div className="flex flex-col gap-3">
          {/* Expenses progress */}
          <div className="card">
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Útgjöld af fjárhagsáætlun</div>
                <div className="text-2xl font-semibold">{formatISK(total)}</div>
              </div>
              <div className="flex flex-col items-end">
                <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Eftir</div>
                <div className="text-base font-semibold" style={{ color: isOver ? 'var(--danger)' : 'var(--success)' }}>
                  {isOver ? '-' : ''}{formatISK(Math.abs(left))}
                </div>
              </div>
            </div>
            <div className="h-2.5 rounded-full overflow-hidden mb-1" style={{ background: 'var(--surface2)' }}>
              <div className="h-full rounded-full" style={{ width: `${pct}%`, background: isOver ? 'var(--danger)' : pct > 80 ? '#f97316' : 'var(--accent)' }} />
            </div>
            <div className="flex justify-between text-xs" style={{ color: 'var(--muted)' }}>
              <span>{pct}% notað</span>
              <span>{formatISK(budget.monthly)}</span>
            </div>
          </div>

          {/* Income / Lendó progress */}
          <div className="card">
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Tekjur af mánaðarmarki</div>
                <div className="text-2xl font-semibold" style={{ color: 'var(--success)' }}>{formatISK(totalIncome)}</div>
              </div>
              <div className="flex flex-col items-end">
                <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Mark</div>
                <div className="text-base font-medium">{formatShortISK(budget.incomeGoal || 200000)}</div>
              </div>
            </div>
            <div className="h-2.5 rounded-full overflow-hidden mb-1" style={{ background: 'var(--surface2)' }}>
              <div className="h-full rounded-full" style={{ width: `${incomePct}%`, background: 'var(--success)' }} />
            </div>
            <div className="flex justify-between text-xs" style={{ color: 'var(--muted)' }}>
              <span>{incomePct}% af marki</span>
              <button onClick={() => setShowBudgetEdit(!showBudgetEdit)} style={{ color: 'var(--accent)' }}>Breyta</button>
            </div>
          </div>

          {showBudgetEdit && (
            <div className="card flex flex-col gap-3">
              <div className="text-sm font-medium">Breytar fjárhagsáætlunar</div>
              <div className="flex flex-col gap-1">
                <label className="text-xs" style={{ color: 'var(--muted)' }}>Mánaðarleg fjárhagsáætlun (ISK)</label>
                <input className="input text-sm" type="number" value={budget.monthly}
                  onChange={e => setBudget(b => ({ ...b, monthly: Number(e.target.value) }))} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs" style={{ color: 'var(--muted)' }}>Tekjumark (ISK)</label>
                <input className="input text-sm" type="number" value={budget.incomeGoal || 200000}
                  onChange={e => setBudget(b => ({ ...b, incomeGoal: Number(e.target.value) }))} />
              </div>
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

          {/* By category */}
          <div className="card flex flex-col gap-3">
            <h3 className="font-semibold text-sm">Útgjöld eftir flokkum</h3>
            {EXPENSE_CATEGORIES.map(c => (
              <CategoryBar key={c.id} cat={c} spent={cats[c.id] || 0} budget={budget.categories[c.id]} />
            ))}
          </div>

          {/* Income by source */}
          {Object.keys(sources).length > 0 && (
            <div className="card flex flex-col gap-3">
              <h3 className="font-semibold text-sm">Tekjur eftir uppruna</h3>
              {INCOME_SOURCES.filter(s => sources[s.id]).map(s => (
                <div key={s.id} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg flex items-center justify-center text-sm" style={{ background: `${s.color}22` }}>{s.icon}</span>
                    {s.label}
                  </span>
                  <span style={{ color: 'var(--success)' }}>{formatISK(sources[s.id])}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'income' && (
        <div className="flex flex-col gap-2">
          {recentIncome.length === 0 ? (
            <div className="card text-center py-8" style={{ color: 'var(--muted)' }}>Engar tekjur skráðar</div>
          ) : recentIncome.map(i => {
            const src = INCOME_SOURCES.find(s => s.id === i.source) || INCOME_SOURCES[3]
            return (
              <div key={i.id} className="card flex items-center gap-3 py-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-base"
                     style={{ background: `${src.color}22` }}>{src.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium" style={{ color: 'var(--success)' }}>+{formatISK(i.amount)}</div>
                  <div className="text-xs" style={{ color: 'var(--muted)' }}>
                    {src.label}{i.note ? ` · ${i.note}` : ''} · {new Date(i.date).toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
                <button onClick={() => removeIncome(i.id)} style={{ color: 'var(--muted)' }}>
                  <Trash2 size={14} />
                </button>
              </div>
            )
          })}
        </div>
      )}

      {tab === 'expenses' && (
        <div className="flex flex-col gap-2">
          {recentExpenses.length === 0 ? (
            <div className="card text-center py-8" style={{ color: 'var(--muted)' }}>Engar færslur ennþá</div>
          ) : recentExpenses.map(e => {
            const cat = EXPENSE_CATEGORIES.find(c => c.id === e.category) || EXPENSE_CATEGORIES[7]
            return (
              <div key={e.id} className="card flex items-center gap-3 py-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-base"
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
    </div>
  )
}
