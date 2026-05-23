import { useState } from 'react'
import { useLendo, LENDO_ITEMS } from '../hooks/useLendo'
import { formatISK, formatShortISK } from '../utils/currency'
import { Plus, X, Trash2, Check } from 'lucide-react'

const TODAY = new Date().toISOString().split('T')[0]

function MonthCalendar({ bookedDates, onDayClick }) {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  const firstDay = new Date(year, month, 1)
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const todayStr = now.toISOString().split('T')[0]

  // Monday-first: getDay() returns 0=Sun. Offset to Mon-first.
  const startOffset = (firstDay.getDay() + 6) % 7
  const cells = []
  for (let i = 0; i < startOffset; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  const DAY_LABELS = ['Mán', 'Þri', 'Mið', 'Fim', 'Fös', 'Lau', 'Sun']

  const monthStr = now.toLocaleDateString('is-IS', { month: 'long', year: 'numeric' })

  return (
    <div className="card">
      <div className="font-semibold text-sm mb-3 capitalize">{monthStr}</div>
      <div className="grid grid-cols-7 gap-1 mb-1">
        {DAY_LABELS.map(l => (
          <div key={l} className="text-center text-xs font-medium py-0.5" style={{ color: 'var(--muted)' }}>{l}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((d, i) => {
          if (!d) return <div key={`e-${i}`} />
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
          const isBooked = bookedDates.has(dateStr)
          const isToday = dateStr === todayStr
          const isPast = dateStr < todayStr
          return (
            <button key={dateStr} onClick={() => onDayClick(dateStr)}
              className="aspect-square flex items-center justify-center rounded-lg text-xs font-medium transition-all"
              style={{
                background: isBooked ? 'rgba(0,212,170,0.2)' : isToday ? 'rgba(139,92,246,0.15)' : 'transparent',
                color: isBooked ? 'var(--accent)' : isToday ? 'var(--accent2)' : isPast ? 'var(--muted)' : 'var(--text)',
                border: isToday ? '1px solid rgba(139,92,246,0.4)' : isBooked ? '1px solid rgba(0,212,170,0.35)' : '1px solid transparent',
                fontWeight: isBooked ? 700 : isToday ? 600 : 400,
              }}>
              {d}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function BookingCard({ booking, onTogglePaid, onRemove }) {
  const item = LENDO_ITEMS.find(i => i.id === booking.itemId) || LENDO_ITEMS[0]
  const date = new Date(booking.date)
  const isPast = date < new Date(new Date().toDateString())

  return (
    <div className="card flex items-center gap-3 py-3" style={{ opacity: isPast ? 0.75 : 1 }}>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
           style={{ background: 'rgba(0,212,170,0.12)' }}>
        {item.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold">{formatISK(booking.amount)}</span>
          {booking.paid ? (
            <span className="badge" style={{ background: 'rgba(34,197,94,0.15)', color: 'var(--success)' }}>✓ Greitt</span>
          ) : (
            <span className="badge" style={{ background: 'rgba(249,115,22,0.15)', color: '#f97316' }}>Ógreitt</span>
          )}
        </div>
        <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
          {date.toLocaleDateString('is-IS', { weekday: 'long', month: 'long', day: 'numeric' })}
          {booking.customer && ` · ${booking.customer}`}
        </div>
        <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{item.name}</div>
      </div>
      <div className="flex flex-col gap-1.5 shrink-0">
        <button onClick={() => onTogglePaid(booking.id)}
          className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
          style={{
            background: booking.paid ? 'rgba(34,197,94,0.2)' : 'var(--surface2)',
            border: `1px solid ${booking.paid ? 'rgba(34,197,94,0.4)' : 'var(--border)'}`,
          }}>
          <Check size={13} style={{ color: booking.paid ? 'var(--success)' : 'var(--muted)' }} />
        </button>
        <button onClick={() => onRemove(booking.id)}
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ background: 'var(--surface2)' }}>
          <Trash2 size={13} style={{ color: 'var(--muted)' }} />
        </button>
      </div>
    </div>
  )
}

export default function Lendo() {
  const { bookings, monthlyGoal, setMonthlyGoal, add, remove, togglePaid, calcRate, monthlyIncome, paidThisMonth, upcomingBookings, pastBookings, bookedDates } = useLendo()

  const [showForm, setShowForm] = useState(false)
  const [showGoalEdit, setShowGoalEdit] = useState(false)
  const [date, setDate] = useState(TODAY)
  const [itemId, setItemId] = useState('veislusett')
  const [amount, setAmount] = useState('')
  const [customer, setCustomer] = useState('')
  const [paid, setPaid] = useState(false)

  const income = monthlyIncome()
  const paidAmt = paidThisMonth()
  const unpaid = income - paidAmt
  const pct = Math.min(100, Math.round((income / monthlyGoal) * 100))
  const upcoming = upcomingBookings()
  const past = pastBookings()
  const dates = bookedDates()

  const autoAmount = calcRate(itemId, date)

  const handleAdd = (e) => {
    e.preventDefault()
    const finalAmount = Number(amount) || autoAmount
    if (!date || finalAmount < 0) return
    add({ date, itemId, amount: finalAmount, customer: customer.trim() || null, paid })
    setDate(TODAY)
    setItemId('veislusett')
    setAmount('')
    setCustomer('')
    setPaid(false)
    setShowForm(false)
  }

  const handleDayClick = (dateStr) => {
    setDate(dateStr)
    setShowForm(true)
    const autoAmt = calcRate(itemId, dateStr)
    setAmount(autoAmt > 0 ? String(autoAmt) : '')
  }

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🪑</span>
            <h1 className="text-xl font-semibold">Lendó</h1>
          </div>
          <p className="text-sm mt-0.5" style={{ color: 'var(--muted)' }}>Leigubúnaðarþjónusta</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          <Plus size={16} /> Bóka
        </button>
      </div>

      {/* Monthly goal card */}
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.07), rgba(139,92,246,0.06))' }}>
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Tekjur þennan mánuð</div>
            <div className="text-3xl font-semibold">{formatISK(income)}</div>
          </div>
          <button onClick={() => setShowGoalEdit(!showGoalEdit)}
            className="text-xs px-2.5 py-1 rounded-lg" style={{ background: 'var(--surface2)', color: 'var(--muted)' }}>
            Markmið
          </button>
        </div>

        {showGoalEdit && (
          <div className="flex gap-2 mb-3">
            <input className="input text-sm flex-1" type="number"
              value={monthlyGoal}
              onChange={e => setMonthlyGoal(Number(e.target.value))}
              placeholder="Mánaðarmarkmið (ISK)" />
          </div>
        )}

        <div className="h-2.5 rounded-full overflow-hidden mb-2" style={{ background: 'var(--surface2)' }}>
          <div className="h-full rounded-full transition-all"
               style={{ width: `${pct}%`, background: pct >= 100 ? 'var(--success)' : 'var(--accent)' }} />
        </div>
        <div className="flex justify-between text-xs" style={{ color: 'var(--muted)' }}>
          <span>{pct}% af {formatShortISK(monthlyGoal)}</span>
          <span>{formatShortISK(monthlyGoal - income)} eftir</span>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-3">
          <div className="p-2.5 rounded-xl" style={{ background: 'var(--surface2)' }}>
            <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Greitt</div>
            <div className="text-sm font-semibold" style={{ color: 'var(--success)' }}>{formatISK(paidAmt)}</div>
          </div>
          <div className="p-2.5 rounded-xl" style={{ background: 'var(--surface2)' }}>
            <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Ógreitt</div>
            <div className="text-sm font-semibold" style={{ color: unpaid > 0 ? '#f97316' : 'var(--muted)' }}>{formatISK(unpaid)}</div>
          </div>
        </div>
      </div>

      {/* Add booking form */}
      {showForm && (
        <form onSubmit={handleAdd} className="card flex flex-col gap-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Skrá leigu</h3>
            <button type="button" onClick={() => setShowForm(false)}><X size={16} style={{ color: 'var(--muted)' }} /></button>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs" style={{ color: 'var(--muted)' }}>Dagsetning</label>
            <input type="date" className="input text-sm" value={date}
              onChange={e => {
                setDate(e.target.value)
                const auto = calcRate(itemId, e.target.value)
                if (auto > 0) setAmount(String(auto))
              }} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs" style={{ color: 'var(--muted)' }}>Vara</label>
            <div className="flex flex-col gap-1.5">
              {LENDO_ITEMS.map(item => (
                <button key={item.id} type="button"
                  onClick={() => {
                    setItemId(item.id)
                    const auto = calcRate(item.id, date)
                    if (auto > 0) setAmount(String(auto))
                    else setAmount('')
                  }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-left transition-all"
                  style={{
                    background: itemId === item.id ? 'rgba(0,212,170,0.12)' : 'var(--surface2)',
                    border: `1px solid ${itemId === item.id ? 'rgba(0,212,170,0.3)' : 'transparent'}`,
                    color: itemId === item.id ? 'var(--accent)' : 'var(--text)',
                  }}>
                  <span>{item.icon}</span>
                  <div className="flex-1">
                    <div className="text-xs font-medium">{item.name}</div>
                    {item.weekdayRate > 0 && (
                      <div className="text-xs" style={{ color: 'var(--muted)' }}>
                        {formatISK(item.weekdayRate)}/virkur · {formatISK(item.weekendRate)}/helgi
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs" style={{ color: 'var(--muted)' }}>
              Upphæð (ISK){autoAmount > 0 && itemId !== 'custom' && ` · Sjálfvirkt: ${formatISK(autoAmount)}`}
            </label>
            <input className="input text-sm" type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder={autoAmount > 0 ? String(autoAmount) : 'Upphæð...'} />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs" style={{ color: 'var(--muted)' }}>Viðskiptavinur (valkvæmt)</label>
            <input className="input text-sm" value={customer} onChange={e => setCustomer(e.target.value)} placeholder="Nafn viðskiptavinar..." />
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={paid} onChange={e => setPaid(e.target.checked)} />
            <span className="text-sm">Búið að greiða</span>
          </label>

          <button type="submit" className="btn btn-primary w-full justify-center">
            <Plus size={16} /> Skrá leigu
          </button>
        </form>
      )}

      {/* Calendar */}
      <MonthCalendar bookedDates={dates} onDayClick={handleDayClick} />

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <div className="flex flex-col gap-2">
          <h2 className="text-sm font-semibold px-1">Kommandi bókanir</h2>
          {upcoming.map(b => (
            <BookingCard key={b.id} booking={b} onTogglePaid={togglePaid} onRemove={remove} />
          ))}
        </div>
      )}

      {/* Past */}
      {past.length > 0 && (
        <div className="flex flex-col gap-2">
          <h2 className="text-sm font-semibold px-1" style={{ color: 'var(--muted)' }}>Fyrri bókanir</h2>
          {past.map(b => (
            <BookingCard key={b.id} booking={b} onTogglePaid={togglePaid} onRemove={remove} />
          ))}
        </div>
      )}

      {bookings.length === 0 && (
        <div className="card text-center py-10">
          <div className="text-4xl mb-3">🪑</div>
          <div className="font-medium mb-1">Engar bókanir ennþá</div>
          <div className="text-sm" style={{ color: 'var(--muted)' }}>Smelltu á Bóka til að skrá fyrstu leiguna</div>
        </div>
      )}
    </div>
  )
}
