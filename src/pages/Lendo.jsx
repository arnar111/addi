import { useState } from 'react'
import { useLendo, LENDO_ITEMS } from '../hooks/useLendo'
import { formatISK, formatShortISK } from '../utils/currency'
import { Plus, Trash2, X, TrendingUp, Home, Target, Package } from 'lucide-react'

function MiniBar({ value, max, color = '#ff6b35' }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--surface2)' }}>
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="text-xs shrink-0" style={{ color: 'var(--muted)', minWidth: 36, textAlign: 'right' }}>
        {Math.round(pct)}%
      </span>
    </div>
  )
}

function MonthChart({ data }) {
  const max = Math.max(...data.map(d => d.revenue), 1)
  return (
    <div className="flex items-end gap-1.5 h-16">
      {data.map((d, i) => {
        const pct = Math.max(4, (d.revenue / max) * 100)
        const isLast = i === data.length - 1
        return (
          <div key={d.month} className="flex flex-col items-center gap-1 flex-1">
            <div className="w-full rounded-t-md transition-all"
                 style={{
                   height: `${pct}%`,
                   background: isLast ? '#ff6b35' : 'var(--surface2)',
                   border: isLast ? '1px solid rgba(255,107,53,0.4)' : 'none',
                   minHeight: 6,
                 }} />
            <span className="text-xs" style={{ color: isLast ? '#ff6b35' : 'var(--muted)', fontSize: 9 }}>
              {d.month}
            </span>
          </div>
        )
      })}
    </div>
  )
}

