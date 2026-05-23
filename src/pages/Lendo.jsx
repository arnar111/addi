import { useState } from 'react'
import { useLendo, DAILY_RATE } from '../hooks/useLendo'
import { formatISK } from '../utils/currency'
import { Plus, Trash2, X, CheckCircle, Circle, Phone } from 'lucide-react'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'Maí', 'Jún', 'Júl', 'Ágú', 'Sep', 'Okt', 'Nóv', 'Des']

function CalendarView({ bookings }) {
  const today = new Date()
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1))

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const firstDay = (new Date(year, month, 1).getDay() + 6) % 7 // Mon=0
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const isBooked = (day) => {
    const d = new Date(year, month, day)
    return bookings.some(b => {
      const s = new Date(b.startDate); s.setHours(0,0,0,0)
      const e = new Date(b.endDate); e.setHours(23,59,59,999)
      return d >= s && d <= e
    })
  }
  const isToday = (day) => {
    return today.getDate() === day && today.getMonth() === month && today.getFullYear() === year
  }

  const prev = () => setViewDate(new Date(year, month - 1, 1))
  const next = () => setViewDate(new Date(year, month + 1, 1))

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <button onClick={prev} className="p-1 rounded-lg" style={{ background: 'var(--surface2)' }}>
          <span style={{ color: 'var(--muted)' }}>‹</span>
        </button>
        <span className="font-semibold text-sm">{MONTHS[month]} {year}</span>
        <button onClick={next} className="p-1 rounded-lg" style={{ background: 'var(--surface2)' }}>
          <span style={{ color: 'var(--muted)' }}>›</span>
        </button>
      </div>
      <div className="grid grid-cols-7 gap-0.5 text-center mb-1">
        {['Mán', 'Þri', 'Mið', 'Fim', 'Fös', 'Lau', 'Sun'].map(d => (
          <div key={d} className="text-xs pb-1" style={{ color: 'var(--muted)' }}>{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1
          const booked = isBooked(day)
          const td = isToday(day)
          return (
            <div key={day}
              className="aspect-square flex items-center justify-center rounded-lg text-xs font-medium"
              style={{
                background: booked ? 'rgba(139,92,246,0.25)' : td ? 'rgba(0,212,170,0.15)' : 'transparent',
                color: booked ? '#a78bfa' : td ? 'var(--accent)' : 'var(--text)',
                border: td ? '1px solid rgba(0,212,170,0.4)' : '1px solid transparent',
              }}>
              {day}
            </div>
          )
        })}
      </div>
      <div className="flex gap-3 mt-3 text-xs" style={{ color: 'var(--muted)' }}>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded" style={{ background: 'rgba(139,92,246,0.25)' }} />
          Bókað
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded" style={{ background: 'rgba(0,212,170,0.15)', border: '1px solid rgba(0,212,170,0.4)' }} />
          Í dag
        </span>
      </div>
    </div>
  )
}

