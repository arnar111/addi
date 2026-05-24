import { useState } from 'react'
import { useLendo, LENDO_ITEMS } from '../hooks/useLendo'
import { formatISK, formatShortISK } from '../utils/currency'
import { Plus, Trash2, Check, X, ChevronDown, TrendingUp } from 'lucide-react'

const STATUS_COLORS = {
  paid: { bg: 'rgba(34,197,94,0.12)', text: '#22c55e', label: 'Greitt' },
  pending: { bg: 'rgba(249,115,22,0.12)', text: '#f97316', label: 'Ógreitt' },
}

function BookingCard({ booking, onRemove, onTogglePaid }) {
  const item = LENDO_ITEMS.find(i => i.id === booking.item) || LENDO_ITEMS[0]
  const s = booking.paid ? STATUS_COLORS.paid : STATUS_COLORS.pending
  const start = new Date(booking.startDate)
  const end = new Date(booking.endDate || booking.startDate)
  const days = Math.max(1, Math.ceil((end - start) / 86400000) + 1)

  return (
    <div className="card flex flex-col gap-2 py-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <span className="text-xl shrink-0">{item.icon}</span>
          <div className="min-w-0">
            <div className="text-sm font-semibold truncate">{booking.customer}</div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>
              {item.name} · {days > 1 ? `${days} dagar` : '1 dagur'}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <span className="text-sm font-semibold">{formatISK(booking.amount)}</span>
          <span className="badge text-xs" style={{ background: s.bg, color: s.text }}>{s.label}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--muted)' }}>
        <span>
          {start.toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })}
          {booking.endDate && booking.endDate !== booking.startDate && (
            <> – {end.toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })}</>
          )}
        </span>
        {booking.note && <span className="truncate flex-1">· {booking.note}</span>}
      </div>

      <div className="flex gap-2 pt-1">
        <button onClick={() => onTogglePaid(booking.id)}
          className="btn flex-1 justify-center text-xs py-1.5"
          style={{
            background: booking.paid ? 'rgba(34,197,94,0.1)' : 'rgba(0,212,170,0.1)',
            color: booking.paid ? '#22c55e' : 'var(--accent)',
            border: `1px solid ${booking.paid ? 'rgba(34,197,94,0.3)' : 'rgba(0,212,170,0.3)'}`,
          }}>
          <Check size={12} /> {booking.paid ? 'Greitt ✓' : 'Merkja greitt'}
        </button>
        <button onClick={() => onRemove(booking.id)} className="btn btn-ghost px-3" style={{ color: 'var(--muted)' }}>
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  )
}