export default function Lendo() {
  const {
    bookings, addBooking, removeBooking,
    bizExpenses, addBizExpense, removeBizExpense,
    monthlyGoal, setMonthlyGoal,
    currentMonthBookings, monthlyRevenue, monthlyBizExpenses, netProfit, goalProgress,
    last6Months,
  } = useLendo()

  const [tab, setTab] = useState('yfirlit')
  const [showAddBooking, setShowAddBooking] = useState(false)
  const [showAddExpense, setShowAddExpense] = useState(false)
  const [showGoalEdit, setShowGoalEdit] = useState(false)

  const [bForm, setBForm] = useState({ amount: '', item: 'veislusett', customer: '', note: '', days: '1', date: '' })
  const [eForm, setEForm] = useState({ amount: '', note: '', date: '' })

  const rev = monthlyRevenue()
  const exp = monthlyBizExpenses()
  const profit = netProfit()
  const pct = goalProgress()
  const bkgs = currentMonthBookings()
  const chart = last6Months()
  const isOver = pct >= 100

  const handleAddBooking = (e) => {
    e.preventDefault()
    if (!bForm.amount) return
    addBooking({ ...bForm })
    setBForm({ amount: '', item: 'veislusett', customer: '', note: '', days: '1', date: '' })
    setShowAddBooking(false)
  }

  const handleAddExpense = (e) => {
    e.preventDefault()
    if (!eForm.amount) return
    addBizExpense({ ...eForm })
    setEForm({ amount: '', note: '', date: '' })
    setShowAddExpense(false)
  }

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                 style={{ background: 'rgba(255,107,53,0.15)' }}>
              <Home size={16} style={{ color: '#ff6b35' }} />
            </div>
            <h1 className="text-xl font-semibold">Lendó</h1>
          </div>
          <p className="text-sm mt-0.5" style={{ color: 'var(--muted)' }}>
            {new Date().toLocaleDateString('is-IS', { month: 'long', year: 'numeric' })}
          </p>
        </div>
        <button onClick={() => setShowAddBooking(!showAddBooking)} className="btn"
                style={{ background: '#ff6b35', color: '#fff' }}>
          <Plus size={16} /> Bókun
        </button>
      </div>

      {/* Hero stats */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, rgba(255,107,53,0.08), rgba(139,92,246,0.05))',
        border: '1px solid rgba(255,107,53,0.2)',
      }}>
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div>
            <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Tekjur</div>
            <div className="text-2xl font-bold">{formatShortISK(rev)}</div>
          </div>
          <div>
            <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Gjöld</div>
            <div className="text-2xl font-bold" style={{ color: 'var(--danger)' }}>{formatShortISK(exp)}</div>
          </div>
          <div>
            <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Hagnaður</div>
            <div className="text-2xl font-bold" style={{ color: profit >= 0 ? '#22c55e' : 'var(--danger)' }}>
              {formatShortISK(profit)}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs" style={{ color: 'var(--muted)' }}>
            {isOver ? '🎉 Mark náð!' : `${bkgs.length} bókanir`}
          </span>
          <button onClick={() => setShowGoalEdit(!showGoalEdit)} className="text-xs" style={{ color: '#ff6b35' }}>
            Mark: {formatShortISK(monthlyGoal)}
          </button>
        </div>

        {showGoalEdit && (
          <div className="flex gap-2 mb-3 animate-slide-up">
            <input className="input text-sm flex-1" type="number"
              value={monthlyGoal}
              onChange={e => setMonthlyGoal(Number(e.target.value))}
              placeholder="200000" />
            <button onClick={() => setShowGoalEdit(false)} className="btn btn-ghost px-3">OK</button>
          </div>
        )}

        <div className="h-3 rounded-full overflow-hidden mb-1" style={{ background: 'var(--surface2)' }}>
          <div className="h-full rounded-full transition-all duration-700"
               style={{
                 width: `${pct}%`,
                 background: isOver ? '#22c55e' : pct > 60 ? '#ff6b35' : 'rgba(255,107,53,0.65)',
               }} />
        </div>
        <div className="flex justify-between text-xs" style={{ color: 'var(--muted)' }}>
          <span>{pct}% af {formatShortISK(monthlyGoal)} marki</span>
          <span>{formatShortISK(Math.max(0, monthlyGoal - rev))} eftir</span>
        </div>
      </div>

      {/* Add booking form */}
      {showAddBooking && (
        <form onSubmit={handleAddBooking} className="card flex flex-col gap-3 animate-slide-up"
              style={{ border: '1px solid rgba(255,107,53,0.25)' }}>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Ný bókun</h3>
            <button type="button" onClick={() => setShowAddBooking(false)}>
              <X size={16} style={{ color: 'var(--muted)' }} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input className="input text-sm" type="number" placeholder="Upphæð (kr)"
              value={bForm.amount} onChange={e => setBForm(f => ({ ...f, amount: e.target.value }))} required autoFocus />
            <input className="input text-sm" type="number" placeholder="Dagar" min={1}
              value={bForm.days} onChange={e => setBForm(f => ({ ...f, days: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {LENDO_ITEMS.map(it => (
              <button key={it.id} type="button"
                onClick={() => setBForm(f => ({ ...f, item: it.id }))}
                className="flex items-center gap-2 p-2.5 rounded-xl text-xs text-left"
                style={{
                  background: bForm.item === it.id ? 'rgba(255,107,53,0.15)' : 'var(--surface2)',
                  border: `1px solid ${bForm.item === it.id ? 'rgba(255,107,53,0.4)' : 'transparent'}`,
                  color: bForm.item === it.id ? '#ff6b35' : 'var(--muted)',
                }}>
                <span>{it.icon}</span>
                <span className="truncate">{it.label}</span>
              </button>
            ))}
          </div>
          <input className="input text-sm" placeholder="Viðskiptavinur (valkvæmt)"
            value={bForm.customer} onChange={e => setBForm(f => ({ ...f, customer: e.target.value }))} />
          <input className="input text-sm" placeholder="Athugasemd (valkvæmt)"
            value={bForm.note} onChange={e => setBForm(f => ({ ...f, note: e.target.value }))} />
          <input className="input text-sm" type="date"
            value={bForm.date} onChange={e => setBForm(f => ({ ...f, date: e.target.value }))} />
          <button type="submit" className="btn w-full justify-center"
                  style={{ background: '#ff6b35', color: '#fff' }}>
            <Plus size={15} /> Bæta við bókun
          </button>
        </form>
      )}

      {/* Tabs */}
      <div className="flex gap-2">
        {[['yfirlit', 'Yfirlit'], ['bókanir', 'Bókanir'], ['gjöld', 'Gjöld']].map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)}
            className="btn text-sm flex-1 justify-center"
            style={{
              background: tab === t ? 'rgba(255,107,53,0.15)' : 'var(--surface)',
              color: tab === t ? '#ff6b35' : 'var(--muted)',
              border: `1px solid ${tab === t ? 'rgba(255,107,53,0.3)' : 'var(--border)'}`,
            }}>{l}</button>
        ))}
      </div>

      {/* Yfirlit tab */}
      {tab === 'yfirlit' && (
        <div className="flex flex-col gap-4">
          {/* Revenue chart */}
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={14} style={{ color: '#ff6b35' }} />
              <span className="font-semibold text-sm">Tekjuþróun (6 mánuðir)</span>
            </div>
            <MonthChart data={chart} />
          </div>

          {/* Item breakdown */}
          <div className="card">
            <div className="flex items-center gap-2 mb-3">
              <Package size={14} style={{ color: '#ff6b35' }} />
              <span className="font-semibold text-sm">Hlutir þessa mánaðar</span>
            </div>
            {bkgs.length === 0 ? (
              <p className="text-sm text-center py-3" style={{ color: 'var(--muted)' }}>Engar bókanir enn</p>
            ) : (
              <div className="flex flex-col gap-3">
                {LENDO_ITEMS.map(it => {
                  const itBookings = bkgs.filter(b => b.item === it.id)
                  const itRev = itBookings.reduce((s, b) => s + b.amount, 0)
                  if (itBookings.length === 0) return null
                  return (
                    <div key={it.id}>
                      <div className="flex justify-between text-xs mb-1">
                        <span>{it.icon} {it.label} <span style={{ color: 'var(--muted)' }}>({itBookings.length}×)</span></span>
                        <span className="font-semibold">{formatShortISK(itRev)}</span>
                      </div>
                      <MiniBar value={itRev} max={rev} />
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 gap-3">
            {[
              ['Meðaltal/bókun', bkgs.length ? formatShortISK(rev / bkgs.length) : '—'],
              ['Bókanir í mánuði', String(bkgs.length)],
              ['Heildartekjur', formatShortISK(bookings.reduce((s, b) => s + b.amount, 0))],
              ['Heildarbókanir', String(bookings.length)],
            ].map(([k, v]) => (
              <div key={k} className="card-sm">
                <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>{k}</div>
                <div className="text-lg font-bold">{v}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bókanir tab */}
      {tab === 'bókanir' && (
        <div className="flex flex-col gap-2">
          {bookings.length === 0 ? (
            <div className="card text-center py-8" style={{ color: 'var(--muted)' }}>
              Engar bókanir ennþá — bættu við fyrstu bókuninni!
            </div>
          ) : bookings.map(b => {
            const it = LENDO_ITEMS.find(i => i.id === b.item) || LENDO_ITEMS[3]
            return (
              <div key={b.id} className="card flex items-center gap-3 py-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0"
                     style={{ background: 'rgba(255,107,53,0.12)' }}>
                  {it.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold">{formatISK(b.amount)}</span>
                    {b.days > 1 && (
                      <span className="text-xs px-1.5 py-0.5 rounded-full"
                            style={{ background: 'rgba(255,107,53,0.12)', color: '#ff6b35' }}>
                        {b.days} dagar
                      </span>
                    )}
                  </div>
                  <div className="text-xs truncate" style={{ color: 'var(--muted)' }}>
                    {it.label}
                    {b.customer ? ` · ${b.customer}` : ''}
                    {b.note ? ` · ${b.note}` : ''}
                  </div>
                  <div className="text-xs" style={{ color: 'var(--muted)' }}>
                    {new Date(b.date).toLocaleDateString('is-IS', { month: 'short', day: 'numeric', year: 'numeric' })}
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

      {/* Gjöld tab */}
      {tab === 'gjöld' && (
        <div className="flex flex-col gap-3">
          <button onClick={() => setShowAddExpense(!showAddExpense)}
                  className="btn btn-ghost w-full justify-center">
            <Plus size={15} /> Bæta við gjaldi
          </button>

          {showAddExpense && (
            <form onSubmit={handleAddExpense} className="card flex flex-col gap-3 animate-slide-up">
              <input className="input text-sm" type="number" placeholder="Upphæð (kr)"
                value={eForm.amount} onChange={e => setEForm(f => ({ ...f, amount: e.target.value }))} required autoFocus />
              <input className="input text-sm" placeholder="Lýsing (t.d. flutningur, geymsla)"
                value={eForm.note} onChange={e => setEForm(f => ({ ...f, note: e.target.value }))} />
              <input className="input text-sm" type="date"
                value={eForm.date} onChange={e => setEForm(f => ({ ...f, date: e.target.value }))} />
              <button type="submit" className="btn btn-primary w-full justify-center">Vista gjald</button>
            </form>
          )}

          {bizExpenses.length === 0 ? (
            <div className="card text-center py-6" style={{ color: 'var(--muted)' }}>Engin rekstrargjöld</div>
          ) : bizExpenses.map(e => (
            <div key={e.id} className="card flex items-center gap-3 py-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0"
                   style={{ background: 'rgba(239,68,68,0.1)' }}>💸</div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold" style={{ color: 'var(--danger)' }}>
                  -{formatISK(e.amount)}
                </div>
                <div className="text-xs" style={{ color: 'var(--muted)' }}>
                  {e.note || 'Rekstrargjald'} · {new Date(e.date).toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })}
                </div>
              </div>
              <button onClick={() => removeBizExpense(e.id)} style={{ color: 'var(--muted)' }}>
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
