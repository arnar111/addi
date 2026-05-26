import { useState } from 'react'
import { useFinance } from '../hooks/useFinance'
import { useIncome, INCOME_SOURCES } from '../hooks/useIncome'
import { useSubscriptions } from '../hooks/useSubscriptions'
import { formatISK, formatShortISK, EXPENSE_CATEGORIES } from '../utils/currency'
import { Plus, Trash2, X, ToggleLeft, ToggleRight } from 'lucide-react'

const TABS = [
  { id: 'overview', label: 'Yfirlit' },
  { id: 'expenses', label: 'Gjöld' },
  { id: 'income', label: 'Tekjur' },
  { id: 'subscriptions', label: 'Áskriftir' },
]

function CategoryBar({ cat, spent, budget }) {
  const pct = budget ? Math.min(100, Math.round((spent / budget) * 100)) : 0
  const isOver = budget && spent > budget
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

function OverviewTab({ monthlyTotal, incomeTotal, budget, byCategory, remaining, setBudget, showBudgetEdit, setShowBudgetEdit }) {
  const spent = monthlyTotal()
  const income = incomeTotal()
  const net = income - spent
  const left = remaining()
  const isOver = left < 0
  const pct = Math.min(100, Math.round((spent / budget.monthly) * 100))
  const cats = byCategory()

  return (
    <>
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.06), rgba(139,92,246,0.06))' }}>
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div>
            <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Tekjur</div>
            <div className="text-xl font-semibold" style={{ color: '#22c55e' }}>{formatShortISK(income)}</div>
          </div>
          <div>
            <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Útgjöld</div>
            <div className="text-xl font-semibold" style={{ color: '#ef4444' }}>{formatShortISK(spent)}</div>
          </div>
          <div>
            <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Nettó</div>
            <div className="text-xl font-semibold" style={{ color: net >= 0 ? 'var(--accent)' : 'var(--danger)' }}>
              {net >= 0 ? '+' : ''}{formatShortISK(net)}
            </div>
          </div>
        </div>
        <div className="h-2.5 rounded-full overflow-hidden mb-1" style={{ background: 'var(--surface2)' }}>
          <div className="h-full rounded-full transition-all"
               style={{ width: `${pct}%`, background: isOver ? 'var(--danger)' : pct > 80 ? '#f97316' : 'var(--accent)' }} />
        </div>
        <div className="flex justify-between text-xs" style={{ color: 'var(--muted)' }}>
          <span>{pct}% af fjárhagsáætlun ({formatShortISK(budget.monthly)})</span>
          <span style={{ color: isOver ? 'var(--danger)' : 'var(--success)' }}>
            {isOver ? 'yfir um ' : 'eftir '}{formatShortISK(Math.abs(left))}
          </span>
        </div>
      </div>

      <div className="card flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm">Eftir flokkum</h3>
          <button onClick={() => setShowBudgetEdit(!showBudgetEdit)} className="text-xs" style={{ color: 'var(--accent)' }}>
            Breyta áætlun
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
    </>
  )
}

