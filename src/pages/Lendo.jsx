import { useState } from 'react'
import { useLendo } from '../hooks/useLendo'
import { Plus, Trash2, X, Check, Package, ChevronDown, TrendingUp } from 'lucide-react'

function fmtISK(n) {
  return n.toLocaleString('is-IS') + ' kr'
}

const ITEMS = [
  'Veislusett (borð + 10 stólar)',
  'Borð eingöngu',
  'Stólar (10 stk)',
  'Stólar (20 stk)',
  'Fullkomið partýsett (borð + 20 stólar)',
  'Annað',
]

export default function Lendo() {
  const {
    addBooking, removeBooking, togglePaid,
    thisMonthRevenue, upcomingBookings, pastBookings,
    goal, setGoal,
  } = useLendo()

  const [showForm, setShowForm] = useState(false)
  const [showGoalEdit, setShowGoalEdit] = useState(false)
  const [tab, setTab] = useState('upcoming')

  const [date, setDate] = useState('')
  const [customer, setCustomer] = useState('')
  const [item, setItem] = useState(ITEMS[0])
  const [amount, setAmount] = useState('7000')
  const [notes, setNotes] = useState('')

  const pct = Math.min(100, Math.round((thisMonthRevenue / goal) * 100))
  const remaining = goal - thisMonthRevenue
  const isOver = remaining <= 0

  function handleAdd(e) {
    e.preventDefault()
    if (!date || !customer || !amount) return
    addBooking({ date, customer, item, amount: Number(amount), notes })
    setDate('')
    setCustomer('')
    setItem(ITEMS[0])
    setAmount('7000')
    setNotes('')
    setShowForm(false)
  }

  const list = tab === 'upcoming' ? upcomingBookings : pastBookings

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">

      {/* Header */}
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                 style={{ background: 'rgba(249,115,22,0.15)' }}>
              <Package size={16} style={{ color: 'var(--accent3)' }} />
            </div>
            <h1 className="text-xl font-semibold">Lendó</h1>
          </div>
          <p className="text-sm mt-0.5" style={{ color: 'var(--muted)' }}>
            {new Date().toLocaleDateString('is-IS', { month: 'long', year: 'numeric' })}
          </p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn"
                style={{ background: 'var(--accent3)', color: '#000' }}>
          <Plus size={16} /> Bókun
        </button>
      </div>

      {/* Revenue overview */}
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(249,115,22,0.08), rgba(139,92,246,0.06))' }}>
        <div className="flex items-center gap-1.5 mb-3">
          <TrendingUp size={14} style={{ color: 'var(--accent3)' }} />
          <span className="text-xs font-medium" style={{ color: 'var(--muted)' }}>Tekjur þessa mánaðar</span>
        </div>
        <div className="flex justify-between items-end mb-3">
          <div>
            <div className="text-3xl font-bold" style={{ color: 'var(--accent3)' }}>
              {fmtISK(thisMonthRevenue)}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs" style={{ color: 'var(--muted)' }}>
              {isOver ? '🎉 Markmið náð!' : 'Eftir'}
            </div>
            <div className="font-semibold" style={{ color: isOver ? 'var(--success)' : 'var(--text)' }}>
              {fmtISK(Math.abs(remaining))}
            </div>
          </div>
        </div>

        <div className="h-3 rounded-full overflow-hidden mb-1.5" style={{ background: 'var(--surface2)' }}>
          <div className="h-full rounded-full transition-all duration-700"
               style={{
                 width: `${pct}%`,
                 background: isOver
                   ? 'var(--success)'
                   : 'linear-gradient(90deg, #f97316, #ec4899)',
               }} />
        </div>
        <div className="flex justify-between items-center text-xs" style={{ color: 'var(--muted)' }}>
          <span>{pct}% af marki</span>
          <button onClick={() => setShowGoalEdit(!showGoalEdit)} style={{ color: 'var(--accent3)' }}>
            Mark: {fmtISK(goal)} ✏️
          </button>
        </div>

        {showGoalEdit && (
          <div className="flex gap-2 mt-3">
            <input className="input text-sm flex-1" type="number"
                   value={goal} onChange={e => setGoal(Number(e.target.value))}
                   placeholder="Mánaðarleg marktekjur (ISK)" />
            <button onClick={() => setShowGoalEdit(false)} className="btn text-sm px-3"
                    style={{ background: 'var(--accent3)', color: '#000' }}>
              Vista
            </button>
          </div>
        )}
      </div>

      {/* New booking form */}
      {showForm && (
        <form onSubmit={handleAdd} className="card flex flex-col gap-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Ný bókun</h3>
            <button type="button" onClick={() => setShowForm(false)}>
              <X size={16} style={{ color: 'var(--muted)' }} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs mb-1 block" style={{ color: 'var(--muted)' }}>Dagsetning</label>
              <input className="input" type="date" value={date}
                     onChange={e => setDate(e.target.value)} required />
            </div>
            <div>
              <label className="text-xs mb-1 block" style={{ color: 'var(--muted)' }}>Upphæð (ISK)</label>
              <input className="input" type="number" value={amount}
                     onChange={e => setAmount(e.target.value)} required />
            </div>
          </div>

          <div>
            <label className="text-xs mb-1 block" style={{ color: 'var(--muted)' }}>Nafn viðskiptavinar</label>
            <input className="input" placeholder="Nafn..." value={customer}
                   onChange={e => setCustomer(e.target.value)} required />
          </div>

          <div className="relative">
            <label className="text-xs mb-1 block" style={{ color: 'var(--muted)' }}>Hlutur</label>
            <select className="input appearance-none pr-8" value={item}
                    onChange={e => setItem(e.target.value)}>
              {ITEMS.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-3 pointer-events-none"
                        style={{ color: 'var(--muted)', bottom: 10 }} />
          </div>

          <div>
            <label className="text-xs mb-1 block" style={{ color: 'var(--muted)' }}>Athugasemd</label>
            <input className="input" placeholder="Valkvæmt..." value={notes}
                   onChange={e => setNotes(e.target.value)} />
          </div>

          <button type="submit" className="btn w-full justify-center font-semibold"
                  style={{ background: 'var(--accent3)', color: '#000' }}>
            Bæta við bókun
          </button>
        </form>
      )}

      {/* Tabs */}
      <div className="flex gap-2">
        {[['upcoming', `Komandi (${upcomingBookings.length})`], ['past', `Liðnar (${pastBookings.length})`]].map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)} className="btn text-sm flex-1 justify-center"
                  style={{
                    background: tab === t ? 'rgba(249,115,22,0.12)' : 'var(--surface)',
                    color: tab === t ? 'var(--accent3)' : 'var(--muted)',
                    border: `1px solid ${tab === t ? 'rgba(249,115,22,0.3)' : 'var(--border)'}`,
                  }}>
            {l}
          </button>
        ))}
      </div>

      {/* Booking list */}
      <div className="flex flex-col gap-2">
        {list.length === 0 ? (
          <div className="card text-center py-10" style={{ color: 'var(--muted)' }}>
            {tab === 'upcoming'
              ? <><div className="text-2xl mb-2">📦</div><div>Engar komandi bókanir</div></>
              : <><div className="text-2xl mb-2">📋</div><div>Engar liðnar bókanir</div></>
            }
          </div>
        ) : list.map(b => (
          <div key={b.id} className="card" style={{ opacity: tab === 'past' && !b.paid ? 0.8 : 1 }}>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                   style={{ background: 'rgba(249,115,22,0.12)' }}>
                <Package size={15} style={{ color: 'var(--accent3)' }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium text-sm truncate">{b.customer}</span>
                  <span className="font-bold text-sm shrink-0" style={{ color: 'var(--accent3)' }}>
                    {fmtISK(b.amount)}
                  </span>
                </div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                  {new Date(b.date).toLocaleDateString('is-IS', { weekday: 'long', month: 'long', day: 'numeric' })}
                </div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{b.item}</div>
                {b.notes && (
                  <div className="text-xs mt-1 italic" style={{ color: 'var(--muted)' }}>
                    📝 {b.notes}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between mt-3 pt-2.5"
                 style={{ borderTop: '1px solid var(--border)' }}>
              <button onClick={() => togglePaid(b.id)}
                      className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg transition-all"
                      style={{
                        background: b.paid ? 'rgba(34,197,94,0.12)' : 'var(--surface2)',
                        color: b.paid ? 'var(--success)' : 'var(--muted)',
                        border: `1px solid ${b.paid ? 'rgba(34,197,94,0.3)' : 'transparent'}`,
                      }}>
                <Check size={12} />
                {b.paid ? 'Greitt' : 'Merkja greitt'}
              </button>
              <button onClick={() => removeBooking(b.id)} className="p-1.5 rounded-lg transition-all"
                      style={{ color: 'var(--muted)' }}>
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
