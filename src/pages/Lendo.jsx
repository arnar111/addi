import { useState } from 'react'
import { useLendo, DEFAULT_ITEMS } from '../hooks/useLendo'
import { formatISK, formatShortISK } from '../utils/currency'
import { Plus, Trash2, X, Check, Calendar, Phone, Package } from 'lucide-react'

function BookingCard({ booking, onTogglePaid, onRemove }) {
  const item = DEFAULT_ITEMS.find(i => i.id === booking.itemId) || DEFAULT_ITEMS[0]
  const startDate = new Date(booking.startDate)
  const isPast = startDate < new Date()

  return (
    <div className="card flex flex-col gap-2"
         style={{ borderColor: booking.paid ? 'rgba(34,197,94,0.3)' : isPast && !booking.paid ? 'rgba(239,68,68,0.3)' : 'var(--border)' }}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="font-semibold text-sm truncate">{booking.customerName}</span>
            <span className={`badge text-xs shrink-0 ${booking.paid ? 'bg-green-500/15 text-green-400' : isPast ? 'bg-red-500/15 text-red-400' : 'bg-yellow-500/15 text-yellow-400'}`}>
              {booking.paid ? 'Greitt' : isPast ? 'Í vanskilum' : 'Ógreitt'}
            </span>
          </div>
          <div className="text-xs flex items-center gap-1" style={{ color: 'var(--muted)' }}>
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </div>
          <div className="flex gap-3 mt-1.5">
            <span className="text-xs flex items-center gap-1" style={{ color: 'var(--muted)' }}>
              <Calendar size={11} />
              {startDate.toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })}
              {booking.days > 1 ? ` – ${new Date(booking.endDate).toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })}` : ''}
            </span>
            {booking.phone && (
              <a href={`tel:${booking.phone}`} className="text-xs flex items-center gap-1" style={{ color: 'var(--accent)' }}>
                <Phone size={11} /> {booking.phone}
              </a>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <span className="font-semibold text-sm">{formatISK(booking.totalPrice)}</span>
          <span className="text-xs" style={{ color: 'var(--muted)' }}>{booking.days} dag{booking.days > 1 ? 'ar' : 'ur'}</span>
        </div>
      </div>
      {booking.note && (
        <p className="text-xs px-2 py-1.5 rounded-lg" style={{ background: 'var(--surface2)', color: 'var(--muted)' }}>{booking.note}</p>
      )}
      <div className="flex gap-2 pt-1" style={{ borderTop: '1px solid var(--border)' }}>
        <button onClick={() => onTogglePaid(booking.id)}
          className={`btn text-xs flex-1 justify-center py-1.5 ${booking.paid ? 'btn-ghost' : 'btn-primary'}`}>
          {booking.paid ? <><X size={12} /> Afturkalla</> : <><Check size={12} /> Merkja sem greitt</>}
        </button>
        <button onClick={() => onRemove(booking.id)} className="btn btn-ghost py-1.5 px-3" style={{ color: 'var(--muted)' }}>
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  )
}

