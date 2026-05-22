import { useState } from 'react'
import { useLendo } from '../hooks/useLendo'
import { formatISK, formatShortISK } from '../utils/currency'
import { Plus, Trash2, X, Target, TrendingUp, Package, Calendar } from 'lucide-react'

export default function Lendo() {
  const {
    recentRentals, addRental, removeRental,
    items, addItem, removeItem,
    goal, setGoal,
    monthlyIncome, totalRentals, avgPerRental,
  } = useLendo()

  const [tab, setTab] = useState('overview')
  const [showForm, setShowForm] = useState(false)
  const [showItemForm, setShowItemForm] = useState(false)
  const [showGoalEdit, setShowGoalEdit] = useState(false)

  // Rental form state
  const [itemId, setItemId] = useState('')
  const [amount, setAmount] = useState('')
  const [days, setDays] = useState('1')
  const [note, setNote] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])

  // Item form state
  const [newItemName, setNewItemName] = useState('')
  const [newItemDay, setNewItemDay] = useState('')
  const [newItemWeekend, setNewItemWeekend] = useState('')
  const [newItemEmoji, setNewItemEmoji] = useState('📦')

  const income = monthlyIncome()
  const goalAmount = goal
  const pct = Math.min(100, Math.round((income / goalAmount) * 100))
  const isGoalMet = income >= goalAmount

  const handleAddRental = (e) => {
    e.preventDefault()
    if (!itemId || !amount) return
    addRental({ itemId, amount, days, note, date: new Date(date).toISOString() })
    setAmount('')
    setDays('1')
    setNote('')
    setDate(new Date().toISOString().split('T')[0])
    setShowForm(false)
  }

  const handleSelectItem = (id) => {
    setItemId(id)
    const item = items.find(i => i.id === id)
    if (item) setAmount(String(item.priceDay))
  }

  const handleAddItem = (e) => {
    e.preventDefault()
    if (!newItemName || !newItemDay) return
    addItem(newItemName, newItemDay, newItemWeekend || newItemDay, newItemEmoji)
    setNewItemName('')
    setNewItemDay('')
    setNewItemWeekend('')
    setNewItemEmoji('📦')
    setShowItemForm(false)
  }

  const monthName = new Date().toLocaleDateString('is-IS', { month: 'long', year: 'numeric' })

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold">Lendó</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>{monthName}</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          <Plus size={16} /> Leiga
        </button>
      </div>

      {/* Income progress card */}
      <div className="card" style={{
        background: isGoalMet
          ? 'linear-gradient(135deg, rgba(34,197,94,0.08), rgba(0,212,170,0.08))'
          : 'linear-gradient(135deg, rgba(0,212,170,0.06), rgba(139,92,246,0.06))'
      }}>
        <div className="flex justify-between items-start mb-3">
          <div>
            <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Tekjur þessa mánaðar</div>
            <div className="text-3xl font-semibold" style={{ color: isGoalMet ? 'var(--success)' : 'var(--text)' }}>
              {formatISK(income)}
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <button onClick={() => setShowGoalEdit(!showGoalEdit)} className="flex items-center gap-1 text-xs"
              style={{ color: 'var(--accent)' }}>
              <Target size={12} /> Markmið
            </button>
            <div className="text-lg font-semibold" style={{ color: 'var(--muted)' }}>
              {formatShortISK(goalAmount)}
            </div>
          </div>
        </div>

        {showGoalEdit && (
          <div className="mb-3">
            <input className="input text-sm" type="number"
              value={goalAmount}
              onChange={e => setGoal(Number(e.target.value))}
              placeholder="Mánaðarmarkmið (ISK)" />
          </div>
        )}

        <div className="h-2.5 rounded-full overflow-hidden mb-1" style={{ background: 'var(--surface2)' }}>
          <div className="h-full rounded-full transition-all"
            style={{ width: `${pct}%`, background: isGoalMet ? 'var(--success)' : 'var(--accent)' }} />
        </div>
        <div className="flex justify-between text-xs" style={{ color: 'var(--muted)' }}>
          <span>{pct}% af markmiði</span>
          <span>{isGoalMet ? '🎉 Markmið náð!' : `${formatShortISK(goalAmount - income)} eftir`}</span>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-2 mt-3">
          {[
            ['Leigur', String(totalRentals()), '📋'],
            ['Meðaltal', formatShortISK(avgPerRental()), '📊'],
            ['Hlutfall', `${pct}%`, '🎯'],
          ].map(([label, value, icon]) => (
            <div key={label} className="flex flex-col items-center p-2 rounded-xl text-center"
              style={{ background: 'var(--surface2)' }}>
              <span className="text-sm mb-0.5">{icon}</span>
              <span className="text-sm font-semibold">{value}</span>
              <span className="text-xs" style={{ color: 'var(--muted)' }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Add rental form */}
      {showForm && (
        <form onSubmit={handleAddRental} className="card flex flex-col gap-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Skrá leigu</h3>
            <button type="button" onClick={() => setShowForm(false)}>
              <X size={16} style={{ color: 'var(--muted)' }} />
            </button>
          </div>

          {/* Item selector */}
          <div className="grid grid-cols-2 gap-2">
            {items.map(item => (
              <button key={item.id} type="button" onClick={() => handleSelectItem(item.id)}
                className="flex items-center gap-2 p-2.5 rounded-xl text-left text-xs transition-all"
                style={{
                  background: itemId === item.id ? 'rgba(0,212,170,0.12)' : 'var(--surface2)',
                  border: `1px solid ${itemId === item.id ? 'rgba(0,212,170,0.35)' : 'transparent'}`,
                }}>
                <span className="text-base">{item.emoji}</span>
                <div className="min-w-0">
                  <div className="font-medium truncate" style={{ color: itemId === item.id ? 'var(--accent)' : 'var(--text)' }}>
                    {item.name.length > 18 ? item.name.slice(0, 18) + '…' : item.name}
                  </div>
                  <div style={{ color: 'var(--muted)' }}>{formatShortISK(item.priceDay)}/dag</div>
                </div>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <label className="text-xs" style={{ color: 'var(--muted)' }}>Upphæð (ISK)</label>
              <input className="input text-sm" type="number" placeholder="7000" value={amount}
                onChange={e => setAmount(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs" style={{ color: 'var(--muted)' }}>Dagar</label>
              <input className="input text-sm" type="number" min="1" value={days}
                onChange={e => setDays(e.target.value)} />
            </div>
          </div>

          <input className="input text-sm" placeholder="Athugasemd (valkvæmt)" value={note}
            onChange={e => setNote(e.target.value)} />
          <div className="flex flex-col gap-1">
            <label className="text-xs" style={{ color: 'var(--muted)' }}>Dagsetning</label>
            <input className="input text-sm" type="date" value={date}
              onChange={e => setDate(e.target.value)} />
          </div>

          <button type="submit" className="btn btn-primary w-full justify-center">
            <Plus size={16} /> Skrá leigu
          </button>
        </form>
      )}

      {/* Tabs */}
      <div className="flex gap-2">
        {[['overview', '📋 Leigur'], ['items', '📦 Hlutir']].map(([t, l]) => (
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
        <div className="flex flex-col gap-2">
          {recentRentals.length === 0 ? (
            <div className="card text-center py-10 flex flex-col items-center gap-3">
              <span className="text-3xl">🏠</span>
              <div style={{ color: 'var(--muted)' }} className="text-sm">Engar leigur skráðar enn</div>
              <button onClick={() => setShowForm(true)} className="btn btn-primary text-sm">
                <Plus size={14} /> Skrá fyrstu leigu
              </button>
            </div>
          ) : recentRentals.map(r => {
            const isThisMonth = (() => {
              const d = new Date(r.date)
              const now = new Date()
              return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
            })()
            return (
              <div key={r.id} className="card flex items-center gap-3 py-3"
                style={{ opacity: isThisMonth ? 1 : 0.6 }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-lg"
                  style={{ background: 'rgba(0,212,170,0.12)' }}>{r.itemEmoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{r.itemName}</div>
                  <div className="text-xs" style={{ color: 'var(--muted)' }}>
                    {r.days} {r.days === 1 ? 'dagur' : 'dagar'}
                    {r.note ? ` · ${r.note}` : ''}
                    {' · '}{new Date(r.date).toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-semibold text-sm" style={{ color: 'var(--accent)' }}>
                    {formatISK(r.amount)}
                  </span>
                  <button onClick={() => removeRental(r.id)} style={{ color: 'var(--muted)' }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {tab === 'items' && (
        <div className="flex flex-col gap-3">
          {items.map(item => (
            <div key={item.id} className="card flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-xl"
                style={{ background: 'var(--surface2)' }}>{item.emoji}</div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium">{item.name}</div>
                <div className="text-xs" style={{ color: 'var(--muted)' }}>
                  {formatShortISK(item.priceDay)}/dag · {formatShortISK(item.priceWeekend)}/helgi
                </div>
              </div>
              <button onClick={() => removeItem(item.id)} style={{ color: 'var(--muted)' }}>
                <Trash2 size={14} />
              </button>
            </div>
          ))}

          {showItemForm ? (
            <form onSubmit={handleAddItem} className="card flex flex-col gap-3 animate-slide-up">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm">Nýr hlutur</h3>
                <button type="button" onClick={() => setShowItemForm(false)}>
                  <X size={16} style={{ color: 'var(--muted)' }} />
                </button>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {['📦', '🪑', '🪵', '⛺', '🔥', '🎉', '🏠', '🚗'].map(e => (
                  <button key={e} type="button" onClick={() => setNewItemEmoji(e)}
                    className="py-2 rounded-xl text-xl transition-all"
                    style={{ background: newItemEmoji === e ? 'rgba(0,212,170,0.15)' : 'var(--surface2)' }}>
                    {e}
                  </button>
                ))}
              </div>
              <input className="input text-sm" placeholder="Nafn hlutar" value={newItemName}
                onChange={e => setNewItemName(e.target.value)} />
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <label className="text-xs" style={{ color: 'var(--muted)' }}>Verð/dag (ISK)</label>
                  <input className="input text-sm" type="number" value={newItemDay}
                    onChange={e => setNewItemDay(e.target.value)} />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs" style={{ color: 'var(--muted)' }}>Verð/helgi (ISK)</label>
                  <input className="input text-sm" type="number" value={newItemWeekend}
                    onChange={e => setNewItemWeekend(e.target.value)} />
                </div>
              </div>
              <button type="submit" className="btn btn-primary w-full justify-center">
                <Plus size={14} /> Bæta við hlutt
              </button>
            </form>
          ) : (
            <button onClick={() => setShowItemForm(true)}
              className="btn btn-ghost w-full justify-center" style={{ borderStyle: 'dashed' }}>
              <Plus size={16} /> Bæta við hlutt
            </button>
          )}
        </div>
      )}
    </div>
  )
}
