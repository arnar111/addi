import { useState } from 'react'
import { useLendo } from '../hooks/useLendo'
import { formatISK } from '../utils/currency'
import { Plus, Trash2, X, Check, Calendar, Package } from 'lucide-react'

function BookingCard({ booking, onTogglePaid, onRemove }) {
  const isPast = new Date(booking.endDate) < new Date()
  return (
    <div
      className="card flex flex-col gap-3 py-3"
      style={{
        opacity: isPast && booking.paid ? 0.6 : 1,
        borderColor: booking.paid ? 'rgba(34,197,94,0.25)' : 'var(--border)',
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm">{booking.customerName}</div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--text2)' }}>{booking.itemName}</div>
          {booking.note && <div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>{booking.note}</div>}
        </div>
        <div className="text-right shrink-0">
          <div className="font-bold" style={{ color: '#fb923c' }}>{formatISK(booking.total)}</div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>{booking.days} dag{booking.days !== 1 ? 'ar' : 'ur'}</div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Calendar size={12} style={{ color: 'var(--muted)' }} />
        <span className="text-xs" style={{ color: 'var(--text2)' }}>
          {new Date(booking.startDate).toLocaleDateString('is-IS', { weekday: 'short', month: 'short', day: 'numeric' })}
          {booking.startDate !== booking.endDate && (
            ` – ${new Date(booking.endDate).toLocaleDateString('is-IS', { weekday: 'short', month: 'short', day: 'numeric' })}`
          )}
        </span>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onTogglePaid(booking.id)}
          className="btn text-xs py-1.5 flex-1 justify-center"
          style={{
            background: booking.paid ? 'rgba(34,197,94,0.12)' : 'rgba(0,212,170,0.1)',
            color: booking.paid ? 'var(--success)' : 'var(--accent)',
            border: `1px solid ${booking.paid ? 'rgba(34,197,94,0.25)' : 'rgba(0,212,170,0.2)'}`,
          }}
        >
          <Check size={12} />
          {booking.paid ? 'Greitt ✓' : 'Merkja greitt'}
        </button>
        <button onClick={() => onRemove(booking.id)} className="btn btn-ghost py-1.5 px-3">
          <Trash2 size={13} style={{ color: 'var(--muted)' }} />
        </button>
      </div>
    </div>
  )
}

export default function Lendo() {
  const {
    bookings, items,
    addBooking, togglePaid, removeBooking,
    monthlyRevenue, upcomingBookings, totalRevenue, unpaidRevenue,
  } = useLendo()

  const [showForm, setShowForm] = useState(false)
  const [tab, setTab] = useState('upcoming')
  const [form, setForm] = useState({ customerName: '', itemId: '', startDate: '', endDate: '', note: '' })

  const handleAdd = (e) => {
    e.preventDefault()
    if (!form.customerName || !form.itemId || !form.startDate || !form.endDate) return
    addBooking(form)
    setForm({ customerName: '', itemId: '', startDate: '', endDate: '', note: '' })
    setShowForm(false)
  }

  const upcoming = upcomingBookings()
  const past = bookings
    .filter(b => new Date(b.endDate) < new Date())
    .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))

  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between px-1 pt-4">
        <div>
          <h1 className="text-xl font-semibold flex items-center gap-2">
            🏠 Lendó
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text2)' }}>
            Búnaðarleiga · Reykjavík
          </p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          <Plus size={16} /> Pöntun
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="card-sm text-center">
          <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Þessi mánuður</div>
          <div className="text-lg font-bold" style={{ color: '#fb923c' }}>{formatISK(monthlyRevenue())}</div>
        </div>
        <div className="card-sm text-center">
          <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Ógreitt</div>
          <div className="text-lg font-bold" style={{ color: unpaidRevenue() > 0 ? 'var(--danger)' : 'var(--muted)' }}>
            {formatISK(unpaidRevenue())}
          </div>
        </div>
        <div className="card-sm text-center">
          <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Komandi</div>
          <div className="text-lg font-bold" style={{ color: 'var(--accent)' }}>{upcoming.length}</div>
        </div>
      </div>

      {/* Add booking form */}
      {showForm && (
        <form onSubmit={handleAdd} className="card flex flex-col gap-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Ný pöntun</h3>
            <button type="button" onClick={() => setShowForm(false)}>
              <X size={16} style={{ color: 'var(--muted)' }} />
            </button>
          </div>

          <input
            className="input"
            placeholder="Nafn viðskiptavinar"
            value={form.customerName}
            onChange={e => setForm(f => ({ ...f, customerName: e.target.value }))}
            required
            autoFocus
          />

          <div>
            <label className="text-xs mb-1 block" style={{ color: 'var(--muted)' }}>Hlutur</label>
            <div className="grid grid-cols-2 gap-2">
              {items.map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, itemId: item.id }))}
                  className="flex items-center gap-2 p-3 rounded-xl text-left transition-all"
                  style={{
                    background: form.itemId === item.id ? 'rgba(249,115,22,0.12)' : 'var(--surface2)',
                    border: `1px solid ${form.itemId === item.id ? 'rgba(249,115,22,0.3)' : 'transparent'}`,
                  }}
                >
                  <span>{item.emoji}</span>
                  <div className="min-w-0">
                    <div className="text-xs font-medium leading-tight truncate">{item.name}</div>
                    <div className="text-xs" style={{ color: 'var(--muted)' }}>{formatISK(item.pricePerDay)}/dag</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs mb-1 block" style={{ color: 'var(--muted)' }}>Frá</label>
              <input type="date" className="input text-sm" value={form.startDate} min={today}
                onChange={e => setForm(f => ({ ...f, startDate: e.target.value, endDate: e.target.value }))} required />
            </div>
            <div>
              <label className="text-xs mb-1 block" style={{ color: 'var(--muted)' }}>Til</label>
              <input type="date" className="input text-sm" value={form.endDate} min={form.startDate || today}
                onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} required />
            </div>
          </div>

          {form.startDate && form.endDate && form.itemId && (() => {
            const item = items.find(i => i.id === form.itemId)
            const days = Math.max(1, Math.round((new Date(form.endDate) - new Date(form.startDate)) / 86400000) + 1)
            const total = days * (item?.pricePerDay || 0)
            return (
              <div className="flex justify-between text-sm p-3 rounded-xl" style={{ background: 'rgba(249,115,22,0.08)' }}>
                <span style={{ color: 'var(--muted)' }}>{days} dag{days !== 1 ? 'ar' : 'ur'}</span>
                <span className="font-bold" style={{ color: '#fb923c' }}>{formatISK(total)}</span>
              </div>
            )
          })()}

          <input
            className="input text-sm"
            placeholder="Athugasemdir (valkvæmt)"
            value={form.note}
            onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
          />

          <button type="submit" className="btn btn-primary w-full justify-center">Bæta við pöntun</button>
        </form>
      )}

      {/* Tabs */}
      <div className="tab-strip">
        <button className={tab === 'upcoming' ? 'active' : ''} onClick={() => setTab('upcoming')}>
          Komandi ({upcoming.length})
        </button>
        <button className={tab === 'past' ? 'active' : ''} onClick={() => setTab('past')}>
          Liðnar ({past.length})
        </button>
        <button className={tab === 'items' ? 'active' : ''} onClick={() => setTab('items')}>
          <Package size={13} style={{ display: 'inline', marginRight: 4 }} />Hlutir
        </button>
      </div>

      {/* Content */}
      {tab === 'upcoming' && (
        <div className="flex flex-col gap-3">
          {upcoming.length === 0 ? (
            <div className="card text-center py-10" style={{ color: 'var(--muted)' }}>
              <div className="text-3xl mb-2">📅</div>
              <p>Engar komandi pantanir</p>
            </div>
          ) : upcoming.map(b => (
            <BookingCard key={b.id} booking={b} onTogglePaid={togglePaid} onRemove={removeBooking} />
          ))}
        </div>
      )}

      {tab === 'past' && (
        <div className="flex flex-col gap-3">
          {past.length === 0 ? (
            <div className="card text-center py-10" style={{ color: 'var(--muted)' }}>
              <div className="text-3xl mb-2">📦</div>
              <p>Engar liðnar pantanir</p>
            </div>
          ) : past.map(b => (
            <BookingCard key={b.id} booking={b} onTogglePaid={togglePaid} onRemove={removeBooking} />
          ))}
        </div>
      )}

      {tab === 'items' && (
        <div className="flex flex-col gap-3">
          {items.map(item => (
            <div key={item.id} className="card flex items-center gap-3 py-3">
              <span className="text-2xl">{item.emoji}</span>
              <div className="flex-1">
                <div className="font-medium text-sm">{item.name}</div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{formatISK(item.pricePerDay)} á dag</div>
              </div>
              <div className="text-sm font-bold" style={{ color: '#fb923c' }}>{formatISK(item.pricePerDay)}/dag</div>
            </div>
          ))}
          <p className="text-xs text-center" style={{ color: 'var(--muted)' }}>
            Hlutar eru skilgreindir í kóðanum · breyta þarf þar til viðmót er tilbúið
          </p>
        </div>
      )}
    </div>
  )
}
