import { useState } from 'react'
import { useLendo } from '../hooks/useLendo'
import { formatISK, formatShortISK } from '../utils/currency'
import { Plus, Trash2, X, TrendingUp, Package, ChevronDown, ChevronUp, Target } from 'lucide-react'

const STATUS_LABELS = { confirmed: 'Staðfest', pending: 'Í bið', cancelled: 'Afbókað', completed: 'Lokið' }
const STATUS_COLORS = { confirmed: '#00d4aa', pending: '#f97316', cancelled: '#ef4444', completed: '#8b5cf6' }

export default function Lendo() {
  const {
    bookings, items, monthlyGoal, setMonthlyGoal,
    addBooking, removeBooking, updateStatus,
    addItem, removeItem,
    thisMonthBookings, monthlyIncome, totalIncome, goalPct
  } = useLendo()

  const [showForm, setShowForm] = useState(false)
  const [showItemForm, setShowItemForm] = useState(false)
  const [tab, setTab] = useState('bookings')
  const [editGoal, setEditGoal] = useState(false)
  const [goalInput, setGoalInput] = useState(String(monthlyGoal))

  // Booking form state
  const [form, setForm] = useState({
    itemId: items[0]?.id || '',
    renterName: '',
    startDate: '',
    endDate: '',
    amount: '',
    note: '',
  })

  // Item form state
  const [itemForm, setItemForm] = useState({ name: '', desc: '', pricePerDay: '', emoji: '📦' })

  const income = monthlyIncome()
  const pct = goalPct()
  const isGoalMet = income >= monthlyGoal
  const monthBookings = thisMonthBookings()

  const handleAddBooking = (e) => {
    e.preventDefault()
    if (!form.renterName || !form.amount) return
    addBooking(form)
    setForm({ itemId: items[0]?.id || '', renterName: '', startDate: '', endDate: '', amount: '', note: '' })
    setShowForm(false)
  }

  const handleAddItem = (e) => {
    e.preventDefault()
    if (!itemForm.name || !itemForm.pricePerDay) return
    addItem(itemForm)
    setItemForm({ name: '', desc: '', pricePerDay: '', emoji: '📦' })
    setShowItemForm(false)
  }

  const handleSaveGoal = () => {
    setMonthlyGoal(Number(goalInput))
    setEditGoal(false)
  }

  const monthName = new Date().toLocaleDateString('is-IS', { month: 'long', year: 'numeric' })

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏠</span>
            <h1 className="text-xl font-semibold">Lendó</h1>
          </div>
          <p className="text-sm ml-9" style={{ color: 'var(--muted)' }}>{monthName}</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn btn-primary">
          <Plus size={16} /> Bókun
        </button>
      </div>

      {/* Revenue hero card */}
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.08), rgba(139,92,246,0.06))' }}>
        <div className="flex justify-between items-start mb-3">
          <div>
            <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Tekjur þessa mánaðar</div>
            <div className="text-3xl font-bold" style={{ color: isGoalMet ? 'var(--accent)' : 'var(--text)' }}>
              {formatISK(income)}
            </div>
          </div>
          <div className="text-right">
            {editGoal ? (
              <div className="flex gap-2 items-center">
                <input
                  className="input text-right text-sm"
                  style={{ width: 120, padding: '4px 8px' }}
                  type="number"
                  value={goalInput}
                  onChange={e => setGoalInput(e.target.value)}
                  autoFocus
                />
                <button onClick={handleSaveGoal} className="btn btn-primary" style={{ padding: '4px 10px', fontSize: 12 }}>Vista</button>
              </div>
            ) : (
              <button onClick={() => setEditGoal(true)} className="text-right">
                <div className="text-xs mb-0.5" style={{ color: 'var(--muted)' }}>Markmið</div>
                <div className="text-base font-semibold flex items-center gap-1 justify-end" style={{ color: 'var(--accent)' }}>
                  <Target size={13} />
                  {formatShortISK(monthlyGoal)}
                </div>
              </button>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-3 rounded-full overflow-hidden mb-1.5" style={{ background: 'var(--surface2)' }}>
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${pct}%`,
              background: isGoalMet
                ? 'linear-gradient(90deg, #00d4aa, #8b5cf6)'
                : pct > 70
                ? 'var(--accent)'
                : 'linear-gradient(90deg, var(--accent), #00b89a)',
            }}
          />
        </div>
        <div className="flex justify-between text-xs" style={{ color: 'var(--muted)' }}>
          <span>{pct}% {isGoalMet ? '🎉 Markmiðið náð!' : 'af markmiði'}</span>
          <span>{monthBookings.length} bókun{monthBookings.length !== 1 ? 'ar' : ''} í mánuði</span>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-2 mt-3 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
          <div className="text-center">
            <div className="text-xs" style={{ color: 'var(--muted)' }}>Alls</div>
            <div className="font-semibold text-sm">{formatShortISK(totalIncome())}</div>
          </div>
          <div className="text-center">
            <div className="text-xs" style={{ color: 'var(--muted)' }}>Bókanir</div>
            <div className="font-semibold text-sm">{bookings.length}</div>
          </div>
          <div className="text-center">
            <div className="text-xs" style={{ color: 'var(--muted)' }}>Meðaltal</div>
            <div className="font-semibold text-sm">
              {bookings.length ? formatShortISK(totalIncome() / bookings.length) : '—'}
            </div>
          </div>
        </div>
      </div>

      {/* Add booking form */}
      {showForm && (
        <form onSubmit={handleAddBooking} className="card flex flex-col gap-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Ný bókun</h3>
            <button type="button" onClick={() => setShowForm(false)}><X size={16} style={{ color: 'var(--muted)' }} /></button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {items.map(item => (
              <button
                key={item.id}
                type="button"
                onClick={() => setForm(f => ({ ...f, itemId: item.id, amount: String(item.pricePerDay) }))}
                className="flex flex-col items-center gap-1 py-2 rounded-xl text-xs transition-all"
                style={{
                  background: form.itemId === item.id ? 'rgba(0,212,170,0.12)' : 'var(--surface2)',
                  border: `1px solid ${form.itemId === item.id ? 'var(--accent)' : 'transparent'}`,
                }}>
                <span className="text-lg">{item.emoji}</span>
                <span className="font-medium" style={{ color: form.itemId === item.id ? 'var(--accent)' : 'var(--text)' }}>{item.name}</span>
                <span style={{ color: 'var(--muted)' }}>{formatShortISK(item.pricePerDay)}/dag</span>
              </button>
            ))}
          </div>

          <input
            className="input"
            placeholder="Nafn leigutaka *"
            value={form.renterName}
            onChange={e => setForm(f => ({ ...f, renterName: e.target.value }))}
            autoFocus
          />
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs mb-1 block" style={{ color: 'var(--muted)' }}>Frá</label>
              <input className="input" type="date" value={form.startDate}
                onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs mb-1 block" style={{ color: 'var(--muted)' }}>Til</label>
              <input className="input" type="date" value={form.endDate}
                onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} />
            </div>
          </div>
          <input
            className="input"
            type="number"
            placeholder="Upphæð (ISK) *"
            value={form.amount}
            onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
          />
          <input
            className="input"
            placeholder="Athugasemd (valkvæmt)"
            value={form.note}
            onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
          />
          <button type="submit" className="btn btn-primary w-full justify-center">
            <Plus size={16} /> Bæta við bókun
          </button>
        </form>
      )}

      {/* Tabs */}
      <div className="flex gap-2">
        {[['bookings', 'Bókanir'], ['items', 'Hlutir']].map(([t, l]) => (
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
        <div className="flex flex-col gap-2">
          {bookings.length === 0 ? (
            <div className="card text-center py-10">
              <div className="text-3xl mb-2">🏠</div>
              <div className="font-medium mb-1">Engar bókanir ennþá</div>
              <div className="text-sm" style={{ color: 'var(--muted)' }}>Bættu við fyrstu bókuninni</div>
            </div>
          ) : bookings.map(b => {
            const item = items.find(i => i.id === b.itemId)
            return (
              <div key={b.id} className="card flex items-start gap-3 py-3">
                <div className="text-xl shrink-0 mt-0.5">{item?.emoji || '📦'}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-medium text-sm">{b.renterName}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full"
                      style={{ background: `${STATUS_COLORS[b.status]}22`, color: STATUS_COLORS[b.status] }}>
                      {STATUS_LABELS[b.status]}
                    </span>
                  </div>
                  <div className="text-xs" style={{ color: 'var(--muted)' }}>
                    {item?.name}
                    {b.startDate && ` · ${new Date(b.startDate).toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })}`}
                    {b.endDate && ` – ${new Date(b.endDate).toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })}`}
                  </div>
                  {b.note && <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{b.note}</div>}
                  <div className="font-semibold text-sm mt-1" style={{ color: 'var(--accent)' }}>{formatISK(b.amount)}</div>
                </div>
                <div className="flex flex-col gap-1 items-end">
                  <select
                    value={b.status}
                    onChange={e => updateStatus(b.id, e.target.value)}
                    className="text-xs rounded-lg px-2 py-1 cursor-pointer"
                    style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text)' }}>
                    {Object.entries(STATUS_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                  <button onClick={() => removeBooking(b.id)} style={{ color: 'var(--muted)' }} className="mt-1">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {tab === 'items' && (
        <div className="flex flex-col gap-3">
          {items.map(item => (
            <div key={item.id} className="card flex items-center gap-3">
              <div className="text-2xl">{item.emoji}</div>
              <div className="flex-1">
                <div className="font-medium">{item.name}</div>
                {item.desc && <div className="text-xs" style={{ color: 'var(--muted)' }}>{item.desc}</div>}
                <div className="text-sm font-semibold mt-0.5" style={{ color: 'var(--accent)' }}>
                  {formatISK(item.pricePerDay)}/dag
                </div>
              </div>
              <button onClick={() => removeItem(item.id)} style={{ color: 'var(--muted)' }}>
                <Trash2 size={14} />
              </button>
            </div>
          ))}

          {showItemForm ? (
            <form onSubmit={handleAddItem} className="card flex flex-col gap-3 animate-slide-up">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Nýr hlutur</h3>
                <button type="button" onClick={() => setShowItemForm(false)}><X size={16} style={{ color: 'var(--muted)' }} /></button>
              </div>
              <div className="flex gap-2">
                <input className="input" style={{ width: 60 }} placeholder="🎁"
                  value={itemForm.emoji} onChange={e => setItemForm(f => ({ ...f, emoji: e.target.value }))} />
                <input className="input flex-1" placeholder="Heiti *"
                  value={itemForm.name} onChange={e => setItemForm(f => ({ ...f, name: e.target.value }))} autoFocus />
              </div>
              <input className="input" placeholder="Lýsing"
                value={itemForm.desc} onChange={e => setItemForm(f => ({ ...f, desc: e.target.value }))} />
              <input className="input" type="number" placeholder="Verð á dag (ISK) *"
                value={itemForm.pricePerDay} onChange={e => setItemForm(f => ({ ...f, pricePerDay: e.target.value }))} />
              <button type="submit" className="btn btn-primary w-full justify-center">Bæta við</button>
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
