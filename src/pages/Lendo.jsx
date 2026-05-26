import { useState } from 'react'
import { useLendo, LENDO_ITEMS } from '../hooks/useLendo'
import { formatISK, formatShortISK } from '../utils/currency'
import { Plus, Trash2, X, Package, TrendingUp, Calendar } from 'lucide-react'

function MiniBarChart({ data }) {
  const max = Math.max(...data.map(d => d.revenue), 1)
  return (
    <div className="flex items-end gap-1.5" style={{ height: 64 }}>
      {data.map((d, i) => {
        const pct = Math.max(6, Math.round((d.revenue / max) * 100))
        const isToday = i === data.length - 1
        return (
          <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
            <div className="w-full rounded-t-md transition-all"
              style={{
                height: `${pct}%`,
                background: isToday
                  ? 'var(--accent)'
                  : d.revenue > 0
                  ? 'rgba(0,212,170,0.3)'
                  : 'var(--surface2)',
                minHeight: 4,
              }} />
            <span style={{ fontSize: 9, color: isToday ? 'var(--accent)' : 'var(--muted)' }}>
              {d.day}
            </span>
          </div>
        )
      })}
    </div>
  )
}

export default function Lendo() {
  const {
    addBooking, removeBooking,
    goal, setGoal,
    monthlyRevenue, lastMonthRevenue,
    last7Days, topItems, revenueStreak,
    totalBookingsThisMonth, avgPerBooking,
    recentBookings,
  } = useLendo()

  const [showForm, setShowForm] = useState(false)
  const [showGoalEdit, setShowGoalEdit] = useState(false)
  const [amount, setAmount] = useState('')
  const [item, setItem] = useState('veislusett')
  const [note, setNote] = useState('')
  const [tab, setTab] = useState('overview')

  const revenue = monthlyRevenue()
  const lastRev = lastMonthRevenue()
  const pct = Math.min(100, Math.round((revenue / goal) * 100))
  const chartData = last7Days()
  const top = topItems()
  const streak = revenueStreak()
  const bookingsCount = totalBookingsThisMonth()
  const avg = avgPerBooking()
  const diff = lastRev > 0 ? Math.round(((revenue - lastRev) / lastRev) * 100) : null

  const handleAdd = (e) => {
    e.preventDefault()
    if (!amount || isNaN(Number(amount))) return
    addBooking(Number(amount), item, note)
    setAmount('')
    setNote('')
    setShowForm(false)
  }

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold">🏷️ Lendo</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            {new Date().toLocaleDateString('is-IS', { month: 'long', year: 'numeric' })}
          </p>
        </div>
        <button onClick={() => setShowForm(v => !v)} className="btn btn-primary">
          <Plus size={16} /> Bókun
        </button>
      </div>

      {/* Revenue hero */}
      <div className="card"
        style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.09), rgba(139,92,246,0.06))' }}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Tekjur þessa mánaðar</div>
            <div className="text-3xl font-semibold tabular-nums">{formatISK(revenue)}</div>
            {diff !== null && (
              <div className="text-xs mt-1 font-medium"
                style={{ color: diff >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                {diff >= 0 ? '▲' : '▼'} {Math.abs(diff)}% frá síðasta mánuði
              </div>
            )}
          </div>
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1 text-xs mb-1" style={{ color: 'var(--muted)' }}>
              Markmið
              <button onClick={() => setShowGoalEdit(v => !v)}
                className="text-xs ml-1" style={{ color: 'var(--accent)' }}>
                Breyta
              </button>
            </div>
            <div className="text-lg font-semibold"
              style={{ color: pct >= 100 ? 'var(--success)' : 'var(--text)' }}>
              {formatShortISK(goal)}
            </div>
          </div>
        </div>

        {showGoalEdit && (
          <div className="flex gap-2 mb-4">
            <input className="input text-sm flex-1" type="number"
              value={goal} onChange={e => setGoal(Number(e.target.value))}
              placeholder="Mánaðarmarkmið (ISK)" />
            <button onClick={() => setShowGoalEdit(false)} className="btn btn-primary px-4">OK</button>
          </div>
        )}

        <div className="h-2.5 rounded-full overflow-hidden mb-1.5"
          style={{ background: 'var(--surface2)' }}>
          <div className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${pct}%`,
              background: pct >= 100 ? 'var(--success)' : pct > 80 ? '#f97316' : 'var(--accent)',
            }} />
        </div>
        <div className="flex justify-between text-xs" style={{ color: 'var(--muted)' }}>
          <span>{pct}% af markmiði</span>
          {goal > revenue && <span>{formatShortISK(goal - revenue)} eftir</span>}
          {revenue >= goal && <span style={{ color: 'var(--success)' }}>Markmið náð! 🎉</span>}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="card-sm text-center">
          <div className="text-xl font-semibold" style={{ color: 'var(--accent)' }}>{bookingsCount}</div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>Bókanir</div>
        </div>
        <div className="card-sm text-center">
          <div className="text-xl font-semibold tabular-nums" style={{ color: '#8b5cf6' }}>
            {formatShortISK(avg)}
          </div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>Meðaltal</div>
        </div>
        <div className="card-sm text-center">
          <div className="text-xl font-semibold">
            {streak > 0 ? '🔥' : '💤'} {streak}
          </div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>Daga streak</div>
        </div>
      </div>

      {/* Add form */}
      {showForm && (
        <form onSubmit={handleAdd} className="card flex flex-col gap-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Skrá bókun</h3>
            <button type="button" onClick={() => setShowForm(false)}>
              <X size={16} style={{ color: 'var(--muted)' }} />
            </button>
          </div>
          <input className="input text-lg font-semibold" type="number"
            placeholder="Upphæð (ISK)" value={amount}
            onChange={e => setAmount(e.target.value)} autoFocus />
          <div className="grid grid-cols-6 gap-1.5">
            {LENDO_ITEMS.map(it => (
              <button key={it.id} type="button" onClick={() => setItem(it.id)}
                className="flex flex-col items-center gap-0.5 py-2 rounded-xl transition-all"
                style={{
                  background: item === it.id ? 'rgba(0,212,170,0.15)' : 'var(--surface2)',
                  border: `1px solid ${item === it.id ? 'rgba(0,212,170,0.4)' : 'transparent'}`,
                }}>
                <span>{it.icon}</span>
                <span style={{ fontSize: 9, color: item === it.id ? 'var(--accent)' : 'var(--muted)' }}>
                  {it.label}
                </span>
              </button>
            ))}
          </div>
          <input className="input text-sm" placeholder="Athugasemd (valkvæmt)"
            value={note} onChange={e => setNote(e.target.value)} />
          <button type="submit" className="btn btn-primary w-full justify-center">
            <Plus size={16} /> Skrá bókun
          </button>
        </form>
      )}

      {/* Tabs */}
      <div className="flex gap-2">
        {[['overview', 'Yfirlit'], ['bookings', 'Bókanir']].map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)}
            className="btn text-sm flex-1 justify-center"
            style={{
              background: tab === t ? 'rgba(0,212,170,0.12)' : 'var(--surface)',
              color: tab === t ? 'var(--accent)' : 'var(--muted)',
              border: `1px solid ${tab === t ? 'rgba(0,212,170,0.25)' : 'var(--border)'}`,
            }}>
            {l}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <>
          {/* 7-day chart */}
          <div className="card">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={14} style={{ color: 'var(--accent)' }} />
              <span className="text-sm font-medium">Síðustu 7 dagar</span>
              <span className="ml-auto text-xs" style={{ color: 'var(--muted)' }}>
                {formatShortISK(chartData.reduce((s, d) => s + d.revenue, 0))} samtals
              </span>
            </div>
            <MiniBarChart data={chartData} />
          </div>

          {/* Top items */}
          {top.length > 0 && (
            <div className="card">
              <div className="flex items-center gap-2 mb-3">
                <Package size={14} style={{ color: 'var(--accent)' }} />
                <span className="text-sm font-medium">Vinsælustu hlutir þ.m.</span>
              </div>
              <div className="flex flex-col gap-2.5">
                {top.map(({ item: itemId, revenue: rev, count }, i) => {
                  const lendoItem = LENDO_ITEMS.find(l => l.id === itemId) || { label: itemId, icon: '📦' }
                  const barPct = Math.round((rev / top[0].revenue) * 100)
                  return (
                    <div key={itemId} className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs w-4" style={{ color: 'var(--muted)' }}>{i + 1}.</span>
                        <span className="text-sm flex-1">{lendoItem.icon} {lendoItem.label}</span>
                        <span className="text-sm font-semibold tabular-nums">{formatShortISK(rev)}</span>
                        <span className="text-xs" style={{ color: 'var(--muted)' }}>{count}x</span>
                      </div>
                      <div className="h-1 rounded-full ml-6 overflow-hidden" style={{ background: 'var(--surface2)' }}>
                        <div className="h-full rounded-full"
                          style={{ width: `${barPct}%`, background: 'var(--accent)', opacity: 0.6 + i * -0.15 }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {top.length === 0 && bookingsCount === 0 && (
            <div className="card text-center py-10 flex flex-col items-center gap-3">
              <span style={{ fontSize: 40 }}>🏷️</span>
              <div>
                <div className="font-medium mb-1">Engar bókanir ennþá</div>
                <div className="text-sm" style={{ color: 'var(--muted)' }}>
                  Skráðu fyrstu Lendo bókunina þína!
                </div>
              </div>
              <button onClick={() => setShowForm(true)} className="btn btn-primary">
                <Plus size={16} /> Skrá bókun
              </button>
            </div>
          )}
        </>
      )}

      {tab === 'bookings' && (
        <div className="flex flex-col gap-2">
          {recentBookings.length === 0 ? (
            <div className="card text-center py-10 flex flex-col items-center gap-3">
              <Calendar size={32} style={{ color: 'var(--muted)', opacity: 0.4 }} />
              <div className="text-sm" style={{ color: 'var(--muted)' }}>Engar bókanir ennþá</div>
            </div>
          ) : recentBookings.map(b => {
            const lendoItem = LENDO_ITEMS.find(l => l.id === b.item) || { label: b.item, icon: '📦' }
            const isThisMonth = new Date(b.date).getMonth() === new Date().getMonth()
            return (
              <div key={b.id} className="card flex items-center gap-3 py-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0"
                  style={{ background: 'rgba(0,212,170,0.12)' }}>
                  {lendoItem.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold tabular-nums">{formatISK(b.amount)}</div>
                  <div className="text-xs" style={{ color: 'var(--muted)' }}>
                    {lendoItem.label}
                    {b.note ? ` · ${b.note}` : ''} · {new Date(b.date).toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
                {!isThisMonth && (
                  <span className="text-xs px-1.5 py-0.5 rounded-md" style={{ background: 'var(--surface2)', color: 'var(--muted)' }}>
                    {new Date(b.date).toLocaleDateString('is-IS', { month: 'short' })}
                  </span>
                )}
                <button onClick={() => removeBooking(b.id)} style={{ color: 'var(--muted)', padding: 4 }}>
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
