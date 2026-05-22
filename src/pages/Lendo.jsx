import { useState } from 'react'
import { useLendo } from '../hooks/useLendo'
import { Plus, Trash2, X, TrendingUp, Package, Target, Calendar } from 'lucide-react'

function formatISK(n) {
  return n.toLocaleString('is-IS') + ' kr'
}

function formatShort(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M'
  if (n >= 1000) return Math.round(n / 1000) + 'þ'
  return String(n)
}

export default function Lendo() {
  const {
    items, bookings, monthlyGoal, monthlyIncome, monthlyBookings,
    totalIncome, totalBookings, byItem, addBooking, removeBooking, addItem, removeItem,
  } = useLendo()

  const [tab, setTab] = useState('overview')
  const [showBookingForm, setShowBookingForm] = useState(false)
  const [showItemForm, setShowItemForm] = useState(false)
  const [selectedItem, setSelectedItem] = useState(items[0]?.id || null)
  const [days, setDays] = useState('1')
  const [bookingDate, setBookingDate] = useState(new Date().toISOString().slice(0, 10))
  const [bookingNote, setBookingNote] = useState('')

  const [newItemName, setNewItemName] = useState('')
  const [newItemPrice, setNewItemPrice] = useState('')
  const [newItemIcon, setNewItemIcon] = useState('📦')

  const goalPct = Math.min(100, Math.round((monthlyIncome / monthlyGoal) * 100))
  const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate()
  const dayOfMonth = new Date().getDate()
  const projectedIncome = dayOfMonth > 0 ? Math.round((monthlyIncome / dayOfMonth) * daysInMonth) : 0
  const avgPerBooking = totalBookings > 0 ? Math.round(totalIncome / totalBookings) : 0

  function handleAddBooking(e) {
    e.preventDefault()
    if (!selectedItem || !days) return
    addBooking(Number(selectedItem), Number(days), bookingDate, bookingNote)
    setDays('1')
    setBookingNote('')
    setShowBookingForm(false)
  }

  function handleAddItem(e) {
    e.preventDefault()
    if (!newItemName || !newItemPrice) return
    addItem(newItemName, Number(newItemPrice), 'dag', newItemIcon)
    setNewItemName('')
    setNewItemPrice('')
    setNewItemIcon('📦')
    setShowItemForm(false)
  }

  const selectedItemObj = items.find(i => i.id === Number(selectedItem))
  const estimatedRevenue = selectedItemObj ? selectedItemObj.price * Number(days || 1) : 0

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold flex items-center gap-2">
            <span className="text-2xl">🏠</span> Lendó
          </h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>Leigutekjur þínar</p>
        </div>
        <button onClick={() => setShowBookingForm(true)} className="btn btn-primary">
          <Plus size={16} /> Bókun
        </button>
      </div>

      {/* Monthly goal card */}
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.1), rgba(139,92,246,0.06))', border: '1px solid rgba(0,212,170,0.2)' }}>
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>
              {new Date().toLocaleDateString('is-IS', { month: 'long', year: 'numeric' })}
            </div>
            <div className="text-3xl font-bold" style={{ color: 'var(--accent)' }}>
              {formatISK(monthlyIncome)}
            </div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
              Markmið: {formatISK(monthlyGoal)}
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold" style={{ color: goalPct >= 100 ? 'var(--success)' : 'var(--text)' }}>
              {goalPct}%
            </div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>náð</div>
          </div>
        </div>
        <div className="h-3 rounded-full overflow-hidden mb-2" style={{ background: 'var(--surface2)' }}>
          <div className="h-full rounded-full transition-all"
               style={{ width: `${goalPct}%`, background: goalPct >= 100 ? 'var(--success)' : 'var(--accent)' }} />
        </div>
        <div className="grid grid-cols-3 gap-2 mt-3">
          <div className="flex flex-col items-center p-2 rounded-xl" style={{ background: 'var(--surface2)' }}>
            <div className="text-base font-bold">{monthlyBookings.length}</div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>Bókanir</div>
          </div>
          <div className="flex flex-col items-center p-2 rounded-xl" style={{ background: 'var(--surface2)' }}>
            <div className="text-base font-bold">{formatShort(projectedIncome)}</div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>Spá mán.</div>
          </div>
          <div className="flex flex-col items-center p-2 rounded-xl" style={{ background: 'var(--surface2)' }}>
            <div className="text-base font-bold">{formatShort(monthlyGoal - monthlyIncome)}</div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>Vantar</div>
          </div>
        </div>
      </div>

      {/* Booking form */}
      {showBookingForm && (
        <form onSubmit={handleAddBooking} className="card flex flex-col gap-3 animate-slide-up"
              style={{ border: '1px solid rgba(0,212,170,0.25)' }}>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Ný bókun</h3>
            <button type="button" onClick={() => setShowBookingForm(false)}>
              <X size={18} style={{ color: 'var(--muted)' }} />
            </button>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs" style={{ color: 'var(--muted)' }}>Hlutur</label>
            <div className="grid grid-cols-1 gap-1.5">
              {items.map(item => (
                <button key={item.id} type="button"
                  onClick={() => setSelectedItem(item.id)}
                  className="flex items-center gap-3 p-3 rounded-xl text-sm text-left transition-all"
                  style={{
                    background: selectedItem === item.id ? `rgba(0,212,170,0.12)` : 'var(--surface2)',
                    border: `1px solid ${selectedItem === item.id ? 'rgba(0,212,170,0.35)' : 'transparent'}`,
                  }}>
                  <span className="text-lg">{item.icon}</span>
                  <div className="flex-1">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs" style={{ color: 'var(--muted)' }}>{formatISK(item.price)}/{item.unit}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs" style={{ color: 'var(--muted)' }}>Dagarnir</label>
              <input className="input" type="number" min="1" value={days}
                onChange={e => setDays(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs" style={{ color: 'var(--muted)' }}>Dagsetning</label>
              <input className="input" type="date" value={bookingDate}
                onChange={e => setBookingDate(e.target.value)} />
            </div>
          </div>
          <input className="input" placeholder="Skýring (t.d. Afmæli, Brúðkaup)" value={bookingNote}
            onChange={e => setBookingNote(e.target.value)} />
          <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'var(--surface2)' }}>
            <span className="text-sm" style={{ color: 'var(--muted)' }}>Áætlaðar tekjur</span>
            <span className="font-bold" style={{ color: 'var(--accent)' }}>{formatISK(estimatedRevenue)}</span>
          </div>
          <button type="submit" className="btn btn-primary w-full justify-center">Staðfesta bókun</button>
        </form>
      )}

      {/* Tabs */}
      <div className="flex gap-2">
        {[['overview', 'Yfirlit'], ['bookings', 'Bókanir'], ['items', 'Hlutir']].map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)} className="btn text-sm flex-1 justify-center"
            style={{
              background: tab === t ? 'rgba(0,212,170,0.12)' : 'var(--surface)',
              color: tab === t ? 'var(--accent)' : 'var(--muted)',
              border: `1px solid ${tab === t ? 'rgba(0,212,170,0.25)' : 'var(--border)'}`,
            }}>{l}</button>
        ))}
      </div>

      {/* Overview tab */}
      {tab === 'overview' && (
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="card flex flex-col gap-1">
              <div className="text-xs" style={{ color: 'var(--muted)' }}>Heildartekjur</div>
              <div className="text-xl font-bold" style={{ color: 'var(--accent)' }}>{formatISK(totalIncome)}</div>
            </div>
            <div className="card flex flex-col gap-1">
              <div className="text-xs" style={{ color: 'var(--muted)' }}>Meðaltal/bókun</div>
              <div className="text-xl font-bold">{formatISK(avgPerBooking)}</div>
            </div>
          </div>
          <div className="card">
            <h3 className="text-sm font-semibold mb-3">Tekjur eftir hlut</h3>
            <div className="flex flex-col gap-3">
              {byItem.map(item => (
                <div key={item.id}>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="flex items-center gap-1.5">
                      <span>{item.icon}</span>
                      <span className="font-medium">{item.name}</span>
                    </span>
                    <span style={{ color: 'var(--accent)' }}>{formatISK(item.revenue)} · {item.count}x</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--surface2)' }}>
                    <div className="h-full rounded-full"
                         style={{ width: totalIncome > 0 ? `${Math.round((item.revenue / totalIncome) * 100)}%` : '0%', background: item.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bookings tab */}
      {tab === 'bookings' && (
        <div className="flex flex-col gap-2">
          {bookings.length === 0 ? (
            <div className="card text-center py-10" style={{ color: 'var(--muted)' }}>
              <div className="text-3xl mb-2">📭</div>
              <div>Engar bókanir ennþá</div>
            </div>
          ) : bookings.map(b => {
            const item = items.find(i => i.id === b.itemId)
            return (
              <div key={b.id} className="card flex items-center gap-3 py-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
                     style={{ background: 'var(--surface2)' }}>{item?.icon || '📦'}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold" style={{ color: 'var(--accent)' }}>{formatISK(b.amount)}</div>
                  <div className="text-xs" style={{ color: 'var(--muted)' }}>
                    {b.itemName} · {b.days} dag{b.days > 1 ? 'ar' : 'ur'}
                    {b.note ? ` · ${b.note}` : ''}
                  </div>
                  <div className="text-xs" style={{ color: 'var(--muted)' }}>
                    {new Date(b.date).toLocaleDateString('is-IS', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </div>
                </div>
                <button onClick={() => removeBooking(b.id)} style={{ color: 'var(--muted)' }}>
                  <Trash2 size={14} />
                </button>
              </div>
            )
          })}
        </div>
      )}

      {/* Items tab */}
      {tab === 'items' && (
        <div className="flex flex-col gap-3">
          {items.map(item => (
            <div key={item.id} className="card flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                   style={{ background: `${item.color}22` }}>{item.icon}</div>
              <div className="flex-1">
                <div className="font-medium text-sm">{item.name}</div>
                <div className="text-xs" style={{ color: 'var(--muted)' }}>{formatISK(item.price)}/{item.unit}</div>
              </div>
              <button onClick={() => removeItem(item.id)} style={{ color: 'var(--muted)' }}>
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          {showItemForm ? (
            <form onSubmit={handleAddItem} className="card flex flex-col gap-3 animate-slide-up">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">Nýr hlutur</span>
                <button type="button" onClick={() => setShowItemForm(false)}>
                  <X size={16} style={{ color: 'var(--muted)' }} />
                </button>
              </div>
              <input className="input" placeholder="Nafn hlutar" value={newItemName} onChange={e => setNewItemName(e.target.value)} />
              <input className="input" placeholder="Verð (ISK/dag)" type="number" value={newItemPrice} onChange={e => setNewItemPrice(e.target.value)} />
              <input className="input" placeholder="Tákn 📦" value={newItemIcon} onChange={e => setNewItemIcon(e.target.value)} />
              <button type="submit" className="btn btn-primary w-full justify-center">Bæta við</button>
            </form>
          ) : (
            <button onClick={() => setShowItemForm(true)} className="btn w-full justify-center"
                    style={{ border: '1px dashed var(--border)', color: 'var(--muted)' }}>
              <Plus size={16} /> Bæta við hlut
            </button>
          )}
        </div>
      )}
    </div>
  )
}
