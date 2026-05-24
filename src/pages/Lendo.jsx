import { useState } from 'react'
import { useLendo, LENDO_ITEMS } from '../hooks/useLendo'
import { formatISK, formatShortISK } from '../utils/currency'
import { Plus, X, Trash2, CheckCircle, XCircle, Clock, Target } from 'lucide-react'

const STATUS_LABELS = {
  confirmed: { label: 'Staðfest', color: '#22c55e', icon: CheckCircle },
  pending: { label: 'Í bið', color: '#f97316', icon: Clock },
  cancelled: { label: 'Afbókað', color: '#ef4444', icon: XCircle },
}

function BookingCard({ booking, onUpdateStatus, onRemove }) {
  const item = LENDO_ITEMS.find(i => i.id === booking.item) || LENDO_ITEMS[4]
  const st = STATUS_LABELS[booking.status] || STATUS_LABELS.confirmed
  const StIcon = st.icon
  const start = new Date(booking.startDate)
  const end = new Date(booking.endDate)
  const sameDay = start.toDateString() === end.toDateString()

  return (
    <div className="card flex flex-col gap-2">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xl shrink-0">{item.icon}</span>
          <div className="min-w-0">
            <div className="text-sm font-medium truncate">{booking.customer}</div>
            <div className="text-xs truncate" style={{ color: 'var(--muted)' }}>{item.name}</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="font-semibold text-sm" style={{ color: 'var(--accent)' }}>
            {formatShortISK(booking.amount)}
          </span>
          <button onClick={() => onRemove(booking.id)} style={{ color: 'var(--muted)' }}>
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-xs" style={{ color: 'var(--muted)' }}>
          {start.toLocaleDateString('is-IS', { weekday: 'short', month: 'short', day: 'numeric' })}
          {!sameDay && ` – ${end.toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })}`}
        </div>
        <div className="flex gap-1">
          {Object.entries(STATUS_LABELS).map(([k, v]) => (
            <button key={k} onClick={() => onUpdateStatus(booking.id, k)}
              className="px-2 py-0.5 rounded-full text-xs font-medium transition-all"
              style={{
                background: booking.status === k ? `${v.color}22` : 'var(--surface2)',
                color: booking.status === k ? v.color : 'var(--muted)',
                border: `1px solid ${booking.status === k ? v.color + '44' : 'transparent'}`,
              }}>
              {v.label}
            </button>
          ))}
        </div>
      </div>

      {booking.notes && (
        <div className="text-xs px-2 py-1.5 rounded-lg" style={{ background: 'var(--surface2)', color: 'var(--muted)' }}>
          {booking.notes}
        </div>
      )}
    </div>
  )
}

