import { useState } from 'react'
import { useLendo, LENDO_ITEMS } from '../hooks/useLendo'
import { formatISK, formatShortISK } from '../utils/currency'
import { Plus, Trash2, X, TrendingUp, Target, Package } from 'lucide-react'

function BarChart({ data }) {
  const max = Math.max(...data.map(d => d.total), 1)
  return (
    <div className="flex items-end gap-1.5 h-16">
      {data.map((d, i) => {
        const pct = (d.total / max) * 100
        const isLast = i === data.length - 1
        return (
          <div key={d.month} className="flex-1 flex flex-col items-center gap-0.5">
            <div className="w-full rounded-t-sm transition-all"
                 style={{
                   height: `${Math.max(4, pct)}%`,
                   background: isLast ? 'var(--accent)' : 'var(--surface2)',
                   minHeight: d.total > 0 ? 4 : 0,
                 }} />
            <span className="text-xs" style={{ color: isLast ? 'var(--accent)' : 'var(--muted)', fontSize: 9 }}>{d.month}</span>
          </div>
        )
      })}
    </div>
  )
}

export default function Business() {
  const { rentals, add, remove, goal, setGoal, thisMonth, total, remaining, pct, rentalCount, avgPerRental, last6 } = useLendo()
  const [showForm, setShowForm] = useState(false)
  const [showGoalEdit, setShowGoalEdit] = useState(false)
  const [amount, setAmount] = useState('')
  const [item, setItem] = useState('vset')
  const [days, setDays] = useState(1)
  const [note, setNote] = useState('')
  const [tab, setTab] = useState('overview')

  const selectedItem = LENDO_ITEMS.find(i => i.id === item)

  const handleAdd = (e) => {
    e.preventDefault()
    const finalAmount = amount ? Number(amount) : (selectedItem?.price || 0) * days
    if (!finalAmount) return
    add({ amount: finalAmount, item, note, days })
    setAmount('')
    setNote('')
    setDays(1)
    setShowForm(false)
  }

  const isOver = total > goal
  const safeRemaining = Math.abs(remaining)

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold">Lendó</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            {new Date().toLocaleDateString('is-IS', { month: 'long', year: 'numeric' })}
          </p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          <Plus size={16} /> Leiga
        </button>
      </div>

      {/* Overview card */}
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(249,115,22,0.08), rgba(0,212,170,0.08))' }}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Tekjur þessa mánaðar</div>
            <div className="text-3xl font-semibold" style={{ color: 'var(--accent)' }}>{formatISK(total)}</div>
          </div>
          <div className="text-right">
            <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>{isOver ? 'Yfir markmið!' : 'Eftir af markmiði'}</div>
            <div className="text-lg font-semibold" style={{ color: isOver ? 'var(--success)' : 'var(--muted)' }}>
              {isOver ? '+' : ''}{formatISK(isOver ? safeRemaining : -safeRemaining + goal)}
            </div>
          </div>
        </div>

        <div className="h-2.5 rounded-full overflow-hidden mb-1" style={{ background: 'var(--surface2)' }}>
          <div className="h-full rounded-full transition-all"
               style={{ width: `${pct}%`, background: isOver ? 'var(--success)' : 'var(--accent)' }} />
        </div>
        <div className="flex justify-between text-xs" style={{ color: 'var(--muted)' }}>
          <span>{pct}% af markmiði</span>
          <button onClick={() => setShowGoalEdit(!showGoalEdit)} style={{ color: 'var(--accent)' }}>
            Markmið: {formatShortISK(goal)}
          </button>
        </div>

        {showGoalEdit && (
          <div className="mt-3 flex gap-2">
            <input className="input text-sm flex-1" type="number" value={goal}
              onChange={e => setGoal(Number(e.target.value))} />
            <button className="btn btn-primary text-xs" onClick={() => setShowGoalEdit(false)}>Vista</button>
          </div>
        )}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { icon: <Package size={14} />, label: 'Leigur', value: rentalCount },
          { icon: <TrendingUp size={14} />, label: 'Meðaltal', value: formatShortISK(avgPerRental) },
          { icon: <Target size={14} />, label: 'Markmið', value: formatShortISK(goal) },
        ].map(({ icon, label, value }) => (
          <div key={label} className="card-sm flex flex-col gap-1">
            <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--muted)' }}>
              {icon} {label}
            </div>
            <div className="text-base font-semibold">{value}</div>
          </div>
        ))}
      </div>

      {/* Add rental form */}
      {showForm && (
        <form onSubmit={handleAdd} className="card flex flex-col gap-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Skrá leigu</h3>
            <button type="button" onClick={() => setShowForm(false)}><X size={16} style={{ color: 'var(--muted)' }} /></button>
          </div>

          <div>
            <label className="text-xs mb-1 block" style={{ color: 'var(--muted)' }}>Hlutur</label>
            <div className="grid grid-cols-1 gap-1.5">
              {LENDO_ITEMS.map(it => (
                <button key={it.id} type="button" onClick={() => {
                  setItem(it.id)
                  if (it.price && !amount) setAmount('')
                }}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-left text-sm transition-all"
                  style={{
                    background: item === it.id ? 'rgba(249,115,22,0.15)' : 'var(--surface2)',
                    border: `1px solid ${item === it.id ? 'rgba(249,115,22,0.4)' : 'transparent'}`,
                  }}>
                  <span>{it.icon}</span>
                  <span className="flex-1">{it.label}</span>
                  {it.price > 0 && <span className="text-xs" style={{ color: 'var(--muted)' }}>{formatISK(it.price)}/dag</span>}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-xs mb-1 block" style={{ color: 'var(--muted)' }}>Dagar</label>
              <input className="input text-sm" type="number" min={1} value={days}
                onChange={e => setDays(Number(e.target.value))} />
            </div>
            <div className="flex-1">
              <label className="text-xs mb-1 block" style={{ color: 'var(--muted)' }}>Upphæð (ISK)</label>
              <input className="input text-sm" type="number"
                placeholder={selectedItem?.price ? `${selectedItem.price * days} kr` : 'ISK'}
                value={amount} onChange={e => setAmount(e.target.value)} />
            </div>
          </div>

          <input className="input text-sm" placeholder="Athugasemd (valkvæmt)" value={note}
            onChange={e => setNote(e.target.value)} />

          <button type="submit" className="btn btn-primary w-full justify-center">
            Skrá {formatISK(amount ? Number(amount) : (selectedItem?.price || 0) * days)}
          </button>
        </form>
      )}

      {/* Tabs */}
      <div className="flex gap-2">
        {[['overview', 'Yfirlit'], ['history', 'Saga']].map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)}
            className="btn text-sm flex-1 justify-center"
            style={{
              background: tab === t ? 'rgba(249,115,22,0.12)' : 'var(--surface)',
              color: tab === t ? '#f97316' : 'var(--muted)',
              border: `1px solid ${tab === t ? 'rgba(249,115,22,0.25)' : 'var(--border)'}`,
            }}>{l}</button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="card flex flex-col gap-4">
          <div>
            <h3 className="font-semibold text-sm mb-3">Síðustu 6 mánuðir</h3>
            <BarChart data={last6} />
          </div>
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12 }}>
            <div className="text-xs mb-2" style={{ color: 'var(--muted)' }}>Tekjur eftir hlut</div>
            {LENDO_ITEMS.filter(it => it.id !== 'other').map(it => {
              const itemRentals = thisMonth.filter(r => r.item === it.id)
              const itemTotal = itemRentals.reduce((s, r) => s + r.amount, 0)
              if (itemTotal === 0) return null
              return (
                <div key={it.id} className="flex items-center justify-between py-1.5 text-sm">
                  <span>{it.icon} {it.label}</span>
                  <span className="font-medium">{formatISK(itemTotal)}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {tab === 'history' && (
        <div className="flex flex-col gap-2">
          {rentals.length === 0 ? (
            <div className="card text-center py-8" style={{ color: 'var(--muted)' }}>Engar leigur skráðar</div>
          ) : rentals.map(r => {
            const it = LENDO_ITEMS.find(i => i.id === r.item) || LENDO_ITEMS[4]
            return (
              <div key={r.id} className="card flex items-center gap-3 py-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0"
                     style={{ background: 'rgba(249,115,22,0.15)' }}>{it.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">{formatISK(r.amount)}</div>
                  <div className="text-xs" style={{ color: 'var(--muted)' }}>
                    {it.label}{r.days > 1 ? ` · ${r.days} dagar` : ''}{r.note ? ` · ${r.note}` : ''}
                    {' · '}{new Date(r.date).toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
                <button onClick={() => remove(r.id)} style={{ color: 'var(--muted)' }}>
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
