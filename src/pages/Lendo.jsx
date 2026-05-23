import { useState } from 'react'
import { Plus, Trash2, X, Package, CheckCircle, Clock, XCircle } from 'lucide-react'
import { useLendo, BOOKING_STATUSES } from '../hooks/useLendo'
import { formatISK, formatShortISK } from '../utils/currency'

const STATUS_ICONS = {
  'Staðfest': <CheckCircle size={13} color="#22c55e" />,
  'Í bið': <Clock size={13} color="#f97316" />,
  'Skilað': <CheckCircle size={13} color="#00d4aa" />,
  'Afbókað': <XCircle size={13} color="#ef4444" />,
}

const STATUS_COLORS = {
  'Staðfest': 'rgba(34,197,94,0.15)',
  'Í bið': 'rgba(249,115,22,0.15)',
  'Skilað': 'rgba(0,212,170,0.15)',
  'Afbókað': 'rgba(239,68,68,0.15)',
}

const STATUS_TEXT = {
  'Staðfest': '#22c55e',
  'Í bið': '#f97316',
  'Skilað': '#00d4aa',
  'Afbókað': '#ef4444',
}

function BookingCard({ booking, onRemove, onStatusChange }) {
  const date = new Date(booking.date)
  const dateStr = date.toLocaleDateString('is-IS', { weekday: 'short', month: 'short', day: 'numeric' })

  return (
    <div className="card flex flex-col gap-3 py-3 px-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold truncate">{booking.customer || 'Nafnlaus'}</span>
            <span className="badge text-xs shrink-0"
                  style={{ background: STATUS_COLORS[booking.status], color: STATUS_TEXT[booking.status] }}>
              {STATUS_ICONS[booking.status]}
              <span className="ml-1">{booking.status}</span>
            </span>
          </div>
          <div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
            {booking.item || 'Borð + stólar'} · {dateStr}
          </div>
          {booking.note && (
            <div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>{booking.note}</div>
          )}
        </div>
        <div className="text-right shrink-0">
          <div className="text-sm font-semibold" style={{ color: 'var(--accent)' }}>
            {formatISK(booking.amount || 0)}
          </div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
            {booking.days || 1} {(booking.days || 1) === 1 ? 'dagur' : 'dagar'}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex gap-1 flex-1 flex-wrap">
          {BOOKING_STATUSES.filter(s => s !== booking.status).map(s => (
            <button key={s} onClick={() => onStatusChange(booking.id, s)}
              className="text-xs px-2 py-1 rounded-lg"
              style={{ background: 'var(--surface2)', color: 'var(--muted)' }}>
              → {s}
            </button>
          ))}
        </div>
        <button onClick={() => onRemove(booking.id)} style={{ color: 'var(--muted)' }}>
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  )
}

