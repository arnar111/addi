import { useState } from 'react'
import { useLendo } from '../hooks/useLendo'
import { formatISK, formatShortISK } from '../utils/currency'
import { Plus, Trash2, X, Check, ChevronDown, ChevronUp, Package, Target } from 'lucide-react'

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'Maí', 'Jún', 'Júl', 'Ágú', 'Sep', 'Okt', 'Nóv', 'Des']

function BookingRow({ booking, onRemove, onTogglePaid }) {
  const start = new Date(booking.startDate)
  const end = new Date(booking.endDate)
  const isSameDay = booking.startDate === booking.endDate

  return (
    <div className="card flex items-start gap-3 py-3" style={{ opacity: 1 }}>
      <span className="text-xl shrink-0 mt-0.5">{booking.itemIcon}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium">{formatISK(booking.amount)}</span>
          {booking.paid ? (
            <span className="badge" style={{ background: 'rgba(34,197,94,0.15)', color: 'var(--success)', fontSize: 10 }}>Greitt</span>
          ) : (
            <span className="badge" style={{ background: 'rgba(249,115,22,0.15)', color: '#f97316', fontSize: 10 }}>Ógreitt</span>
          )}
        </div>
        <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
          {booking.itemName} · {booking.days} {booking.days === 1 ? 'dagur' : 'dagar'}
        </div>
        <div className="text-xs" style={{ color: 'var(--muted)' }}>
          {start.toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })}
          {!isSameDay && ` – ${end.toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })}`}
          {booking.customer ? ` · ${booking.customer}` : ''}
        </div>
        {booking.note && <div className="text-xs mt-0.5 italic" style={{ color: 'var(--muted)' }}>{booking.note}</div>}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button onClick={() => onTogglePaid(booking.id)}
          className="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all"
          style={{
            borderColor: booking.paid ? 'var(--success)' : 'var(--border)',
            background: booking.paid ? 'var(--success)' : 'transparent',
          }}>
          {booking.paid && <Check size={10} color="#000" />}
        </button>
        <button onClick={() => onRemove(booking.id)} style={{ color: 'var(--muted)' }}>
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  )
}

