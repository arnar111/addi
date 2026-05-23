import { useState } from 'react'
import { useLendo } from '../hooks/useLendo'
import { formatISK, formatShortISK } from '../utils/currency'
import { Plus, Trash2, X, TrendingUp, Target, Calendar, Package } from 'lucide-react'

function BookingCard({ booking, items, onRemove }) {
  const item = items.find(i => i.id === booking.itemId)
  const isUpcoming = new Date(booking.dateFrom) >= new Date(new Date().toISOString().split('T')[0])

  return (
    <div className="card flex items-center gap-3 py-3"
         style={{ borderColor: isUpcoming ? 'rgba(0,212,170,0.25)' : 'var(--border)' }}>
      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-lg"
           style={{ background: isUpcoming ? 'rgba(0,212,170,0.12)' : 'var(--surface2)' }}>
        🪑
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate">{booking.clientName}</div>
        <div className="text-xs truncate" style={{ color: 'var(--muted)' }}>
          {item?.name || 'Vara'} · {new Date(booking.dateFrom).toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })}
          {booking.dateTo !== booking.dateFrom && ` – ${new Date(booking.dateTo).toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })}`}
        </div>
        {booking.note && <div className="text-xs mt-0.5 truncate" style={{ color: 'var(--muted)' }}>{booking.note}</div>}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <span className="font-semibold text-sm" style={{ color: 'var(--accent)' }}>{formatShortISK(booking.price)}</span>
        <button onClick={() => onRemove(booking.id)} style={{ color: 'var(--muted)' }}>
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  )
}

