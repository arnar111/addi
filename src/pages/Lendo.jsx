import { useState } from 'react'
import { useLendo } from '../hooks/useLendo'
import { formatISK, formatShortISK } from '../utils/currency'
import { Plus, Trash2, X, Package, Calendar, TrendingUp, Check } from 'lucide-react'

const STATUS_COLOR = { confirmed: 'var(--accent)', pending: '#f97316', cancelled: 'var(--danger)', completed: 'var(--muted)' }
const STATUS_LABEL = { confirmed: 'Staðfest', pending: 'Bíður', cancelled: 'Afbókað', completed: 'Lokið' }

function BookingForm({ items, onAdd, onClose }) {
  const [itemId, setItemId] = useState(items[0]?.id || '')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [customer, setCustomer] = useState('')
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')

  const selectedItem = items.find(i => i.id === itemId)

  const calcAmount = () => {
    if (!startDate || !endDate || !selectedItem) return
    const days = Math.max(1, Math.ceil((new Date(endDate) - new Date(startDate)) / 86400000) + 1)
    setAmount(String(selectedItem.pricePerDay * days))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!itemId || !startDate || !amount) return
    onAdd({
      itemId,
      itemName: selectedItem?.name || '',
      startDate,
      endDate: endDate || startDate,
      customer,
      amount: Number(amount),
      note,
      status: 'confirmed',
    })
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="card flex flex-col gap-3 animate-slide-up">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm">Ný bókun</h3>
        <button type="button" onClick={onClose}><X size={16} style={{ color: 'var(--muted)' }} /></button>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs" style={{ color: 'var(--muted)' }}>Hlutur</label>
        <select className="input text-sm" value={itemId} onChange={e => setItemId(e.target.value)}>
          {items.map(i => (
            <option key={i.id} value={i.id}>{i.icon} {i.name} — {formatShortISK(i.pricePerDay)}/dag</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col gap-1">
          <label className="text-xs" style={{ color: 'var(--muted)' }}>Frá</label>
          <input type="date" className="input text-sm" value={startDate}
            onChange={e => { setStartDate(e.target.value); setTimeout(calcAmount, 50) }} required />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs" style={{ color: 'var(--muted)' }}>Til</label>
          <input type="date" className="input text-sm" value={endDate}
            onChange={e => { setEndDate(e.target.value); setTimeout(calcAmount, 50) }} />
        </div>
      </div>

      <button type="button" onClick={calcAmount} className="btn btn-ghost text-xs py-1.5 justify-center"
              style={{ color: 'var(--accent)' }}>
        Reikna upphæð
      </button>

      <div className="flex flex-col gap-1">
        <label className="text-xs" style={{ color: 'var(--muted)' }}>Upphæð (ISK)</label>
        <input type="number" className="input text-sm" value={amount} onChange={e => setAmount(e.target.value)} required />
      </div>

      <input className="input text-sm" placeholder="Nafn viðskiptavinar (valkvæmt)" value={customer} onChange={e => setCustomer(e.target.value)} />
      <input className="input text-sm" placeholder="Skýring / Athugasemd" value={note} onChange={e => setNote(e.target.value)} />

      <button type="submit" className="btn btn-primary w-full justify-center">Bóka</button>
    </form>
  )
}

function ItemForm({ onAdd, onClose }) {
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [icon, setIcon] = useState('📦')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name || !price) return
    onAdd(name, price, icon)
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="card flex flex-col gap-3 animate-slide-up">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm">Nýr hlutur</h3>
        <button type="button" onClick={onClose}><X size={16} style={{ color: 'var(--muted)' }} /></button>
      </div>
      <div className="flex gap-2">
        <input className="input text-sm w-16" placeholder="🎉" value={icon} onChange={e => setIcon(e.target.value)} />
        <input className="input text-sm flex-1" placeholder="Nafn hlutar" value={name} onChange={e => setName(e.target.value)} required />
      </div>
      <input type="number" className="input text-sm" placeholder="Verð á dag (ISK)" value={price} onChange={e => setPrice(e.target.value)} required />
      <button type="submit" className="btn btn-primary justify-center">Bæta við</button>
    </form>
  )
}

