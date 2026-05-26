import { useState } from 'react'
import { useLendo, LENDO_ITEMS } from '../hooks/useLendo'
import { formatISK, formatShortISK } from '../utils/currency'
import { Plus, X, Check, Trash2, ChevronDown, ChevronUp, Calendar } from 'lucide-react'

const STATUS_COLORS = {
  paid: 'var(--success)',
  pending: '#f97316',
}

function BookingCard({ booking, onTogglePaid, onRemove }) {
  const item = LENDO_ITEMS.find(i => i.id === booking.itemId) || LENDO_ITEMS[4]
  const start = new Date(booking.startDate)
  const end = booking.endDate ? new Date(booking.endDate) : null
  const isPast = start < new Date(new Date().toDateString())

  return (
    <div className="card flex flex-col gap-2 py-3"
      style={{ opacity: isPast && booking.paid ? 0.7 : 1 }}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-lg"
               style={{ background: 'var(--surface2)' }}>{item.icon}</div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">{booking.customer || 'Viðskiptavinur'}</div>
            <div className="text-xs truncate" style={{ color: 'var(--muted)' }}>{item.label}</div>
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="text-sm font-semibold">{formatISK(booking.price || 0)}</div>
          <span className="text-xs font-medium"
            style={{ color: booking.paid ? STATUS_COLORS.paid : STATUS_COLORS.pending }}>
            {booking.paid ? '✓ Greitt' : '○ Ógreitt'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--muted)' }}>
        <Calendar size={11} />
        <span>
          {start.toLocaleDateString('is-IS', { weekday: 'short', month: 'short', day: 'numeric' })}
          {end && ` → ${end.toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })}`}
        </span>
      </div>

      {booking.note && (
        <div className="text-xs px-1" style={{ color: 'var(--muted)' }}>{booking.note}</div>
      )}

      <div className="flex gap-2 pt-1">
        <button onClick={() => onTogglePaid(booking.id)}
          className="btn flex-1 justify-center text-xs py-1.5"
          style={{
            background: booking.paid ? 'rgba(34,197,94,0.1)' : 'rgba(249,115,22,0.1)',
            color: booking.paid ? 'var(--success)' : '#f97316',
            border: `1px solid ${booking.paid ? 'rgba(34,197,94,0.2)' : 'rgba(249,115,22,0.2)'}`,
          }}>
          {booking.paid ? <><Check size={12} /> Greitt</> : <>○ Merkja greitt</>}
        </button>
        <button onClick={() => onRemove(booking.id)} style={{ color: 'var(--muted)', padding: '0 8px' }}>
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  )
}