export default function Lendo() {
  const { bookings, addBooking, removeBooking, goal, setGoal, items, addItem, removeItem,
    currentMonthIncome, goalPct, upcomingBookings, currentMonthBookings } = useLendo()

  const [tab, setTab] = useState('yfirlit')
  const [showForm, setShowForm] = useState(false)
  const [showItemForm, setShowItemForm] = useState(false)
  const [showGoalEdit, setShowGoalEdit] = useState(false)

  const [clientName, setClientName] = useState('')
  const [selectedItem, setSelectedItem] = useState(items[0]?.id || '')
  const [customPrice, setCustomPrice] = useState('')
  const [dateFrom, setDateFrom] = useState(new Date().toISOString().split('T')[0])
  const [dateTo, setDateTo] = useState(new Date().toISOString().split('T')[0])
  const [note, setNote] = useState('')
  const [useCustomPrice, setUseCustomPrice] = useState(false)

  const [newItemName, setNewItemName] = useState('')
  const [newItemPrice, setNewItemPrice] = useState('')

  const item = items.find(i => i.id === selectedItem)
  const price = useCustomPrice ? Number(customPrice) : (item?.price || 0)

  const handleAdd = (e) => {
    e.preventDefault()
    if (!clientName.trim() || !price) return
    addBooking({ clientName: clientName.trim(), itemId: selectedItem, price, dateFrom, dateTo, note })
    setClientName('')
    setNote('')
    setCustomPrice('')
    setUseCustomPrice(false)
    setShowForm(false)
  }

  const handleAddItem = (e) => {
    e.preventDefault()
    if (!newItemName.trim() || !newItemPrice) return
    addItem(newItemName.trim(), newItemPrice)
    setNewItemName('')
    setNewItemPrice('')
    setShowItemForm(false)
  }

  const isOver = currentMonthIncome >= goal
  const monthName = new Date().toLocaleDateString('is-IS', { month: 'long' })
  const upcoming = upcomingBookings()
  const thisMonthAll = currentMonthBookings()

  const TABS = [['yfirlit', 'Yfirlit'], ['bokkanir', 'Bókanir'], ['vorur', 'Vörur']]

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold">Lendó</h1>
            <span className="badge text-xs" style={{ background: 'rgba(0,212,170,0.12)', color: 'var(--accent)' }}>
              Leiga
            </span>
          </div>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>Veisluútleiga · {monthName}</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          <Plus size={16} /> Bókun
        </button>
      </div>

      {/* Add booking form */}
      {showForm && (
        <form onSubmit={handleAdd} className="card flex flex-col gap-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Ný bókun</h3>
            <button type="button" onClick={() => setShowForm(false)}><X size={16} style={{ color: 'var(--muted)' }} /></button>
          </div>
          <input className="input" placeholder="Nafn viðskiptavinar" value={clientName}
            onChange={e => setClientName(e.target.value)} autoFocus required />
          <div className="flex flex-col gap-1.5">
            <label className="text-xs" style={{ color: 'var(--muted)' }}>Vara</label>
            <div className="flex flex-col gap-1.5">
              {items.map(it => (
                <button key={it.id} type="button" onClick={() => { setSelectedItem(it.id); setUseCustomPrice(false) }}
                  className="flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all"
                  style={{
                    background: selectedItem === it.id && !useCustomPrice ? 'rgba(0,212,170,0.12)' : 'var(--surface2)',
                    border: `1px solid ${selectedItem === it.id && !useCustomPrice ? 'rgba(0,212,170,0.4)' : 'transparent'}`,
                    color: selectedItem === it.id && !useCustomPrice ? 'var(--accent)' : 'var(--text)',
                  }}>
                  <span>{it.name}</span>
                  <span style={{ color: 'var(--muted)' }}>{formatShortISK(it.price)}</span>
                </button>
              ))}
              <button type="button" onClick={() => setUseCustomPrice(true)}
                className="flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all"
                style={{
                  background: useCustomPrice ? 'rgba(139,92,246,0.12)' : 'var(--surface2)',
                  border: `1px solid ${useCustomPrice ? 'rgba(139,92,246,0.4)' : 'transparent'}`,
                  color: useCustomPrice ? '#8b5cf6' : 'var(--muted)',
                }}>
                Sérsniðið verð
              </button>
            </div>
          </div>
          {useCustomPrice && (
            <input className="input" type="number" placeholder="Verð (ISK)" value={customPrice}
              onChange={e => setCustomPrice(e.target.value)} required />
          )}
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <label className="text-xs" style={{ color: 'var(--muted)' }}>Frá</label>
              <input className="input text-sm" type="date" value={dateFrom} onChange={e => { setDateFrom(e.target.value); if (dateTo < e.target.value) setDateTo(e.target.value) }} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs" style={{ color: 'var(--muted)' }}>Til</label>
              <input className="input text-sm" type="date" value={dateTo} min={dateFrom} onChange={e => setDateTo(e.target.value)} />
            </div>
          </div>
          <input className="input" placeholder="Athugasemd (valkvæmt)" value={note} onChange={e => setNote(e.target.value)} />
          {price > 0 && (
            <div className="flex items-center justify-between px-1">
              <span className="text-sm" style={{ color: 'var(--muted)' }}>Verð</span>
              <span className="font-semibold" style={{ color: 'var(--accent)' }}>{formatISK(price)}</span>
            </div>
          )}
          <button type="submit" className="btn btn-primary w-full justify-center">Skrá bókun</button>
        </form>
      )}

      {/* Goal card */}
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.08), rgba(139,92,246,0.08))' }}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Tekjur þessa mánaðar</div>
            <div className="text-3xl font-semibold" style={{ color: isOver ? 'var(--success)' : 'var(--text)' }}>
              {formatISK(currentMonthIncome)}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Markmið</div>
            <button onClick={() => setShowGoalEdit(!showGoalEdit)}
              className="text-lg font-semibold" style={{ color: 'var(--muted)' }}>
              {formatShortISK(goal)}
            </button>
          </div>
        </div>
        {showGoalEdit && (
          <div className="mb-4 flex gap-2">
            <input className="input text-sm flex-1" type="number" value={goal}
              onChange={e => setGoal(Number(e.target.value))} />
            <button onClick={() => setShowGoalEdit(false)} className="btn btn-primary text-sm py-2">Vista</button>
          </div>
        )}
        <div className="h-2.5 rounded-full overflow-hidden mb-1" style={{ background: 'var(--surface2)' }}>
          <div className="h-full rounded-full transition-all"
               style={{ width: `${goalPct}%`, background: isOver ? 'var(--success)' : goalPct > 75 ? '#f97316' : 'var(--accent)' }} />
        </div>
        <div className="flex justify-between text-xs" style={{ color: 'var(--muted)' }}>
          <span>{goalPct}% af markmiði</span>
          <span>{thisMonthAll.length} bókanir</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {TABS.map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)}
            className="btn text-sm flex-1 justify-center"
            style={{
              background: tab === t ? 'rgba(0,212,170,0.12)' : 'var(--surface)',
              color: tab === t ? 'var(--accent)' : 'var(--muted)',
              border: `1px solid ${tab === t ? 'rgba(0,212,170,0.25)' : 'var(--border)'}`,
            }}>{l}</button>
        ))}
      </div>

      {/* Overview tab */}
      {tab === 'yfirlit' && (
        <div className="flex flex-col gap-3">
          {upcoming.length > 0 && (
            <div className="card flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Calendar size={15} style={{ color: 'var(--accent)' }} />
                <h3 className="font-semibold text-sm">Komandi bókanir</h3>
              </div>
              {upcoming.map(b => (
                <BookingCard key={b.id} booking={b} items={items} onRemove={removeBooking} />
              ))}
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <div className="card text-center py-4">
              <div className="text-2xl font-semibold mb-1" style={{ color: 'var(--accent)' }}>
                {thisMonthAll.length}
              </div>
              <div className="text-xs" style={{ color: 'var(--muted)' }}>Bókanir í mánuðinum</div>
            </div>
            <div className="card text-center py-4">
              <div className="text-2xl font-semibold mb-1" style={{ color: 'var(--accent)' }}>
                {thisMonthAll.length > 0 ? formatShortISK(currentMonthIncome / thisMonthAll.length) : '–'}
              </div>
              <div className="text-xs" style={{ color: 'var(--muted)' }}>Meðalverð</div>
            </div>
          </div>
          {goal - currentMonthIncome > 0 && (
            <div className="card flex items-center gap-3" style={{ borderColor: 'rgba(249,115,22,0.25)' }}>
              <Target size={18} style={{ color: '#f97316' }} />
              <div className="flex-1">
                <div className="text-sm font-medium">
                  {formatISK(goal - currentMonthIncome)} vantar
                </div>
                <div className="text-xs" style={{ color: 'var(--muted)' }}>
                  til að ná {formatShortISK(goal)} markmiðinu
                </div>
              </div>
            </div>
          )}
          {isOver && (
            <div className="card flex items-center gap-3" style={{ borderColor: 'rgba(34,197,94,0.3)' }}>
              <TrendingUp size={18} style={{ color: 'var(--success)' }} />
              <div>
                <div className="text-sm font-medium" style={{ color: 'var(--success)' }}>Markmið náð! 🎉</div>
                <div className="text-xs" style={{ color: 'var(--muted)' }}>+{formatISK(currentMonthIncome - goal)} yfir markmiði</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Bookings tab */}
      {tab === 'bokkanir' && (
        <div className="flex flex-col gap-2">
          {bookings.length === 0 ? (
            <div className="card text-center py-8" style={{ color: 'var(--muted)' }}>Engar bókanir enn</div>
          ) : bookings.map(b => (
            <BookingCard key={b.id} booking={b} items={items} onRemove={removeBooking} />
          ))}
        </div>
      )}

      {/* Items tab */}
      {tab === 'vorur' && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm px-1">Vörulisti</h3>
            <button onClick={() => setShowItemForm(!showItemForm)} className="btn btn-ghost text-xs py-1.5">
              <Plus size={14} /> Vara
            </button>
          </div>
          {showItemForm && (
            <form onSubmit={handleAddItem} className="card flex flex-col gap-3 animate-slide-up">
              <input className="input text-sm" placeholder="Heiti vöru" value={newItemName}
                onChange={e => setNewItemName(e.target.value)} autoFocus required />
              <input className="input text-sm" type="number" placeholder="Verð (ISK)" value={newItemPrice}
                onChange={e => setNewItemPrice(e.target.value)} required />
              <div className="flex gap-2">
                <button type="submit" className="btn btn-primary flex-1 justify-center text-sm">Bæta við</button>
                <button type="button" onClick={() => setShowItemForm(false)} className="btn btn-ghost"><X size={16} /></button>
              </div>
            </form>
          )}
          {items.map(it => (
            <div key={it.id} className="card flex items-center gap-3 py-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base shrink-0"
                   style={{ background: 'var(--surface2)' }}>🪑</div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium">{it.name}</div>
                <div className="text-xs" style={{ color: 'var(--muted)' }}>
                  {bookings.filter(b => b.itemId === it.id).length} bókanir
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="font-semibold text-sm" style={{ color: 'var(--accent)' }}>{formatShortISK(it.price)}</span>
                <button onClick={() => removeItem(it.id)} style={{ color: 'var(--muted)' }}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
