import { useState } from 'react'
import { useLendo } from '../hooks/useLendo'
import { formatISK, formatShortISK } from '../utils/currency'
import { Plus, X, Trash2, ChevronDown } from 'lucide-react'

const STATUS_CONFIG = {
  booked: { label: 'Bókað', color: '#3b82f6' },
  active: { label: 'Virkt', color: '#22c55e' },
  done: { label: 'Lokið', color: '#64748b' },
  cancelled: { label: 'Afbókað', color: '#ef4444' },
}

const QUICK_PRICES = [
  { label: 'Sett (borð+10 stólar)', price: 7000 },
  { label: 'Viðbótarborð', price: 3000 },
  { label: 'Stóll', price: 300 },
]

function BookingCard({ booking, onRemove, onUpdateStatus }) {
  const s = STATUS_CONFIG[booking.status] || STATUS_CONFIG.booked
  const start = new Date(booking.startDate)
  const end = new Date(booking.endDate)
  const sameDay = booking.startDate === booking.endDate
  const days = Math.max(1, Math.round((end - start) / 86400000) + 1)

  return (
    <div className="card flex flex-col gap-2">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-sm">{booking.customerName}</span>
            <span className="badge text-xs px-2 py-0.5 rounded-full"
                  style={{ background: `${s.color}22`, color: s.color }}>
              {s.label}
            </span>
          </div>
          <div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
            📦 {booking.equipment}
          </div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
            📅 {start.toLocaleDateString('is-IS', { weekday: 'short', month: 'short', day: 'numeric' })}
            {!sameDay && ` – ${end.toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })} (${days} dagar)`}
          </div>
          {booking.note && (
            <div className="text-xs mt-0.5 italic" style={{ color: 'var(--muted)' }}>💬 {booking.note}</div>
          )}
        </div>
        <div className="shrink-0 text-right">
          <div className="font-bold text-base" style={{ color: '#f97316' }}>{formatISK(booking.amount)}</div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>
            {new Date(booking.createdAt).toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })} skráð
          </div>
        </div>
      </div>

      <div className="flex gap-1.5 pt-2" style={{ borderTop: '1px solid var(--border)' }}>
        {['booked', 'active', 'done'].map(st => (
          <button key={st} onClick={() => onUpdateStatus(booking.id, st)}
            className="flex-1 text-xs py-1.5 rounded-xl transition-all font-medium"
            style={{
              background: booking.status === st ? `${STATUS_CONFIG[st].color}22` : 'var(--surface2)',
              color: booking.status === st ? STATUS_CONFIG[st].color : 'var(--muted)',
              border: `1px solid ${booking.status === st ? STATUS_CONFIG[st].color + '44' : 'transparent'}`,
            }}>
            {STATUS_CONFIG[st].label}
          </button>
        ))}
        <button onClick={() => onRemove(booking.id)}
          className="px-2.5 py-1.5 rounded-xl transition-all"
          style={{ background: 'rgba(239,68,68,0.08)', color: 'var(--danger)' }}>
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  )
}

