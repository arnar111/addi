import { useState } from 'react'
import { useFinance, INCOME_CATEGORIES } from '../hooks/useFinance'
import { useSubscriptions, SUB_CATEGORIES } from '../hooks/useSubscriptions'
import { formatISK, formatShortISK, EXPENSE_CATEGORIES } from '../utils/currency'
import { Plus, Trash2, X, TrendingDown, TrendingUp, PiggyBank, Repeat, Bell } from 'lucide-react'

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
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--surface2)' }}>
          <div className="h-full rounded-full transition-all"
               style={{ width: `${pct}%`, background: isOver ? 'var(--danger)' : cat.color }} />
        </div>
      )}
    </div>
  )
}

function SubCard({ sub, onToggle, onRemove }) {
  const cat = SUB_CATEGORIES.find(c => c.id === sub.category) || SUB_CATEGORIES[6]
  const monthlyAmt = sub.cycle === 'yearly' ? Math.round(sub.amount / 12) : sub.amount
  return (
    <div className="card flex items-center gap-3 py-3" style={{ opacity: sub.active ? 1 : 0.5 }}>
      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-lg"
           style={{ background: `${cat.color}22` }}>{cat.icon}</div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium">{sub.name}</div>
        <div className="text-xs" style={{ color: 'var(--muted)' }}>
          {formatISK(sub.amount)} / {sub.cycle === 'yearly' ? 'ár' : 'mán'}
          {sub.cycle === 'yearly' ? ` · ${formatISK(monthlyAmt)}/mán` : ''}
          {sub.renewDay ? ` · endurnýjast ${sub.renewDay}.` : ''}
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button onClick={() => onToggle(sub.id)}
          className="text-xs px-2 py-1 rounded-lg"
          style={{
            background: sub.active ? 'rgba(0,212,170,0.12)' : 'var(--surface2)',
            color: sub.active ? 'var(--accent)' : 'var(--muted)',
          }}>
          {sub.active ? 'Virk' : 'Óvirk'}
        </button>
        <button onClick={() => onRemove(sub.id)} style={{ color: 'var(--muted)' }}>
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  )
}