export default function Lendo() {
  const { bookings, addBooking, togglePaid, removeBooking, items, monthlyGoal, monthlyIncome, pendingAmount, upcomingBookings, totalRevenue } = useLendo()
  const [showForm, setShowForm] = useState(false)
  const [tab, setTab] = useState('upcoming')
  const [form, setForm] = useState({ customerName: '', phone: '', itemId: 'party-set', startDate: '', days: 1, note: '' })

  const income = monthlyIncome()
  const pending = pendingAmount()
  const pct = Math.min(100, Math.round((income / monthlyGoal) * 100))
  const upcoming = upcomingBookings()

  const selectedItem = items.find(i => i.id === form.itemId) || items[0]
  const totalPrice = (selectedItem?.pricePerDay || 7000) * Number(form.days || 1)

  const endDate = () => {
    if (!form.startDate || !form.days) return ''
    const d = new Date(form.startDate)
    d.setDate(d.getDate() + Number(form.days) - 1)
    return d.toISOString().split('T')[0]
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.customerName || !form.startDate) return
    addBooking({
      ...form,
      days: Number(form.days),
      totalPrice,
      endDate: endDate(),
    })
    setForm({ customerName: '', phone: '', itemId: 'party-set', startDate: '', days: 1, note: '' })
    setShowForm(false)
    setTab('upcoming')
  }

  const displayBookings = tab === 'upcoming' ? upcoming
    : tab === 'unpaid' ? bookings.filter(b => !b.paid)
    : bookings

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold">Lendó</h1>
            <span className="badge text-xs" style={{ background: 'rgba(0,212,170,0.12)', color: 'var(--accent)' }}>Leiga</span>
          </div>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>Leigurekstur · {new Date().toLocaleDateString('is-IS', { month: 'long', year: 'numeric' })}</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          <Plus size={16} /> Bókun
        </button>
      </div>

      {/* Monthly income overview */}
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.08), rgba(139,92,246,0.06))' }}>
        <div className="flex justify-between items-start mb-3">
          <div>
            <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Tekjur þessa mánaðar</div>
            <div className="text-3xl font-semibold">{formatISK(income)}</div>
          </div>
          <div className="text-right">
            <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Markmið</div>
            <div className="text-lg font-semibold" style={{ color: 'var(--accent)' }}>{formatShortISK(monthlyGoal)}</div>
          </div>
        </div>
        <div className="h-2.5 rounded-full overflow-hidden mb-1.5" style={{ background: 'var(--surface2)' }}>
          <div className="h-full rounded-full transition-all"
               style={{ width: `${pct}%`, background: 'var(--accent)' }} />
        </div>
        <div className="flex justify-between text-xs" style={{ color: 'var(--muted)' }}>
          <span>{pct}% af markmiði</span>
          {pending > 0 && <span style={{ color: '#f97316' }}>+ {formatISK(pending)} ógreitt</span>}
        </div>
        <div className="grid grid-cols-3 gap-2 mt-3">
          {[
            { label: 'Bókanir', value: bookings.filter(b => { const d = new Date(b.startDate); const n = new Date(); return d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear() }).length },
            { label: 'Ógreidd', value: bookings.filter(b => !b.paid).length },
            { label: 'Heildarins', value: formatShortISK(totalRevenue()) },
          ].map(s => (
            <div key={s.label} className="flex flex-col items-center py-2 rounded-xl" style={{ background: 'var(--surface2)' }}>
              <span className="font-semibold text-sm">{s.value}</span>
              <span className="text-xs" style={{ color: 'var(--muted)' }}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Add booking form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="card flex flex-col gap-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Ný bókun</h3>
            <button type="button" onClick={() => setShowForm(false)}><X size={16} style={{ color: 'var(--muted)' }} /></button>
          </div>
          <input className="input" placeholder="Nafn viðskiptavinar *" value={form.customerName}
            onChange={e => setForm(f => ({ ...f, customerName: e.target.value }))} required autoFocus />
          <input className="input" type="tel" placeholder="Símanúmer" value={form.phone}
            onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
          <div>
            <label className="text-xs mb-1 block" style={{ color: 'var(--muted)' }}>Vara</label>
            <div className="flex flex-col gap-1.5">
              {items.map(item => (
                <button key={item.id} type="button"
                  onClick={() => setForm(f => ({ ...f, itemId: item.id }))}
                  className="flex items-center justify-between p-3 rounded-xl text-sm transition-all"
                  style={{
                    background: form.itemId === item.id ? 'rgba(0,212,170,0.12)' : 'var(--surface2)',
                    border: `1px solid ${form.itemId === item.id ? 'rgba(0,212,170,0.3)' : 'transparent'}`,
                  }}>
                  <span>{item.icon} {item.label}</span>
                  <span style={{ color: 'var(--accent)' }}>{formatISK(item.pricePerDay)}/dag</span>
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs mb-1 block" style={{ color: 'var(--muted)' }}>Upphafsdagur *</label>
              <input className="input" type="date" value={form.startDate}
                onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} required />
            </div>
            <div>
              <label className="text-xs mb-1 block" style={{ color: 'var(--muted)' }}>Fjöldi daga</label>
              <input className="input" type="number" min={1} max={30} value={form.days}
                onChange={e => setForm(f => ({ ...f, days: e.target.value }))} />
            </div>
          </div>
          <input className="input" placeholder="Athugasemd (valkvæmt)" value={form.note}
            onChange={e => setForm(f => ({ ...f, note: e.target.value }))} />
          <div className="flex items-center justify-between py-2 px-3 rounded-xl" style={{ background: 'var(--surface2)' }}>
            <span className="text-sm" style={{ color: 'var(--muted)' }}>Heildarverð</span>
            <span className="font-semibold">{formatISK(totalPrice)}</span>
          </div>
          <button type="submit" className="btn btn-primary w-full justify-center">
            <Plus size={16} /> Stofna bókun
          </button>
        </form>
      )}

      {/* Tabs */}
      <div className="flex gap-2">
        {[['upcoming', 'Væntanlegar', upcoming.length], ['unpaid', 'Ógreidd', bookings.filter(b => !b.paid).length], ['all', 'Allar', bookings.length]].map(([t, l, count]) => (
          <button key={t} onClick={() => setTab(t)}
            className="btn text-xs flex-1 justify-center py-1.5 relative"
            style={{
              background: tab === t ? 'rgba(0,212,170,0.12)' : 'var(--surface)',
              color: tab === t ? 'var(--accent)' : 'var(--muted)',
              border: `1px solid ${tab === t ? 'rgba(0,212,170,0.25)' : 'var(--border)'}`,
            }}>
            {l}
            {count > 0 && (
              <span className="ml-1 px-1.5 py-0.5 rounded-full text-xs font-bold"
                    style={{ background: tab === t ? 'rgba(0,212,170,0.25)' : 'var(--surface2)', fontSize: 10 }}>
                {count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Bookings list */}
      {displayBookings.length === 0 ? (
        <div className="card text-center py-10 flex flex-col items-center gap-3">
          <Package size={32} style={{ color: 'var(--muted)' }} />
          <p style={{ color: 'var(--muted)' }}>
            {tab === 'upcoming' ? 'Engar væntanlegar bókanir' : tab === 'unpaid' ? 'Allt greitt!' : 'Engar bókanir ennþá'}
          </p>
          {tab !== 'unpaid' && (
            <button onClick={() => setShowForm(true)} className="btn btn-primary text-sm">
              <Plus size={14} /> Bæta við bókun
            </button>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {displayBookings.map(b => (
            <BookingCard key={b.id} booking={b} onTogglePaid={togglePaid} onRemove={removeBooking} />
          ))}
        </div>
      )}
    </div>
  )
}