export default function Lendo() {
  const {
    items, addItem, removeItem,
    bookings, addBooking, removeBooking, togglePaid,
    goal, setGoal,
    currentMonthBookings, upcomingBookings,
    monthlyIncome, totalIncome, incomeByMonth,
  } = useLendo()

  const [tab, setTab] = useState('overview')
  const [showBookingForm, setShowBookingForm] = useState(false)
  const [showItemForm, setShowItemForm] = useState(false)
  const [showGoalEdit, setShowGoalEdit] = useState(false)

  // Booking form state
  const [bItemId, setBItemId] = useState(items[0]?.id || '')
  const [bStart, setBStart] = useState('')
  const [bEnd, setBEnd] = useState('')
  const [bCustomer, setBCustomer] = useState('')
  const [bNote, setBNote] = useState('')

  // Item form state
  const [iName, setIName] = useState('')
  const [iPrice, setIPrice] = useState('')
  const [iIcon, setIIcon] = useState('📦')

  const income = monthlyIncome()
  const allIncome = totalIncome()
  const thisMonthBookings = currentMonthBookings()
  const upcoming = upcomingBookings()
  const pct = goal > 0 ? Math.min(100, Math.round((income / goal) * 100)) : 0
  const history = incomeByMonth()

  const handleAddBooking = (e) => {
    e.preventDefault()
    if (!bItemId || !bStart) return
    addBooking({
      itemId: bItemId,
      startDate: bStart,
      endDate: bEnd || bStart,
      customer: bCustomer,
      note: bNote,
    })
    setBStart('')
    setBEnd('')
    setBCustomer('')
    setBNote('')
    setShowBookingForm(false)
  }

  const handleAddItem = (e) => {
    e.preventDefault()
    if (!iName || !iPrice) return
    addItem(iName, iPrice, iIcon)
    setIName('')
    setIPrice('')
    setIIcon('📦')
    setShowItemForm(false)
  }

  const selectedItem = items.find(i => i.id === bItemId)
  const previewDays = bStart && bEnd ? Math.max(1, Math.round((new Date(bEnd) - new Date(bStart)) / (1000 * 60 * 60 * 24)) + 1) : 1
  const previewAmount = selectedItem ? selectedItem.pricePerDay * (bStart && bEnd ? previewDays : 1) : 0

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold flex items-center gap-2">🏠 Lendó</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            {new Date().toLocaleDateString('is-IS', { month: 'long', year: 'numeric' })}
          </p>
        </div>
        <button onClick={() => setShowBookingForm(!showBookingForm)} className="btn btn-primary">
          <Plus size={16} /> Leiga
        </button>
      </div>

      {/* Income overview */}
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.08), rgba(139,92,246,0.06))' }}>
        <div className="flex justify-between items-start mb-3">
          <div>
            <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Þennan mánuð</div>
            <div className="text-3xl font-semibold">{formatISK(income)}</div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
              {thisMonthBookings.length} leiga{thisMonthBookings.length !== 1 ? 'r' : ''}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Samtals</div>
            <div className="text-lg font-semibold" style={{ color: 'var(--accent)' }}>{formatISK(allIncome)}</div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{bookings.length} leigar</div>
          </div>
        </div>

        <div className="h-2.5 rounded-full overflow-hidden mb-1" style={{ background: 'var(--surface2)' }}>
          <div className="h-full rounded-full transition-all"
            style={{ width: `${pct}%`, background: pct >= 80 ? 'var(--success)' : pct >= 50 ? 'var(--accent)' : '#f97316' }} />
        </div>
        <div className="flex justify-between text-xs items-center" style={{ color: 'var(--muted)' }}>
          <span>{pct}% af mánaðarmarki</span>
          <button onClick={() => setShowGoalEdit(!showGoalEdit)} style={{ color: 'var(--accent)' }}>
            Markmið: {formatShortISK(goal)}
          </button>
        </div>

        {showGoalEdit && (
          <div className="mt-3 flex gap-2">
            <input className="input text-sm flex-1" type="number"
              value={goal}
              onChange={e => setGoal(Number(e.target.value))}
              placeholder="Mánaðarmarkmið (ISK)" />
            <button onClick={() => setShowGoalEdit(false)} className="btn btn-primary text-xs">Vista</button>
          </div>
        )}
      </div>

      {/* Booking form */}
      {showBookingForm && (
        <form onSubmit={handleAddBooking} className="card flex flex-col gap-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Ný leiga</h3>
            <button type="button" onClick={() => setShowBookingForm(false)}><X size={16} style={{ color: 'var(--muted)' }} /></button>
          </div>

          <div>
            <label className="text-xs mb-1 block" style={{ color: 'var(--muted)' }}>Hlutur</label>
            <select className="input text-sm" value={bItemId} onChange={e => setBItemId(e.target.value)}>
              {items.map(item => (
                <option key={item.id} value={item.id}>{item.icon} {item.name} — {formatISK(item.pricePerDay)}/dag</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs mb-1 block" style={{ color: 'var(--muted)' }}>Upphafsdagur</label>
              <input className="input text-sm" type="date" value={bStart} onChange={e => setBStart(e.target.value)} required />
            </div>
            <div>
              <label className="text-xs mb-1 block" style={{ color: 'var(--muted)' }}>Lokadagur</label>
              <input className="input text-sm" type="date" value={bEnd} onChange={e => setBEnd(e.target.value)} />
            </div>
          </div>

          {bStart && selectedItem && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium"
              style={{ background: 'rgba(0,212,170,0.1)', color: 'var(--accent)' }}>
              <span>{bEnd && bEnd !== bStart ? `${previewDays} dagar` : '1 dagur'}</span>
              <span className="mx-1">·</span>
              <span className="font-semibold">{formatISK(previewAmount)}</span>
            </div>
          )}

          <input className="input text-sm" placeholder="Viðskiptavinur (valkvæmt)" value={bCustomer} onChange={e => setBCustomer(e.target.value)} />
          <input className="input text-sm" placeholder="Athugasemd (valkvæmt)" value={bNote} onChange={e => setBNote(e.target.value)} />

          <button type="submit" className="btn btn-primary w-full justify-center">Skrá leigu</button>
        </form>
      )}

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <div className="card">
          <h3 className="text-sm font-semibold mb-3">Komandi leigar</h3>
          <div className="flex flex-col gap-2">
            {upcoming.map(b => {
              const d = new Date(b.startDate)
              const daysUntil = Math.ceil((d - new Date()) / (1000 * 60 * 60 * 24))
              return (
                <div key={b.id} className="flex items-center gap-3">
                  <span className="text-xl">{b.itemIcon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm">{d.toLocaleDateString('is-IS', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
                    <div className="text-xs" style={{ color: 'var(--muted)' }}>
                      {b.days} {b.days === 1 ? 'dagur' : 'dagar'}{b.customer ? ` · ${b.customer}` : ''}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-medium">{formatISK(b.amount)}</div>
                    <div className="text-xs" style={{ color: daysUntil <= 2 ? '#f97316' : 'var(--muted)' }}>
                      {daysUntil === 0 ? 'Í dag' : daysUntil === 1 ? 'Á morgun' : `${daysUntil} dagar`}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2">
        {[['overview', 'Yfirlit'], ['bookings', 'Leigar'], ['items', 'Hlutir']].map(([t, l]) => (
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
        <div className="flex flex-col gap-3">
          {history.length > 0 ? (
            <div className="card">
              <h3 className="text-sm font-semibold mb-4">Tekjur eftir mánuðum</h3>
              {history.map(([key, amount]) => {
                const [yr, mo] = key.split('-')
                const label = `${MONTH_LABELS[Number(mo) - 1]} ${yr}`
                const maxAmount = Math.max(...history.map(([, a]) => a))
                const barPct = Math.round((amount / maxAmount) * 100)
                return (
                  <div key={key} className="flex items-center gap-3 mb-2">
                    <span className="text-xs w-16 shrink-0" style={{ color: 'var(--muted)' }}>{label}</span>
                    <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'var(--surface2)' }}>
                      <div className="h-full rounded-full" style={{ width: `${barPct}%`, background: 'var(--accent)' }} />
                    </div>
                    <span className="text-xs font-medium w-20 text-right shrink-0">{formatShortISK(amount)}</span>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="card text-center py-8" style={{ color: 'var(--muted)' }}>
              Engar leigar skráðar ennþá. Byrjaðu á að bæta við leigu!
            </div>
          )}

          {items.length > 0 && (
            <div className="card">
              <h3 className="text-sm font-semibold mb-3">Hlutir</h3>
              {items.map(item => {
                const itemBookings = bookings.filter(b => b.itemId === item.id)
                const itemTotal = itemBookings.reduce((s, b) => s + b.amount, 0)
                return (
                  <div key={item.id} className="flex items-center gap-3 mb-2 last:mb-0">
                    <span className="text-xl">{item.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium">{item.name}</div>
                      <div className="text-xs" style={{ color: 'var(--muted)' }}>
                        {formatISK(item.pricePerDay)}/dagur · {itemBookings.length} leigar · {formatISK(itemTotal)} samtals
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {tab === 'bookings' && (
        <div className="flex flex-col gap-2">
          {bookings.length === 0 ? (
            <div className="card text-center py-8" style={{ color: 'var(--muted)' }}>Engar leigar skráðar ennþá</div>
          ) : bookings.map(b => (
            <BookingRow key={b.id} booking={b} onRemove={removeBooking} onTogglePaid={togglePaid} />
          ))}
        </div>
      )}

      {tab === 'items' && (
        <div className="flex flex-col gap-3">
          {items.map(item => (
            <div key={item.id} className="card flex items-center gap-3">
              <span className="text-2xl">{item.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium">{item.name}</div>
                <div className="text-xs" style={{ color: 'var(--muted)' }}>{formatISK(item.pricePerDay)} á dag</div>
              </div>
              {items.length > 1 && (
                <button onClick={() => removeItem(item.id)} style={{ color: 'var(--muted)' }}>
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          ))}

          {showItemForm ? (
            <form onSubmit={handleAddItem} className="card flex flex-col gap-3 animate-slide-up">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm">Nýr hlutur</h3>
                <button type="button" onClick={() => setShowItemForm(false)}><X size={16} style={{ color: 'var(--muted)' }} /></button>
              </div>
              <div className="flex gap-2">
                <input className="input text-sm" style={{ width: 52, textAlign: 'center' }}
                  placeholder="🏠" value={iIcon} onChange={e => setIIcon(e.target.value)} maxLength={2} />
                <input className="input text-sm flex-1" placeholder="Nafn hluts" value={iName} onChange={e => setIName(e.target.value)} required />
              </div>
              <input className="input text-sm" type="number" placeholder="Verð á dag (ISK)" value={iPrice} onChange={e => setIPrice(e.target.value)} required />
              <button type="submit" className="btn btn-primary w-full justify-center">Bæta við hlut</button>
            </form>
          ) : (
            <button onClick={() => setShowItemForm(true)} className="btn btn-ghost w-full justify-center">
              <Plus size={16} /> Bæta við hlut
            </button>
          )}
        </div>
      )}
    </div>
  )
}
