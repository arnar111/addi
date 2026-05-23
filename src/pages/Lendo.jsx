import { useState } from 'react'
import { Package, Plus, X, ChevronRight, Calendar, User, Trash2, CheckCircle, XCircle } from 'lucide-react'
import { useLendo } from '../hooks/useLendo'
import { formatISK, formatShortISK } from '../utils/currency'
import { format } from 'date-fns'

const TABS = [
  { id: 'upcoming', label: 'Væntanlegar' },
  { id: 'month', label: 'Þessi mánuður' },
  { id: 'all', label: 'Allar' },
]

const STATUS_BADGE = {
  upcoming: { label: 'Væntanleg', bg: 'rgba(0,212,170,0.15)', color: 'var(--accent)' },
  done: { label: 'Lokið', bg: 'rgba(34,197,94,0.15)', color: 'var(--success)' },
  cancelled: { label: 'Aflýst', bg: 'rgba(239,68,68,0.15)', color: 'var(--danger)' },
}

function BookingCard({ booking, onDelete, onStatus }) {
  const badge = STATUS_BADGE[booking.status]
  const dateStr = (() => {
    try { return format(new Date(booking.date), 'd. MMM yyyy') } catch { return booking.date }
  })()

  return (
    <div className="card-sm flex flex-col gap-2 animate-slide-up">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-0.5">
          <span className="font-semibold text-sm">{booking.customer}</span>
          <span className="text-xs flex items-center gap-1" style={{ color: 'var(--muted)' }}>
            <Calendar size={11} /> {dateStr}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-bold text-base" style={{ color: 'var(--accent)' }}>
            {formatShortISK(booking.amount)}
          </span>
          <button onClick={() => onDelete(booking.id)} className="btn btn-danger p-1.5 rounded-lg">
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs" style={{ color: 'var(--muted)' }}>{booking.items}</span>
        <span className="badge text-xs" style={{ background: badge.bg, color: badge.color }}>
          {badge.label}
        </span>
      </div>

      {booking.note ? (
        <div className="text-xs px-2 py-1.5 rounded-lg" style={{ background: 'var(--surface2)', color: 'var(--muted)' }}>
          {booking.note}
        </div>
      ) : null}

      {booking.status === 'upcoming' && (
        <div className="flex gap-2 pt-1">
          <button onClick={() => onStatus(booking.id, 'done')}
            className="btn btn-ghost text-xs py-1 px-3 flex-1 flex items-center justify-center gap-1"
            style={{ color: 'var(--success)', borderColor: 'rgba(34,197,94,0.3)' }}>
            <CheckCircle size={13} /> Lokið
          </button>
          <button onClick={() => onStatus(booking.id, 'cancelled')}
            className="btn btn-ghost text-xs py-1 px-3 flex-1 flex items-center justify-center gap-1"
            style={{ color: 'var(--danger)', borderColor: 'rgba(239,68,68,0.3)' }}>
            <XCircle size={13} /> Aflýsa
          </button>
        </div>
      )}
    </div>
  )
}