export default function Lendo() {
  const { bookings, addBooking, updateStatus, removeBooking, getMonthBookings,
    monthlyIncome, goalProgress, monthlyGoal, setMonthlyGoal, upcomingBookings } = useLendo()

  const [showForm, setShowForm] = useState(false)
  const [showGoalEdit, setShowGoalEdit] = useState(false)
  const [tab, setTab] = useState('upcoming')

  const [form, setForm] = useState({
    item: 'party_set',
    customer: '',
    amount: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    notes: '',
  })

  const income = monthlyIncome()
  const pct = goalProgress()
  const monthBookings = getMonthBookings()
  const upcoming = upcomingBookings()
  const isOver = pct >= 100

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.customer.trim() || !form.amount || !form.startDate) return
    addBooking({
      item: form.item,
      customer: form.customer.trim(),
      amount: Number(form.amount),
      startDate: form.startDate,
      endDate: form.endDate || form.startDate,
      notes: form.notes.trim(),
    })
    setForm({ item: 'party_set', customer: '', amount: '', startDate: new Date().toISOString().split('T')[0], endDate: '', notes: '' })
    setShowForm(false)
  }

  const autoFillRate = (itemId) => {
    const item = LENDO_ITEMS.find(i => i.id === itemId)
    if (item) setForm(f => ({ ...f, item: itemId, amount: String(item.defaultRate) }))
  }

  const displayedBookings = tab === 'upcoming' ? upcoming : monthBookings

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold">Lendó</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            {new Date().toLocaleDateString('is-IS', { month: 'long', year: 'numeric' })}
          </p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          <Plus size={16} /> Bókun
        </button>
      </div>

      {/* Income overview */}
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(249,115,22,0.08), rgba(139,92,246,0.06))' }}>
        <div className="flex justify-between items-start mb-3">
          <div>
            <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Tekjur þessa mánaðar</div>
            <div className="text-3xl font-semibold" style={{ color: '#f97316' }}>{formatISK(income)}</div>
          </div>
          <div className="text-right">
            <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Markmið</div>
            <button onClick={() => setShowGoalEdit(!showGoalEdit)}
              className="text-sm font-semibold flex items-center gap-1"
              style={{ color: 'var(--muted)' }}>
              <Target size={13} /> {formatShortISK(monthlyGoal)}
            </button>
          </div>
        </div>

        {showGoalEdit && (
          <div className="flex gap-2 mb-3">
            <input className="input text-sm flex-1" type="number"
              value={monthlyGoal} onChange={e => setMonthlyGoal(Number(e.target.value))}
              placeholder="Mánaðarmarkmið (ISK)" />
            <button onClick={() => setShowGoalEdit(false)} className="btn btn-ghost px-3">
              <X size={14} />
            </button>
          </div>
        )}

        <div className="h-2.5 rounded-full overflow-hidden mb-1.5" style={{ background: 'var(--surface2)' }}>
          <div className="h-full rounded-full transition-all duration-500"
            style={{ width: `${pct}%`, background: isOver ? 'var(--success)' : '#f97316' }} />
        </div>
        <div className="flex justify-between text-xs" style={{ color: 'var(--muted)' }}>
          <span>{pct}% af markmiði</span>
          <span>{monthBookings.filter(b => b.status !== 'cancelled').length} bókanir</span>
        </div>
      </div>

      {/* Add booking form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="card flex flex-col gap-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Ný bókun</h3>
            <button type="button" onClick={() => setShowForm(false)}><X size={16} style={{ color: 'var(--muted)' }} /></button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {LENDO_ITEMS.map(item => (
              <button key={item.id} type="button" onClick={() => autoFillRate(item.id)}
                className="flex items-center gap-2 py-2 px-3 rounded-xl text-left text-xs transition-all"
                style={{
                  background: form.item === item.id ? 'rgba(249,115,22,0.12)' : 'var(--surface2)',
                  border: `1px solid ${form.item === item.id ? 'rgba(249,115,22,0.4)' : 'transparent'}`,
                  color: form.item === item.id ? '#f97316' : 'var(--muted)',
                }}>
                <span>{item.icon}</span>
                <span className="leading-tight">{item.name}</span>
              </button>
            ))}
          </div>

          <input className="input" placeholder="Nafn viðskiptavinar" value={form.customer}
            onChange={e => setForm(f => ({ ...f, customer: e.target.value }))} autoFocus />

          <div className="flex gap-2">
            <input className="input" type="number" placeholder="Upphæð (ISK)" value={form.amount}
              onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} />
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-xs mb-1 block" style={{ color: 'var(--muted)' }}>Frá</label>
              <input className="input text-sm" type="date" value={form.startDate}
                onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} />
            </div>
            <div className="flex-1">
              <label className="text-xs mb-1 block" style={{ color: 'var(--muted)' }}>Til</label>
              <input className="input text-sm" type="date" value={form.endDate}
                min={form.startDate}
                onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} />
            </div>
          </div>

          <input className="input text-sm" placeholder="Athugasemd (valkvæmt)" value={form.notes}
            onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />

          <button type="submit" className="btn btn-primary w-full justify-center">
            Skrá bókun
          </button>
        </form>
      )}

      {/* Tabs */}
      <div className="flex gap-2">
        {[['upcoming', 'Komandi'], ['month', 'Þessi mánuður']].map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)}
            className="btn text-sm flex-1 justify-center"
            style={{
              background: tab === t ? 'rgba(249,115,22,0.12)' : 'var(--surface)',
              color: tab === t ? '#f97316' : 'var(--muted)',
              border: `1px solid ${tab === t ? 'rgba(249,115,22,0.3)' : 'var(--border)'}`,
            }}>{l}</button>
        ))}
      </div>

      {/* Bookings list */}
      {displayedBookings.length === 0 ? (
        <div className="card text-center py-10" style={{ color: 'var(--muted)' }}>
          <div className="text-3xl mb-2">📦</div>
          <div className="text-sm">{tab === 'upcoming' ? 'Engar komandi bókanir' : 'Engar bókanir þennan mánuð'}</div>
          <button onClick={() => setShowForm(true)} className="btn btn-primary mt-4 mx-auto">
            <Plus size={14} /> Bæta við bókun
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {displayedBookings.map(b => (
            <BookingCard key={b.id} booking={b}
              onUpdateStatus={updateStatus}
              onRemove={removeBooking} />
          ))}
        </div>
      )}
    </div>
  )
}
