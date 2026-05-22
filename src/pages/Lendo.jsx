import { useState } from 'react'
import { useLendo, LENDO_ITEMS } from '../hooks/useLendo'
import { formatISK, formatShortISK } from '../utils/currency'
import { Plus, Trash2, X, TrendingUp, Package } from 'lucide-react'

export default function Lendo() {
  const {
    bookings, addBooking, removeBooking,
    currentMonthBookings, monthlyTotal, monthlyGoalPct,
    totalAllTime, totalBookings, goal, setGoal,
  } = useLendo()

  const [showForm, setShowForm] = useState(false)
  const [showGoalEdit, setShowGoalEdit] = useState(false)
  const [itemId, setItemId] = useState('party_set')
  const [days, setDays] = useState('1')
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [tab, setTab] = useState('month')

  const total = monthlyTotal()
  const pct = monthlyGoalPct()
  const isGoalMet = pct >= 100
  const monthBookings = currentMonthBookings()

  const selectedItem = LENDO_ITEMS.find(i => i.id === itemId)

  const handleItemChange = (id) => {
    setItemId(id)
    const item = LENDO_ITEMS.find(i => i.id === id)
    if (item?.price && days) setAmount(String(item.price * Number(days)))
  }

  const handleDaysChange = (d) => {
    setDays(d)
    const item = LENDO_ITEMS.find(i => i.id === itemId)
    if (item?.price && d) setAmount(String(item.price * Number(d)))
  }

  const handleAdd = (e) => {
    e.preventDefault()
    if (!amount || isNaN(Number(amount))) return
    addBooking(itemId, days, amount, note)
    setAmount('')
    setDays('1')
    setNote('')
    setShowForm(false)
  }

  const displayBookings = tab === 'month' ? monthBookings : bookings.slice(0, 30)

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold flex items-center gap-2">
            <span>🪑</span> Lendó
          </h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>Leigutekjur þínar</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          <Plus size={16} /> Leiga
        </button>
      </div>

      {/* Monthly overview card */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, rgba(249,115,22,0.08), rgba(234,179,8,0.06))',
        border: `1px solid ${isGoalMet ? 'rgba(34,197,94,0.4)' : 'rgba(249,115,22,0.25)'}`,
      }}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>
              {new Date().toLocaleDateString('is-IS', { month: 'long', year: 'numeric' })}
            </div>
            <div className="text-3xl font-semibold">{formatISK(total)}</div>
            <div className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
              {monthBookings.length} leiga{monthBookings.length !== 1 ? 'r' : ''}
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className="text-xs" style={{ color: 'var(--muted)' }}>Markmið</div>
            <button onClick={() => setShowGoalEdit(!showGoalEdit)}
              className="text-lg font-semibold" style={{ color: isGoalMet ? 'var(--success)' : 'var(--accent)' }}>
              {formatShortISK(goal)}
            </button>
          </div>
        </div>

        {showGoalEdit && (
          <div className="flex gap-2 mb-4">
            <input className="input text-sm" type="number"
              value={goal} onChange={e => setGoal(Number(e.target.value))} />
            <button onClick={() => setShowGoalEdit(false)} className="btn btn-ghost text-sm">Vista</button>
          </div>
        )}

        <div className="h-3 rounded-full overflow-hidden mb-1" style={{ background: 'var(--surface2)' }}>
          <div className="h-full rounded-full transition-all duration-700"
               style={{
                 width: `${pct}%`,
                 background: isGoalMet ? 'var(--success)' : pct > 60 ? '#f97316' : '#eab308',
               }} />
        </div>
        <div className="flex justify-between text-xs" style={{ color: 'var(--muted)' }}>
          <span>{pct}% af marki</span>
          {isGoalMet
            ? <span style={{ color: 'var(--success)' }}>Marki náð! 🎉</span>
            : <span>{formatShortISK(goal - total)} eftir</span>
          }
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="card-sm flex flex-col gap-1">
          <div className="text-xs" style={{ color: 'var(--muted)' }}>Heildar tekjur</div>
          <div className="text-lg font-semibold">{formatShortISK(totalAllTime())}</div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>{totalBookings()} leigur</div>
        </div>
        <div className="card-sm flex flex-col gap-1">
          <div className="text-xs" style={{ color: 'var(--muted)' }}>Meðaltal/leiga</div>
          <div className="text-lg font-semibold">
            {bookings.length ? formatShortISK(Math.round(totalAllTime() / bookings.length)) : '—'}
          </div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>á leigu</div>
        </div>
      </div>

      {/* Add form */}
      {showForm && (
        <form onSubmit={handleAdd} className="card flex flex-col gap-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Skrá leigu</h3>
            <button type="button" onClick={() => setShowForm(false)}><X size={16} style={{ color: 'var(--muted)' }} /></button>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs" style={{ color: 'var(--muted)' }}>Hlutur</label>
            <div className="grid grid-cols-2 gap-2">
              {LENDO_ITEMS.map(item => (
                <button key={item.id} type="button" onClick={() => handleItemChange(item.id)}
                  className="flex flex-col gap-0.5 p-3 rounded-xl text-left transition-all text-sm"
                  style={{
                    background: itemId === item.id ? 'rgba(249,115,22,0.15)' : 'var(--surface2)',
                    border: `1px solid ${itemId === item.id ? 'rgba(249,115,22,0.5)' : 'transparent'}`,
                  }}>
                  <span>{item.icon} {item.label}</span>
                  {item.price > 0 && (
                    <span className="text-xs" style={{ color: 'var(--muted)' }}>{formatShortISK(item.price)}/dag</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs" style={{ color: 'var(--muted)' }}>Dagar</label>
              <input className="input text-sm" type="number" min="1" value={days}
                onChange={e => handleDaysChange(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs" style={{ color: 'var(--muted)' }}>Upphæð (ISK)</label>
              <input className="input text-sm" type="number" value={amount}
                onChange={e => setAmount(e.target.value)} placeholder="7.000" />
            </div>
          </div>

          <input className="input text-sm" placeholder="Skýring (valkvæmt)" value={note}
            onChange={e => setNote(e.target.value)} />
          <button type="submit" className="btn btn-primary w-full justify-center">
            <TrendingUp size={16} /> Skrá leigu
          </button>
        </form>
      )}

      {/* Tabs */}
      <div className="flex gap-2">
        {[['month', 'Þessi mánuður'], ['all', 'Allar leigur']].map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)}
            className="btn text-sm flex-1 justify-center"
            style={{
              background: tab === t ? 'rgba(249,115,22,0.12)' : 'var(--surface)',
              color: tab === t ? '#f97316' : 'var(--muted)',
              border: `1px solid ${tab === t ? 'rgba(249,115,22,0.3)' : 'var(--border)'}`,
            }}>{l}</button>
        ))}
      </div>

      {/* Bookings list */}
      <div className="flex flex-col gap-2">
        {displayBookings.length === 0 ? (
          <div className="card text-center py-8 flex flex-col items-center gap-3">
            <Package size={32} style={{ color: 'var(--muted)' }} />
            <div style={{ color: 'var(--muted)' }}>
              {tab === 'month' ? 'Engar leigur þennan mánuð' : 'Engar leigur ennþá'}
            </div>
          </div>
        ) : displayBookings.map(b => {
          const item = LENDO_ITEMS.find(i => i.id === b.itemId) || LENDO_ITEMS[3]
          return (
            <div key={b.id} className="card flex items-center gap-3 py-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-lg"
                   style={{ background: 'rgba(249,115,22,0.15)' }}>
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium">{formatISK(b.amount)}</div>
                <div className="text-xs" style={{ color: 'var(--muted)' }}>
                  {item.label}{b.days > 1 ? ` · ${b.days} dagar` : ''}
                  {b.note ? ` · ${b.note}` : ''}
                  {' · '}{new Date(b.date).toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })}
                </div>
              </div>
              <button onClick={() => removeBooking(b.id)} style={{ color: 'var(--muted)' }}>
                <Trash2 size={14} />
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