function AddBookingForm({ onAdd, onClose }) {
  const today = new Date().toISOString().split('T')[0]
  const [form, setForm] = useState({
    date: today,
    customer: '',
    amount: '7000',
    items: 'Borð + 10 stólar',
    note: '',
  })

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.customer.trim() || !form.date) return
    onAdd(form)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4"
         style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
         onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="card w-full max-w-md animate-slide-up" style={{ borderColor: 'rgba(0,212,170,0.3)' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg flex items-center gap-2">
            <Package size={20} style={{ color: 'var(--accent)' }} /> Ný bókun
          </h2>
          <button onClick={onClose} className="btn btn-ghost p-2 rounded-xl">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="text-xs mb-1 block" style={{ color: 'var(--muted)' }}>Dagsetning</label>
            <input type="date" className="input" value={form.date}
              onChange={e => set('date', e.target.value)} required />
          </div>

          <div>
            <label className="text-xs mb-1 block" style={{ color: 'var(--muted)' }}>Viðskiptavinur</label>
            <input type="text" className="input" placeholder="Nafn..." value={form.customer}
              onChange={e => set('customer', e.target.value)} required autoFocus />
          </div>

          <div>
            <label className="text-xs mb-1 block" style={{ color: 'var(--muted)' }}>Upphæð (kr.)</label>
            <input type="number" className="input" value={form.amount}
              onChange={e => set('amount', e.target.value)} min="0" />
          </div>

          <div>
            <label className="text-xs mb-1 block" style={{ color: 'var(--muted)' }}>Hlutir</label>
            <input type="text" className="input" value={form.items}
              onChange={e => set('items', e.target.value)} />
          </div>

          <div>
            <label className="text-xs mb-1 block" style={{ color: 'var(--muted)' }}>Athugasemd</label>
            <input type="text" className="input" placeholder="Valfrjálst..." value={form.note}
              onChange={e => set('note', e.target.value)} />
          </div>

          <div className="flex gap-3 mt-1">
            <button type="button" onClick={onClose} className="btn btn-ghost flex-1">Hætta við</button>
            <button type="submit" className="btn btn-primary flex-1">
              <Plus size={16} /> Bóka
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function Lendo() {
  const { allBookings, addBooking, removeBooking, updateBookingStatus,
    currentMonthBookings, monthlyIncome, upcomingBookings, monthlyTarget } = useLendo()
  const [tab, setTab] = useState('upcoming')
  const [showForm, setShowForm] = useState(false)

  const income = monthlyIncome()
  const pct = Math.min(100, Math.round((income / monthlyTarget) * 100))
  const isParty = pct >= 100
  const barColor = isParty ? 'var(--success)' : pct >= 80 ? '#f97316' : pct >= 50 ? 'var(--accent)' : 'var(--accent)'
  const monthBookings = currentMonthBookings()
  const upcoming = upcomingBookings()

  const visibleBookings = tab === 'upcoming' ? upcoming
    : tab === 'month' ? monthBookings
    : allBookings

  const avgAmount = monthBookings.filter(b => b.status !== 'cancelled').length > 0
    ? Math.round(income / monthBookings.filter(b => b.status !== 'cancelled').length)
    : 0

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="px-1 pt-2 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                 style={{ background: 'rgba(0,212,170,0.15)' }}>
              <Package size={20} style={{ color: 'var(--accent)' }} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Lendó</h1>
              <p className="text-xs" style={{ color: 'var(--muted)' }}>Leigubúnaður</p>
            </div>
          </div>
        </div>
        <button onClick={() => setShowForm(true)} className="btn btn-primary gap-2">
          <Plus size={16} /> Bóka
        </button>
      </div>

      <div className="card" style={{
        background: 'linear-gradient(135deg, rgba(0,212,170,0.08), rgba(139,92,246,0.06))',
        borderColor: isParty ? 'rgba(34,197,94,0.4)' : 'var(--border)',
      }}>
        <div className="flex items-start justify-between mb-2">
          <div>
            <div className="text-xs mb-0.5" style={{ color: 'var(--muted)' }}>Tekjur þessa mánaðar</div>
            <div className="text-3xl font-bold" style={{ color: isParty ? 'var(--success)' : 'var(--text)' }}>
              {formatShortISK(income)} {isParty && '🎉'}
            </div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
              af {formatShortISK(monthlyTarget)} marki
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold" style={{
              color: isParty ? 'var(--success)' : pct >= 80 ? '#f97316' : 'var(--accent)'
            }}>{pct}%</div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>náð</div>
          </div>
        </div>

        <div className="h-3 rounded-full overflow-hidden" style={{ background: 'var(--surface2)' }}>
          <div className="h-full rounded-full transition-all duration-700"
               style={{ width: `${pct}%`, background: barColor }} />
        </div>

        {isParty && (
          <div className="text-xs mt-2 font-semibold text-center" style={{ color: 'var(--success)' }}>
            Frábært! Marki náð! 🎉
          </div>
        )}
        {!isParty && (
          <div className="text-xs mt-1.5" style={{ color: 'var(--muted)' }}>
            {formatShortISK(monthlyTarget - income)} eftir að marki
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="card-sm text-center">
          <div className="text-xl font-bold" style={{ color: 'var(--accent)' }}>
            {monthBookings.filter(b => b.status !== 'cancelled').length}
          </div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>Bókanir</div>
        </div>
        <div className="card-sm text-center">
          <div className="text-xl font-bold" style={{ color: 'var(--accent2)' }}>
            {formatShortISK(income)}
          </div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>Tekjur</div>
        </div>
        <div className="card-sm text-center">
          <div className="text-xl font-bold" style={{ color: 'var(--accent3)' }}>
            {avgAmount > 0 ? formatShortISK(avgAmount) : '—'}
          </div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>Meðaltal</div>
        </div>
      </div>

      <div className="flex rounded-xl overflow-hidden" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className="flex-1 py-2.5 text-sm font-medium transition-all"
            style={{
              background: tab === t.id ? 'var(--accent)' : 'transparent',
              color: tab === t.id ? '#000' : 'var(--muted)',
            }}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {visibleBookings.length === 0 ? (
          <div className="card text-center py-10">
            <Package size={36} className="mx-auto mb-3" style={{ color: 'var(--muted)' }} />
            <div className="font-semibold mb-1">Engar bókanir</div>
            <div className="text-sm" style={{ color: 'var(--muted)' }}>
              {tab === 'upcoming' ? 'Engar væntanlegar leigur. Bættu við bókun!' : 'Engar bókanir fundust.'}
            </div>
          </div>
        ) : (
          visibleBookings.map(b => (
            <BookingCard key={b.id} booking={b}
              onDelete={removeBooking}
              onStatus={updateBookingStatus} />
          ))
        )}
      </div>

      {showForm && <AddBookingForm onAdd={addBooking} onClose={() => setShowForm(false)} />}
    </div>
  )
}
