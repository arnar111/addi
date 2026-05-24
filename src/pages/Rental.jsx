import { useState } from 'react'
import { useRental } from '../hooks/useRental'
import { formatISK, formatShortISK } from '../utils/currency'
import { Plus, Trash2, X, Check, Package, TrendingUp, Target } from 'lucide-react'

const STATUS_META = {
  active: { label: 'Virkt', color: 'var(--accent)', bg: 'rgba(0,212,170,0.1)' },
  returned: { label: 'Skilað', color: 'var(--success)', bg: 'rgba(34,197,94,0.1)' },
  cancelled: { label: 'Afbókað', color: 'var(--danger)', bg: 'rgba(239,68,68,0.1)' },
}

export default function Rental() {
  const { rentals, items, monthlyGoal, setMonthlyGoal,
    addRental, updateStatus, remove,
    thisMonthRentals, monthlyIncome, activeRentals } = useRental()

  const [showForm, setShowForm] = useState(false)
  const [showGoalEdit, setShowGoalEdit] = useState(false)
  const [tab, setTab] = useState('overview')

  const [client, setClient] = useState('')
  const [itemId, setItemId] = useState('1')
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0])
  const [days, setDays] = useState('1')
  const [pricePerDay, setPricePerDay] = useState('7000')
  const [note, setNote] = useState('')

  const income = monthlyIncome()
  const pct = Math.min(100, Math.round((income / monthlyGoal) * 100))
  const monthRentals = thisMonthRentals()

  const handleItemChange = (id) => {
    setItemId(id)
    const item = items.find(i => i.id === id)
    if (item) setPricePerDay(String(item.defaultPrice))
  }

  const handleAdd = (e) => {
    e.preventDefault()
    if (!client.trim()) return
    addRental({ client: client.trim(), itemId, startDate, days, pricePerDay, note })
    setClient('')
    setDays('1')
    setNote('')
    setShowForm(false)
  }

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold">🏠 Lendó</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            {activeRentals.length} virkar leigur · {new Date().toLocaleDateString('is-IS', { month: 'long', year: 'numeric' })}
          </p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          <Plus size={16} /> Bóka
        </button>
      </div>

      {/* Income summary card */}
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.06), rgba(139,92,246,0.06))' }}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Tekjur þessa mánaðar</div>
            <div className="text-3xl font-semibold">{formatISK(income)}</div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className="text-xs" style={{ color: 'var(--muted)' }}>Markmið</div>
            <button onClick={() => setShowGoalEdit(!showGoalEdit)}
                    className="text-lg font-semibold hover:underline" style={{ color: pct >= 100 ? 'var(--success)' : 'var(--accent)' }}>
              {formatShortISK(monthlyGoal)}
            </button>
          </div>
        </div>
        {showGoalEdit && (
          <div className="mb-3">
            <input className="input text-sm" type="number" value={monthlyGoal}
              onChange={e => setMonthlyGoal(Number(e.target.value))} placeholder="Mánaðarmarkmið" />
          </div>
        )}
        <div className="h-2.5 rounded-full overflow-hidden mb-1" style={{ background: 'var(--surface2)' }}>
          <div className="h-full rounded-full transition-all"
               style={{ width: `${pct}%`, background: pct >= 100 ? 'var(--success)' : 'var(--accent)' }} />
        </div>
        <div className="flex justify-between text-xs" style={{ color: 'var(--muted)' }}>
          <span>{pct}% náð</span>
          <span>{monthRentals.length} leigur þennan mánuð</span>
        </div>
      </div>

      {/* Add booking form */}
      {showForm && (
        <form onSubmit={handleAdd} className="card flex flex-col gap-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Ný bókun</h3>
            <button type="button" onClick={() => setShowForm(false)}><X size={16} style={{ color: 'var(--muted)' }} /></button>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs" style={{ color: 'var(--muted)' }}>Viðskiptavinur</label>
            <input className="input" placeholder="Nafn viðskiptavinar" value={client} onChange={e => setClient(e.target.value)} required autoFocus />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs" style={{ color: 'var(--muted)' }}>Hlutur</label>
            <div className="grid grid-cols-2 gap-2">
              {items.map(item => (
                <button key={item.id} type="button" onClick={() => handleItemChange(item.id)}
                  className="flex flex-col gap-1 p-3 rounded-xl text-left text-xs transition-all"
                  style={{
                    background: itemId === item.id ? 'rgba(0,212,170,0.1)' : 'var(--surface2)',
                    border: `1px solid ${itemId === item.id ? 'rgba(0,212,170,0.4)' : 'transparent'}`,
                    color: itemId === item.id ? 'var(--accent)' : 'var(--text)',
                  }}>
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium leading-tight">{item.name}</span>
                  <span style={{ color: 'var(--muted)' }}>{formatShortISK(item.defaultPrice)}/dag</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <label className="text-xs" style={{ color: 'var(--muted)' }}>Upphafsdagur</label>
              <input className="input text-sm" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs" style={{ color: 'var(--muted)' }}>Fjöldi daga</label>
              <input className="input text-sm" type="number" min="1" value={days} onChange={e => setDays(e.target.value)} />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs" style={{ color: 'var(--muted)' }}>Verð á dag (ISK)</label>
            <input className="input text-sm" type="number" value={pricePerDay} onChange={e => setPricePerDay(e.target.value)} />
          </div>

          <div className="flex items-center justify-between text-sm font-semibold px-1">
            <span style={{ color: 'var(--muted)' }}>Samtals:</span>
            <span style={{ color: 'var(--accent)' }}>
              {formatISK(Number(days) * Number(pricePerDay))}
            </span>
          </div>

          <input className="input text-sm" placeholder="Athugasemd (valkvæmt)" value={note} onChange={e => setNote(e.target.value)} />
          <button type="submit" className="btn btn-primary w-full justify-center">Staðfesta bókun</button>
        </form>
      )}

      {/* Tabs */}
      <div className="flex gap-2">
        {[['overview', 'Virkar'], ['history', 'Saga']].map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)}
            className="btn text-sm flex-1 justify-center"
            style={{
              background: tab === t ? 'rgba(0,212,170,0.12)' : 'var(--surface)',
              color: tab === t ? 'var(--accent)' : 'var(--muted)',
              border: `1px solid ${tab === t ? 'rgba(0,212,170,0.25)' : 'var(--border)'}`,
            }}>{l}</button>
        ))}
      </div>

      {/* Rental list */}
      <div className="flex flex-col gap-2">
        {(() => {
          const list = tab === 'overview'
            ? rentals.filter(r => r.status === 'active')
            : rentals
          if (list.length === 0) return (
            <div className="card text-center py-8" style={{ color: 'var(--muted)' }}>
              {tab === 'overview' ? 'Engar virkar leigur' : 'Engar bókanir enn'}
            </div>
          )
          return list.map(r => {
            const meta = STATUS_META[r.status]
            const endDate = new Date(r.startDate)
            endDate.setDate(endDate.getDate() + r.days)
            return (
              <div key={r.id} className="card py-3">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{r.itemIcon || '🪑'}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold">{r.client}</span>
                      <span className="badge text-xs" style={{ background: meta.bg, color: meta.color }}>
                        {meta.label}
                      </span>
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{r.itemName}</div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                      {new Date(r.startDate).toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })}
                      {r.days > 1 && ` – ${endDate.toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })}`}
                      {' '}· {r.days} {r.days === 1 ? 'dagur' : 'dagar'}
                    </div>
                    {r.note && <div className="text-xs mt-0.5 italic" style={{ color: 'var(--muted)' }}>{r.note}</div>}
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-semibold" style={{ color: 'var(--accent)' }}>
                      {formatISK(r.total)}
                    </div>
                    <div className="text-xs" style={{ color: 'var(--muted)' }}>
                      {formatShortISK(r.pricePerDay)}/d
                    </div>
                  </div>
                </div>
                {r.status === 'active' && (
                  <div className="flex gap-2 mt-3">
                    <button onClick={() => updateStatus(r.id, 'returned')}
                      className="btn flex-1 justify-center text-xs py-1.5"
                      style={{ background: 'rgba(34,197,94,0.1)', color: 'var(--success)', border: '1px solid rgba(34,197,94,0.25)' }}>
                      <Check size={13} /> Skilað
                    </button>
                    <button onClick={() => updateStatus(r.id, 'cancelled')}
                      className="btn text-xs py-1.5 px-3"
                      style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--danger)', border: '1px solid rgba(239,68,68,0.2)' }}>
                      <X size={13} />
                    </button>
                    <button onClick={() => remove(r.id)}
                      className="btn text-xs py-1.5 px-3" style={{ color: 'var(--muted)', border: '1px solid var(--border)' }}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                )}
              </div>
            )
          })
        })()}
      </div>
    </div>
  )
}
