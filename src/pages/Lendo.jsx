import { useState } from 'react'
import { useLendo, LENDO_ITEMS } from '../hooks/useLendo'
import { formatISK, formatShortISK } from '../utils/currency'
import { Plus, X, Check, Trash2, TrendingUp } from 'lucide-react'

function BookingCard({ booking, onTogglePaid, onRemove }) {
  return (
    <div className="card-sm flex items-center gap-3"
         style={{ border: `1px solid ${booking.paid ? 'rgba(0,212,170,0.2)' : 'var(--border)'}` }}>
      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-base"
           style={{ background: booking.paid ? 'rgba(0,212,170,0.1)' : 'rgba(249,115,22,0.1)' }}>
        {LENDO_ITEMS.find(i => i.id === booking.itemId)?.icon || '📦'}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">{formatISK(booking.price * (booking.days || 1))}</span>
          {booking.days > 1 && (
            <span className="text-xs" style={{ color: 'var(--muted)' }}>{booking.days} dagar</span>
          )}
        </div>
        <div className="text-xs truncate" style={{ color: 'var(--muted)' }}>
          {booking.itemName}
          {booking.customer ? ` · ${booking.customer}` : ''}
        </div>
        <div className="text-xs" style={{ color: 'var(--muted)' }}>
          {new Date(booking.date).toLocaleDateString('is-IS', { weekday: 'short', month: 'short', day: 'numeric' })}
          {booking.note ? ` · ${booking.note}` : ''}
        </div>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <button onClick={() => onTogglePaid(booking.id)}
                className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg transition-all"
                style={{
                  background: booking.paid ? 'rgba(0,212,170,0.12)' : 'var(--surface2)',
                  color: booking.paid ? 'var(--accent)' : 'var(--muted)',
                  border: `1px solid ${booking.paid ? 'rgba(0,212,170,0.3)' : 'transparent'}`,
                }}>
          {booking.paid ? <><Check size={11} /> Greitt</> : 'Ógreitt'}
        </button>
        <button onClick={() => onRemove(booking.id)} style={{ color: 'var(--muted)', padding: 4 }}>
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  )
}