export default function Lendo() {
  const { bookings, addBooking, removeBooking, togglePaid,
          thisMonthBookings, monthlyIncome, monthlyPending, totalEarned, upcomingBookings } = useLendo()

  const [showForm, setShowForm] = useState(false)
  const [tab, setTab] = useState('upcoming')

  const [customer, setCustomer] = useState('')
  const [selectedItem, setSelectedItem] = useState('set')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [customAmount, setCustomAmount] = useState('')
  const [note, setNote] = useState('')

  const item = LENDO_ITEMS.find(i => i.id === selectedItem) || LENDO_ITEMS[0]
  const days = startDate && endDate
    ? Math.max(1, Math.ceil((new Date(endDate) - new Date(startDate)) / 86400000) + 1)
    : 1
  const isWeekend = days >= 2
  const suggestedAmount = isWeekend ? item.weekendPrice : item.price * days

  const handleAdd = (e) => {
    e.preventDefault()
    if (!customer.trim() || !startDate) return
    addBooking({
      customer: customer.trim(),
      item: selectedItem,
      startDate,
      endDate: endDate || startDate,
      amount: customAmount ? Number(customAmount) : suggestedAmount,
      note: note.trim(),
    })
    setCustomer('')
    setStartDate('')
    setEndDate('')
    setCustomAmount('')
    setNote('')
    setShowForm(false)
  }

  const income = monthlyIncome()
  const pending = monthlyPending()
  const total = totalEarned()
  const upcoming = upcomingBookings()
  const monthBookings = thisMonthBookings()

  const displayList = tab === 'upcoming' ? upcoming
    : tab === 'month' ? monthBookings
    : bookings

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold flex items-center gap-2">🪑 Lendó</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>Leiga á veisluáhöldum</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          <Plus size={16} /> Pöntun
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'Þessa mánaðar', value: formatShortISK(income), color: 'var(--accent)', icon: '✅' },
          { label: 'Ógreitt', value: formatShortISK(pending), color: pending > 0 ? '#f97316' : 'var(--muted)', icon: '⏳' },
          { label: 'Heildarlega', value: formatShortISK(total), color: 'var(--text)', icon: '📈' },
        ].map(({ label, value, color, icon }) => (
          <div key={label} className="card-sm flex flex-col gap-0.5 text-center">
            <span className="text-base">{icon}</span>
            <span className="text-sm font-bold" style={{ color }}>{value}</span>
            <span style={{ fontSize: 10, color: 'var(--muted)' }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Add form */}
      {showForm && (
        <form onSubmit={handleAdd} className="card flex flex-col gap-3 animate-slide-up">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-sm">Ný pöntun</h3>
            <button type="button" onClick={() => setShowForm(false)}>
              <X size={16} style={{ color: 'var(--muted)' }} />
            </button>
          </div>

          <input className="input" placeholder="Nafn viðskiptavinar" value={customer}
            onChange={e => setCustomer(e.target.value)} autoFocus required />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs" style={{ color: 'var(--muted)' }}>Vara</label>
            <div className="grid grid-cols-3 gap-1.5">
              {LENDO_ITEMS.map(it => (
                <button key={it.id} type="button" onClick={() => setSelectedItem(it.id)}
                  className="flex flex-col items-center gap-1 py-2.5 rounded-xl text-xs transition-all"
                  style={{
                    background: selectedItem === it.id ? 'rgba(0,212,170,0.12)' : 'var(--surface2)',
                    border: `1px solid ${selectedItem === it.id ? 'rgba(0,212,170,0.4)' : 'transparent'}`,
                    color: selectedItem === it.id ? 'var(--accent)' : 'var(--text)',
                  }}>
                  <span className="text-xl">{it.icon}</span>
                  <span className="font-medium text-center leading-tight">{it.name}</span>
                  <span style={{ color: 'var(--muted)', fontSize: 10 }}>{formatShortISK(it.price)}/dag</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <label className="text-xs" style={{ color: 'var(--muted)' }}>Upphafsdagur</label>
              <input className="input text-sm" type="date" value={startDate}
                onChange={e => setStartDate(e.target.value)} required />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs" style={{ color: 'var(--muted)' }}>Skiladagur</label>
              <input className="input text-sm" type="date" value={endDate}
                onChange={e => setEndDate(e.target.value)} min={startDate} />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs flex justify-between" style={{ color: 'var(--muted)' }}>
              <span>Upphæð</span>
              <span style={{ color: 'var(--accent)' }}>
                Tillaga: {formatISK(suggestedAmount)} ({days} dag{days > 1 ? 'ar' : 'ur'})
              </span>
            </label>
            <input className="input" type="number" placeholder={String(suggestedAmount)}
              value={customAmount} onChange={e => setCustomAmount(e.target.value)} />
          </div>

          <input className="input text-sm" placeholder="Athugasemd (valkvæmt)" value={note}
            onChange={e => setNote(e.target.value)} />

          <button type="submit" className="btn btn-primary w-full justify-center">
            <Plus size={16} /> Skrá pöntun
          </button>
        </form>
      )}

      {/* Items reference */}
      <div className="card-sm">
        <div className="text-xs font-medium mb-2" style={{ color: 'var(--muted)' }}>Vörur & verð</div>
        <div className="flex flex-col gap-2">
          {LENDO_ITEMS.map(it => (
            <div key={it.id} className="flex items-center gap-2">
              <span className="text-base">{it.icon}</span>
              <div className="flex-1">
                <div className="text-xs font-medium">{it.name}</div>
                <div className="text-xs" style={{ color: 'var(--muted)' }}>{it.desc}</div>
              </div>
              <div className="text-right">
                <div className="text-xs font-semibold" style={{ color: 'var(--accent)' }}>
                  {formatISK(it.price)}/dag
                </div>
                <div className="text-xs" style={{ color: 'var(--muted)' }}>
                  {formatISK(it.weekendPrice)}/helgar
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {[
          ['upcoming', '📅 Komandi'],
          ['month', '📆 Þessi mánuður'],
          ['all', '📋 Allt'],
        ].map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)}
            className="btn text-xs flex-1 justify-center py-2"
            style={{
              background: tab === t ? 'rgba(0,212,170,0.12)' : 'var(--surface)',
              color: tab === t ? 'var(--accent)' : 'var(--muted)',
              border: `1px solid ${tab === t ? 'rgba(0,212,170,0.3)' : 'var(--border)'}`,
            }}>{l}</button>
        ))}
      </div>

      {/* Booking list */}
      <div className="flex flex-col gap-3">
        {displayList.length === 0 ? (
          <div className="card text-center py-8" style={{ color: 'var(--muted)' }}>
            {tab === 'upcoming' ? 'Engar komandi pantanir' : 'Engar pantanir skráðar'} 📦
          </div>
        ) : displayList.map(b => (
          <BookingCard key={b.id} booking={b} onRemove={removeBooking} onTogglePaid={togglePaid} />
        ))}
      </div>
    </div>
  )
}
