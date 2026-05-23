import { useState } from 'react'
import { useLendo, LENDO_ITEMS } from '../hooks/useLendo'
import { formatISK, formatShortISK } from '../utils/currency'
import { Plus, Trash2, Check, X, ChevronRight, Package, CalendarDays, TrendingUp, Target } from 'lucide-react'

function MonthProgress({ income, pending, goal, days, count }) {
  const pct = goal ? Math.min(100, Math.round((income / goal) * 100)) : 0
  const isNear = pct >= 80
  const isOver = income >= goal
  const monthName = new Date().toLocaleDateString('is-IS', { month: 'long', year: 'numeric' })

  return (
    <div className="card" style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.06), rgba(139,92,246,0.06))' }}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="text-xs mb-1 capitalize" style={{ color: 'var(--muted)' }}>{monthName}</div>
          <div className="text-3xl font-semibold">{formatISK(income)}</div>
          <div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>af {formatShortISK(goal)} markmiði</div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="text-2xl font-bold" style={{ color: isOver ? 'var(--success)' : isNear ? '#f97316' : 'var(--accent)' }}>
            {pct}%
          </div>
          {isOver && <span className="text-xs" style={{ color: 'var(--success)' }}>🎉 Markmið náð!</span>}
        </div>
      </div>

      <div className="h-2.5 rounded-full overflow-hidden mb-3" style={{ background: 'var(--surface2)' }}>
        <div className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: isOver ? 'var(--success)' : isNear ? '#f97316' : 'var(--accent)' }} />
      </div>

      <div className="grid grid-cols-4 gap-2 text-center">
        {[
          ['✅', formatShortISK(income), 'Greitt'],
          ['📋', formatShortISK(pending), 'Ógreitt'],
          ['📅', count, 'Bókanir'],
          ['🗓️', days, 'Dagar'],
        ].map(([icon, val, label]) => (
          <div key={label} className="flex flex-col gap-0.5 p-2 rounded-xl" style={{ background: 'var(--surface2)' }}>
            <span className="text-base">{icon}</span>
            <span className="text-sm font-semibold">{val}</span>
            <span className="text-xs" style={{ color: 'var(--muted)', fontSize: 10 }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function BookingCard({ booking, onRemove, onTogglePaid }) {
  const item = LENDO_ITEMS.find(i => i.id === booking.itemId) || LENDO_ITEMS[0]
  const date = new Date(booking.date)
  const isUpcoming = date >= new Date(new Date().toDateString())

  return (
    <div className="card flex items-center gap-3 py-3"
      style={{ borderColor: booking.paid ? 'rgba(34,197,94,0.2)' : 'var(--border)' }}>
      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-lg"
        style={{ background: 'var(--surface2)' }}>
        {item.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate">{booking.name}</div>
        <div className="text-xs" style={{ color: 'var(--muted)' }}>
          {item.name} · {booking.days || 1} {Number(booking.days) === 1 ? 'dagur' : 'dagar'}
          {booking.note ? ` · ${booking.note}` : ''}
        </div>
        <div className="text-xs mt-0.5" style={{ color: isUpcoming ? 'var(--accent)' : 'var(--muted)' }}>
          {date.toLocaleDateString('is-IS', { weekday: 'short', month: 'short', day: 'numeric' })}
        </div>
      </div>
      <div className="flex flex-col items-end gap-1.5 shrink-0">
        <span className="text-sm font-semibold">{formatShortISK(booking.amount)}</span>
        <div className="flex items-center gap-1.5">
          <button onClick={() => onTogglePaid(booking.id)}
            className="flex items-center gap-0.5 px-2 py-0.5 rounded-lg text-xs font-medium transition-all"
            style={{
              background: booking.paid ? 'rgba(34,197,94,0.15)' : 'rgba(100,116,139,0.15)',
              color: booking.paid ? 'var(--success)' : 'var(--muted)',
              border: `1px solid ${booking.paid ? 'rgba(34,197,94,0.3)' : 'var(--border)'}`,
            }}>
            {booking.paid ? <Check size={10} /> : null}
            {booking.paid ? 'Greitt' : 'Ógreitt'}
          </button>
          <button onClick={() => onRemove(booking.id)} style={{ color: 'var(--muted)', padding: 2 }}>
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  )
}

function AddBookingForm({ onAdd, onClose }) {
  const [name, setName] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [itemId, setItemId] = useState('veislusett')
  const [days, setDays] = useState(1)
  const [paid, setPaid] = useState(false)
  const [note, setNote] = useState('')

  const selectedItem = LENDO_ITEMS.find(i => i.id === itemId) || LENDO_ITEMS[0]
  const calcAmount = selectedItem.pricePerDay * days

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim()) return
    onAdd({ name: name.trim(), date, itemId, days, paid, note: note.trim() })
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="card flex flex-col gap-3 animate-slide-up">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm">Ný bókun</h3>
        <button type="button" onClick={onClose}><X size={16} style={{ color: 'var(--muted)' }} /></button>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs" style={{ color: 'var(--muted)' }}>Leigjandi</label>
        <input className="input" placeholder="Nafn leigjanda..." value={name} onChange={e => setName(e.target.value)} autoFocus required />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col gap-1">
          <label className="text-xs" style={{ color: 'var(--muted)' }}>Dagsetning</label>
          <input type="date" className="input text-sm" value={date} onChange={e => setDate(e.target.value)} required />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs" style={{ color: 'var(--muted)' }}>Fjöldi daga</label>
          <div className="flex gap-1">
            {[1, 2, 3].map(d => (
              <button key={d} type="button"
                className="flex-1 py-2 rounded-xl text-sm font-semibold transition-all"
                style={{
                  background: days === d ? 'rgba(0,212,170,0.15)' : 'var(--surface2)',
                  color: days === d ? 'var(--accent)' : 'var(--muted)',
                  border: `1px solid ${days === d ? 'rgba(0,212,170,0.3)' : 'transparent'}`,
                }}
                onClick={() => setDays(d)}>{d}</button>
            ))}
            <input type="number" min={1} max={30}
              className="input text-sm py-2 px-2 w-12 text-center"
              value={days > 3 ? days : ''}
              placeholder={days <= 3 ? '+' : ''}
              onChange={e => { const v = Number(e.target.value); if (v > 0) setDays(v) }} />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs" style={{ color: 'var(--muted)' }}>Vara</label>
        <div className="flex flex-col gap-1">
          {LENDO_ITEMS.map(item => (
            <button key={item.id} type="button"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all"
              style={{
                background: itemId === item.id ? 'rgba(0,212,170,0.1)' : 'var(--surface2)',
                border: `1px solid ${itemId === item.id ? 'rgba(0,212,170,0.3)' : 'transparent'}`,
                color: itemId === item.id ? 'var(--text)' : 'var(--muted)',
              }}
              onClick={() => setItemId(item.id)}>
              <span className="text-base">{item.icon}</span>
              <span className="flex-1 text-left">{item.name} — {item.desc}</span>
              <span className="font-semibold" style={{ color: itemId === item.id ? 'var(--accent)' : 'var(--muted)' }}>
                {formatShortISK(item.pricePerDay)}/dag
              </span>
            </button>
          ))}
        </div>
      </div>

      <input className="input text-sm" placeholder="Athugasemd (valkvæmt)..." value={note} onChange={e => setNote(e.target.value)} />

      <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'var(--surface2)' }}>
        <div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>Upphæð</div>
          <div className="text-xl font-bold" style={{ color: 'var(--accent)' }}>{formatISK(calcAmount)}</div>
        </div>
        <button type="button"
          onClick={() => setPaid(!paid)}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all"
          style={{
            background: paid ? 'rgba(34,197,94,0.15)' : 'var(--surface)',
            color: paid ? 'var(--success)' : 'var(--muted)',
            border: `1px solid ${paid ? 'rgba(34,197,94,0.3)' : 'var(--border)'}`,
          }}>
          {paid ? <Check size={14} /> : null}
          {paid ? 'Greitt' : 'Merkja sem greitt'}
        </button>
      </div>

      <button type="submit" className="btn btn-primary w-full justify-center">
        <Plus size={16} /> Bæta við bókun
      </button>
    </form>
  )
}

export default function Lendo() {
  const {
    goal, setGoal,
    add, remove, togglePaid,
    monthlyIncome, monthlyPending, monthlyDays, monthlyBookingCount,
    upcomingBookings, pastBookings,
  } = useLendo()

  const [showForm, setShowForm] = useState(false)
  const [tab, setTab] = useState('bookings')
  const [showGoalEdit, setShowGoalEdit] = useState(false)

  const income = monthlyIncome()
  const pending = monthlyPending()
  const days = monthlyDays()
  const count = monthlyBookingCount()

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold">🪑 Lendó</h1>
          </div>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            Leigufyrirtæki þitt
          </p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          <Plus size={16} /> Bókun
        </button>
      </div>

      {/* Add booking form */}
      {showForm && <AddBookingForm onAdd={add} onClose={() => setShowForm(false)} />}

      {/* Monthly progress */}
      <MonthProgress income={income} pending={pending} goal={goal} days={days} count={count} />

      {/* Goal edit */}
      <button onClick={() => setShowGoalEdit(!showGoalEdit)}
        className="text-xs text-right w-full"
        style={{ color: 'var(--muted)' }}>
        {showGoalEdit ? '▲ Loka' : '⚙️ Breyta markmiði'}
      </button>

      {showGoalEdit && (
        <div className="card flex items-center gap-3 animate-slide-up">
          <Target size={16} style={{ color: 'var(--accent)', shrink: 0 }} />
          <div className="flex-1">
            <label className="text-xs block mb-1" style={{ color: 'var(--muted)' }}>Mánaðarleg markmið (ISK)</label>
            <input className="input text-sm" type="number" value={goal}
              onChange={e => setGoal(Number(e.target.value))} />
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2">
        {[['bookings', 'Bókanir'], ['items', '🪑 Vara']].map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)}
            className="btn flex-1 justify-center text-sm"
            style={{
              background: tab === t ? 'rgba(0,212,170,0.12)' : 'var(--surface)',
              color: tab === t ? 'var(--accent)' : 'var(--muted)',
              border: `1px solid ${tab === t ? 'rgba(0,212,170,0.25)' : 'var(--border)'}`,
            }}>{l}</button>
        ))}
      </div>

      {tab === 'bookings' && (
        <div className="flex flex-col gap-4">
          {/* Upcoming */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide mb-2 px-1" style={{ color: 'var(--muted)' }}>
              Komandi · {upcomingBookings.length}
            </h3>
            {upcomingBookings.length === 0 ? (
              <div className="card text-center py-6 text-sm" style={{ color: 'var(--muted)' }}>
                Engar komandi bókanir
                <div className="mt-2">
                  <button onClick={() => setShowForm(true)} className="btn btn-primary text-xs">
                    <Plus size={12} /> Bæta við
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {upcomingBookings.map(b => (
                  <BookingCard key={b.id} booking={b} onRemove={remove} onTogglePaid={togglePaid} />
                ))}
              </div>
            )}
          </div>

          {/* Past */}
          {pastBookings.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide mb-2 px-1" style={{ color: 'var(--muted)' }}>
                Liðnar · {pastBookings.length}
              </h3>
              <div className="flex flex-col gap-2">
                {pastBookings.map(b => (
                  <BookingCard key={b.id} booking={b} onRemove={remove} onTogglePaid={togglePaid} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 'items' && (
        <div className="flex flex-col gap-3">
          <div className="card flex flex-col gap-1 p-3 text-xs" style={{ background: 'rgba(0,212,170,0.06)', border: '1px solid rgba(0,212,170,0.2)' }}>
            <span style={{ color: 'var(--accent)' }}>💡 Lendó — Leiga á veislubúnaði</span>
            <span style={{ color: 'var(--muted)' }}>Hér eru vörurnar þínar í leigu. Verð eru sjálfkrafa reiknuð út frá leigudögum.</span>
          </div>
          {LENDO_ITEMS.map(item => (
            <div key={item.id} className="card flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0"
                style={{ background: 'var(--surface2)' }}>
                {item.icon}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-sm">{item.name}</div>
                <div className="text-xs" style={{ color: 'var(--muted)' }}>{item.desc}</div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-lg font-bold" style={{ color: 'var(--accent)' }}>
                  {formatShortISK(item.pricePerDay)}
                </div>
                <div className="text-xs" style={{ color: 'var(--muted)' }}>á dag</div>
              </div>
            </div>
          ))}

          {/* Quick stats */}
          {count > 0 && (
            <div className="card">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp size={14} style={{ color: 'var(--accent)' }} />
                <span className="font-semibold text-sm">Þennan mánuð</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="flex flex-col gap-0.5">
                  <span className="text-xl font-bold" style={{ color: 'var(--accent)' }}>{count}</span>
                  <span className="text-xs" style={{ color: 'var(--muted)' }}>Bókanir</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-xl font-bold" style={{ color: 'var(--accent)' }}>{days}</span>
                  <span className="text-xs" style={{ color: 'var(--muted)' }}>Dagar</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-xl font-bold" style={{ color: 'var(--accent)' }}>
                    {count ? formatShortISK(Math.round((income + pending) / count)) : '0'}
                  </span>
                  <span className="text-xs" style={{ color: 'var(--muted)' }}>Meðal/bókun</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