export default function Lendo() {
  const {
    bookings, addBooking, togglePaid, removeBooking,
    goal, setGoal, monthlyRevenue, unpaidTotal, paidTotal, goalPct,
  } = useLendo()

  const [showForm, setShowForm] = useState(false)
  const [tab, setTab] = useState('overview')
  const [itemId, setItemId] = useState('veislusett')
  const [price, setPrice] = useState(7000)
  const [customer, setCustomer] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [days, setDays] = useState(1)
  const [note, setNote] = useState('')
  const [editGoal, setEditGoal] = useState(false)
  const [goalInput, setGoalInput] = useState(goal)

  const handleItemChange = (id) => {
    setItemId(id)
    const item = LENDO_ITEMS.find(i => i.id === id)
    if (item?.price) setPrice(item.price)
  }

  const handleAdd = (e) => {
    e.preventDefault()
    addBooking({ date, itemId, price, customer, note, days })
    setCustomer('')
    setNote('')
    setDays(1)
    setShowForm(false)
  }

  const rev = monthlyRevenue()
  const pct = goalPct()
  const unpaid = unpaidTotal()

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
          <Plus size={16} /> Bókun
        </button>
      </div>

      {/* Revenue overview */}
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.07), rgba(139,92,246,0.07))' }}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Tekjur þessa mánaðar</div>
            <div className="text-3xl font-semibold" style={{ color: 'var(--accent)' }}>{formatISK(rev)}</div>
          </div>
          <button onClick={() => setEditGoal(!editGoal)} className="text-right">
            <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Markmið</div>
            <div className="text-lg font-semibold">{formatShortISK(goal)}</div>
          </button>
        </div>

        {editGoal && (
          <div className="flex gap-2 mb-3">
            <input className="input text-sm flex-1" type="number" value={goalInput}
              onChange={e => setGoalInput(e.target.value)} />
            <button onClick={() => { setGoal(Number(goalInput)); setEditGoal(false) }} className="btn btn-primary text-sm">
              Vista
            </button>
          </div>
        )}

        <div className="h-2.5 rounded-full overflow-hidden mb-2" style={{ background: 'var(--surface2)' }}>
          <div className="h-full rounded-full transition-all"
               style={{ width: `${pct}%`, background: pct >= 100 ? 'var(--success)' : 'var(--accent)' }} />
        </div>
        <div className="flex justify-between text-xs" style={{ color: 'var(--muted)' }}>
          <span>{pct}% af marki</span>
          {unpaid > 0 && (
            <span style={{ color: '#f97316' }}>🔔 {formatShortISK(unpaid)} ógreitt</span>
          )}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Bókanir', value: bookings.length, icon: '📋' },
          { label: 'Greitt', value: formatShortISK(paidTotal()), icon: '✅' },
          { label: 'Ógreitt', value: formatShortISK(unpaid), icon: '⏳', warn: unpaid > 0 },
        ].map(s => (
          <div key={s.label} className="card-sm text-center">
            <div className="text-xl mb-1">{s.icon}</div>
            <div className="text-sm font-bold" style={{ color: s.warn ? '#f97316' : 'var(--text)' }}>{s.value}</div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Add booking form */}
      {showForm && (
        <form onSubmit={handleAdd} className="card flex flex-col gap-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Ný bókun</h3>
            <button type="button" onClick={() => setShowForm(false)}><X size={16} style={{ color: 'var(--muted)' }} /></button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {LENDO_ITEMS.map(item => (
              <button key={item.id} type="button" onClick={() => handleItemChange(item.id)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all text-left"
                      style={{
                        background: itemId === item.id ? 'rgba(0,212,170,0.1)' : 'var(--surface2)',
                        border: `1px solid ${itemId === item.id ? 'rgba(0,212,170,0.3)' : 'transparent'}`,
                        color: itemId === item.id ? 'var(--accent)' : 'var(--text)',
                      }}>
                <span>{item.icon}</span>
                <span className="text-xs leading-tight">{item.name}</span>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs mb-1 block" style={{ color: 'var(--muted)' }}>Verð (kr)</label>
              <input className="input text-sm" type="number" value={price}
                onChange={e => setPrice(e.target.value)} />
            </div>
            <div>
              <label className="text-xs mb-1 block" style={{ color: 'var(--muted)' }}>Fjöldi daga</label>
              <input className="input text-sm" type="number" min="1" value={days}
                onChange={e => setDays(e.target.value)} />
            </div>
          </div>

          <div>
            <label className="text-xs mb-1 block" style={{ color: 'var(--muted)' }}>Dagsetning</label>
            <input className="input text-sm" type="date" value={date}
              onChange={e => setDate(e.target.value)} />
          </div>

          <input className="input text-sm" placeholder="Nafn viðskiptavinar" value={customer}
            onChange={e => setCustomer(e.target.value)} />
          <input className="input text-sm" placeholder="Athugasemd (valkvæmt)" value={note}
            onChange={e => setNote(e.target.value)} />

          <div className="flex items-center justify-between px-1 py-1 rounded-xl text-sm font-semibold"
               style={{ background: 'rgba(0,212,170,0.08)' }}>
            <span>Samtals:</span>
            <span style={{ color: 'var(--accent)' }}>{formatISK(Number(price) * Number(days))}</span>
          </div>

          <button type="submit" className="btn btn-primary w-full justify-center">
            <TrendingUp size={15} /> Skrá bókun
          </button>
        </form>
      )}

      {/* Tabs */}
      <div className="flex gap-2">
        {[['overview', 'Yfirlit'], ['all', 'Allar bókanir']].map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)}
                  className="btn text-sm flex-1 justify-center"
                  style={{
                    background: tab === t ? 'rgba(0,212,170,0.12)' : 'var(--surface)',
                    color: tab === t ? 'var(--accent)' : 'var(--muted)',
                    border: `1px solid ${tab === t ? 'rgba(0,212,170,0.25)' : 'var(--border)'}`,
                  }}>{l}</button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="flex flex-col gap-2">
          <h3 className="text-xs font-semibold px-1" style={{ color: 'var(--muted)' }}>Þessi mánuður</h3>
          {bookings.length === 0 ? (
            <div className="card text-center py-8 text-sm" style={{ color: 'var(--muted)' }}>
              Engar bókanir ennþá — skráðu fyrstu bókunina!
            </div>
          ) : bookings.filter(b => {
            const now = new Date()
            const d = new Date(b.date)
            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
          }).map(b => (
            <BookingCard key={b.id} booking={b} onTogglePaid={togglePaid} onRemove={removeBooking} />
          ))}
        </div>
      )}

      {tab === 'all' && (
        <div className="flex flex-col gap-2">
          {bookings.length === 0 ? (
            <div className="card text-center py-8 text-sm" style={{ color: 'var(--muted)' }}>
              Engar bókanir ennþá
            </div>
          ) : bookings.map(b => (
            <BookingCard key={b.id} booking={b} onTogglePaid={togglePaid} onRemove={removeBooking} />
          ))}
        </div>
      )}
    </div>
  )
}
