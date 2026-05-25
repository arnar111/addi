import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useFinance } from '../hooks/useFinance'
import { useIncome, INCOME_SOURCES } from '../hooks/useIncome'
import { formatISK, formatShortISK, EXPENSE_CATEGORIES } from '../utils/currency'
import { Plus, Trash2, X, TrendingDown, TrendingUp, Target } from 'lucide-react'

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
          <div className="h-full rounded-full" style={{ width: `${pct}%`, background: isOver ? 'var(--danger)' : cat.color }} />
        </div>
      )}
    </div>
  )
}

export default function Finance() {
  const [searchParams] = useSearchParams()
  const initialTab = searchParams.get('tab') === 'tekjur' ? 'tekjur' : 'yfirlit'
  const [tab, setTab] = useState(initialTab)

  const { addExpense, removeExpense, budget, setBudget, monthlyTotal, byCategory, remaining, recentExpenses } = useFinance()
  const { incomes, addIncome, removeIncome, rentalGoal, setRentalGoal, monthlyTotal: incomeTotal, bySource, goalProgress } = useIncome()

  const [showExpenseForm, setShowExpenseForm] = useState(false)
  const [showIncomeForm, setShowIncomeForm] = useState(false)
  const [showBudgetEdit, setShowBudgetEdit] = useState(false)

  const [eAmount, setEAmount] = useState('')
  const [eCategory, setECategory] = useState('food')
  const [eNote, setENote] = useState('')

  const [iAmount, setIAmount] = useState('')
  const [iSource, setISource] = useState('lendo')
  const [iNote, setINote] = useState('')

  const totalExpense = monthlyTotal()
  const totalIncome = incomeTotal()
  const net = totalIncome - totalExpense
  const cats = byCategory()
  const left = remaining()
  const isOverBudget = left < 0
  const expPct = Math.min(100, Math.round((totalExpense / budget.monthly) * 100))
  const incPct = goalProgress()

  const handleAddExpense = (e) => {
    e.preventDefault()
    if (!eAmount || isNaN(Number(eAmount))) return
    addExpense(Number(eAmount), eCategory, eNote)
    setEAmount(''); setENote(''); setShowExpenseForm(false)
  }

  const handleAddIncome = (e) => {
    e.preventDefault()
    if (!iAmount || isNaN(Number(iAmount))) return
    addIncome(Number(iAmount), iSource, iNote)
    setIAmount(''); setINote(''); setShowIncomeForm(false)
  }

  useEffect(() => {
    if (searchParams.get('tab') === 'tekjur') setTab('tekjur')
  }, [searchParams])

  const TABS = [
    ['yfirlit', 'Yfirlit'],
    ['utgjold', 'Útgjöld'],
    ['tekjur', 'Tekjur'],
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
        <div className="flex gap-2">
          <button onClick={() => { setShowIncomeForm(!showIncomeForm); setShowExpenseForm(false) }}
            className="btn text-xs py-1.5"
            style={{ background: 'rgba(0,212,170,0.12)', color: 'var(--accent)', border: '1px solid rgba(0,212,170,0.25)' }}>
            <Plus size={14} /> Tekjur
          </button>
          <button onClick={() => { setShowExpenseForm(!showExpenseForm); setShowIncomeForm(false) }}
            className="btn btn-primary text-xs py-1.5">
            <Plus size={14} /> Gjald
          </button>
        </div>
      </div>

      {/* Net summary strip */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'Tekjur', val: totalIncome, color: 'var(--success)', icon: <TrendingUp size={14} /> },
          { label: 'Útgjöld', val: totalExpense, color: 'var(--danger)', icon: <TrendingDown size={14} /> },
          { label: 'Nettó', val: net, color: net >= 0 ? 'var(--accent)' : 'var(--danger)', icon: null },
        ].map(({ label, val, color, icon }) => (
          <div key={label} className="card-sm flex flex-col gap-0.5 text-center">
            <div className="text-xs flex items-center justify-center gap-1" style={{ color: 'var(--muted)' }}>{icon}{label}</div>
            <div className="text-sm font-semibold" style={{ color }}>{formatShortISK(Math.abs(val))}{label === 'Nettó' && val < 0 ? ' -' : ''}</div>
          </div>
        ))}
      </div>

      {/* Income form */}
      {showIncomeForm && (
        <form onSubmit={handleAddIncome} className="card flex flex-col gap-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm" style={{ color: 'var(--accent)' }}>Skrá tekjur</h3>
            <button type="button" onClick={() => setShowIncomeForm(false)}><X size={16} style={{ color: 'var(--muted)' }} /></button>
          </div>
          <input className="input" type="number" placeholder="Upphæð (ISK)" value={iAmount} onChange={e => setIAmount(e.target.value)} autoFocus />
          <input className="input" placeholder="Minnismiði (valkvæmt)" value={iNote} onChange={e => setINote(e.target.value)} />
          <div className="grid grid-cols-4 gap-1.5">
            {INCOME_SOURCES.map(s => (
              <button key={s.id} type="button" onClick={() => setISource(s.id)}
                className="flex flex-col items-center gap-0.5 py-2 rounded-xl text-xs transition-all"
                style={{
                  background: iSource === s.id ? `${s.color}22` : 'var(--surface2)',
                  border: `1px solid ${iSource === s.id ? s.color + '55' : 'transparent'}`,
                }}>
                <span>{s.icon}</span>
                <span style={{ color: iSource === s.id ? s.color : 'var(--muted)', fontSize: 10 }}>{s.label}</span>
              </button>
            ))}
          </div>
          <button type="submit" className="btn w-full justify-center" style={{ background: 'rgba(0,212,170,0.15)', color: 'var(--accent)', border: '1px solid rgba(0,212,170,0.3)' }}>Skrá</button>
        </form>
      )}

      {/* Expense form */}
      {showExpenseForm && (
        <form onSubmit={handleAddExpense} className="card flex flex-col gap-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Bæta við gjaldi</h3>
            <button type="button" onClick={() => setShowExpenseForm(false)}><X size={16} style={{ color: 'var(--muted)' }} /></button>
          </div>
          <input className="input" type="number" placeholder="Upphæð (ISK)" value={eAmount} onChange={e => setEAmount(e.target.value)} autoFocus />
          <input className="input" placeholder="Skýring (valkvæmt)" value={eNote} onChange={e => setENote(e.target.value)} />
          <div className="grid grid-cols-4 gap-1.5">
            {EXPENSE_CATEGORIES.map(c => (
              <button key={c.id} type="button" onClick={() => setECategory(c.id)}
                className="flex flex-col items-center gap-0.5 py-2 rounded-xl text-xs transition-all"
                style={{
                  background: eCategory === c.id ? `${c.color}22` : 'var(--surface2)',
                  border: `1px solid ${eCategory === c.id ? c.color + '55' : 'transparent'}`,
                }}>
                <span>{c.icon}</span>
                <span style={{ color: eCategory === c.id ? c.color : 'var(--muted)', fontSize: 10 }}>{c.label}</span>
              </button>
            ))}
          </div>
          <button type="submit" className="btn btn-primary w-full justify-center">Bæta við</button>
        </form>
      )}

      {/* Tabs */}
      <div className="flex gap-2">
        {TABS.map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)}
            className="btn text-xs flex-1 justify-center py-1.5"
            style={{
              background: tab === t ? 'rgba(0,212,170,0.12)' : 'var(--surface)',
              color: tab === t ? 'var(--accent)' : 'var(--muted)',
              border: `1px solid ${tab === t ? 'rgba(0,212,170,0.25)' : 'var(--border)'}`,
            }}>{l}</button>
        ))}
      </div>

      {/* YFIRLIT TAB */}
      {tab === 'yfirlit' && (
        <div className="flex flex-col gap-4">
          {/* Expense budget */}
          <div className="card" style={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.05), rgba(249,115,22,0.05))' }}>
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Útgjöld þessa mánaðar</div>
                <div className="text-2xl font-semibold">{formatISK(totalExpense)}</div>
              </div>
              <div className="text-right">
                <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Eftir</div>
                <div className="text-lg font-semibold" style={{ color: isOverBudget ? 'var(--danger)' : 'var(--success)' }}>
                  {isOverBudget ? '-' : ''}{formatISK(Math.abs(left))}
                </div>
              </div>
            </div>
            <div className="h-2 rounded-full overflow-hidden mb-1" style={{ background: 'var(--surface2)' }}>
              <div className="h-full rounded-full" style={{ width: `${expPct}%`, background: isOverBudget ? 'var(--danger)' : expPct > 80 ? '#f97316' : '#f97316' }} />
            </div>
            <div className="flex justify-between text-xs" style={{ color: 'var(--muted)' }}>
              <span>{expPct}% notað</span>
              <button onClick={() => setShowBudgetEdit(!showBudgetEdit)} style={{ color: 'var(--accent)' }}>Breyta fjárhagsáætlun</button>
            </div>
          </div>

          {/* Rental goal */}
          <div className="card" style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.06), rgba(0,212,170,0.02))' }}>
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="text-xs mb-1 flex items-center gap-1" style={{ color: 'var(--muted)' }}>
                  <Target size={11} /> Lendó markmið mánaðarins
                </div>
                <div className="text-2xl font-semibold" style={{ color: 'var(--accent)' }}>{formatISK(totalIncome)}</div>
              </div>
              <div className="text-right">
                <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Mark</div>
                <div className="text-lg font-semibold">{formatShortISK(rentalGoal)}</div>
              </div>
            </div>
            <div className="h-2 rounded-full overflow-hidden mb-1" style={{ background: 'var(--surface2)' }}>
              <div className="h-full rounded-full" style={{ width: `${incPct}%`, background: incPct >= 100 ? 'var(--success)' : 'var(--accent)' }} />
            </div>
            <div className="flex justify-between text-xs" style={{ color: 'var(--muted)' }}>
              <span>{incPct}% af marki</span>
              <span>{incPct >= 100 ? '🎉 Mark náð!' : `${formatShortISK(rentalGoal - totalIncome)} eftir`}</span>
            </div>
          </div>

          {showBudgetEdit && (
            <div className="card flex flex-col gap-2" style={{ background: 'var(--surface2)' }}>
              <div className="text-xs font-medium" style={{ color: 'var(--muted)' }}>Mánaðarleg fjárhagsáætlun</div>
              <input className="input text-sm" type="number" value={budget.monthly}
                onChange={e => setBudget(b => ({ ...b, monthly: Number(e.target.value) }))} />
              <div className="text-xs font-medium mt-1" style={{ color: 'var(--muted)' }}>Lendó mánaðarmark</div>
              <input className="input text-sm" type="number" value={rentalGoal}
                onChange={e => setRentalGoal(Number(e.target.value))} />
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

          {/* Category breakdown */}
          <div className="card flex flex-col gap-3">
            <h3 className="font-semibold text-sm">Útgjöld eftir flokkum</h3>
            {EXPENSE_CATEGORIES.map(c => (
              <CategoryBar key={c.id} cat={c} spent={cats[c.id] || 0} budget={budget.categories[c.id]} />
            ))}
          </div>
        </div>
      )}

      {/* ÚTGJÖLD TAB */}
      {tab === 'utgjold' && (
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
                <button onClick={() => removeExpense(e.id)} style={{ color: 'var(--muted)', padding: 4 }}>
                  <Trash2 size={14} />
                </button>
              </div>
            )
          })}
        </div>
      )}

      {/* TEKJUR TAB */}
      {tab === 'tekjur' && (
        <div className="flex flex-col gap-3">
          {/* source breakdown */}
          <div className="card flex flex-col gap-3">
            <h3 className="font-semibold text-sm">Tekjur eftir flokki</h3>
            {INCOME_SOURCES.map(s => {
              const amt = bySource()[s.id] || 0
              const pct = totalIncome > 0 ? Math.round((amt / totalIncome) * 100) : 0
              return (
                <div key={s.id} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-xs">
                    <span>{s.icon} {s.label}</span>
                    <span style={{ color: 'var(--muted)' }}>{formatShortISK(amt)}</span>
                  </div>
                  {amt > 0 && (
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--surface2)' }}>
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: s.color }} />
                    </div>
                  )}
                </div>
              )
            })}
            {totalIncome === 0 && (
              <div className="text-center py-4 text-xs" style={{ color: 'var(--muted)' }}>Engar tekjur skráðar í mánuðinum</div>
            )}
          </div>

          {/* income list */}
          {incomes.filter(e => {
            const now = new Date()
            const d = new Date(e.date)
            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
          }).length === 0 ? (
            <div className="card text-center py-8" style={{ color: 'var(--muted)' }}>Engar tekjur ennþá</div>
          ) : incomes.filter(e => {
            const now = new Date()
            const d = new Date(e.date)
            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
          }).map(e => {
            const src = INCOME_SOURCES.find(s => s.id === e.source) || INCOME_SOURCES[3]
            return (
              <div key={e.id} className="card flex items-center gap-3 py-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-base"
                     style={{ background: `${src.color}22` }}>{src.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold" style={{ color: 'var(--success)' }}>+{formatISK(e.amount)}</div>
                  <div className="text-xs" style={{ color: 'var(--muted)' }}>
                    {src.label}{e.note ? ` · ${e.note}` : ''} · {new Date(e.date).toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
                <button onClick={() => removeIncome(e.id)} style={{ color: 'var(--muted)', padding: 4 }}>
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