export default function Lendo() {
  const { bookings, items, goal, setGoal, monthlyIncome, upcomingBookings, totalAllTime, addBooking, removeBooking, updateBooking, addItem, removeItem, currentMonthBookings } = useLendo()
  const [tab, setTab] = useState('overview')
  const [showBookingForm, setShowBookingForm] = useState(false)
  const [showItemForm, setShowItemForm] = useState(false)
  const [editGoal, setEditGoal] = useState(false)
  const [goalInput, setGoalInput] = useState(String(goal))

  const income = monthlyIncome()
  const pct = Math.min(100, Math.round((income / goal) * 100))
  const upcoming = upcomingBookings()
  const thisMonth = currentMonthBookings()

  const saveGoal = () => {
    setGoal(Number(goalInput))
    setEditGoal(false)
  }

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold">Lendó 🏠</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>Leigurekstur · {bookings.length} bókanir</p>
        </div>
        <button onClick={() => { setShowBookingForm(!showBookingForm); setShowItemForm(false) }} className="btn btn-primary">
          <Plus size={16} /> Bókun
        </button>
      </div>

      {showBookingForm && <BookingForm items={items} onAdd={addBooking} onClose={() => setShowBookingForm(false)} />}
      {showItemForm && <ItemForm onAdd={addItem} onClose={() => setShowItemForm(false)} />}

      {/* Monthly overview */}
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(249,115,22,0.06), rgba(234,179,8,0.06))', border: '1px solid rgba(249,115,22,0.15)' }}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Tekjur þessa mánaðar</div>
            <div className="text-3xl font-bold">{formatISK(income)}</div>
            <div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>{thisMonth().length} leigur</div>
          </div>
          <div className="text-right">
            <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Markmið</div>
            {editGoal ? (
              <div className="flex items-center gap-1">
                <input type="number" className="input text-sm w-28 py-1" value={goalInput} onChange={e => setGoalInput(e.target.value)} />
                <button onClick={saveGoal} className="p-1 rounded-lg" style={{ background: 'var(--accent)', color: '#000' }}>
                  <Check size={14} />
                </button>
              </div>
            ) : (
              <button onClick={() => setEditGoal(true)} className="text-lg font-semibold" style={{ color: 'var(--muted)' }}>
                {formatShortISK(goal)}
              </button>
            )}
          </div>
        </div>
        <div className="h-3 rounded-full overflow-hidden mb-1" style={{ background: 'var(--surface2)' }}>
          <div className="h-full rounded-full transition-all"
               style={{ width: `${pct}%`, background: pct >= 100 ? 'var(--success)' : 'linear-gradient(90deg, #f97316, #eab308)' }} />
        </div>
        <div className="flex justify-between text-xs" style={{ color: 'var(--muted)' }}>
          <span>{pct}% af markmiði</span>
          <span>Samtals: {formatShortISK(totalAllTime())}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {[['overview', '📅 Bókanir'], ['items', '📦 Hlutir']].map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)}
            className="btn shrink-0 text-sm py-2 flex-1 justify-center"
            style={{
              background: tab === t ? 'rgba(249,115,22,0.12)' : 'var(--surface)',
              color: tab === t ? '#f97316' : 'var(--muted)',
              border: `1px solid ${tab === t ? 'rgba(249,115,22,0.25)' : 'var(--border)'}`,
            }}>{l}</button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="flex flex-col gap-3">
          {upcoming.length > 0 && (
            <div>
              <div className="text-xs font-semibold px-1 mb-2" style={{ color: 'var(--muted)' }}>VÆNTANLEGAR BÓKANIR</div>
              {upcoming.map(b => (
                <div key={b.id} className="card flex items-start gap-3 py-3 mb-2">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-base"
                       style={{ background: 'rgba(249,115,22,0.15)' }}>
                    {items.find(i => i.id === b.itemId)?.icon || '📦'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">{b.itemName}</div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                      {new Date(b.startDate).toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })}
                      {b.endDate && b.endDate !== b.startDate ? ` – ${new Date(b.endDate).toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })}` : ''}
                      {b.customer ? ` · ${b.customer}` : ''}
                    </div>
                    {b.note && <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{b.note}</div>}
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="font-semibold text-sm" style={{ color: '#f97316' }}>{formatShortISK(b.amount)}</span>
                    <div className="flex items-center gap-1.5">
                      <select
                        className="text-xs rounded-lg px-1.5 py-0.5 border"
                        style={{ background: 'var(--surface2)', border: `1px solid var(--border)`, color: STATUS_COLOR[b.status] || 'var(--muted)' }}
                        value={b.status}
                        onChange={e => updateBooking(b.id, { status: e.target.value })}>
                        {Object.entries(STATUS_LABEL).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                      </select>
                      <button onClick={() => removeBooking(b.id)} style={{ color: 'var(--muted)' }}>
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {bookings.length === 0 ? (
            <div className="card text-center py-10">
              <div className="text-4xl mb-3">🏠</div>
              <div className="font-semibold mb-1">Engar bókanir ennþá</div>
              <p className="text-sm mb-4" style={{ color: 'var(--muted)' }}>Bættu við þinni fyrstu leigu til að fylgjast með tekjum</p>
              <button onClick={() => setShowBookingForm(true)} className="btn btn-primary mx-auto">
                <Plus size={15} /> Fyrsta bókun
              </button>
            </div>
          ) : (
            <div>
              <div className="text-xs font-semibold px-1 mb-2" style={{ color: 'var(--muted)' }}>ALLAR BÓKANIR</div>
              {bookings.map(b => (
                <div key={b.id} className="card flex items-center gap-3 py-3 mb-2"
                     style={{ opacity: b.status === 'cancelled' ? 0.5 : 1 }}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{b.itemName}</span>
                      <span className="text-xs px-1.5 py-0.5 rounded-full"
                            style={{ background: `${STATUS_COLOR[b.status]}18`, color: STATUS_COLOR[b.status], fontSize: 10 }}>
                        {STATUS_LABEL[b.status]}
                      </span>
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                      {new Date(b.startDate).toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })}
                      {b.customer ? ` · ${b.customer}` : ''}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-semibold text-sm" style={{ color: '#f97316' }}>{formatShortISK(b.amount)}</span>
                    <button onClick={() => removeBooking(b.id)} style={{ color: 'var(--muted)' }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'items' && (
        <div className="flex flex-col gap-3">
          <button onClick={() => { setShowItemForm(!showItemForm); setShowBookingForm(false) }}
                  className="btn btn-ghost w-full justify-center text-sm">
            <Plus size={15} /> Bæta við hlut
          </button>
          {items.map(item => (
            <div key={item.id} className="card flex items-center gap-3">
              <span className="text-2xl">{item.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium">{item.name}</div>
                <div className="text-xs" style={{ color: '#f97316' }}>{formatISK(item.pricePerDay)} / dag</div>
              </div>
              <button onClick={() => removeItem(item.id)} style={{ color: 'var(--muted)' }}>
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