function ExpensesTab({ addExpense, removeExpense, recentExpenses }) {
  const [showForm, setShowForm] = useState(false)
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('food')
  const [note, setNote] = useState('')

  const handleAdd = (e) => {
    e.preventDefault()
    if (!amount || isNaN(Number(amount))) return
    addExpense(Number(amount), category, note)
    setAmount('')
    setNote('')
    setShowForm(false)
  }

  return (
    <>
      <div className="flex justify-end">
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          <Plus size={16} /> Gjald
        </button>
      </div>

      {showForm && (
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

      <div className="flex flex-col gap-2">
        {recentExpenses.length === 0 ? (
          <div className="card text-center py-8" style={{ color: 'var(--muted)' }}>Engar gjaldsfærslur ennþá</div>
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
    </>
  )
}

function IncomeTab({ addIncome, removeIncome, recent, monthlyTotal }) {
  const [showForm, setShowForm] = useState(false)
  const [amount, setAmount] = useState('')
  const [source, setSource] = useState('lendo')
  const [note, setNote] = useState('')
  const total = monthlyTotal()

  const handleAdd = (e) => {
    e.preventDefault()
    if (!amount || isNaN(Number(amount))) return
    addIncome(Number(amount), source, note)
    setAmount('')
    setNote('')
    setShowForm(false)
  }

  return (
    <>
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.07), rgba(0,212,170,0.07))' }}>
        <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Tekjur þessa mánaðar</div>
        <div className="text-3xl font-semibold" style={{ color: '#22c55e' }}>{formatISK(total)}</div>
      </div>

      <div className="flex justify-end">
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary" style={{ background: '#22c55e', color: '#000' }}>
          <Plus size={16} /> Tekjur
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="card flex flex-col gap-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Bæta við tekjum</h3>
            <button type="button" onClick={() => setShowForm(false)}>
              <X size={16} style={{ color: 'var(--muted)' }} />
            </button>
          </div>
          <input className="input" type="number" placeholder="Upphæð (ISK)" value={amount}
            onChange={e => setAmount(e.target.value)} autoFocus />
          <input className="input" placeholder="Skýring (valkvæmt)" value={note}
            onChange={e => setNote(e.target.value)} />
          <div className="grid grid-cols-3 gap-1.5">
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
          <button type="submit" className="btn btn-primary w-full justify-center" style={{ background: '#22c55e', color: '#000' }}>
            Bæta við
          </button>
        </form>
      )}

      <div className="flex flex-col gap-2">
        {recent.length === 0 ? (
          <div className="card text-center py-8" style={{ color: 'var(--muted)' }}>
            <div className="text-2xl mb-2">🪑</div>
            <div>Engar tekjur skráðar ennþá</div>
            <div className="text-xs mt-1">Skráðu Lendó leigutekjur og fleiri tekjur hér</div>
          </div>
        ) : recent.map(i => {
          const src = INCOME_SOURCES.find(s => s.id === i.source) || INCOME_SOURCES[5]
          return (
            <div key={i.id} className="card flex items-center gap-3 py-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-base"
                   style={{ background: `${src.color}22` }}>{src.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium" style={{ color: '#22c55e' }}>+{formatISK(i.amount)}</div>
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
    </>
  )
}

const SUB_ICONS = ['📱', '💻', '🎬', '🎵', '🎮', '📰', '☁️', '🤖', '🚀', '🌐', '🎨', '📧', '🔒', '⚽', '🧘', '📺', '🎧', '🦁', '🌙', '🪑']

function SubscriptionsTab({ subscriptions, add, remove, toggleActive, monthlyTotal, yearlyTotal, daysUntilDue }) {
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [dueDay, setDueDay] = useState(1)
  const [icon, setIcon] = useState('📱')

  const handleAdd = (e) => {
    e.preventDefault()
    if (!name.trim() || !amount) return
    add({ name: name.trim(), amount: Number(amount), dueDay: Number(dueDay), icon, color: '#00d4aa', cycle: 'monthly', category: 'other' })
    setName('')
    setAmount('')
    setDueDay(1)
    setIcon('📱')
    setShowForm(false)
  }

  return (
    <>
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.06), rgba(139,92,246,0.06))' }}>
        <div className="flex justify-between items-start">
          <div>
            <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Mánaðarlegar áskriftir</div>
            <div className="text-3xl font-semibold">{formatISK(monthlyTotal)}</div>
          </div>
          <div className="text-right">
            <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Á ári</div>
            <div className="text-lg font-semibold" style={{ color: 'var(--muted)' }}>{formatShortISK(yearlyTotal)}</div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          <Plus size={16} /> Áskrift
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="card flex flex-col gap-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Bæta við áskrift</h3>
            <button type="button" onClick={() => setShowForm(false)}>
              <X size={16} style={{ color: 'var(--muted)' }} />
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {SUB_ICONS.map(ico => (
              <button key={ico} type="button" onClick={() => setIcon(ico)}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-all"
                style={{
                  background: icon === ico ? 'rgba(0,212,170,0.2)' : 'var(--surface2)',
                  border: `1px solid ${icon === ico ? 'var(--accent)' : 'transparent'}`,
                }}>
                {ico}
              </button>
            ))}
          </div>
          <input className="input" placeholder="Nafn (t.d. Spotify)" value={name}
            onChange={e => setName(e.target.value)} />
          <input className="input" type="number" placeholder="Upphæð á mánuði (ISK)" value={amount}
            onChange={e => setAmount(e.target.value)} />
          <div className="flex flex-col gap-1">
            <label className="text-xs" style={{ color: 'var(--muted)' }}>Gjalddagi (1–31)</label>
            <input className="input" type="number" min={1} max={31} value={dueDay}
              onChange={e => setDueDay(e.target.value)} />
          </div>
          <button type="submit" className="btn btn-primary w-full justify-center">Bæta við</button>
        </form>
      )}

      <div className="flex flex-col gap-2">
        {subscriptions.map(s => {
          const days = daysUntilDue(s)
          const isDueSoon = days <= 7 && s.active
          return (
            <div key={s.id} className="card flex items-center gap-3 py-3" style={{ opacity: s.active ? 1 : 0.5 }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0"
                   style={{ background: `${s.color}22` }}>{s.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium truncate">{s.name}</span>
                  {isDueSoon && (
                    <span className="badge shrink-0" style={{ background: 'rgba(249,115,22,0.15)', color: '#f97316' }}>
                      {days === 0 ? 'Í dag' : `${days}d`}
                    </span>
                  )}
                </div>
                <div className="text-xs" style={{ color: 'var(--muted)' }}>
                  {formatShortISK(s.amount)}/mán · {s.dueDay}. hvers mánaðar
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => toggleActive(s.id)}
                        style={{ color: s.active ? 'var(--accent)' : 'var(--muted)' }}>
                  {s.active ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
                </button>
                <button onClick={() => remove(s.id)} style={{ color: 'var(--muted)' }}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}

export default function Finance() {
  const { addExpense, removeExpense, budget, setBudget, monthlyTotal, byCategory, remaining, recentExpenses } = useFinance()
  const { add: addIncome, remove: removeIncome, monthlyTotal: incomeTotal, recent: recentIncome } = useIncome()
  const { subscriptions, add: addSub, remove: removeSub, toggleActive, monthlyTotal: subTotal, yearlyTotal: subYearlyTotal, daysUntilDue } = useSubscriptions()
  const [tab, setTab] = useState('overview')
  const [showBudgetEdit, setShowBudgetEdit] = useState(false)

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="px-1 pt-2">
        <h1 className="text-xl font-semibold">Fjármál</h1>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>
          {new Date().toLocaleDateString('is-IS', { month: 'long', year: 'numeric' })}
        </p>
      </div>

      <div className="flex gap-1.5 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className="btn shrink-0 text-sm py-2"
            style={{
              background: tab === t.id ? 'rgba(0,212,170,0.12)' : 'var(--surface)',
              color: tab === t.id ? 'var(--accent)' : 'var(--muted)',
              border: `1px solid ${tab === t.id ? 'rgba(0,212,170,0.25)' : 'var(--border)'}`,
            }}>{t.label}</button>
        ))}
      </div>

      {tab === 'overview' && (
        <OverviewTab
          monthlyTotal={monthlyTotal}
          incomeTotal={incomeTotal}
          budget={budget}
          byCategory={byCategory}
          remaining={remaining}
          setBudget={setBudget}
          showBudgetEdit={showBudgetEdit}
          setShowBudgetEdit={setShowBudgetEdit}
        />
      )}
      {tab === 'expenses' && (
        <ExpensesTab
          addExpense={addExpense}
          removeExpense={removeExpense}
          recentExpenses={recentExpenses}
        />
      )}
      {tab === 'income' && (
        <IncomeTab
          addIncome={addIncome}
          removeIncome={removeIncome}
          recent={recentIncome}
          monthlyTotal={incomeTotal}
        />
      )}
      {tab === 'subscriptions' && (
        <SubscriptionsTab
          subscriptions={subscriptions}
          add={addSub}
          remove={removeSub}
          toggleActive={toggleActive}
          monthlyTotal={subTotal}
          yearlyTotal={subYearlyTotal}
          daysUntilDue={daysUntilDue}
        />
      )}
    </div>
  )
}
