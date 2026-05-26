import { useState } from 'react'
import { useLendo } from '../hooks/useLendo'
import { formatISK, formatShortISK } from '../utils/currency'
import { Plus, Trash2, X, TrendingUp, Flame, Target, Package } from 'lucide-react'

function BookingRow({ booking, onRemove }) {
  return (
    <div className="flex items-center gap-3 py-3 border-b last:border-0"
         style={{ borderColor: 'var(--border)' }}>
      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0"
           style={{ background: 'rgba(0,212,170,0.1)' }}>
        {booking.itemIcon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate">{booking.itemName}</div>
        <div className="text-xs" style={{ color: 'var(--muted)' }}>
          {new Date(booking.date).toLocaleDateString('is-IS', { weekday: 'short', month: 'short', day: 'numeric' })}
          {booking.note ? ` · ${booking.note}` : ''}
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <span className="font-semibold text-sm" style={{ color: 'var(--success)' }}>
          +{formatShortISK(booking.price)}
        </span>
        <button onClick={() => onRemove(booking.id)} style={{ color: 'var(--muted)' }}>
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  )
}

export default function Lendo() {
  const { bookings, recentBookings, items, goal, setGoal, addBooking, removeBooking,
          addItem, monthlyRevenue, thisMonthBookings, totalRevenue, streak } = useLendo()

  const [showForm, setShowForm] = useState(false)
  const [showAddItem, setShowAddItem] = useState(false)
  const [showGoalEdit, setShowGoalEdit] = useState(false)
  const [tab, setTab] = useState('overview')

  const [selectedItem, setSelectedItem] = useState(items[0]?.id || '')
  const [customPrice, setCustomPrice] = useState('')
  const [bookDate, setBookDate] = useState(new Date().toISOString().split('T')[0])
  const [bookNote, setBookNote] = useState('')

  const [newItemName, setNewItemName] = useState('')
  const [newItemPrice, setNewItemPrice] = useState('')
  const [newItemIcon, setNewItemIcon] = useState('📦')

  const [newGoal, setNewGoal] = useState(String(goal))

  const revenue = monthlyRevenue()
  const pct = Math.min(100, Math.round((revenue / goal) * 100))

  const handleAddBooking = (e) => {
    e.preventDefault()
    const item = items.find(i => i.id === selectedItem)
    const price = customPrice ? Number(customPrice) : item?.price || 0
    if (!price) return
    addBooking(selectedItem, price, bookDate, bookNote)
    setCustomPrice('')
    setBookNote('')
    setShowForm(false)
  }

  const handleAddItem = (e) => {
    e.preventDefault()
    if (!newItemName || !newItemPrice) return
    addItem(newItemName, newItemPrice, newItemIcon)
    setNewItemName('')
    setNewItemPrice('')
    setNewItemIcon('📦')
    setShowAddItem(false)
  }

  const monthName = new Date().toLocaleDateString('is-IS', { month: 'long', year: 'numeric' })

  return (
    <div className="flex flex-col gap-4 pb-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold flex items-center gap-2">
            🏠 Lendo
          </h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>{monthName}</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary text-sm">
          <Plus size={15} /> Leiga
        </button>
      </div>

      {/* Add booking form */}
      {showForm && (
        <form onSubmit={handleAddBooking} className="card flex flex-col gap-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Skrá leigutekjur</h3>
            <button type="button" onClick={() => setShowForm(false)}>
              <X size={16} style={{ color: 'var(--muted)' }} />
            </button>
          </div>

          <div>
            <label className="text-xs mb-1.5 block" style={{ color: 'var(--muted)' }}>Hlutur</label>
            <div className="grid grid-cols-2 gap-2">
              {items.map(item => (
                <button key={item.id} type="button" onClick={() => setSelectedItem(item.id)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all"
                  style={{
                    background: selectedItem === item.id ? 'rgba(0,212,170,0.12)' : 'var(--surface2)',
                    border: `1px solid ${selectedItem === item.id ? 'rgba(0,212,170,0.3)' : 'transparent'}`,
                    color: selectedItem === item.id ? 'var(--accent)' : 'var(--text)',
                  }}>
                  <span>{item.icon}</span>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="text-xs font-medium truncate">{item.name}</div>
                    <div className="text-xs" style={{ color: 'var(--muted)' }}>{formatShortISK(item.price)}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <input className="input" type="number"
            placeholder={`Verð (sjálfgefið: ${formatISK(items.find(i => i.id === selectedItem)?.price || 0)})`}
            value={customPrice} onChange={e => setCustomPrice(e.target.value)} />
          <input className="input" type="date" value={bookDate} onChange={e => setBookDate(e.target.value)} />
          <input className="input" placeholder="Athugasemd (valkvæmt)" value={bookNote} onChange={e => setBookNote(e.target.value)} />
          <button type="submit" className="btn btn-primary w-full justify-center">Skrá leigutekjur</button>
        </form>
      )}

      {/* Revenue overview */}
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.08), rgba(139,92,246,0.06))' }}>
        <div className="flex justify-between items-start mb-3">
          <div>
            <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Tekjur þennan mánuð</div>
            <div className="text-3xl font-bold" style={{ color: 'var(--accent)' }}>
              {formatISK(revenue)}
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            {streak > 0 && (
              <div className="flex items-center gap-1 text-sm font-semibold" style={{ color: '#f97316' }}>
                <Flame size={14} /> {streak} daga streak
              </div>
            )}
            <button onClick={() => setShowGoalEdit(!showGoalEdit)} className="text-xs" style={{ color: 'var(--muted)' }}>
              <Target size={12} className="inline mr-1" />
              Markmið: {formatShortISK(goal)}
            </button>
          </div>
        </div>

        {showGoalEdit && (
          <div className="flex gap-2 mb-3">
            <input className="input text-sm flex-1" type="number" value={newGoal}
              onChange={e => setNewGoal(e.target.value)}
              placeholder="Mánaðarlegt markmið (ISK)" />
            <button className="btn btn-primary text-sm"
              onClick={() => { setGoal(Number(newGoal)); setShowGoalEdit(false) }}>
              Vista
            </button>
          </div>
        )}

        <div className="h-2.5 rounded-full overflow-hidden mb-1.5" style={{ background: 'var(--surface2)' }}>
          <div className="h-full rounded-full transition-all duration-700"
               style={{ width: `${pct}%`, background: pct >= 100 ? 'var(--success)' : 'var(--accent)' }} />
        </div>
        <div className="flex justify-between text-xs" style={{ color: 'var(--muted)' }}>
          <span>{pct}% af markmiði</span>
          <span>{formatShortISK(Math.max(0, goal - revenue))} eftir</span>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'Leigur í mánuð', value: thisMonthBookings.length, icon: '📅' },
          { label: 'Meðaltal/leiga', value: thisMonthBookings.length ? formatShortISK(Math.round(revenue / thisMonthBookings.length)) : '0', icon: '📊' },
          { label: 'Heildartek.', value: formatShortISK(totalRevenue), icon: '💰' },
        ].map(s => (
          <div key={s.label} className="card-sm flex flex-col items-center gap-1 text-center">
            <span className="text-xl">{s.icon}</span>
            <span className="font-bold text-sm">{s.value}</span>
            <span className="text-xs" style={{ color: 'var(--muted)', fontSize: 10 }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {[['overview', 'Yfirlit'], ['bookings', 'Leigur'], ['items', 'Hlutir']].map(([t, l]) => (
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
        <div className="card">
          <div className="text-sm font-semibold mb-3">Síðustu leigur</div>
          {recentBookings.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-3xl mb-2">🏠</div>
              <div className="text-sm" style={{ color: 'var(--muted)' }}>Engar leigur skráðar ennþá</div>
              <button onClick={() => setShowForm(true)} className="btn btn-primary mt-3 text-sm">
                <Plus size={14} /> Skrá fyrstu leiguna
              </button>
            </div>
          ) : (
            recentBookings.map(b => <BookingRow key={b.id} booking={b} onRemove={removeBooking} />)
          )}
        </div>
      )}

      {tab === 'bookings' && (
        <div className="flex flex-col gap-2">
          {bookings.length === 0 ? (
            <div className="card text-center py-8" style={{ color: 'var(--muted)' }}>Engar leigur skráðar</div>
          ) : (
            <div className="card">
              {bookings.map(b => <BookingRow key={b.id} booking={b} onRemove={removeBooking} />)}
            </div>
          )}
        </div>
      )}

      {tab === 'items' && (
        <div className="flex flex-col gap-3">
          <div className="card">
            <div className="flex items-center justify-between mb-3">
              <div className="font-semibold text-sm flex items-center gap-2">
                <Package size={15} /> Leiguhlutar
              </div>
              <button onClick={() => setShowAddItem(!showAddItem)}
                      className="text-xs" style={{ color: 'var(--accent)' }}>
                + Nýr hlutur
              </button>
            </div>

            {showAddItem && (
              <form onSubmit={handleAddItem} className="flex flex-col gap-2 mb-4 p-3 rounded-xl"
                    style={{ background: 'var(--surface2)' }}>
                <div className="flex gap-2">
                  <input className="input flex-1 text-sm" placeholder="Nafn hlutarins"
                    value={newItemName} onChange={e => setNewItemName(e.target.value)} autoFocus />
                  <input className="input w-16 text-center text-lg" placeholder="🎁"
                    value={newItemIcon} onChange={e => setNewItemIcon(e.target.value)} />
                </div>
                <input className="input text-sm" type="number" placeholder="Verð (ISK)"
                  value={newItemPrice} onChange={e => setNewItemPrice(e.target.value)} />
                <button type="submit" className="btn btn-primary text-sm justify-center">Bæta við</button>
              </form>
            )}

            <div className="flex flex-col gap-2">
              {items.map(item => {
                const timesRented = bookings.filter(b => b.itemId === item.id).length
                const earned = bookings.filter(b => b.itemId === item.id).reduce((s, b) => s + b.price, 0)
                return (
                  <div key={item.id} className="flex items-center gap-3 py-2 border-b last:border-0"
                       style={{ borderColor: 'var(--border)' }}>
                    <span className="text-2xl">{item.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium">{item.name}</div>
                      <div className="text-xs" style={{ color: 'var(--muted)' }}>
                        {formatISK(item.price)} · {timesRented}x leigt · {formatShortISK(earned)} total
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