export default function Lendo() {
  const {
    bookings, addBooking, removeBooking, togglePaid,
    monthlyRevenue, paidRevenue, upcomingBookings,
    pendingAmount, totalBookings, avgPerBooking, DAILY_RATE,
  } = useLendo()

  const [showForm, setShowForm] = useState(false)
  const [tab, setTab] = useState('upcoming')
  const [form, setForm] = useState({
    customer: '', phone: '', startDate: '', endDate: '', note: '',
  })

  const handleAdd = (e) => {
    e.preventDefault()
    if (!form.customer || !form.startDate) return
    addBooking({ ...form, endDate: form.endDate || form.startDate })
    setForm({ customer: '', phone: '', startDate: '', endDate: '', note: '' })
    setShowForm(false)
  }

  const monthly = monthlyRevenue()
  const paid = paidRevenue()
  const pending = pendingAmount()
  const upcoming = upcomingBookings()
  const pastBookings = [...bookings]
    .filter(b => new Date(b.endDate) < new Date())
    .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))

  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold">🪑 Lendó</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>Leigurekstur · {DAILY_RATE.toLocaleString('is-IS')} kr/dag</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          <Plus size={16} /> Bókun
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="card" style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(0,212,170,0.05))' }}>
          <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Þessi mánuður</div>
          <div className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>{formatISK(monthly)}</div>
          <div className="text-xs mt-0.5" style={{ color: paid > 0 ? 'var(--success)' : 'var(--muted)' }}>
            {formatISK(paid)} greitt
          </div>
        </div>
        <div className="card">
          <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Ógreitt</div>
          <div className="text-2xl font-bold" style={{ color: pending > 0 ? '#f97316' : 'var(--muted)' }}>{formatISK(pending)}</div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
            {totalBookings} bókanir samtals
          </div>
        </div>
      </div>

      {/* Add form */}
      {showForm && (
        <form onSubmit={handleAdd} className="card flex flex-col gap-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Ný bókun</h3>
            <button type="button" onClick={() => setShowForm(false)}>
              <X size={16} style={{ color: 'var(--muted)' }} />
            </button>
          </div>
          <input className="input" placeholder="Nafn viðskiptavinar *" value={form.customer}
            onChange={e => setForm(f => ({ ...f, customer: e.target.value }))} required autoFocus />
          <input className="input" placeholder="Símanúmer" value={form.phone}
            onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} type="tel" />
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs mb-1 block" style={{ color: 'var(--muted)' }}>Frá *</label>
              <input className="input" type="date" min={today} value={form.startDate}
                onChange={e => setForm(f => ({ ...f, startDate: e.target.value, endDate: f.endDate || e.target.value }))} required />
            </div>
            <div>
              <label className="text-xs mb-1 block" style={{ color: 'var(--muted)' }}>Til</label>
              <input className="input" type="date" min={form.startDate || today} value={form.endDate}
                onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} />
            </div>
          </div>
          {form.startDate && (
            <div className="text-sm px-1" style={{ color: 'var(--accent)' }}>
              {(() => {
                const s = new Date(form.startDate)
                const e = new Date(form.endDate || form.startDate)
                const days = Math.max(1, Math.ceil((e - s) / (1000 * 60 * 60 * 24)) + 1)
                return `${days} ${days === 1 ? 'dagur' : 'dagar'} · ${formatISK(days * DAILY_RATE)}`
              })()}
            </div>
          )}
          <input className="input" placeholder="Athugasemd" value={form.note}
            onChange={e => setForm(f => ({ ...f, note: e.target.value }))} />
          <button type="submit" className="btn btn-primary w-full justify-center">Skrá bókun</button>
        </form>
      )}

      {/* Calendar */}
      <CalendarView bookings={bookings} />

      {/* Tabs */}
      <div className="flex gap-2">
        {[['upcoming', 'Komandi'], ['past', 'Liðnar']].map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)}
            className="btn text-sm flex-1 justify-center"
            style={{
              background: tab === t ? 'rgba(139,92,246,0.12)' : 'var(--surface)',
              color: tab === t ? '#a78bfa' : 'var(--muted)',
              border: `1px solid ${tab === t ? 'rgba(139,92,246,0.25)' : 'var(--border)'}`,
            }}>{l} {tab === t && `(${t === 'upcoming' ? upcoming.length : pastBookings.length})`}</button>
        ))}
      </div>

      {/* Booking list */}
      <div className="flex flex-col gap-2">
        {(tab === 'upcoming' ? upcoming : pastBookings).length === 0 ? (
          <div className="card text-center py-8" style={{ color: 'var(--muted)' }}>
            {tab === 'upcoming' ? 'Engar komandi bókanir' : 'Engar liðnar bókanir'}
          </div>
        ) : (tab === 'upcoming' ? upcoming : pastBookings).map(b => (
          <div key={b.id} className="card flex flex-col gap-2 py-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm">{b.customer}</div>
                {b.phone && (
                  <a href={`tel:${b.phone}`} className="flex items-center gap-1 text-xs" style={{ color: 'var(--muted)' }}>
                    <Phone size={10} /> {b.phone}
                  </a>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => togglePaid(b.id)} title={b.paid ? 'Merkja ógreitt' : 'Merkja greitt'}>
                  {b.paid
                    ? <CheckCircle size={18} style={{ color: 'var(--success)' }} />
                    : <Circle size={18} style={{ color: 'var(--muted)' }} />
                  }
                </button>
                <button onClick={() => removeBooking(b.id)} style={{ color: 'var(--muted)' }}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--muted)' }}>
              <span>📅 {new Date(b.startDate).toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })}
                {b.startDate !== b.endDate ? ` – ${new Date(b.endDate).toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })}` : ''}
              </span>
              <span>· {b.days} {b.days === 1 ? 'dagur' : 'dagar'}</span>
            </div>
            {b.note && <div className="text-xs" style={{ color: 'var(--muted)' }}>💬 {b.note}</div>}
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold" style={{ color: 'var(--accent)' }}>{formatISK(b.amount)}</span>
              <span className="badge" style={{
                background: b.paid ? 'rgba(34,197,94,0.15)' : 'rgba(249,115,22,0.15)',
                color: b.paid ? 'var(--success)' : '#f97316',
              }}>
                {b.paid ? 'Greitt' : 'Ógreitt'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
