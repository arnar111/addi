import { useState } from 'react'
import { useBusiness, ITEM_TYPES } from '../hooks/useBusiness'
import { formatISK, formatShortISK } from '../utils/currency'
import { Plus, Trash2, X, TrendingUp, Calendar, Package } from 'lucide-react'

const STATUS_OPTS = [
  { id: 'confirmed', label: 'Staðfest', color: '#22c55e' },
  { id: 'pending', label: 'Bíður', color: '#f97316' },
  { id: 'completed', label: 'Lokið', color: '#00d4aa' },
  { id: 'cancelled', label: 'Afbókað', color: '#ef4444' },
]

function BookingCard({ booking, onStatus, onRemove }) {
  const status = STATUS_OPTS.find(s => s.id === booking.status)
  return (
    <div className="card flex flex-col gap-2"
         style={{ borderLeft: `3px solid ${status?.color || 'var(--border)'}` }}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm">{booking.customerName}</div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>{booking.itemName}</div>
        </div>
        <div className="text-right shrink-0">
          <div className="font-bold text-sm" style={{ color: 'var(--accent)' }}>{formatISK(booking.price)}</div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>{booking.days} dag{booking.days !== 1 ? 'ar' : 'ur'}</div>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--muted)' }}>
        <Calendar size={12} />
        <span>
          {new Date(booking.startDate).toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })}
          {booking.endDate !== booking.startDate && ` – ${new Date(booking.endDate).toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })}`}
        </span>
      </div>

      {booking.notes && (
        <div className="text-xs" style={{ color: 'var(--muted)' }}>{booking.notes}</div>
      )}

      <div className="flex items-center gap-1 flex-wrap pt-1" style={{ borderTop: '1px solid var(--border)' }}>
        {STATUS_OPTS.map(s => (
          <button key={s.id} onClick={() => onStatus(booking.id, s.id)}
            className="text-xs px-2 py-0.5 rounded-lg transition-all"
            style={{
              background: booking.status === s.id ? `${s.color}22` : 'var(--surface2)',
              color: booking.status === s.id ? s.color : 'var(--muted)',
              border: `1px solid ${booking.status === s.id ? s.color + '44' : 'transparent'}`,
            }}>{s.label}</button>
        ))}
        <div className="flex-1" />
        <button onClick={() => onRemove(booking.id)} style={{ color: 'var(--muted)' }}>
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  )
}