export default function Lendo() {
  const {
    equipment, monthlyGoal, addBooking, removeBooking, updateStatus,
    thisMonthIncome, upcomingBookings, allSortedBookings, totalIncome,
  } = useLendo()

  const [showForm, setShowForm] = useState(false)
  const [tab, setTab] = useState('upcoming')
  const [form, setForm] = useState({
    customer: '', item: 'Borð + 10 stólar', date: '', days: '1', amount: '7000',
    status: 'Staðfest', note: '',
  })

  const income = thisMonthIncome()
  const pct = Math.min(100, Math.round((income / monthlyGoal) * 100))
  const upcoming = upcomingBookings()
  const all = allSortedBookings()
  const now = new Date()
  const monthName = now.toLocaleDateString('is-IS', { month: 'long' })

  const handleAdd = (e) => {
    e.preventDefault()
    if (!form.customer || !form.date) return
    addBooking({ ...form, amount: Number(form.amount), days: Number(form.days) })
    setForm({ customer: '', item: 'Borð + 10 stólar', date: '', days: '1', amount: '7000', status: 'Staðfest', note: '' })
    setShowForm(false)
  }

  const updateDaysAndAmount = (days, item) => {
    const eq = equipment.find(e => e.name === item)
    const price = eq ? eq.pricePerDay * Number(days) : Number(form.amount)
    setForm(f => ({ ...f, days: String(days), amount: String(price), item }))
  }

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold">Lendó</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>Partý húsbúnaðarleiga</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          <Plus size={16} /> Bókun
        </button>
      </div>

      {/* Monthly income card */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, rgba(0,212,170,0.08), rgba(34,197,94,0.06))',
        border: '1px solid rgba(0,212,170,0.2)'
      }}>
        <div className="flex justify-between items-start mb-3">
          <div>
            <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Tekjur · {monthName}</div>
            <div className="text-3xl font-semibold" style={{ color: 'var(--accent)' }}>
              {formatISK(income)}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Markmið</div>
            <div className="text-lg font-semibold">{formatShortISK(monthlyGoal)}</div>
          </div>
        </div>
        <div className="h-2.5 rounded-full overflow-hidden mb-1" style={{ background: 'var(--surface2)' }}>
          <div className="h-full rounded-full transition-all"
               style={{ width: `${pct}%`, background: pct >= 100 ? '#22c55e' : 'var(--accent)' }} />
        </div>
        <div className="flex justify-between text-xs" style={{ color: 'var(--muted)' }}>
          <span>{pct}% af markmiði</span>
          <span>{formatShortISK(Math.max(0, monthlyGoal - income))} eftir</span>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-2 mt-3 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
          {[
            { label: 'Næstu bókanir', value: upcoming.length },
            { label: 'Þ.m. bókanir', value: all.filter(b => { const d = new Date(b.date); return d.getMonth() === now.getMonth() && b.status !== 'Afbókað' }).length },
            { label: 'Heildartekjur', value: formatShortISK(totalIncome()) },
          ].map(({ label, value }) => (
            <div key={label} className="flex flex-col items-center gap-0.5">
              <span className="text-sm font-semibold">{value}</span>
              <span className="text-xs text-center" style={{ color: 'var(--muted)', fontSize: 10 }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Add booking form */}
      {showForm && (
        <form onSubmit={handleAdd} className="card flex flex-col gap-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Ný bókun</h3>
            <button type="button" onClick={() => setShowForm(false)}><X size={16} style={{ color: 'var(--muted)' }} /></button>
          </div>
          <input className="input" placeholder="Nafn viðskiptavinar *" value={form.customer}
            onChange={e => setForm(f => ({ ...f, customer: e.target.value }))} required autoFocus />

          <div>
            <label className="text-xs mb-1 block" style={{ color: 'var(--muted)' }}>Vara</label>
            <div className="grid grid-cols-2 gap-1.5">
              {equipment.map(eq => (
                <button key={eq.id} type="button"
                  onClick={() => updateDaysAndAmount(form.days, eq.name)}
                  className="flex items-center gap-2 py-2 px-3 rounded-xl text-xs text-left"
                  style={{
                    background: form.item === eq.name ? 'rgba(0,212,170,0.12)' : 'var(--surface2)',
                    border: `1px solid ${form.item === eq.name ? 'rgba(0,212,170,0.3)' : 'transparent'}`,
                    color: form.item === eq.name ? 'var(--accent)' : 'var(--text)',
                  }}>
                  <span>{eq.icon}</span>
                  <div>
                    <div style={{ fontSize: 11 }}>{eq.name}</div>
                    <div style={{ color: 'var(--muted)', fontSize: 10 }}>{formatShortISK(eq.pricePerDay)}/dag</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs mb-1 block" style={{ color: 'var(--muted)' }}>Dagsetning *</label>
              <input type="date" className="input text-sm" value={form.date}
                onChange={e => setForm(f => ({ ...f, date: e.target.value }))} required />
            </div>
            <div>
              <label className="text-xs mb-1 block" style={{ color: 'var(--muted)' }}>Dagar</label>
              <input type="number" className="input text-sm" min="1" value={form.days}
                onChange={e => updateDaysAndAmount(e.target.value, form.item)} />
            </div>
          </div>

          <div>
            <label className="text-xs mb-1 block" style={{ color: 'var(--muted)' }}>Upphæð (ISK)</label>
            <input type="number" className="input" value={form.amount}
              onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} />
          </div>

          <div>
            <label className="text-xs mb-1 block" style={{ color: 'var(--muted)' }}>Staða</label>
            <div className="flex gap-1.5 flex-wrap">
              {BOOKING_STATUSES.map(s => (
                <button key={s} type="button" onClick={() => setForm(f => ({ ...f, status: s }))}
                  className="px-3 py-1.5 rounded-lg text-xs"
                  style={{
                    background: form.status === s ? STATUS_COLORS[s] : 'var(--surface2)',
                    color: form.status === s ? STATUS_TEXT[s] : 'var(--muted)',
                    border: `1px solid ${form.status === s ? STATUS_TEXT[s] + '44' : 'transparent'}`,
                  }}>{s}</button>
              ))}
            </div>
          </div>

          <input className="input" placeholder="Athugasemd (valkvæmt)" value={form.note}
            onChange={e => setForm(f => ({ ...f, note: e.target.value }))} />

          <button type="submit" className="btn btn-primary w-full justify-center">Vista bókun</button>
        </form>
      )}

      {/* Tabs */}
      <div className="flex gap-2">
        {[['upcoming', `Næstar (${upcoming.length})`], ['all', 'Allar bókanir']].map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)}
            className="btn text-sm flex-1 justify-center"
            style={{
              background: tab === t ? 'rgba(0,212,170,0.12)' : 'var(--surface)',
              color: tab === t ? 'var(--accent)' : 'var(--muted)',
              border: `1px solid ${tab === t ? 'rgba(0,212,170,0.25)' : 'var(--border)'}`,
            }}>{l}</button>
        ))}
      </div>

      {/* Bookings list */}
      {tab === 'upcoming' && (
        <div className="flex flex-col gap-2">
          {upcoming.length === 0 ? (
            <div className="card text-center py-8" style={{ color: 'var(--muted)' }}>
              Engar bókanir á dagskrá 📅<br />
              <span style={{ fontSize: 12 }}>Bættu við fyrstu bókuninni!</span>
            </div>
          ) : upcoming.map(b => (
            <BookingCard key={b.id} booking={b} onRemove={removeBooking} onStatusChange={updateStatus} />
          ))}
        </div>
      )}

      {tab === 'all' && (
        <div className="flex flex-col gap-2">
          {all.length === 0 ? (
            <div className="card text-center py-8" style={{ color: 'var(--muted)' }}>Engar bókanir enn</div>
          ) : all.map(b => (
            <BookingCard key={b.id} booking={b} onRemove={removeBooking} onStatusChange={updateStatus} />
          ))}
        </div>
      )}

      {/* Equipment list */}
      <div className="card flex flex-col gap-3">
        <div className="flex items-center gap-2 mb-1">
          <Package size={15} style={{ color: 'var(--accent)' }} />
          <span className="font-semibold text-sm">Búnaður</span>
        </div>
        {equipment.map(eq => (
          <div key={eq.id} className="flex items-center gap-3">
            <span className="text-lg">{eq.icon}</span>
            <div className="flex-1">
              <div className="text-sm font-medium">{eq.name}</div>
              <div className="text-xs" style={{ color: 'var(--muted)' }}>{formatISK(eq.pricePerDay)} / dag</div>
            </div>
            <span className="badge" style={{ background: 'rgba(0,212,170,0.1)', color: 'var(--accent)' }}>
              x{eq.count}
            </span>
          </div>
        ))}
        <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
          Stillingarnar fyrir búnað má breyta í Lendó stillingum
        </p>
      </div>
    </div>
  )
}
