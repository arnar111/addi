import { useState } from 'react'
import { useFinance } from '../hooks/useFinance'
import { formatISK, formatShortISK, EXPENSE_CATEGORIES, INCOME_SOURCES } from '../utils/currency'
import { Plus, Trash2, X, ArrowUpRight, ArrowDownRight } from 'lucide-react'

function CategoryBar({ cat, spent, budget }) {
  const pct = budget ? Math.min(100, Math.round((spent / budget) * 100)) : 0
  const isOver = spent > budget && budget > 0
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between text-xs">
        <span>{cat.icon} {cat.label}</span>
        <span style={{ color: isOver ? 'var(--danger)' : 'var(--muted)' }}>
          {formatShortISK(spent)}{budget > 0 ? ` / ${formatShortISK(budget)}` : ''}
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

export default function Finance() {
  const {
    addExpense, removeExpense, budget, setBudget, monthlyTotal, byCategory, remaining, recentExpenses,
    addIncome, removeIncome, monthlyIncome, monthlyNet, bySource, recentIncome,
  } = useFinance()

  const [tab, setTab] = useState('overview')
  const [showExpForm, setShowExpForm] = useState(false)
  const [showIncForm, setShowIncForm] = useState(false)
  const [showBudgetEdit, setShowBudgetEdit] = useState(false)
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('food')
  const [source, setSource] = useState('lendo')
  const [note, setNote] = useState('')

  const total = monthlyTotal()
  const income = monthlyIncome()
  const net = monthlyNet()
  const cats = byCategory()
  const sources = bySource()
  const left = remaining()
  const isOver = left < 0
  const pct = Math.min(100, Math.round((total / budget.monthly) * 100))
  const monthName = new Date().toLocaleDateString('is-IS', { month: 'long', year: 'numeric' })

  const handleAddExpense = (e) => {
    e.preventDefault()
    if (!amount || isNaN(Number(amount))) return
    addExpense(Number(amount), category, note)
    setAmount('')
    setNote('')
    setShowExpForm(false)
  }

  const handleAddIncome = (e) => {
    e.preventDefault()
    if (!amount || isNaN(Number(amount))) return
    addIncome(Number(amount), source, note)
    setAmount('')
    setNote('')
    setShowIncForm(false)
  }

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold">💰 Fjármál</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>{monthName}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => { setShowIncForm(!showIncForm); setShowExpForm(false) }}
                  className="btn text-xs py-1.5 px-3"
                  style={{ background: 'rgba(34,197,94,0.12)', color: 'var(--success)', border: '1px solid rgba(34,197,94,0.25)' }}>
            <ArrowUpRight size={14} /> Tekjur
          </button>
          <button onClick={() => { setShowExpForm(!showExpForm); setShowIncForm(false) }}
                  className="btn btn-primary text-xs py-1.5 px-3">
            <ArrowDownRight size={14} /> Gjald
          </button>
        </div>
      </div>

      {/* Net summary */}
      <div className="grid grid-cols-3 gap-2">
        <div className="card py-3 text-center" style={{ background: 'rgba(34,197,94,0.06)', borderColor: 'rgba(34,197,94,0.15)' }}>
          <div className="text-xs mb-0.5" style={{ color: 'var(--muted)' }}>Tekjur</div>
          <div className="font-bold text-sm" style={{ color: 'var(--success)' }}>+{formatShortISK(income)}</div>
        </div>
        <div className="card py-3 text-center" style={{ background: 'rgba(239,68,68,0.06)', borderColor: 'rgba(239,68,68,0.15)' }}>
          <div className="text-xs mb-0.5" style={{ color: 'var(--muted)' }}>Gjöld</div>
          <div className="font-bold text-sm" style={{ color: 'var(--danger)' }}>-{formatShortISK(total)}</div>
        </div>
        <div className="card py-3 text-center" style={{
          background: net >= 0 ? 'rgba(0,212,170,0.06)' : 'rgba(239,68,68,0.06)',
          borderColor: net >= 0 ? 'rgba(0,212,170,0.2)' : 'rgba(239,68,68,0.2)',
        }}>
          <div className="text-xs mb-0.5" style={{ color: 'var(--muted)' }}>Nettó</div>
          <div className="font-bold text-sm" style={{ color: net >= 0 ? 'var(--accent)' : 'var(--danger)' }}>
            {net >= 0 ? '+' : ''}{formatShortISK(net)}
          </div>
        </div>
      </div>

      {/* Expense form */}
      {showExpForm && (
        <form onSubmit={handleAddExpense} className="card flex flex-col gap-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Skrá gjald</h3>
            <button type="button" onClick={() => setShowExpForm(false)}><X size={16} style={{ color: 'var(--muted)' }} /></button>
          </div>
          <input className="input" type="number" placeholder="Upphæð (ISK)" value={amount}
                 onChange={e => setAmount(e.target.value)} autoFocus />
          <input className="input" placeholder="Skýring (valkvæmt)" value={note} onChange={e => setNote(e.target.value)} />
          <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-4">
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
          <button type="submit" className="btn btn-primary w-full justify-center">Skrá gjald</button>
        </form>
      )}

      {/* Income form */}
      {showIncForm && (
        <form onSubmit={handleAddIncome} className="card flex flex-col gap-3 animate-slide-up"
              style={{ borderColor: 'rgba(34,197,94,0.2)' }}>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Skrá tekjur</h3>
            <button type="button" onClick={() => setShowIncForm(false)}><X size={16} style={{ color: 'var(--muted)' }} /></button>
          </div>
          <input className="input" type="number" placeholder="Upphæð (ISK)" value={amount}
                 onChange={e => setAmount(e.target.value)} autoFocus />
          <input className="input" placeholder="Skýring (valkvæmt)" value={note} onChange={e => setNote(e.target.value)} />
          <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-5">
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
          <button type="submit" className="btn w-full justify-center"
                  style={{ background: 'rgba(34,197,94,0.15)', color: 'var(--success)', border: '1px solid rgba(34,197,94,0.3)' }}>
            Skrá tekjur
          </button>
        </form>
      )}

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {[['overview', 'Yfirlit'], ['expenses', 'Gjöld'], ['income', 'Tekjur'], ['all', 'Allt']].map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)}
            className="btn shrink-0 text-xs py-1.5"
            style={{
              background: tab === t ? 'rgba(0,212,170,0.12)' : 'var(--surface)',
              color: tab === t ? 'var(--accent)' : 'var(--muted)',
              border: `1px solid ${tab === t ? 'rgba(0,212,170,0.25)' : 'var(--border)'}`,
            }}>{l}</button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="flex flex-col gap-3">
          <div className="card" style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.05), rgba(139,92,246,0.05))' }}>
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Útgjöld þessa mánaðar</div>
                <div className="text-2xl font-bold">{formatISK(total)}</div>
              </div>
              <div className="text-right">
                <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Eftir af áætlun</div>
                <div className="font-semibold" style={{ color: isOver ? 'var(--danger)' : 'var(--success)' }}>
                  {isOver ? '−' : ''}{formatISK(Math.abs(left))}
                </div>
              </div>
            </div>
            <div className="h-2 rounded-full overflow-hidden mb-1" style={{ background: 'var(--surface2)' }}>
              <div className="h-full rounded-full transition-all"
                   style={{ width: `${pct}%`, background: isOver ? 'var(--danger)' : pct > 80 ? '#f97316' : 'var(--accent)' }} />
            </div>
            <div className="flex justify-between text-xs" style={{ color: 'var(--muted)' }}>
              <span>{pct}% notað</span>
              <span>Áætlun: {formatShortISK(budget.monthly)}</span>
            </div>
          </div>

          <div className="card flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">Eftir flokkum</h3>
              <button onClick={() => setShowBudgetEdit(!showBudgetEdit)} className="text-xs" style={{ color: 'var(--accent)' }}>
                {showBudgetEdit ? 'Loka' : 'Breyta áætlun'}
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
                    <div key={c.id}>
                      <label className="text-xs" style={{ color: 'var(--muted)' }}>{c.icon} {c.label}</label>
                      <input className="input text-xs py-1.5 mt-0.5" type="number"
                             value={budget.categories[c.id] || ''}
                             onChange={e => setBudget(b => ({ ...b, categories: { ...b.categories, [c.id]: Number(e.target.value) } }))} />
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="flex flex-col gap-3">
              {EXPENSE_CATEGORIES.map(c => (
                <CategoryBar key={c.id} cat={c} spent={cats[c.id] || 0} budget={budget.categories[c.id] || 0} />
              ))}
            </div>
          </div>

          {Object.keys(sources).length > 0 && (
            <div className="card" style={{ borderColor: 'rgba(34,197,94,0.2)' }}>
              <h3 className="font-semibold text-sm mb-3">Tekjur eftir uppruna</h3>
              {INCOME_SOURCES.filter(s => sources[s.id] > 0).map(s => (
                <div key={s.id} className="flex items-center justify-between text-sm py-1">
                  <span>{s.icon} {s.label}</span>
                  <span className="font-semibold" style={{ color: 'var(--success)' }}>+{formatShortISK(sources[s.id])}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'expenses' && (
        <div className="flex flex-col gap-2">
          {recentExpenses.length === 0 ? (
            <div className="card text-center py-8" style={{ color: 'var(--muted)' }}>Engin gjöld skráð</div>
          ) : recentExpenses.map(e => {
            const cat = EXPENSE_CATEGORIES.find(c => c.id === e.category) || EXPENSE_CATEGORIES[8]
            return (
              <div key={e.id} className="card flex items-center gap-3 py-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-lg"
                     style={{ background: `${cat.color}18` }}>{cat.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold">{formatISK(e.amount)}</div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                    {cat.label}{e.note ? ` · ${e.note}` : ''} · {new Date(e.date).toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
                <button onClick={() => removeExpense(e.id)} style={{ color: 'var(--muted)' }}><Trash2 size={14} /></button>
              </div>
            )
          })}
        </div>
      )}

      {tab === 'income' && (
        <div className="flex flex-col gap-2">
          {recentIncome.length === 0 ? (
            <div className="card text-center py-8" style={{ color: 'var(--muted)' }}>
              <div className="text-3xl mb-2">💼</div>
              <div>Engar tekjur skráðar</div>
              <div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>Lendó leiga? Laun? Skráðu hér.</div>
            </div>
          ) : recentIncome.map(i => {
            const src = INCOME_SOURCES.find(s => s.id === i.source) || INCOME_SOURCES[4]
            return (
              <div key={i.id} className="card flex items-center gap-3 py-3"
                   style={{ borderColor: 'rgba(34,197,94,0.15)' }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-lg"
                     style={{ background: `${src.color}18` }}>{src.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold" style={{ color: 'var(--success)' }}>+{formatISK(i.amount)}</div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                    {src.label}{i.note ? ` · ${i.note}` : ''} · {new Date(i.date).toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
                <button onClick={() => removeIncome(i.id)} style={{ color: 'var(--muted)' }}><Trash2 size={14} /></button>
              </div>
            )
          })}
        </div>
      )}

      {tab === 'all' && (
        <div className="flex flex-col gap-2">
          {[...recentExpenses.map(e => ({ ...e, kind: 'expense' })), ...recentIncome.map(i => ({ ...i, kind: 'income' }))]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 40)
            .map(item => {
              if (item.kind === 'expense') {
                const cat = EXPENSE_CATEGORIES.find(c => c.id === item.category) || EXPENSE_CATEGORIES[8]
                return (
                  <div key={`e-${item.id}`} className="card flex items-center gap-3 py-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0"
                         style={{ background: `${cat.color}18` }}>{cat.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold" style={{ color: 'var(--danger)' }}>−{formatISK(item.amount)}</div>
                      <div className="text-xs" style={{ color: 'var(--muted)' }}>
                        {cat.label}{item.note ? ` · ${item.note}` : ''} · {new Date(item.date).toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                    <button onClick={() => removeExpense(item.id)} style={{ color: 'var(--muted)' }}><Trash2 size={14} /></button>
                  </div>
                )
              } else {
                const src = INCOME_SOURCES.find(s => s.id === item.source) || INCOME_SOURCES[4]
                return (
                  <div key={`i-${item.id}`} className="card flex items-center gap-3 py-3"
                       style={{ borderColor: 'rgba(34,197,94,0.15)' }}>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0"
                         style={{ background: `${src.color}18` }}>{src.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold" style={{ color: 'var(--success)' }}>+{formatISK(item.amount)}</div>
                      <div className="text-xs" style={{ color: 'var(--muted)' }}>
                        {src.label}{item.note ? ` · ${item.note}` : ''} · {new Date(item.date).toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                    <button onClick={() => removeIncome(item.id)} style={{ color: 'var(--muted)' }}><Trash2 size={14} /></button>
                  </div>
                )
              }
            })}
        </div>
      )}
    </div>
  )
}
