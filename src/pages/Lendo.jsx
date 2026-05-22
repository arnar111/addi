import { useState } from 'react'
import { useLendo, LENDO_ITEMS } from '../hooks/useLendo'
import { formatISK, formatShortISK } from '../utils/currency'
import { Plus, Trash2, X, TrendingUp, Target, CalendarDays, BarChart2 } from 'lucide-react'

function MiniBar({ label, revenue, max, goal }) {
  const pct = max > 0 ? Math.round((revenue / max) * 100) : 0
  const isGoal = revenue >= goal
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between text-xs">
        <span style={{ color: 'var(--muted)' }}>{label}</span>
        <span style={{ color: isGoal ? 'var(--success)' : 'var(--text)' }}>{formatShortISK(revenue)}</span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--surface2)' }}>
        <div className="h-full rounded-full transition-all"
             style={{ width: `${pct}%`, background: isGoal ? 'var(--success)' : 'var(--accent)' }} />
      </div>
    </div>
  )
}

export default function Lendo() {
  const {
    bookings, addBooking, removeBooking,
    monthlyGoal, setMonthlyGoal,
    currentMonthBookings, monthlyRevenue, monthlyProgress, monthlyRemaining,
    totalBookings, avgPerBooking, last6Months,
  } = useLendo()

  const [tab, setTab] = useState('bookings')
  const [showForm, setShowForm] = useState(false)
  const [showGoalEdit, setShowGoalEdit] = useState(false)
  const [form, setForm] = useState({ date: new Date().toISOString().split('T')[0], itemId: 'set', days: 1, amount: '', customer: '', note: '' })

  const rev = monthlyRevenue()
  const pct = monthlyProgress()
  const remaining = monthlyRemaining()
  const isOver = pct >= 100
  const months = last6Months()
  const maxMonthRev = Math.max(...months.map(m => m.revenue), 1)

  const handleItemChange = (itemId) => {
    const item = LENDO_ITEMS.find(i => i.id === itemId)
    setForm(f => ({
      ...f,
      itemId,
      amount: item && item.price ? String(item.price * f.days) : '',
    }))
  }

  const handleDaysChange = (days) => {
    const item = LENDO_ITEMS.find(i => i.id === form.itemId)
    setForm(f => ({
      ...f,
      days: Number(days),
      amount: item && item.price ? String(item.price * Number(days)) : f.amount,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.amount || isNaN(Number(form.amount))) return
    addBooking(form)
    setForm({ date: new Date().toISOString().split('T')[0], itemId: 'set', days: 1, amount: '', customer: '', note: '' })
    setShowForm(false)
  }

  return (
    <div className="flex flex-col gap-4 pb-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold">🏡 Lendó</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            {new Date().toLocaleDateString('is-IS', { month: 'long', year: 'numeric' })}
          </p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          <Plus size={16} /> Leiga
        </button>
      </div>

      {/* Revenue hero card */}
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.1), rgba(59,130,246,0.07))' }}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Tekjur þetta mánuð</div>
            <div className="text-4xl font-bold" style={{ color: isOver ? 'var(--success)' : 'var(--text)' }}>
              {formatShortISK(rev)}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Eftir til markmiðs</div>
            <div className="text-xl font-semibold"
                 style={{ color: isOver ? 'var(--success)' : remaining > 50000 ? 'var(--danger)' : '#f97316' }}>
              {isOver ? '✓ Náð!' : formatShortISK(remaining)}
            </div>
          </div>
        </div>

        <div className="h-3 rounded-full overflow-hidden mb-1.5" style={{ background: 'var(--surface2)' }}>
          <div className="h-full rounded-full transition-all duration-700"
               style={{ width: `${pct}%`, background: isOver ? 'var(--success)' : pct > 75 ? '#f97316' : 'var(--accent)' }} />
        </div>
        <div className="flex justify-between text-xs" style={{ color: 'var(--muted)' }}>
          <span>{pct}% af markmiði</span>
          <button onClick={() => setShowGoalEdit(v => !v)} style={{ color: 'var(--accent)' }}>
            Markmið: {formatShortISK(monthlyGoal)}
          </button>
        </div>

        {showGoalEdit && (
          <div className="mt-3 flex gap-2">
            <input className="input text-sm" type="number"
              value={monthlyGoal}
              onChange={e => setMonthlyGoal(Number(e.target.value))} />
            <button onClick={() => setShowGoalEdit(false)} className="btn btn-primary shrink-0">Vista</button>
          </div>
        )}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: <CalendarDays size={15} />, label: 'Leigur í mánuð', value: currentMonthBookings().length },
          { icon: <TrendingUp size={15} />, label: 'Meðaltal/leiga', value: formatShortISK(avgPerBooking()) },
          { icon: <Target size={15} />, label: 'Leigur samtals', value: totalBookings },
        ].map(s => (
          <div key={s.label} className="card-sm flex flex-col gap-1.5">
            <span style={{ color: 'var(--accent)' }}>{s.icon}</span>
            <div className="text-base font-bold">{s.value}</div>
            <div className="text-xs leading-tight" style={{ color: 'var(--muted)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Add booking form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="card flex flex-col gap-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Ný leiga</h3>
            <button type="button" onClick={() => setShowForm(false)}>
              <X size={16} style={{ color: 'var(--muted)' }} />
            </button>
          </div>

          {/* Item selector */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs" style={{ color: 'var(--muted)' }}>Hlutur</label>
            <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
              {LENDO_ITEMS.map(item => (
                <button key={item.id} type="button" onClick={() => handleItemChange(item.id)}
                  className="flex items-center gap-2 p-2.5 rounded-xl text-left transition-all text-xs"
                  style={{
                    background: form.itemId === item.id ? 'rgba(0,212,170,0.12)' : 'var(--surface2)',
                    border: `1px solid ${form.itemId === item.id ? 'rgba(0,212,170,0.4)' : 'transparent'}`,
                    color: form.itemId === item.id ? 'var(--accent)' : 'var(--text)',
                  }}>
                  <span className="text-base">{item.icon}</span>
                  <span className="leading-tight">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs" style={{ color: 'var(--muted)' }}>Dagsetning</label>
              <input className="input text-sm" type="date" value={form.date}
                onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs" style={{ color: 'var(--muted)' }}>Dagar</label>
              <input className="input text-sm" type="number" min={1} max={30} value={form.days}
                onChange={e => handleDaysChange(e.target.value)} />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs" style={{ color: 'var(--muted)' }}>Upphæð (ISK)</label>
            <input className="input text-sm" type="number" placeholder="7000"
              value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs" style={{ color: 'var(--muted)' }}>Viðskiptavinur</label>
              <input className="input text-sm" placeholder="Nafn (valkvæmt)"
                value={form.customer} onChange={e => setForm(f => ({ ...f, customer: e.target.value }))} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs" style={{ color: 'var(--muted)' }}>Athugasemd</label>
              <input className="input text-sm" placeholder="t.d. afmæli"
                value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} />
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-full justify-center">
            <Plus size={16} /> Skrá leiguna
          </button>
        </form>
      )}

      {/* Tabs */}
      <div className="flex gap-2">
        {[['bookings', 'Leigur'], ['stats', 'Tölfræði']].map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)}
            className="btn text-sm flex-1 justify-center"
            style={{
              background: tab === t ? 'rgba(0,212,170,0.12)' : 'var(--surface)',
              color: tab === t ? 'var(--accent)' : 'var(--muted)',
              border: `1px solid ${tab === t ? 'rgba(0,212,170,0.3)' : 'var(--border)'}`,
            }}>{l}</button>
        ))}
      </div>

      {/* Bookings list */}
      {tab === 'bookings' && (
        <div className="flex flex-col gap-2">
          {bookings.length === 0 ? (
            <div className="card text-center py-10" style={{ color: 'var(--muted)' }}>
              <div className="text-3xl mb-2">🏡</div>
              <p className="text-sm">Engar leigur enn</p>
              <p className="text-xs mt-1">Bættu við fyrstu leiguna þinni</p>
            </div>
          ) : bookings.map(b => (
            <div key={b.id} className="card flex items-center gap-3 py-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0"
                   style={{ background: 'rgba(0,212,170,0.1)' }}>{b.itemIcon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold">{formatISK(b.amount)}</span>
                  <span className="text-xs shrink-0" style={{ color: 'var(--muted)' }}>
                    {new Date(b.date).toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                  {b.itemLabel}{b.days > 1 ? ` · ${b.days} dagar` : ''}
                  {b.customer ? ` · ${b.customer}` : ''}
                  {b.note ? ` · ${b.note}` : ''}
                </p>
              </div>
              <button onClick={() => removeBooking(b.id)} style={{ color: 'var(--muted)' }}>
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Stats */}
      {tab === 'stats' && (
        <div className="flex flex-col gap-4">
          <div className="card flex flex-col gap-3">
            <div className="flex items-center gap-2 mb-1">
              <BarChart2 size={15} style={{ color: 'var(--accent)' }} />
              <h3 className="font-semibold text-sm">Síðustu 6 mánuðir</h3>
            </div>
            {months.map(m => (
              <MiniBar key={m.label} label={m.label} revenue={m.revenue}
                max={maxMonthRev} goal={monthlyGoal} />
            ))}
            <div className="text-xs pt-1 flex justify-between" style={{ color: 'var(--muted)' }}>
              <span>Markmið: {formatShortISK(monthlyGoal)}</span>
              <span>Heildarleigur: {totalBookings}</span>
            </div>
          </div>

          <div className="card flex flex-col gap-3">
            <h3 className="font-semibold text-sm mb-1">Þjónusta eftir hlutum</h3>
            {LENDO_ITEMS.filter(i => i.id !== 'other').map(item => {
              const count = bookings.filter(b => b.itemId === item.id).length
              const total = bookings.filter(b => b.itemId === item.id).reduce((s, b) => s + b.amount, 0)
              if (count === 0) return null
              return (
                <div key={item.id} className="flex items-center justify-between text-sm">
                  <span>{item.icon} {item.label}</span>
                  <span style={{ color: 'var(--muted)' }}>
                    {count}x · {formatShortISK(total)}
                  </span>
                </div>
              )
            })}
            {bookings.filter(b => !['set','table','chairs10','chairs20'].includes(b.itemId)).length > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span>📦 Annað</span>
                <span style={{ color: 'var(--muted)' }}>
                  {bookings.filter(b => b.itemId === 'other').length}x · {formatShortISK(bookings.filter(b => b.itemId === 'other').reduce((s, b) => s + b.amount, 0))}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
