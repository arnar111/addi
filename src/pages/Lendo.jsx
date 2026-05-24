import { useState } from 'react'
import { useLendo } from '../hooks/useLendo'
import { formatISK, formatShortISK } from '../utils/currency'
import { Plus, Trash2, X, Check, ChevronDown, ChevronUp, TrendingUp, Clock, CheckCircle2 } from 'lucide-react'

const STATUS_COLORS = {
  paid: 'var(--success)',
  pending: '#f97316',
}

function daysCount(start, end) {
  if (!start || !end) return 1
  return Math.max(1, Math.ceil((new Date(end) - new Date(start)) / 86400000) + 1)
}

function BookingCard({ booking, equipment, onRemove, onTogglePaid }) {
  const [expanded, setExpanded] = useState(false)
  const eq = (booking.equipmentIds || [])
    .map(id => equipment.find(e => e.id === id))
    .filter(Boolean)
  const days = daysCount(booking.startDate, booking.endDate)
  const isPast = new Date(booking.startDate) < new Date(new Date().setHours(0, 0, 0, 0))

  return (
    <div className="card flex flex-col gap-0" style={{
      borderColor: booking.paid ? 'rgba(34,197,94,0.2)' : isPast ? 'rgba(239,68,68,0.15)' : 'var(--border)',
    }}>
      <div className="flex items-center gap-3" onClick={() => setExpanded(!expanded)} style={{ cursor: 'pointer' }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
             style={{ background: booking.paid ? 'rgba(34,197,94,0.12)' : 'rgba(249,115,22,0.12)' }}>
          {booking.paid ? '✅' : '⏳'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold truncate">{booking.customer}</div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>
            {new Date(booking.startDate).toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })}
            {booking.endDate && booking.endDate !== booking.startDate
              ? ` – ${new Date(booking.endDate).toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })}` : ''}
            {' '}· {days} {days === 1 ? 'dagur' : 'dagar'}
          </div>
        </div>
        <div className="flex flex-col items-end gap-0.5 shrink-0">
          <span className="text-sm font-semibold">{formatShortISK(booking.totalPrice || 0)}</span>
          <span className="text-xs" style={{ color: booking.paid ? 'var(--success)' : '#f97316' }}>
            {booking.paid ? 'Greitt' : 'Ógreitt'}
          </span>
        </div>
        {expanded ? <ChevronUp size={14} style={{ color: 'var(--muted)', shrink: 0 }} /> : <ChevronDown size={14} style={{ color: 'var(--muted)' }} />}
      </div>

      {expanded && (
        <div className="flex flex-col gap-2 mt-3 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
          {eq.length > 0 && (
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium" style={{ color: 'var(--muted)' }}>Tæki</span>
              <div className="flex flex-wrap gap-1">
                {eq.map(e => (
                  <span key={e.id} className="badge text-xs px-2 py-0.5" style={{ background: 'var(--surface2)', color: 'var(--text)' }}>
                    {e.icon} {e.name}
                  </span>
                ))}
              </div>
            </div>
          )}
          {booking.phone && (
            <div className="text-xs" style={{ color: 'var(--muted)' }}>
              📞 <a href={`tel:${booking.phone}`} style={{ color: 'var(--accent)' }}>{booking.phone}</a>
            </div>
          )}
          {booking.notes && (
            <div className="text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>💬 {booking.notes}</div>
          )}
          <div className="flex gap-2 mt-1">
            <button
              onClick={() => onTogglePaid(booking.id, !booking.paid)}
              className="btn text-xs py-1.5 flex-1 justify-center"
              style={{
                background: booking.paid ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.1)',
                color: booking.paid ? 'var(--danger)' : 'var(--success)',
                border: `1px solid ${booking.paid ? 'rgba(239,68,68,0.2)' : 'rgba(34,197,94,0.2)'}`,
              }}>
              {booking.paid ? <X size={12} /> : <Check size={12} />}
              {booking.paid ? 'Merkja ógreitt' : 'Merkja greitt'}
            </button>
            <button onClick={() => onRemove(booking.id)} className="btn btn-ghost text-xs py-1.5 px-3">
              <Trash2 size={12} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function Lendo() {
  const {
    addBooking, removeBooking, updateBooking,
    equipment, monthlyGoal, setMonthlyGoal,
    monthlyIncome, pendingIncome, upcomingBookings, pastBookings, totalEarned,
    calcPrice,
  } = useLendo()

  const [showForm, setShowForm] = useState(false)
  const [tab, setTab] = useState('upcoming')
  const [showGoalEdit, setShowGoalEdit] = useState(false)

  // Form state
  const [customer, setCustomer] = useState('')
  const [phone, setPhone] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [selectedEq, setSelectedEq] = useState([])
  const [notes, setNotes] = useState('')
  const [paid, setPaid] = useState(false)
  const [customPrice, setCustomPrice] = useState('')

  const autoPrice = calcPrice(selectedEq, startDate, endDate || startDate)
  const finalPrice = customPrice !== '' ? Number(customPrice) : autoPrice

  const toggleEq = (id) => {
    setSelectedEq(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  const resetForm = () => {
    setCustomer(''); setPhone(''); setStartDate(''); setEndDate('')
    setSelectedEq([]); setNotes(''); setPaid(false); setCustomPrice('')
    setShowForm(false)
  }

  const handleAdd = (e) => {
    e.preventDefault()
    if (!customer.trim() || !startDate) return
    addBooking({
      customer: customer.trim(),
      phone: phone.trim(),
      startDate,
      endDate: endDate || startDate,
      equipmentIds: selectedEq,
      notes: notes.trim(),
      paid,
      totalPrice: finalPrice,
    })
    resetForm()
  }

  const income = monthlyIncome()
  const pending = pendingIncome()
  const goal = monthlyGoal
  const pct = Math.min(100, Math.round((income / goal) * 100))
  const upcoming = upcomingBookings()
  const past = pastBookings()
  const displayed = tab === 'upcoming' ? upcoming : past

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold">Lendó 🏠</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>Leigurekstur · {upcoming.length} komandi bókanir</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          <Plus size={16} /> Bókun
        </button>
      </div>

      {/* Income overview */}
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.07), rgba(139,92,246,0.06))' }}>
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="flex flex-col gap-0.5">
            <div className="text-xs" style={{ color: 'var(--muted)' }}>Þessi mánuður</div>
            <div className="text-xl font-semibold" style={{ color: 'var(--success)' }}>{formatShortISK(income)}</div>
          </div>
          <div className="flex flex-col gap-0.5">
            <div className="text-xs" style={{ color: 'var(--muted)' }}>Í bið</div>
            <div className="text-xl font-semibold" style={{ color: '#f97316' }}>{formatShortISK(pending)}</div>
          </div>
          <div className="flex flex-col gap-0.5">
            <div className="text-xs" style={{ color: 'var(--muted)' }}>Samtals</div>
            <div className="text-xl font-semibold">{formatShortISK(totalEarned())}</div>
          </div>
        </div>

        <div className="h-2 rounded-full overflow-hidden mb-1.5" style={{ background: 'var(--surface2)' }}>
          <div className="h-full rounded-full transition-all duration-500"
               style={{ width: `${pct}%`, background: pct >= 100 ? 'var(--success)' : 'var(--accent)' }} />
        </div>
        <div className="flex justify-between text-xs" style={{ color: 'var(--muted)' }}>
          <span>{pct}% af marki</span>
          <button onClick={() => setShowGoalEdit(!showGoalEdit)} style={{ color: 'var(--accent)' }}>
            Mark: {formatShortISK(goal)}
          </button>
        </div>
        {showGoalEdit && (
          <div className="mt-3 flex gap-2">
            <input className="input text-sm" type="number" value={goal}
              onChange={e => setMonthlyGoal(Number(e.target.value))} />
            <button onClick={() => setShowGoalEdit(false)} className="btn btn-primary text-sm px-3">Vista</button>
          </div>
        )}
      </div>

      {/* Add booking form */}
      {showForm && (
        <form onSubmit={handleAdd} className="card flex flex-col gap-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Ný bókun</h3>
            <button type="button" onClick={resetForm}><X size={16} style={{ color: 'var(--muted)' }} /></button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1 col-span-2">
              <label className="text-xs" style={{ color: 'var(--muted)' }}>Nafn viðskiptavinar *</label>
              <input className="input text-sm" placeholder="Anna Jónsdóttir" value={customer}
                onChange={e => setCustomer(e.target.value)} required autoFocus />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs" style={{ color: 'var(--muted)' }}>Símanúmer</label>
              <input className="input text-sm" type="tel" placeholder="7XX XXXX" value={phone}
                onChange={e => setPhone(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs" style={{ color: 'var(--muted)' }}>Greitt?</label>
              <button type="button" onClick={() => setPaid(!paid)}
                className="btn text-sm justify-center"
                style={{
                  background: paid ? 'rgba(34,197,94,0.12)' : 'var(--surface2)',
                  color: paid ? 'var(--success)' : 'var(--muted)',
                  border: `1px solid ${paid ? 'rgba(34,197,94,0.3)' : 'transparent'}`,
                }}>
                {paid ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                {paid ? 'Greitt' : 'Ógreitt'}
              </button>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs" style={{ color: 'var(--muted)' }}>Upphafsdagur *</label>
              <input className="input text-sm" type="date" value={startDate}
                onChange={e => { setStartDate(e.target.value); if (!endDate) setEndDate(e.target.value) }} required />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs" style={{ color: 'var(--muted)' }}>Lokadagur</label>
              <input className="input text-sm" type="date" value={endDate} min={startDate}
                onChange={e => setEndDate(e.target.value)} />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs" style={{ color: 'var(--muted)' }}>Tæki</label>
            <div className="grid grid-cols-2 gap-1.5">
              {equipment.map(eq => (
                <button key={eq.id} type="button" onClick={() => toggleEq(eq.id)}
                  className="flex items-center gap-2 p-2.5 rounded-xl text-left text-xs transition-all"
                  style={{
                    background: selectedEq.includes(eq.id) ? 'rgba(0,212,170,0.12)' : 'var(--surface2)',
                    border: `1px solid ${selectedEq.includes(eq.id) ? 'rgba(0,212,170,0.35)' : 'transparent'}`,
                    color: selectedEq.includes(eq.id) ? 'var(--accent)' : 'var(--text)',
                  }}>
                  <span className="text-base">{eq.icon}</span>
                  <div className="min-w-0">
                    <div className="font-medium truncate">{eq.name}</div>
                    <div style={{ color: 'var(--muted)', fontSize: 10 }}>{formatShortISK(eq.pricePerDay)}/dag</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs" style={{ color: 'var(--muted)' }}>Verð (ISK)</label>
            <div className="flex gap-2 items-center">
              <input className="input text-sm" type="number" placeholder={`Sjálfkrafa: ${formatShortISK(autoPrice)}`}
                value={customPrice} onChange={e => setCustomPrice(e.target.value)} />
              {customPrice && (
                <button type="button" onClick={() => setCustomPrice('')} style={{ color: 'var(--muted)' }}>
                  <X size={14} />
                </button>
              )}
            </div>
            {finalPrice > 0 && (
              <div className="text-xs" style={{ color: 'var(--accent)' }}>
                Heildarverð: {formatISK(finalPrice)}
                {startDate && (` · ${daysCount(startDate, endDate || startDate)} dagar`)}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs" style={{ color: 'var(--muted)' }}>Athugasemdir</label>
            <input className="input text-sm" placeholder="Veisla, afmæli, o.fl..." value={notes}
              onChange={e => setNotes(e.target.value)} />
          </div>

          <button type="submit" className="btn btn-primary w-full justify-center">Bæta við bókun</button>
        </form>
      )}

      {/* Equipment quick reference */}
      <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {equipment.map(eq => (
          <div key={eq.id} className="card-sm flex items-center gap-2 shrink-0 py-2">
            <span className="text-lg">{eq.icon}</span>
            <div>
              <div className="text-xs font-medium whitespace-nowrap">{eq.name}</div>
              <div className="text-xs" style={{ color: 'var(--accent)' }}>{formatShortISK(eq.pricePerDay)}/dag</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {[['upcoming', `Komandi (${upcoming.length})`], ['past', `Liðið (${past.length})`]].map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)}
            className="btn text-sm flex-1 justify-center"
            style={{
              background: tab === t ? 'rgba(0,212,170,0.12)' : 'var(--surface)',
              color: tab === t ? 'var(--accent)' : 'var(--muted)',
              border: `1px solid ${tab === t ? 'rgba(0,212,170,0.25)' : 'var(--border)'}`,
            }}>{l}</button>
        ))}
      </div>

      {/* Booking list */}
      <div className="flex flex-col gap-2">
        {displayed.length === 0 ? (
          <div className="card text-center py-10" style={{ color: 'var(--muted)' }}>
            {tab === 'upcoming' ? (
              <>
                <div className="text-3xl mb-2">📦</div>
                <div>Engar komandi bókanir</div>
                <button onClick={() => setShowForm(true)} className="btn btn-primary mt-3 mx-auto">
                  <Plus size={14} /> Bæta við bókun
                </button>
              </>
            ) : 'Engar liðnar bókanir'}
          </div>
        ) : displayed.map(b => (
          <BookingCard
            key={b.id}
            booking={b}
            equipment={equipment}
            onRemove={removeBooking}
            onTogglePaid={(id, paid) => updateBooking(id, { paid })}
          />
        ))}
      </div>
    </div>
  )
}
