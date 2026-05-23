import { useState } from 'react'
import { useLendo } from '../hooks/useLendo'
import { formatISK, formatShortISK } from '../utils/currency'
import { Plus, Trash2, X, TrendingUp, TrendingDown, Calendar, Target } from 'lucide-react'

export default function Lendo() {
  const {
    items, goal, setGoal,
    addBooking, removeBooking,
    monthlyIncome, recentBookings, monthBookings,
    thisMonthIncome, vsLastMonth,
  } = useLendo()

  const [showForm, setShowForm] = useState(false)
  const [showGoalEdit, setShowGoalEdit] = useState(false)
  const [itemId, setItemId] = useState(items[0]?.id || '1')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [days, setDays] = useState(1)
  const [note, setNote] = useState('')
  const [tab, setTab] = useState('overview')

  const monthly = thisMonthIncome
  const pct = Math.min(100, Math.round((monthly / goal) * 100))
  const isGoalMet = monthly >= goal
  const thisMonthList = monthBookings(0)
  const selectedItem = items.find(i => i.id === itemId)
  const previewAmount = selectedItem ? selectedItem.pricePerDay * Number(days) : 0

  const handleAdd = (e) => {
    e.preventDefault()
    if (!itemId || !date || Number(days) < 1) return
    addBooking(itemId, date, days, note)
    setNote('')
    setDays(1)
    setShowForm(false)
  }

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🪑</span>
            <h1 className="text-xl font-semibold">Lendó</h1>
          </div>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            {new Date().toLocaleDateString('is-IS', { month: 'long', year: 'numeric' })}
          </p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          <Plus size={16} /> Bókun
        </button>
      </div>

      {/* Monthly income card */}
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.06), rgba(139,92,246,0.06))' }}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Tekjur þessa mánaðar</div>
            <div className="text-3xl font-semibold" style={{ color: isGoalMet ? 'var(--success)' : 'var(--text)' }}>
              {formatISK(monthly)}
            </div>
            {vsLastMonth !== null && (
              <div className="flex items-center gap-1 mt-1 text-xs">
                {vsLastMonth >= 0
                  ? <TrendingUp size={12} style={{ color: 'var(--success)' }} />
                  : <TrendingDown size={12} style={{ color: 'var(--danger)' }} />
                }
                <span style={{ color: vsLastMonth >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                  {vsLastMonth >= 0 ? '+' : ''}{vsLastMonth}% frá síðasta mánuði
                </span>
              </div>
            )}
          </div>
          <div className="flex flex-col items-end">
            <button
              onClick={() => setShowGoalEdit(!showGoalEdit)}
              className="text-xs mb-1"
              style={{ color: 'var(--muted)' }}
            >
              Breyta markmiði
            </button>
            <div className="text-lg font-semibold" style={{ color: isGoalMet ? 'var(--success)' : 'var(--accent)' }}>
              {formatShortISK(goal)}
            </div>
          </div>
        </div>

        {showGoalEdit && (
          <div className="mb-3">
            <input
              className="input text-sm"
              type="number"
              value={goal}
              onChange={e => setGoal(Number(e.target.value))}
              placeholder="Mánaðarmarkmið (ISK)"
            />
          </div>
        )}

        <div className="h-2.5 rounded-full overflow-hidden mb-1" style={{ background: 'var(--surface2)' }}>
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${pct}%`, background: isGoalMet ? 'var(--success)' : 'var(--accent)' }}
          />
        </div>
        <div className="flex justify-between text-xs" style={{ color: 'var(--muted)' }}>
          <span>{pct}% af markmiði náð</span>
          <span>{thisMonthList.length} bókanir</span>
        </div>
      </div>

      {/* Add booking form */}
      {showForm && (
        <form onSubmit={handleAdd} className="card flex flex-col gap-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Ný bókun</h3>
            <button type="button" onClick={() => setShowForm(false)}>
              <X size={16} style={{ color: 'var(--muted)' }} />
            </button>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs" style={{ color: 'var(--muted)' }}>Hlutur til leigu</label>
            <select className="input text-sm" value={itemId} onChange={e => setItemId(e.target.value)}
                    style={{ background: 'var(--surface2)', color: 'var(--text)' }}>
              {items.map(i => (
                <option key={i.id} value={i.id}>
                  {i.icon} {i.name} — {formatISK(i.pricePerDay)}/dag
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <label className="text-xs" style={{ color: 'var(--muted)' }}>Dagsetning</label>
              <input className="input text-sm" type="date" value={date} onChange={e => setDate(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs" style={{ color: 'var(--muted)' }}>Fjöldi daga</label>
              <input
                className="input text-sm"
                type="number"
                min={1}
                max={30}
                value={days}
                onChange={e => setDays(e.target.value)}
              />
            </div>
          </div>

          <input
            className="input text-sm"
            placeholder="Athugasemd (t.d. nafn leigjanda)"
            value={note}
            onChange={e => setNote(e.target.value)}
          />

          {previewAmount > 0 && (
            <div
              className="flex items-center justify-between p-3 rounded-xl text-sm font-semibold"
              style={{ background: 'rgba(0,212,170,0.1)', color: 'var(--accent)' }}
            >
              <span>Samtals</span>
              <span>{formatISK(previewAmount)}</span>
            </div>
          )}

          <button type="submit" className="btn btn-primary w-full justify-center">
            Skrá bókun
          </button>
        </form>
      )}

      {/* Tabs */}
      <div className="flex gap-2">
        {[['overview', 'Yfirlit'], ['bookings', 'Bókanir']].map(([t, l]) => (
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

      {tab === 'overview' && (
        <div className="flex flex-col gap-3">
          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="card">
              <div className="flex items-center gap-1.5 mb-2" style={{ color: 'var(--accent)' }}>
                <Calendar size={14} />
                <span className="text-xs">Bókanir í mánuði</span>
              </div>
              <div className="text-2xl font-bold">{thisMonthList.length}</div>
            </div>
            <div className="card">
              <div className="flex items-center gap-1.5 mb-2" style={{ color: '#8b5cf6' }}>
                <TrendingUp size={14} />
                <span className="text-xs">Meðaltal/bókun</span>
              </div>
              <div className="text-2xl font-bold">
                {thisMonthList.length > 0 ? formatShortISK(monthly / thisMonthList.length) : '—'}
              </div>
            </div>
          </div>

          {/* Rental items */}
          <div className="card flex flex-col gap-2">
            <div className="text-sm font-semibold mb-1">Hlutir til leigu</div>
            {items.map(item => (
              <div
                key={item.id}
                className="flex items-center gap-3 py-2.5 px-3 rounded-xl"
                style={{ background: 'var(--surface2)' }}
              >
                <span className="text-2xl">{item.icon}</span>
                <div className="flex-1">
                  <div className="text-sm font-medium">{item.name}</div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--accent)' }}>
                    {formatISK(item.pricePerDay)} á dag
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Last month comparison */}
          <div className="card flex flex-col gap-3">
            <div className="text-sm font-semibold">Mánaðarleg samanburður</div>
            {[
              { label: 'Þessi mánuður', amount: monthly, isCurrent: true },
              { label: 'Síðasti mánuður', amount: monthlyIncome(-1), isCurrent: false },
            ].map(r => (
              <div key={r.label} className="flex items-center justify-between">
                <span className="text-sm" style={{ color: r.isCurrent ? 'var(--text)' : 'var(--muted)' }}>
                  {r.label}
                </span>
                <span
                  className="text-sm font-semibold"
                  style={{ color: r.isCurrent ? 'var(--success)' : 'var(--muted)' }}
                >
                  {formatISK(r.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'bookings' && (
        <div className="flex flex-col gap-2">
          {recentBookings.length === 0 ? (
            <div className="card text-center py-10" style={{ color: 'var(--muted)' }}>
              <div className="text-3xl mb-2">🪑</div>
              <div>Engar bókanir ennþá</div>
              <div className="text-xs mt-1">Ýttu á "Bókun" til að skrá fyrstu leiguna</div>
            </div>
          ) : (
            recentBookings.map(b => (
              <div key={b.id} className="card flex items-center gap-3 py-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-lg"
                  style={{ background: 'rgba(0,212,170,0.1)' }}
                >
                  {b.itemIcon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold" style={{ color: 'var(--success)' }}>
                    +{formatISK(b.amount)}
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                    {new Date(b.startDate).toLocaleDateString('is-IS', { weekday: 'short', month: 'short', day: 'numeric' })}
                    {b.days > 1 ? ` · ${b.days} dagar` : ' · 1 dagur'}
                    {b.note ? ` · ${b.note}` : ''}
                  </div>
                </div>
                <button onClick={() => removeBooking(b.id)} style={{ color: 'var(--muted)', padding: 4 }}>
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
