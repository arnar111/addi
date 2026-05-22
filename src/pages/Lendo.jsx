import { useState } from 'react'
import { useLendo, RENTAL_ITEMS } from '../hooks/useLendo'
import { formatISK, formatShortISK } from '../utils/currency'
import { Plus, X, Check, Trash2, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react'

function daysBetween(a, b) {
  return Math.max(1, Math.ceil((new Date(b) - new Date(a)) / 86400000) + 1)
}

function BookingCard({ booking, onTogglePaid, onRemove }) {
  const item = RENTAL_ITEMS.find(i => i.id === booking.itemId) || RENTAL_ITEMS[4]
  const now = new Date(); now.setHours(0, 0, 0, 0)
  const start = new Date(booking.startDate)
  const end = new Date(booking.endDate)
  const isActive = start <= now && end >= now
  const isUpcoming = start > now
  const isPast = end < now

  return (
    <div className="card flex flex-col gap-2 py-3"
         style={{ borderColor: isActive ? 'rgba(0,212,170,0.3)' : 'var(--border)', opacity: isPast && booking.paid ? 0.7 : 1 }}>
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0"
             style={{ background: isActive ? 'rgba(0,212,170,0.15)' : 'var(--surface2)' }}>
          {item.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-sm">{booking.customer}</span>
            {isActive && (
              <span className="badge text-xs" style={{ background: 'rgba(0,212,170,0.15)', color: 'var(--accent)' }}>
                Í gangi
              </span>
            )}
            {!booking.paid && (
              <span className="badge text-xs" style={{ background: 'rgba(239,68,68,0.12)', color: 'var(--danger)' }}>
                Ógreitt
              </span>
            )}
          </div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
            {item.label}
          </div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
            {new Date(booking.startDate).toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })}
            {booking.days > 1 && ` – ${new Date(booking.endDate).toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })}`}
            {' · '}{booking.days} {booking.days === 1 ? 'dagur' : 'dagar'}
          </div>
          {booking.note && <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>📝 {booking.note}</div>}
        </div>
        <div className="text-right shrink-0">
          <div className="font-semibold text-sm">{formatISK(booking.total)}</div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>{formatISK(booking.pricePerDay)}/dag</div>
        </div>
      </div>
      <div className="flex gap-2 mt-1">
        <button
          onClick={() => onTogglePaid(booking.id)}
          className="btn flex-1 justify-center text-xs py-1.5"
          style={{
            background: booking.paid ? 'rgba(34,197,94,0.12)' : 'rgba(0,212,170,0.08)',
            color: booking.paid ? 'var(--success)' : 'var(--accent)',
            border: `1px solid ${booking.paid ? 'rgba(34,197,94,0.25)' : 'rgba(0,212,170,0.2)'}`,
          }}>
          <Check size={12} />
          {booking.paid ? 'Greitt' : 'Merkja greitt'}
        </button>
        <button onClick={() => onRemove(booking.id)} className="btn btn-ghost py-1.5 px-2.5">
          <Trash2 size={14} style={{ color: 'var(--muted)' }} />
        </button>
      </div>
    </div>
  )
}