export default function Finance() {
  const {
    addExpense, removeExpense, addIncome, removeIncome,
    budget, setBudget, monthlyTotal, monthlyIncome, monthlySavings, savingsRate,
    byCategory, remaining, recentExpenses, recentIncomes,
  } = useFinance()
  const {
    subs, add: addSub, remove: removeSub, toggle: toggleSub,
    monthlyTotal: subMonthly, yearlyTotal: subYearly, upcomingRenewals,
  } = useSubscriptions()

  const [tab, setTab] = useState('overview')
  const [showExpenseForm, setShowExpenseForm] = useState(false)
  const [showIncomeForm, setShowIncomeForm] = useState(false)
  const [showSubForm, setShowSubForm] = useState(false)
  const [showBudgetEdit, setShowBudgetEdit] = useState(false)

  // Expense form state
  const [eAmount, setEAmount] = useState('')
  const [eCategory, setECategory] = useState('food')
  const [eNote, setENote] = useState('')

  // Income form state
  const [iAmount, setIAmount] = useState('')
  const [iCategory, setICategory] = useState('salary')
  const [iNote, setINote] = useState('')

  // Sub form state
  const [sName, setSName] = useState('')
  const [sAmount, setSAmount] = useState('')
  const [sCategory, setSCategory] = useState('streaming')
  const [sCycle, setSCycle] = useState('monthly')
  const [sRenewDay, setSRenewDay] = useState('')

  const total = monthlyTotal()
  const income = monthlyIncome()
  const savings = monthlySavings()
  const rate = savingsRate()
  const cats = byCategory()
  const left = remaining()
  const isOver = left < 0
  const pct = Math.min(100, Math.round((total / budget.monthly) * 100))
  const subTotal = subMonthly()
  const upcoming = upcomingRenewals()

  const handleAddExpense = (e) => {
    e.preventDefault()
    if (!eAmount || isNaN(Number(eAmount))) return
    addExpense(Number(eAmount), eCategory, eNote)
    setEAmount(''); setENote(''); setShowExpenseForm(false)
  }

  const handleAddIncome = (e) => {
    e.preventDefault()
    if (!iAmount || isNaN(Number(iAmount))) return
    addIncome(Number(iAmount), iCategory, iNote)
    setIAmount(''); setINote(''); setShowIncomeForm(false)
  }

  const handleAddSub = (e) => {
    e.preventDefault()
    if (!sName.trim() || !sAmount || isNaN(Number(sAmount))) return
    addSub({ name: sName.trim(), amount: Number(sAmount), category: sCategory, cycle: sCycle, renewDay: sRenewDay ? Number(sRenewDay) : null })
    setSName(''); setSAmount(''); setSRenewDay(''); setShowSubForm(false)
  }

  const TABS = [
    ['overview', 'Yfirlit'],
    ['transactions', 'Færslur'],
    ['subscriptions', 'Áskriftir'],
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
        <div className="flex gap-2">
          <button onClick={() => { setShowIncomeForm(!showIncomeForm); setShowExpenseForm(false) }}
            className="btn btn-ghost text-sm"
            style={{ color: 'var(--success)', borderColor: 'rgba(34,197,94,0.3)' }}>
            <Plus size={14} /> Tekjur
          </button>
          <button onClick={() => { setShowExpenseForm(!showExpenseForm); setShowIncomeForm(false) }}
            className="btn btn-primary text-sm">
            <Plus size={14} /> Gjald
          </button>
        </div>
      </div>

      {/* Overview hero card */}
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.06), rgba(139,92,246,0.06))' }}>
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="flex flex-col gap-0.5">
            <div className="text-xs" style={{ color: 'var(--muted)' }}>Útgjöld</div>
            <div className="text-xl font-bold">{formatShortISK(total)}</div>
          </div>
          <div className="flex flex-col gap-0.5">
            <div className="text-xs" style={{ color: 'var(--muted)' }}>Tekjur</div>
            <div className="text-xl font-bold" style={{ color: income > 0 ? 'var(--success)' : 'var(--text)' }}>
              {income > 0 ? formatShortISK(income) : '—'}
            </div>
          </div>
          <div className="flex flex-col gap-0.5">
            <div className="text-xs" style={{ color: 'var(--muted)' }}>Sparnaður</div>
            <div className="text-xl font-bold" style={{ color: savings >= 0 ? 'var(--accent)' : 'var(--danger)' }}>
              {income > 0 ? `${rate}%` : '—'}
            </div>
          </div>
        </div>

        <div className="h-2 rounded-full overflow-hidden mb-1" style={{ background: 'var(--surface2)' }}>
          <div className="h-full rounded-full transition-all"
               style={{ width: `${pct}%`, background: isOver ? 'var(--danger)' : pct > 80 ? '#f97316' : 'var(--accent)' }} />
        </div>
        <div className="flex justify-between text-xs" style={{ color: 'var(--muted)' }}>
          <span>{pct}% af fjárhagsáætlun notað</span>
          <span style={{ color: isOver ? 'var(--danger)' : 'var(--success)' }}>
            {isOver ? `-${formatShortISK(Math.abs(left))} yfir` : `${formatShortISK(left)} eftir`}
          </span>
        </div>
      </div>

      {/* Expense form */}
      {showExpenseForm && (
        <form onSubmit={handleAddExpense} className="card flex flex-col gap-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Bæta við gjaldi</h3>
            <button type="button" onClick={() => setShowExpenseForm(false)}><X size={16} style={{ color: 'var(--muted)' }} /></button>
          </div>
          <input className="input" type="number" placeholder="Upphæð (ISK)" value={eAmount}
            onChange={e => setEAmount(e.target.value)} autoFocus />
          <input className="input" placeholder="Skýring (valkvæmt)" value={eNote}
            onChange={e => setENote(e.target.value)} />
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

      {/* Income form */}
      {showIncomeForm && (
        <form onSubmit={handleAddIncome} className="card flex flex-col gap-3 animate-slide-up"
              style={{ border: '1px solid rgba(34,197,94,0.25)' }}>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm" style={{ color: 'var(--success)' }}>Bæta við tekjum</h3>
            <button type="button" onClick={() => setShowIncomeForm(false)}><X size={16} style={{ color: 'var(--muted)' }} /></button>
          </div>
          <input className="input" type="number" placeholder="Upphæð (ISK)" value={iAmount}
            onChange={e => setIAmount(e.target.value)} autoFocus />
          <input className="input" placeholder="Skýring (t.d. Laun)" value={iNote}
            onChange={e => setINote(e.target.value)} />
          <div className="grid grid-cols-5 gap-1.5">
            {INCOME_CATEGORIES.map(c => (
              <button key={c.id} type="button" onClick={() => setICategory(c.id)}
                className="flex flex-col items-center gap-0.5 py-2 rounded-xl text-xs transition-all"
                style={{
                  background: iCategory === c.id ? `${c.color}22` : 'var(--surface2)',
                  border: `1px solid ${iCategory === c.id ? c.color + '55' : 'transparent'}`,
                }}>
                <span>{c.icon}</span>
                <span style={{ color: iCategory === c.id ? c.color : 'var(--muted)', fontSize: 10 }}>{c.label}</span>
              </button>
            ))}
          </div>
          <button type="submit" className="btn w-full justify-center"
                  style={{ background: 'rgba(34,197,94,0.15)', color: 'var(--success)', border: '1px solid rgba(34,197,94,0.3)' }}>
            Bæta við tekjum
          </button>
        </form>
      )}

      {/* Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {TABS.map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)}
            className="btn shrink-0 text-sm flex-1 justify-center"
            style={{
              background: tab === t ? 'rgba(0,212,170,0.12)' : 'var(--surface)',
              color: tab === t ? 'var(--accent)' : 'var(--muted)',
              border: `1px solid ${tab === t ? 'rgba(0,212,170,0.25)' : 'var(--border)'}`,
            }}>{l}</button>
        ))}
      </div>

      {/* Overview tab */}
      {tab === 'overview' && (
        <div className="flex flex-col gap-3">
          <div className="card flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">Útgjöld eftir flokkum</h3>
              <button onClick={() => setShowBudgetEdit(!showBudgetEdit)} className="text-xs" style={{ color: 'var(--accent)' }}>
                Breyta áætlun
              </button>
            </div>
            {showBudgetEdit && (
              <div className="flex flex-col gap-2 p-3 rounded-xl" style={{ background: 'var(--surface2)' }}>
                <div className="text-xs font-medium" style={{ color: 'var(--muted)' }}>Mánaðarleg fjárhagsáætlun</div>
                <input className="input text-sm" type="number" value={budget.monthly}
                  onChange={e => setBudget(b => ({ ...b, monthly: Number(e.target.value) }))} />
                <div className="text-xs font-medium mt-1" style={{ color: 'var(--muted)' }}>Sparnaðarmarkmið/mán</div>
                <input className="input text-sm" type="number" value={budget.savingsGoal || ''}
                  placeholder="Sparnaðarmarkmið..."
                  onChange={e => setBudget(b => ({ ...b, savingsGoal: Number(e.target.value) }))} />
                <div className="grid grid-cols-2 gap-2 mt-1">
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

          {/* Savings goal */}
          {budget.savingsGoal > 0 && income > 0 && (
            <div className="card">
              <div className="flex items-center gap-2 mb-3">
                <PiggyBank size={15} style={{ color: 'var(--accent)' }} />
                <span className="font-semibold text-sm">Sparnaðarmarkmið</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span style={{ color: 'var(--muted)' }}>Sparað þennan mánuð</span>
                <span style={{ color: savings >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                  {formatISK(Math.max(0, savings))}
                </span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--surface2)' }}>
                <div className="h-full rounded-full"
                     style={{
                       width: `${Math.min(100, Math.round((Math.max(0, savings) / budget.savingsGoal) * 100))}%`,
                       background: savings >= budget.savingsGoal ? 'var(--success)' : 'var(--accent)',
                     }} />
              </div>
              <div className="flex justify-between text-xs mt-1" style={{ color: 'var(--muted)' }}>
                <span>{Math.min(100, Math.round((Math.max(0, savings) / budget.savingsGoal) * 100))}%</span>
                <span>Markmið: {formatISK(budget.savingsGoal)}</span>
              </div>
            </div>
          )}

          {/* Income list */}
          {recentIncomes.length > 0 && (
            <div className="card">
              <h3 className="font-semibold text-sm mb-3" style={{ color: 'var(--success)' }}>Tekjur þessa mánaðar</h3>
              <div className="flex flex-col gap-2">
                {recentIncomes.slice(0, 5).map(i => {
                  const cat = INCOME_CATEGORIES.find(c => c.id === i.category) || INCOME_CATEGORIES[4]
                  return (
                    <div key={i.id} className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm"
                           style={{ background: `${cat.color}22` }}>{cat.icon}</div>
                      <div className="flex-1 min-w-0">
                        <span className="text-sm">{i.note || cat.label}</span>
                        <span className="text-xs block" style={{ color: 'var(--muted)' }}>
                          {new Date(i.date).toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium" style={{ color: 'var(--success)' }}>+{formatISK(i.amount)}</span>
                        <button onClick={() => removeIncome(i.id)} style={{ color: 'var(--muted)' }}>
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
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
        <div className="flex flex-col gap-3">
          {/* Sub summary */}
          <div className="card" style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.06), rgba(139,92,246,0.06))' }}>
            <div className="flex justify-between items-center mb-1">
              <div>
                <div className="text-xs" style={{ color: 'var(--muted)' }}>Mánaðarleg áskriftakostnaður</div>
                <div className="text-3xl font-bold mt-0.5">{formatISK(subMonthly())}</div>
              </div>
              <div className="text-right">
                <div className="text-xs" style={{ color: 'var(--muted)' }}>Á ári</div>
                <div className="text-lg font-semibold">{formatISK(subMonthly() * 12)}</div>
              </div>
            </div>
            <div className="text-xs mt-2" style={{ color: 'var(--muted)' }}>
              {subs.filter(s => s.active).length} virkar áskriftir
            </div>
          </div>

          {/* Upcoming renewals */}
          {upcoming.length > 0 && (
            <div className="card" style={{ border: '1px solid rgba(249,115,22,0.25)', background: 'rgba(249,115,22,0.04)' }}>
              <div className="flex items-center gap-2 mb-2">
                <Bell size={13} style={{ color: '#f97316' }} />
                <span className="text-xs font-semibold" style={{ color: '#f97316' }}>Endurnýjast innan 7 daga</span>
              </div>
              {upcoming.map(s => (
                <div key={s.id} className="flex items-center justify-between text-sm py-1">
                  <span>{s.name}</span>
                  <span style={{ color: '#f97316' }}>
                    {s.daysUntil === 0 ? 'Í dag' : `${s.daysUntil}d`} · {formatISK(s.amount)}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Add sub button */}
          <button onClick={() => setShowSubForm(!showSubForm)} className="btn btn-ghost w-full justify-center">
            <Plus size={16} /> Bæta við áskrift
          </button>

          {/* Add sub form */}
          {showSubForm && (
            <form onSubmit={handleAddSub} className="card flex flex-col gap-3 animate-slide-up">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm">Ný áskrift</h3>
                <button type="button" onClick={() => setShowSubForm(false)}><X size={16} style={{ color: 'var(--muted)' }} /></button>
              </div>
              <input className="input" placeholder="Nafn (t.d. Netflix)" value={sName}
                onChange={e => setSName(e.target.value)} autoFocus />
              <div className="flex gap-2">
                <input className="input" type="number" placeholder="Upphæð (ISK)" value={sAmount}
                  onChange={e => setSAmount(e.target.value)} />
                <select className="input" value={sCycle} onChange={e => setSCycle(e.target.value)}
                        style={{ background: 'var(--surface2)' }}>
                  <option value="monthly">Mánaðarlegt</option>
                  <option value="yearly">Árlegt</option>
                </select>
              </div>
              <input className="input" type="number" placeholder="Endurnýjast daginn (1-31, valkvæmt)"
                value={sRenewDay} onChange={e => setSRenewDay(e.target.value)} min={1} max={31} />
              <div className="grid grid-cols-4 gap-1.5">
                {SUB_CATEGORIES.map(c => (
                  <button key={c.id} type="button" onClick={() => setSCategory(c.id)}
                    className="flex flex-col items-center gap-0.5 py-2 rounded-xl text-xs"
                    style={{
                      background: sCategory === c.id ? `${c.color}22` : 'var(--surface2)',
                      border: `1px solid ${sCategory === c.id ? c.color + '55' : 'transparent'}`,
                    }}>
                    <span>{c.icon}</span>
                    <span style={{ color: sCategory === c.id ? c.color : 'var(--muted)', fontSize: 10 }}>{c.label}</span>
                  </button>
                ))}
              </div>
              <button type="submit" className="btn btn-primary w-full justify-center">Bæta við</button>
            </form>
          )}

          {/* Subscription list */}
          <div className="flex flex-col gap-2">
            {subs.length === 0 ? (
              <div className="card text-center py-8" style={{ color: 'var(--muted)' }}>Engar áskriftir skráðar</div>
            ) : subs.map(s => (
              <SubCard key={s.id} sub={s} onToggle={toggleSub} onRemove={removeSub} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
