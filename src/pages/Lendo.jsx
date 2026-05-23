import { useState } from 'react'
import { useLendo } from '../hooks/useLendo'
import { formatISK, formatShortISK } from '../utils/currency'
import { Plus, Trash2, X, TrendingUp, Target, Package } from 'lucide-react'

function StatCard({ label, value, sub, color }) {
  return (
    <div className="flex flex-col gap-1 p-3 rounded-2xl" style={{ background: 'var(--surface2)' }}>
      <div className="text-xs" style={{ color: 'var(--muted)' }}>{label}</div>
      <div className="text-xl font-semibold" style={{ color: color || 'var(--text)' }}>{value}</div>
      {sub && <div className="text-xs" style={{ color: 'var(--muted)' }}>{sub}</div>}
    </div>
  )
}

export default function Lendo() {
  const {
    bookings, addBooking, removeBooking, updateStatus,
    goal, setGoal,
    currentMonthBookings, monthlyPaid, monthlyPending, monthlyCount, goalPct, allTimePaid,
    LENDO_ITEMS,
  } = useLendo()

  const [showForm, setShowForm] = useState(false)
  const [showGoalEdit, setShowGoalEdit] = useState(false)
  const [tab, setTab] = useState('month')
  const [form, setForm] = useState({ amount: '', item: 'borðsett', note: '', days: '1', status: 'paid' })

  const paid = monthlyPaid()
  const pending = monthlyPending()
  const pct = goalPct()
  const isGoalMet = paid >= goal
  const monthBookings = currentMonthBookings()

  const handleItemSelect = (itemId) => {
    const item = LENDO_ITEMS.find(i => i.id === itemId)
    const days = Number(form.days) || 1
    setForm(f => ({
      ...f,
      item: itemId,
      amount: item.price > 0 ? String(item.price * days) : f.amount,
    }))
  }

  const handleDaysChange = (val) => {
    const days = Number(val) || 1
    const item = LENDO_ITEMS.find(i => i.id === form.item)
    setForm(f => ({
      ...f,
      days: val,
      amount: item?.price > 0 ? String(item.price * days) : f.amount,
    }))
  }

  const handleAdd = (e) => {
    e.preventDefault()
    const amt = Number(form.amount)
    if (!amt) return
    addBooking({ ...form, amount: amt })
    setForm({ amount: '', item: 'borðsett', note: '', days: '1', status: 'paid' })
    setShowForm(false)
  }

  const displayBookings = tab === 'month' ? monthBookings : bookings.slice(0, 30)

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold">Lendó</h1>
            <span className="badge text-xs" style={{ background: 'rgba(0,212,170,0.12)', color: 'var(--accent)' }}>
              Fyrirtæki
            </span>
          </div>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            {new Date().toLocaleDateString('is-IS', { month: 'long', year: 'numeric' })} · {monthlyCount()} leigur
          </p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          <Plus size={16} /> Leiga
        </button>
      </div>

      {/* Monthly goal card */}
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.08), rgba(139,92,246,0.06))' }}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="text-xs mb-1 flex items-center gap-1.5" style={{ color: 'var(--muted)' }}>
              <TrendingUp size={11} /> Tekjur þessa mánaðar
            </div>
            <div className="text-4xl font-semibold tabular-nums" style={{ color: 'var(--accent)' }}>
              {formatISK(paid)}
            </div>
            {pending > 0 && (
              <div className="text-sm mt-1 flex items-center gap-1" style={{ color: '#f97316' }}>
                <span>+ {formatISK(pending)} í bið</span>
              </div>
            )}
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className="text-xs" style={{ color: 'var(--muted)' }}>Markmið</div>
            <button
              onClick={() => setShowGoalEdit(v => !v)}
              className="text-xl font-semibold"
              style={{ color: isGoalMet ? 'var(--success)' : 'var(--text)' }}
            >
              {formatShortISK(goal)}
            </button>
            {isGoalMet && <span className="text-xs" style={{ color: 'var(--success)' }}>🎉 Náð!</span>}
          </div>
        </div>

        <div className="h-3 rounded-full overflow-hidden mb-2" style={{ background: 'var(--surface2)' }}>
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${pct}%`, background: isGoalMet ? 'var(--success)' : pct > 70 ? 'var(--accent)' : 'var(--accent)' }}
          />
        </div>
        <div className="flex justify-between text-xs" style={{ color: 'var(--muted)' }}>
          <span>{pct}% af markmiði</span>
          <span>{isGoalMet ? 'Markmiðið náð 💪' : `${formatShortISK(goal - paid)} eftir`}</span>
        </div>
      </div>

      {showGoalEdit && (
        <div className="card flex flex-col gap-2 animate-slide-up">
          <div className="flex items-center gap-1.5 mb-1">
            <Target size={13} style={{ color: 'var(--accent)' }} />
            <span className="text-sm font-medium">Mánaðarlegt markmið</span>
          </div>
          <input
            className="input"
            type="number"
            value={goal}
            onChange={e => setGoal(Number(e.target.value))}
            placeholder="200000"
          />
          <p className="text-xs" style={{ color: 'var(--muted)' }}>
            {Math.ceil(goal / 7000)} leigudagar á {formatShortISK(7000)}/dag til að ná markmiðinu
          </p>
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard label="Allar tímar" value={formatShortISK(allTimePaid())} color="var(--accent)" />
        <StatCard label="Þ.m. leigur" value={monthlyCount()} sub="bókanir" />
        <StatCard label="Í bið" value={formatShortISK(pending)} color={pending > 0 ? '#f97316' : 'var(--muted)'} />
      </div>

      {/* Add form */}
      {showForm && (
        <form onSubmit={handleAdd} className="card flex flex-col gap-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Ný leiga</h3>
            <button type="button" onClick={() => setShowForm(false)}>
              <X size={16} style={{ color: 'var(--muted)' }} />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {LENDO_ITEMS.map(item => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleItemSelect(item.id)}
                className="flex flex-col items-center gap-1 p-2.5 rounded-xl text-xs transition-all"
                style={{
                  background: form.item === item.id ? 'rgba(0,212,170,0.12)' : 'var(--surface2)',
                  border: `1px solid ${form.item === item.id ? 'rgba(0,212,170,0.3)' : 'transparent'}`,
                  color: form.item === item.id ? 'var(--accent)' : 'var(--text)',
                }}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium text-center leading-tight">{item.label}</span>
                {item.price > 0 && (
                  <span style={{ color: 'var(--muted)', fontSize: 10 }}>{formatShortISK(item.price)}/dag</span>
                )}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-xs mb-1 block" style={{ color: 'var(--muted)' }}>Dagar</label>
              <input
                className="input text-sm"
                type="number"
                min={1}
                value={form.days}
                onChange={e => handleDaysChange(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <label className="text-xs mb-1 block" style={{ color: 'var(--muted)' }}>Upphæð (kr)</label>
              <input
                className="input text-sm"
                type="number"
                placeholder="7000"
                value={form.amount}
                onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
              />
            </div>
          </div>

          <input
            className="input text-sm"
            placeholder="Viðskiptavinur / athugasemd (valkvæmt)"
            value={form.note}
            onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
          />

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setForm(f => ({ ...f, status: 'paid' }))}
              className="flex-1 py-2.5 rounded-xl text-xs font-medium transition-all"
              style={{
                background: form.status === 'paid' ? 'rgba(34,197,94,0.15)' : 'var(--surface2)',
                color: form.status === 'paid' ? 'var(--success)' : 'var(--muted)',
                border: `1px solid ${form.status === 'paid' ? 'rgba(34,197,94,0.3)' : 'transparent'}`,
              }}
            >
              ✓ Greitt
            </button>
            <button
              type="button"
              onClick={() => setForm(f => ({ ...f, status: 'pending' }))}
              className="flex-1 py-2.5 rounded-xl text-xs font-medium transition-all"
              style={{
                background: form.status === 'pending' ? 'rgba(249,115,22,0.15)' : 'var(--surface2)',
                color: form.status === 'pending' ? '#f97316' : 'var(--muted)',
                border: `1px solid ${form.status === 'pending' ? 'rgba(249,115,22,0.3)' : 'transparent'}`,
              }}
            >
              ⏳ Í bið
            </button>
          </div>

          <button type="submit" className="btn btn-primary w-full justify-center">
            Skrá leigutíma
          </button>
        </form>
      )}

      {/* Tabs */}
      <div className="flex gap-2">
        {[['month', 'Þessi mánuður'], ['all', 'Allt']].map(([t, l]) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="btn text-sm flex-1 justify-center"
            style={{
              background: tab === t ? 'rgba(0,212,170,0.12)' : 'var(--surface)',
              color: tab === t ? 'var(--accent)' : 'var(--muted)',
              border: `1px solid ${tab === t ? 'rgba(0,212,170,0.25)' : 'var(--border)'}`,
            }}
          >
            {l}
          </button>
        ))}
      </div>

      {/* Bookings list */}
      <div className="flex flex-col gap-2">
        {displayBookings.length === 0 ? (
          <div className="card text-center py-10 flex flex-col items-center gap-3">
            <Package size={36} style={{ color: 'var(--muted)' }} />
            <div style={{ color: 'var(--muted)' }}>Engar leigur skráðar</div>
            <button onClick={() => setShowForm(true)} className="btn btn-primary text-sm">
              <Plus size={14} /> Bæta við fyrstu leigunum
            </button>
          </div>
        ) : displayBookings.map(b => {
          const item = LENDO_ITEMS.find(i => i.id === b.item) || LENDO_ITEMS[LENDO_ITEMS.length - 1]
          return (
            <div key={b.id} className="card flex items-center gap-3 py-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                style={{ background: b.status === 'paid' ? 'rgba(34,197,94,0.12)' : 'rgba(249,115,22,0.12)' }}
              >
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold">{formatISK(b.amount)}</div>
                <div className="text-xs" style={{ color: 'var(--muted)' }}>
                  {item.label}
                  {b.days > 1 ? ` · ${b.days} dagar` : ''}
                  {b.note ? ` · ${b.note}` : ''}
                  {' · '}
                  {new Date(b.date).toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => updateStatus(b.id, b.status === 'paid' ? 'pending' : 'paid')}
                  className="text-xs px-2.5 py-1.5 rounded-lg font-medium"
                  style={{
                    background: b.status === 'paid' ? 'rgba(34,197,94,0.12)' : 'rgba(249,115,22,0.12)',
                    color: b.status === 'paid' ? 'var(--success)' : '#f97316',
                  }}
                >
                  {b.status === 'paid' ? '✓ Greitt' : '⏳ Bið'}
                </button>
                <button onClick={() => removeBooking(b.id)} style={{ color: 'var(--muted)' }}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