export default function Lendo() {
  const {
    addBooking, togglePaid, removeBooking,
    monthlyTotal, monthlyPending, monthlyGoal, setGoal,
    upcoming, past, unpaidCount,
  } = useLendo()

  const [showForm, setShowForm] = useState(false)
  const [showPast, setShowPast] = useState(false)
  const [showGoalEdit, setShowGoalEdit] = useState(false)
  const [tab, setTab] = useState('upcoming')

  const [customer, setCustomer] = useState('')
  const [itemId, setItemId] = useState('veislusett')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [pricePerDay, setPricePerDay] = useState('7000')
  const [note, setNote] = useState('')

  const earned = monthlyTotal()
  const pending = monthlyPending()
  const goal = monthlyGoal
  const pct = Math.min(100, Math.round((earned / goal) * 100))
  const upcomingList = upcoming()
  const pastList = past()

  const handleItemChange = (id) => {
    setItemId(id)
    const item = RENTAL_ITEMS.find(i => i.id === id)
    if (item && item.price > 0) setPricePerDay(String(item.price))
  }

  const handleAdd = (e) => {
    e.preventDefault()
    if (!customer.trim() || !startDate || !endDate) return
    addBooking({ customer: customer.trim(), itemId, startDate, endDate, pricePerDay, note })
    setCustomer('')
    setStartDate('')
    setEndDate('')
    setNote('')
    setShowForm(false)
  }

  const autoEnd = startDate && !endDate ? startDate : endDate
  const previewDays = startDate && autoEnd ? daysBetween(startDate, autoEnd) : 1
  const previewTotal = previewDays * Number(pricePerDay || 0)

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold">Lendó</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            {new Date().toLocaleDateString('is-IS', { month: 'long', year: 'numeric' })}
          </p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          <Plus size={16} /> Leiga
        </button>
      </div>

      {/* Monthly progress card */}
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.08), rgba(139,92,246,0.06))' }}>
        <div className="flex justify-between items-start mb-3">
          <div>
            <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Greitt inn þennan mánuð</div>
            <div className="text-3xl font-bold" style={{ color: 'var(--accent)' }}>{formatISK(earned)}</div>
          </div>
          <div className="text-right">
            <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Markmið</div>
            <button
              onClick={() => setShowGoalEdit(!showGoalEdit)}
              className="text-lg font-semibold"
              style={{ color: 'var(--text)' }}>
              {formatShortISK(goal)}
            </button>
          </div>
        </div>

        {showGoalEdit && (
          <div className="mb-3 flex gap-2">
            <input className="input text-sm flex-1" type="number"
              value={goal}
              onChange={e => setGoal(Number(e.target.value))}
              placeholder="Mánaðarmarkmið (ISK)" />
          </div>
        )}

        <div className="h-3 rounded-full overflow-hidden mb-2" style={{ background: 'var(--surface2)' }}>
          <div className="h-full rounded-full transition-all"
               style={{
                 width: `${pct}%`,
                 background: pct >= 100 ? 'var(--success)' : pct > 60 ? 'var(--accent)' : 'var(--accent)',
               }} />
        </div>
        <div className="flex justify-between text-xs" style={{ color: 'var(--muted)' }}>
          <span>{pct}% af markmiði</span>
          <span>{formatShortISK(Math.max(0, goal - earned))} eftir</span>
        </div>

        {pending > 0 && (
          <div className="mt-3 flex items-center gap-2 p-2 rounded-xl text-xs"
               style={{ background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.2)' }}>
            <AlertCircle size={14} style={{ color: '#f97316' }} />
            <span style={{ color: '#f97316' }}>{formatISK(pending)} ógreitt — {unpaidCount()} leiga bíður greiðslu</span>
          </div>
        )}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Leigur þ.m.', value: upcoming().filter(b => {
              const d = new Date(b.startDate)
              const now = new Date()
              return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
            }).length + past().filter(b => {
              const d = new Date(b.startDate)
              const now = new Date()
              return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
            }).length, unit: 'stk', color: 'var(--accent)' },
          { label: 'Meðaltal', value: (() => {
              const m = [...upcoming(), ...past()].filter(b => {
                const d = new Date(b.startDate)
                const now = new Date()
                return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
              })
              return m.length ? Math.round(m.reduce((s,b) => s + b.total, 0) / m.length / 1000) + 'k' : '–'
            })(), unit: 'kr', color: 'var(--accent2)' },
          { label: 'Ógreitt', value: formatShortISK(pending), unit: '', color: pending > 0 ? '#f97316' : 'var(--muted)' },
        ].map(s => (
          <div key={s.label} className="card py-3 text-center">
            <div className="text-lg font-bold" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Add booking form */}
      {showForm && (
        <form onSubmit={handleAdd} className="card flex flex-col gap-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Ný leiga</h3>
            <button type="button" onClick={() => setShowForm(false)}><X size={16} style={{ color: 'var(--muted)' }} /></button>
          </div>
          <input className="input" placeholder="Nafn leigutaka" value={customer}
            onChange={e => setCustomer(e.target.value)} autoFocus />
          <div className="grid grid-cols-2 gap-2">
            {RENTAL_ITEMS.map(item => (
              <button key={item.id} type="button" onClick={() => handleItemChange(item.id)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition-all text-left"
                style={{
                  background: itemId === item.id ? 'rgba(0,212,170,0.12)' : 'var(--surface2)',
                  border: `1px solid ${itemId === item.id ? 'rgba(0,212,170,0.3)' : 'transparent'}`,
                  color: itemId === item.id ? 'var(--accent)' : 'var(--text)',
                }}>
                <span>{item.icon}</span>
                <span className="leading-tight">{item.label}</span>
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs mb-1 block" style={{ color: 'var(--muted)' }}>Frá</label>
              <input type="date" className="input text-sm" value={startDate}
                onChange={e => { setStartDate(e.target.value); if (!endDate) setEndDate(e.target.value) }} />
            </div>
            <div>
              <label className="text-xs mb-1 block" style={{ color: 'var(--muted)' }}>Til</label>
              <input type="date" className="input text-sm" value={endDate}
                onChange={e => setEndDate(e.target.value)} min={startDate} />
            </div>
          </div>
          <div>
            <label className="text-xs mb-1 block" style={{ color: 'var(--muted)' }}>Verð á dag (ISK)</label>
            <input className="input" type="number" value={pricePerDay}
              onChange={e => setPricePerDay(e.target.value)} />
          </div>
          <input className="input" placeholder="Athugasemd (valkvæmt)" value={note}
            onChange={e => setNote(e.target.value)} />
          {startDate && (
            <div className="flex items-center justify-between p-3 rounded-xl text-sm"
                 style={{ background: 'var(--surface2)' }}>
              <span style={{ color: 'var(--muted)' }}>{previewDays} {previewDays === 1 ? 'dagur' : 'dagar'}</span>
              <span className="font-bold" style={{ color: 'var(--accent)' }}>{formatISK(previewTotal)}</span>
            </div>
          )}
          <button type="submit" className="btn btn-primary w-full justify-center">Bæta við leigu</button>
        </form>
      )}

      {/* Tabs */}
      <div className="flex gap-2">
        {[['upcoming', `Væntanlegar (${upcomingList.length})`], ['past', `Liðnar (${pastList.length})`]].map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)}
            className="btn text-xs flex-1 justify-center"
            style={{
              background: tab === t ? 'rgba(0,212,170,0.12)' : 'var(--surface)',
              color: tab === t ? 'var(--accent)' : 'var(--muted)',
              border: `1px solid ${tab === t ? 'rgba(0,212,170,0.25)' : 'var(--border)'}`,
            }}>{l}</button>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {tab === 'upcoming' && (
          upcomingList.length === 0
            ? <div className="card text-center py-8" style={{ color: 'var(--muted)' }}>Engar væntanlegar leigur<br /><span className="text-xs">Bættu við leigu til að byrja</span></div>
            : upcomingList.map(b => (
                <BookingCard key={b.id} booking={b} onTogglePaid={togglePaid} onRemove={removeBooking} />
              ))
        )}
        {tab === 'past' && (
          pastList.length === 0
            ? <div className="card text-center py-8" style={{ color: 'var(--muted)' }}>Engar liðnar leigur</div>
            : pastList.map(b => (
                <BookingCard key={b.id} booking={b} onTogglePaid={togglePaid} onRemove={removeBooking} />
              ))
        )}
      </div>
    </div>
  )
}