export default function Lendo() {
  const {
    add, remove, togglePaid,
    monthlyRevenue, monthlyPaid, monthlyPending,
    totalRevenue, upcoming, recent,
  } = useLendo()

  const [showForm, setShowForm] = useState(false)
  const [showAll, setShowAll] = useState(false)
  const [form, setForm] = useState({
    customer: '',
    itemId: 'table_set',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    price: '',
    note: '',
    paid: false,
  })

  const upcomingBookings = upcoming()
  const recentBookings = recent()
  const rev = monthlyRevenue()
  const paid = monthlyPaid()
  const pending = monthlyPending()

  const handleItemChange = (itemId) => {
    const item = LENDO_ITEMS.find(i => i.id === itemId)
    setForm(f => ({
      ...f,
      itemId,
      price: item && item.pricePerDay > 0 ? String(item.pricePerDay) : f.price,
    }))
  }

  const handleAdd = (e) => {
    e.preventDefault()
    if (!form.customer || !form.startDate || !form.price) return
    add({
      customer: form.customer,
      itemId: form.itemId,
      startDate: form.startDate,
      endDate: form.endDate || null,
      price: Number(form.price),
      note: form.note,
      paid: form.paid,
    })
    setForm({
      customer: '', itemId: 'table_set',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '', price: '7000', note: '', paid: false,
    })
    setShowForm(false)
  }

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold">🪑 Lendó</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>Leigurekstur</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          <Plus size={16} /> Bókun
        </button>
      </div>

      {/* Revenue cards */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'Tekjur mánaðar', val: rev, color: 'var(--accent)' },
          { label: 'Greitt', val: paid, color: 'var(--success)' },
          { label: 'Ógreitt', val: pending, color: '#f97316' },
        ].map(({ label, val, color }) => (
          <div key={label} className="card py-3 flex flex-col gap-0.5">
            <div className="text-xs" style={{ color: 'var(--muted)' }}>{label}</div>
            <div className="text-base font-bold" style={{ color }}>{formatShortISK(val)}</div>
          </div>
        ))}
      </div>

      {/* Add booking form */}
      {showForm && (
        <form onSubmit={handleAdd} className="card flex flex-col gap-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Ný bókun</h3>
            <button type="button" onClick={() => setShowForm(false)}>
              <X size={16} style={{ color: 'var(--muted)' }} />
            </button>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs" style={{ color: 'var(--muted)' }}>Viðskiptavinur *</label>
            <input className="input" placeholder="Nafn viðskiptavinar" value={form.customer}
              onChange={e => setForm(f => ({ ...f, customer: e.target.value }))} autoFocus />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs" style={{ color: 'var(--muted)' }}>Vara</label>
            <div className="grid grid-cols-1 gap-1.5">
              {LENDO_ITEMS.map(item => (
                <button key={item.id} type="button" onClick={() => handleItemChange(item.id)}
                  className="flex items-center gap-2 py-2 px-3 rounded-xl text-sm text-left transition-all"
                  style={{
                    background: form.itemId === item.id ? 'rgba(0,212,170,0.1)' : 'var(--surface2)',
                    border: `1px solid ${form.itemId === item.id ? 'rgba(0,212,170,0.35)' : 'transparent'}`,
                    color: form.itemId === item.id ? 'var(--accent)' : 'var(--text)',
                  }}>
                  <span>{item.icon}</span>
                  <span className="flex-1">{item.label}</span>
                  {item.pricePerDay > 0 && (
                    <span className="text-xs" style={{ color: 'var(--muted)' }}>
                      {formatShortISK(item.pricePerDay)}/dag
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <label className="text-xs" style={{ color: 'var(--muted)' }}>Dagsetning *</label>
              <input className="input" type="date" value={form.startDate}
                onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs" style={{ color: 'var(--muted)' }}>Skiladagur</label>
              <input className="input" type="date" value={form.endDate}
                onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs" style={{ color: 'var(--muted)' }}>Verð (ISK) *</label>
            <input className="input" type="number" placeholder="7000" value={form.price}
              onChange={e => setForm(f => ({ ...f, price: e.target.value }))} />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs" style={{ color: 'var(--muted)' }}>Athugasemdir</label>
            <input className="input" placeholder="t.d. afhending kl. 14..." value={form.note}
              onChange={e => setForm(f => ({ ...f, note: e.target.value }))} />
          </div>

          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={form.paid}
              onChange={e => setForm(f => ({ ...f, paid: e.target.checked }))} />
            Greitt strax
          </label>

          <button type="submit" className="btn btn-primary w-full justify-center">
            <Plus size={16} /> Vista bókun
          </button>
        </form>
      )}

      {/* Upcoming bookings */}
      {upcomingBookings.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold px-1 mb-2" style={{ color: 'var(--accent)' }}>
            Væntanlegar bókanir ({upcomingBookings.length})
          </h3>
          <div className="flex flex-col gap-2">
            {upcomingBookings.map(b => (
              <BookingCard key={b.id} booking={b} onTogglePaid={togglePaid} onRemove={remove} />
            ))}
          </div>
        </div>
      )}

      {/* All bookings */}
      {recentBookings.length > 0 ? (
        <div>
          <div className="flex items-center justify-between px-1 mb-2">
            <h3 className="text-sm font-semibold">Allar bókanir</h3>
            <span className="text-xs" style={{ color: 'var(--muted)' }}>
              Samtals: {formatShortISK(totalRevenue())}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            {(showAll ? recentBookings : recentBookings.slice(0, 5)).map(b => (
              <BookingCard key={b.id} booking={b} onTogglePaid={togglePaid} onRemove={remove} />
            ))}
          </div>
          {recentBookings.length > 5 && (
            <button onClick={() => setShowAll(s => !s)}
              className="w-full mt-2 py-2 text-xs flex items-center justify-center gap-1"
              style={{ color: 'var(--muted)' }}>
              {showAll ? <><ChevronUp size={13} /> Minna</> : <><ChevronDown size={13} /> Sjá allt ({recentBookings.length})</>}
            </button>
          )}
        </div>
      ) : (
        <div className="card text-center py-10 flex flex-col items-center gap-3"
          style={{ color: 'var(--muted)' }}>
          <span className="text-4xl">🪑</span>
          <div>
            <div className="text-sm font-medium">Engar bókanir enn</div>
            <div className="text-xs mt-1">Smelltu á + Bókun til að skrá fyrstu bókunina</div>
          </div>
        </div>
      )}
    </div>
  )
}
