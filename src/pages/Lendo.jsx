import { useState } from 'react'
import { useLendo } from '../hooks/useLendo'
import { formatISK, formatShortISK } from '../utils/currency'
import { Plus, Trash2, X, Star, TrendingUp, Package } from 'lucide-react'

export default function Lendo() {
  const {
    items, addItem,
    bookings, monthlyGoal, setMonthlyGoal,
    reviews,
    addBooking, removeBooking,
    currentMonthIncome, incomeForDays, totalBookings, totalIncome,
    revenueByItem,
  } = useLendo()

  const [showBookingForm, setShowBookingForm] = useState(false)
  const [showGoalEdit, setShowGoalEdit] = useState(false)
  const [tab, setTab] = useState('overview')
  const [selectedItem, setSelectedItem] = useState(items[0]?.id || '')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [days, setDays] = useState('1')
  const [amount, setAmount] = useState('')
  const [renter, setRenter] = useState('')
  const [note, setNote] = useState('')

  const monthIncome = currentMonthIncome()
  const pct = Math.min(100, Math.round((monthIncome / monthlyGoal) * 100))
  const isGoalMet = monthIncome >= monthlyGoal
  const byItem = revenueByItem()

  const calcAmount = (itemId, d) => {
    const item = items.find(i => i.id === itemId)
    if (item) setAmount(String(item.pricePerDay * Number(d)))
  }

  const handleAdd = (e) => {
    e.preventDefault()
    if (!amount || !selectedItem) return
    addBooking(selectedItem, date, days, amount, renter, note)
    setAmount(''); setRenter(''); setNote(''); setShowBookingForm(false)
  }

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold">Lendó</h1>
            <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{ background: 'rgba(0,212,170,0.12)', color: 'var(--accent)' }}>
              {items.filter(i => i.active).length} hlutir
            </span>
          </div>
          <div className="flex items-center gap-1 mt-0.5">
            <Star size={11} style={{ color: '#eab308' }} fill="#eab308" />
            <span className="text-xs" style={{ color: 'var(--muted)' }}>{reviews.rating} · {reviews.count} umsagnir</span>
          </div>
        </div>
        <button onClick={() => setShowBookingForm(!showBookingForm)} className="btn btn-primary">
          <Plus size={16} /> Leiga
        </button>
      </div>

      {/* Monthly goal card */}
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.07), rgba(16,185,129,0.05))' }}>
        <div className="flex justify-between items-start mb-3">
          <div>
            <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Tekjur þessa mánaðar</div>
            <div className="text-3xl font-bold" style={{ color: isGoalMet ? 'var(--success)' : 'var(--text)' }}>
              {formatISK(monthIncome)}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Mánaðarmarkmið</div>
            <button onClick={() => setShowGoalEdit(!showGoalEdit)}
              className="text-lg font-semibold" style={{ color: 'var(--muted)' }}>
              {formatShortISK(monthlyGoal)} ✎
            </button>
          </div>
        </div>

        {showGoalEdit && (
          <div className="mb-3">
            <input className="input text-sm" type="number"
              value={monthlyGoal}
              onChange={e => setMonthlyGoal(Number(e.target.value))}
              placeholder="Mánaðarmarkmið (ISK)" />
          </div>
        )}

        <div className="h-2.5 rounded-full overflow-hidden mb-1" style={{ background: 'var(--surface2)' }}>
          <div className="h-full rounded-full transition-all duration-500"
               style={{ width: `${pct}%`, background: isGoalMet ? 'var(--success)' : 'var(--accent)' }} />
        </div>
        <div className="flex justify-between text-xs mb-4" style={{ color: 'var(--muted)' }}>
          <span style={{ color: isGoalMet ? 'var(--success)' : 'inherit' }}>
            {isGoalMet ? '🎉 Markmið náð!' : `${pct}% af markmiði`}
          </span>
          <span>{formatISK(Math.max(0, monthlyGoal - monthIncome))} eftir</span>
        </div>

        <div className="grid grid-cols-3 gap-3 pt-3"
             style={{ borderTop: '1px solid var(--border)' }}>
          {[['7 dagar', incomeForDays(7)], ['30 dagar', incomeForDays(30)], ['90 dagar', incomeForDays(90)]].map(([label, val]) => (
            <div key={label} className="text-center">
              <div className="text-base font-bold">{formatShortISK(val)}</div>
              <div className="text-xs" style={{ color: 'var(--muted)' }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="card text-center">
          <div className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>{totalBookings}</div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>Leigur alls</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold">{formatShortISK(totalIncome)}</div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>Heildartekjur</div>
        </div>
      </div>

      {/* Booking form */}
      {showBookingForm && (
        <form onSubmit={handleAdd} className="card flex flex-col gap-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Skrá leigu</h3>
            <button type="button" onClick={() => setShowBookingForm(false)}>
              <X size={16} style={{ color: 'var(--muted)' }} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {items.map(item => (
              <button key={item.id} type="button"
                onClick={() => { setSelectedItem(item.id); calcAmount(item.id, days) }}
                className="flex items-center gap-2 p-3 rounded-xl text-left transition-all"
                style={{
                  background: selectedItem === item.id ? 'rgba(0,212,170,0.12)' : 'var(--surface2)',
                  border: `1px solid ${selectedItem === item.id ? 'var(--accent)' : 'transparent'}`,
                }}>
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <div className="text-xs font-semibold">{item.name}</div>
                  <div className="text-xs" style={{ color: 'var(--muted)' }}>{formatShortISK(item.pricePerDay)}/dag</div>
                </div>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs mb-1 block" style={{ color: 'var(--muted)' }}>Dagsetning</label>
              <input type="date" className="input text-sm" value={date}
                onChange={e => setDate(e.target.value)} />
            </div>
            <div>
              <label className="text-xs mb-1 block" style={{ color: 'var(--muted)' }}>Fjöldi daga</label>
              <input className="input text-sm" type="number" min="1" value={days}
                onChange={e => { setDays(e.target.value); calcAmount(selectedItem, e.target.value) }} />
            </div>
          </div>

          <div>
            <label className="text-xs mb-1 block" style={{ color: 'var(--muted)' }}>Upphæð (ISK)</label>
            <input className="input" type="number" value={amount}
              onChange={e => setAmount(e.target.value)} placeholder="Verð reiknaðst sjálfvirkt" />
          </div>

          <input className="input" placeholder="Leigutaki (valkvæmt)" value={renter}
            onChange={e => setRenter(e.target.value)} />
          <input className="input" placeholder="Athugasemd (valkvæmt)" value={note}
            onChange={e => setNote(e.target.value)} />
          <button type="submit" className="btn btn-primary w-full justify-center">Skrá leigu</button>
        </form>
      )}

      {/* Tabs */}
      <div className="flex gap-2">
        {[['overview', 'Hlutir'], ['bookings', 'Leigur']].map(([t, l]) => (
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
          {items.map(item => (
            <div key={item.id} className="card flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-2xl"
                   style={{ background: 'rgba(0,212,170,0.1)' }}>{item.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm">{item.name}</div>
                <div className="text-xs" style={{ color: 'var(--muted)' }}>{item.description}</div>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs" style={{ color: 'var(--accent)' }}>{formatISK(item.pricePerDay)}/dag</span>
                  <span className="text-xs" style={{ color: 'var(--muted)' }}>Helgi: {formatISK(item.priceWeekend)}</span>
                </div>
              </div>
              {byItem[item.id] > 0 && (
                <div className="text-right shrink-0">
                  <div className="text-sm font-bold" style={{ color: 'var(--accent)' }}>
                    {formatShortISK(byItem[item.id])}
                  </div>
                  <div className="text-xs" style={{ color: 'var(--muted)' }}>alls</div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {tab === 'bookings' && (
        <div className="flex flex-col gap-2">
          {bookings.length === 0 ? (
            <div className="card text-center py-10" style={{ color: 'var(--muted)' }}>
              <div className="text-3xl mb-2">🏠</div>
              <div>Engar leigur ennþá</div>
              <div className="text-xs mt-1">Skráðu fyrstu leigu þína!</div>
            </div>
          ) : bookings.map(b => {
            const item = items.find(i => i.id === b.itemId)
            return (
              <div key={b.id} className="card flex items-center gap-3 py-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-lg"
                     style={{ background: 'rgba(0,212,170,0.1)' }}>{item?.icon || '📦'}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{formatISK(b.amount)}</span>
                    {b.renterName && <span className="text-xs" style={{ color: 'var(--muted)' }}>· {b.renterName}</span>}
                  </div>
                  <div className="text-xs" style={{ color: 'var(--muted)' }}>
                    {item?.name || 'Hlutur'} · {b.days} {b.days === 1 ? 'dagur' : 'dagar'}
                    {' · '}{new Date(b.date).toLocaleDateString('is-IS', { month: 'short', day: 'numeric', year: 'numeric' })}
                    {b.note ? ` · ${b.note}` : ''}
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
    </div>
  )
}