export default function Lendo() {
  const { bookings, add, remove, updateStatus, monthlyRevenue, thisMonth, upcoming, totalRevenue } = useLendo()
  const [showForm, setShowForm] = useState(false)
  const [tab, setTab] = useState('upcoming')
  const [form, setForm] = useState({
    customerName: '',
    equipment: 'Sett (borð+10 stólar)',
    startDate: '',
    endDate: '',
    amount: '7000',
    note: '',
  })

  const handleAdd = (e) => {
    e.preventDefault()
    if (!form.customerName.trim() || !form.startDate) return
    add({ ...form, endDate: form.endDate || form.startDate })
    setForm({ customerName: '', equipment: 'Sett (borð+10 stólar)', startDate: '', endDate: '', amount: '7000', note: '' })
    setShowForm(false)
    setTab('upcoming')
  }

  const setQuickEquip = (item) => {
    setForm(f => ({ ...f, equipment: item.label, amount: String(item.price) }))
  }

  const revenue = monthlyRevenue()
  const upcomingList = upcoming()
  const monthList = thisMonth()
  const tabContent = tab === 'upcoming' ? upcomingList
    : tab === 'month' ? monthList
    : bookings.filter(b => b.status !== 'cancelled')

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🏠</span>
            <h1 className="text-xl font-semibold">Lendó</h1>
          </div>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            {upcomingList.length} væntanlegar bókanir
          </p>
        </div>
        <button onClick={() => setShowForm(v => !v)} className="btn btn-primary">
          <Plus size={16} /> Bókun
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        <div className="card text-center py-3 px-2">
          <div className="text-lg font-bold" style={{ color: '#f97316' }}>{formatShortISK(revenue)}</div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>Tekjur þ.m.</div>
        </div>
        <div className="card text-center py-3 px-2">
          <div className="text-lg font-bold" style={{ color: 'var(--accent)' }}>{monthList.length}</div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>Bókanir þ.m.</div>
        </div>
        <div className="card text-center py-3 px-2">
          <div className="text-lg font-bold" style={{ color: '#8b5cf6' }}>{formatShortISK(totalRevenue())}</div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>Samtals</div>
        </div>
      </div>

      {/* Add form */}
      {showForm && (
        <form onSubmit={handleAdd} className="card flex flex-col gap-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Ný bókun</h3>
            <button type="button" onClick={() => setShowForm(false)}>
              <X size={16} style={{ color: 'var(--muted)' }} />
            </button>
          </div>

          <input className="input text-sm" placeholder="Nafn viðskiptavinar *"
            value={form.customerName}
            onChange={e => setForm(f => ({ ...f, customerName: e.target.value }))}
            autoFocus />

          <div>
            <label className="text-xs mb-1.5 block" style={{ color: 'var(--muted)' }}>Búnaður</label>
            <div className="flex gap-2 mb-2 flex-wrap">
              {QUICK_PRICES.map(item => (
                <button key={item.label} type="button" onClick={() => setQuickEquip(item)}
                  className="text-xs px-2.5 py-1.5 rounded-lg transition-all"
                  style={{
                    background: form.equipment === item.label ? 'rgba(249,115,22,0.15)' : 'var(--surface2)',
                    color: form.equipment === item.label ? '#f97316' : 'var(--muted)',
                    border: `1px solid ${form.equipment === item.label ? 'rgba(249,115,22,0.3)' : 'transparent'}`,
                  }}>
                  {item.label} – {formatShortISK(item.price)}
                </button>
              ))}
            </div>
            <input className="input text-sm" placeholder="Eða sláðu inn búnað..."
              value={form.equipment}
              onChange={e => setForm(f => ({ ...f, equipment: e.target.value }))} />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs mb-1 block" style={{ color: 'var(--muted)' }}>Dagsetning (frá) *</label>
              <input type="date" className="input text-sm" value={form.startDate}
                onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs mb-1 block" style={{ color: 'var(--muted)' }}>Dagsetning (til)</label>
              <input type="date" className="input text-sm" value={form.endDate}
                onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} />
            </div>
          </div>

          <div>
            <label className="text-xs mb-1 block" style={{ color: 'var(--muted)' }}>Verð (ISK)</label>
            <input type="number" className="input text-sm" placeholder="7000"
              value={form.amount}
              onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} />
          </div>

          <input className="input text-sm" placeholder="Athugasemd (valkvæmt)"
            value={form.note}
            onChange={e => setForm(f => ({ ...f, note: e.target.value }))} />

          <button type="submit" className="btn btn-primary w-full justify-center" style={{ background: '#f97316' }}>
            <Plus size={16} /> Bæta við bókun
          </button>
        </form>
      )}

      {/* Tabs */}
      <div className="flex gap-2">
        {[['upcoming', 'Væntanlegar'], ['month', 'Þessi mánuður'], ['all', 'Allar']].map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)}
            className="btn text-xs py-1.5 flex-1 justify-center"
            style={{
              background: tab === t ? 'rgba(249,115,22,0.15)' : 'var(--surface)',
              color: tab === t ? '#f97316' : 'var(--muted)',
              border: `1px solid ${tab === t ? 'rgba(249,115,22,0.3)' : 'var(--border)'}`,
            }}>{l}</button>
        ))}
      </div>

      {/* Booking list */}
      <div className="flex flex-col gap-2">
        {tabContent.length === 0 ? (
          <div className="card text-center py-10 flex flex-col items-center gap-2">
            <span className="text-3xl">🏠</span>
            <p style={{ color: 'var(--muted)' }}>
              {tab === 'upcoming' ? 'Engar væntanlegar bókanir' : 'Engar bókanir'}
            </p>
            <button onClick={() => setShowForm(true)} className="btn btn-primary mt-1" style={{ background: '#f97316' }}>
              <Plus size={14} /> Skrá fyrstu bókunina
            </button>
          </div>
        ) : tabContent.map(b => (
          <BookingCard key={b.id} booking={b} onRemove={remove} onUpdateStatus={updateStatus} />
        ))}
      </div>
    </div>
  )
}