export default function Business() {
  const { bookings, addBooking, updateStatus, remove, items, monthlyGoal, setMonthlyGoal, thisMonthIncome, upcoming, recentBookings } = useBusiness()
  const [showForm, setShowForm] = useState(false)
  const [showGoalEdit, setShowGoalEdit] = useState(false)
  const [tab, setTab] = useState('overview')
  const [form, setForm] = useState({
    customerName: '',
    itemId: items[0]?.id || '1',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    priceOverride: '',
    notes: '',
  })

  const monthIncome = thisMonthIncome()
  const goal = monthlyGoal
  const pct = Math.min(100, Math.round((monthIncome / goal) * 100))
  const isGoalMet = monthIncome >= goal

  const handleAdd = (e) => {
    e.preventDefault()
    if (!form.customerName.trim()) return
    addBooking({
      ...form,
      priceOverride: form.priceOverride ? Number(form.priceOverride) : null,
    })
    setForm(f => ({ ...f, customerName: '', notes: '', priceOverride: '' }))
    setShowForm(false)
  }

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold">Lendó</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>Leigurekstur · {bookings.length} pantanir</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          <Plus size={16} /> Pöntun
        </button>
      </div>

      {/* Monthly income card */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, rgba(0,212,170,0.08), rgba(139,92,246,0.06))',
      }}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>
              Tekjur í {new Date().toLocaleDateString('is-IS', { month: 'long' })}
            </div>
            <div className="text-3xl font-semibold">{formatISK(monthIncome)}</div>
          </div>
          <div className="text-right">
            <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Markmið</div>
            <button onClick={() => setShowGoalEdit(!showGoalEdit)}
              className="text-lg font-semibold" style={{ color: isGoalMet ? 'var(--success)' : 'var(--muted)' }}>
              {formatShortISK(goal)}
            </button>
          </div>
        </div>
        <div className="h-2.5 rounded-full overflow-hidden mb-1" style={{ background: 'var(--surface2)' }}>
          <div className="h-full rounded-full transition-all duration-500"
               style={{ width: `${pct}%`, background: isGoalMet ? 'var(--success)' : 'var(--accent)' }} />
        </div>
        <div className="flex justify-between text-xs" style={{ color: 'var(--muted)' }}>
          <span>{pct}% af markmiði</span>
          <span>{upcoming.length} komandi pöntun{upcoming.length !== 1 ? 'ir' : ''}</span>
        </div>

        {showGoalEdit && (
          <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
            <label className="text-xs mb-1 block" style={{ color: 'var(--muted)' }}>Mánaðarlegt tekjumarkmið (ISK)</label>
            <input className="input text-sm" type="number" value={goal}
              onChange={e => setMonthlyGoal(Number(e.target.value))} />
          </div>
        )}
      </div>

      {/* Upcoming bookings */}
      {upcoming.length > 0 && (
        <div className="card">
          <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
            <Calendar size={14} style={{ color: 'var(--accent)' }} /> Komandi pantanir
          </h3>
          <div className="flex flex-col gap-2">
            {upcoming.slice(0, 3).map(b => {
              const status = STATUS_OPTS.find(s => s.id === b.status)
              return (
                <div key={b.id} className="flex items-center gap-3 p-2.5 rounded-xl" style={{ background: 'var(--surface2)' }}>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{b.customerName}</div>
                    <div className="text-xs" style={{ color: 'var(--muted)' }}>
                      {new Date(b.startDate).toLocaleDateString('is-IS', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                  <span className="text-sm font-semibold" style={{ color: 'var(--accent)' }}>{formatISK(b.price)}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Add booking form */}
      {showForm && (
        <form onSubmit={handleAdd} className="card flex flex-col gap-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Ný pöntun</h3>
            <button type="button" onClick={() => setShowForm(false)}><X size={16} style={{ color: 'var(--muted)' }} /></button>
          </div>

          <div>
            <label className="text-xs mb-1 block" style={{ color: 'var(--muted)' }}>Nafn viðskiptavinar *</label>
            <input className="input text-sm" placeholder="t.d. Jón Jónsson" value={form.customerName}
              onChange={e => setForm(f => ({ ...f, customerName: e.target.value }))} autoFocus />
          </div>

          <div>
            <label className="text-xs mb-1 block" style={{ color: 'var(--muted)' }}>Hlutur</label>
            <div className="flex flex-col gap-1.5">
              {items.map(item => (
                <button key={item.id} type="button" onClick={() => setForm(f => ({ ...f, itemId: item.id }))}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all text-left"
                  style={{
                    background: form.itemId === item.id ? 'rgba(0,212,170,0.1)' : 'var(--surface2)',
                    border: `1px solid ${form.itemId === item.id ? 'rgba(0,212,170,0.3)' : 'transparent'}`,
                  }}>
                  <span>{item.name}</span>
                  <span style={{ color: 'var(--muted)' }}>{formatISK(item.pricePerDay)}/dag</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs mb-1 block" style={{ color: 'var(--muted)' }}>Frá</label>
              <input className="input text-sm" type="date" value={form.startDate}
                onChange={e => setForm(f => ({ ...f, startDate: e.target.value, endDate: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs mb-1 block" style={{ color: 'var(--muted)' }}>Til</label>
              <input className="input text-sm" type="date" value={form.endDate} min={form.startDate}
                onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} />
            </div>
          </div>

          <div>
            <label className="text-xs mb-1 block" style={{ color: 'var(--muted)' }}>Sérstakt verð (valkvæmt)</label>
            <input className="input text-sm" type="number" placeholder="Skildu eftir autt til að nota staðalverð"
              value={form.priceOverride} onChange={e => setForm(f => ({ ...f, priceOverride: e.target.value }))} />
          </div>

          <div>
            <label className="text-xs mb-1 block" style={{ color: 'var(--muted)' }}>Glósur</label>
            <input className="input text-sm" placeholder="Athugasemdir..." value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
          </div>

          <button type="submit" className="btn btn-primary w-full justify-center">Bæta við pöntun</button>
        </form>
      )}

      {/* Tabs */}
      <div className="flex gap-2">
        {[['overview', 'Yfirlit'], ['bookings', 'Allar pantanir']].map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)}
            className="btn text-xs flex-1 justify-center py-1.5"
            style={{
              background: tab === t ? 'rgba(0,212,170,0.12)' : 'var(--surface)',
              color: tab === t ? 'var(--accent)' : 'var(--muted)',
              border: `1px solid ${tab === t ? 'rgba(0,212,170,0.25)' : 'var(--border)'}`,
            }}>{l}</button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="flex flex-col gap-3">
          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-2">
            {[
              ['Pantanir', bookings.filter(b => b.status !== 'cancelled').length, '📋'],
              ['Staðfest', bookings.filter(b => b.status === 'confirmed').length, '✅'],
              ['Lokið', bookings.filter(b => b.status === 'completed').length, '🎉'],
            ].map(([label, val, icon]) => (
              <div key={label} className="card py-3 flex flex-col items-center gap-1">
                <span className="text-xl">{icon}</span>
                <span className="text-xl font-bold">{val}</span>
                <span className="text-xs" style={{ color: 'var(--muted)' }}>{label}</span>
              </div>
            ))}
          </div>

          {/* Items */}
          <div className="card">
            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <Package size={14} style={{ color: 'var(--accent)' }} /> Hlutir til leigu
            </h3>
            {items.map(item => (
              <div key={item.id} className="flex items-center justify-between py-2.5"
                   style={{ borderBottom: '1px solid var(--border)' }}>
                <div>
                  <div className="text-sm font-medium">{item.name}</div>
                  <div className="text-xs" style={{ color: 'var(--muted)' }}>4.3 ⭐ · Garðabær, 210</div>
                </div>
                <div className="text-sm font-semibold" style={{ color: 'var(--accent)' }}>
                  {formatISK(item.pricePerDay)}/dag
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'bookings' && (
        <div className="flex flex-col gap-2">
          {recentBookings.length === 0 ? (
            <div className="card text-center py-8" style={{ color: 'var(--muted)' }}>
              Engar pantanir ennþá
            </div>
          ) : recentBookings.map(b => (
            <BookingCard key={b.id} booking={b} onStatus={updateStatus} onRemove={remove} />
          ))}
        </div>
      )}
    </div>
  )
}
