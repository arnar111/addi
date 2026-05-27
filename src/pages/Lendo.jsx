import { useState } from 'react'
import { useLendo } from '../hooks/useLendo'
import { formatISK, formatShortISK } from '../utils/currency'
import { Plus, Check, Trash2, X, Package, TrendingUp, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react'

function AddRentalForm({ inventory, onAdd, onClose }) {
  const [renterName, setRenterName] = useState('')
  const [item, setItem] = useState(inventory[0]?.id || '')
  const [days, setDays] = useState(1)
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0])
  const [note, setNote] = useState('')
  const [customAmount, setCustomAmount] = useState('')

  const selectedItem = inventory.find(i => i.id === item)
  const calcAmount = customAmount ? Number(customAmount) : (selectedItem ? selectedItem.pricePerDay * days : 0)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!renterName.trim()) return
    onAdd({ renterName, item, days, startDate, note, customAmount: customAmount || null })
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="card flex flex-col gap-3 animate-slide-up"
          style={{ border: '1px solid rgba(0,212,170,0.3)' }}>
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm">Ný leiga</h3>
        <button type="button" onClick={onClose}><X size={16} style={{ color: 'var(--muted)' }} /></button>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs" style={{ color: 'var(--muted)' }}>Leigutaki</label>
        <input className="input text-sm" placeholder="Nafn leigutaka..." value={renterName}
          onChange={e => setRenterName(e.target.value)} autoFocus required />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs" style={{ color: 'var(--muted)' }}>Hlutir</label>
        <select className="input text-sm" value={item} onChange={e => setItem(e.target.value)}
          style={{ background: 'var(--surface2)', color: 'var(--text)' }}>
          {inventory.map(inv => (
            <option key={inv.id} value={inv.id}>{inv.icon} {inv.name} — {formatShortISK(inv.pricePerDay)}/dag</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col gap-1">
          <label className="text-xs" style={{ color: 'var(--muted)' }}>Fjöldi daga</label>
          <input className="input text-sm" type="number" min={1} max={30} value={days}
            onChange={e => setDays(Number(e.target.value))} />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs" style={{ color: 'var(--muted)' }}>Upphafsdagur</label>
          <input className="input text-sm" type="date" value={startDate}
            onChange={e => setStartDate(e.target.value)} />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs" style={{ color: 'var(--muted)' }}>Sérsniðið verð (valkvæmt)</label>
        <input className="input text-sm" type="number" placeholder={`Sjálfgefið: ${formatShortISK(calcAmount)}`}
          value={customAmount} onChange={e => setCustomAmount(e.target.value)} />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs" style={{ color: 'var(--muted)' }}>Athugasemd</label>
        <input className="input text-sm" placeholder="t.d. afhending, greiðslumáti..." value={note}
          onChange={e => setNote(e.target.value)} />
      </div>

      <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'rgba(0,212,170,0.08)' }}>
        <span className="text-sm" style={{ color: 'var(--muted)' }}>Heildarupphæð</span>
        <span className="text-lg font-semibold" style={{ color: 'var(--accent)' }}>{formatISK(calcAmount)}</span>
      </div>

      <button type="submit" className="btn btn-primary w-full justify-center">
        <Plus size={16} /> Skrá leigu
      </button>
    </form>
  )
}

function RentalCard({ rental, onReturn, onDelete }) {
  const [expanded, setExpanded] = useState(false)
  const endDate = rental.startDate ? new Date(rental.startDate) : null
  if (endDate && rental.days) endDate.setDate(endDate.getDate() + rental.days)
  const isOverdue = endDate && endDate < new Date() && rental.status === 'active'

  return (
    <div className="card flex flex-col gap-2" style={{
      border: `1px solid ${isOverdue ? 'rgba(239,68,68,0.4)' : rental.status === 'returned' ? 'rgba(34,197,94,0.2)' : 'var(--border)'}`,
      opacity: rental.status === 'returned' ? 0.7 : 1,
    }}>
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0"
             style={{ background: rental.status === 'returned' ? 'rgba(34,197,94,0.15)' : isOverdue ? 'rgba(239,68,68,0.15)' : 'rgba(0,212,170,0.12)' }}>
          {rental.status === 'returned' ? '✅' : isOverdue ? '⚠️' : '📦'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">{rental.renterName}</span>
            {isOverdue && <span className="badge text-xs" style={{ background: 'rgba(239,68,68,0.15)', color: 'var(--danger)' }}>Seint</span>}
            {rental.status === 'returned' && <span className="badge text-xs" style={{ background: 'rgba(34,197,94,0.15)', color: 'var(--success)' }}>Skilað</span>}
          </div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{rental.itemName}</div>
        </div>
        <div className="text-right shrink-0">
          <div className="font-semibold text-sm" style={{ color: 'var(--accent)' }}>{formatShortISK(rental.totalAmount)}</div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>{rental.days} dag{rental.days !== 1 ? 'ar' : 'ur'}</div>
        </div>
      </div>

      <button onClick={() => setExpanded(!expanded)} className="flex items-center gap-1 text-xs w-full"
              style={{ color: 'var(--muted)' }}>
        {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        {expanded ? 'Minna' : 'Meira'}
      </button>

      {expanded && (
        <div className="flex flex-col gap-2 pt-1 border-t" style={{ borderColor: 'var(--border)' }}>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div><span style={{ color: 'var(--muted)' }}>Upphaf:</span> {rental.startDate}</div>
            <div><span style={{ color: 'var(--muted)' }}>Lokadagur:</span> {endDate?.toLocaleDateString('is-IS', { month: 'short', day: 'numeric' }) || '—'}</div>
          </div>
          {rental.note && (
            <div className="text-xs p-2 rounded-lg" style={{ background: 'var(--surface2)' }}>
              {rental.note}
            </div>
          )}
          <div className="flex gap-2">
            {rental.status === 'active' && (
              <button onClick={() => onReturn(rental.id)}
                className="btn btn-primary flex-1 justify-center text-xs py-2">
                <Check size={13} /> Skráð skilað
              </button>
            )}
            <button onClick={() => onDelete(rental.id)}
              className="btn btn-ghost text-xs py-2 px-3" style={{ color: 'var(--danger)', borderColor: 'rgba(239,68,68,0.2)' }}>
              <Trash2 size={13} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function Lendo() {
  const { rentals, inventory, monthGoal, setMonthGoal, addRental, returnRental, deleteRental,
          monthlyIncome, activeRentals, returnedRentals, rentalsDueToday } = useLendo()
  const [showForm, setShowForm] = useState(false)
  const [tab, setTab] = useState('active')

  const income = monthlyIncome()
  const goalPct = Math.min(100, Math.round((income / monthGoal) * 100))

  const displayRentals = tab === 'active' ? activeRentals
    : tab === 'returned' ? returnedRentals
    : rentals

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold flex items-center gap-2">
            🏠 Lendó
          </h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            {activeRentals.length} virk leiga{activeRentals.length !== 1 ? 'r' : ''}
            {rentalsDueToday.length > 0 && ` · ${rentalsDueToday.length} til skila í dag`}
          </p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          <Plus size={16} /> Leiga
        </button>
      </div>

      {/* Due today alert */}
      {rentalsDueToday.length > 0 && (
        <div className="card flex items-center gap-3" style={{ border: '1px solid rgba(249,115,22,0.4)', background: 'rgba(249,115,22,0.06)' }}>
          <AlertCircle size={18} style={{ color: '#f97316', shrink: 0 }} />
          <div>
            <div className="text-sm font-medium">Til skila í dag</div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>
              {rentalsDueToday.map(r => r.renterName).join(', ')}
            </div>
          </div>
        </div>
      )}

      {/* Income card */}
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.08), rgba(139,92,246,0.06))' }}>
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>
              {new Date().toLocaleDateString('is-IS', { month: 'long', year: 'numeric' })} tekjur
            </div>
            <div className="text-3xl font-semibold" style={{ color: 'var(--accent)' }}>{formatISK(income)}</div>
          </div>
          <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--accent)' }}>
            <TrendingUp size={14} />
            {goalPct}% af marki
          </div>
        </div>

        <div className="h-2 rounded-full overflow-hidden mb-1" style={{ background: 'var(--surface2)' }}>
          <div className="h-full rounded-full transition-all duration-700"
               style={{ width: `${goalPct}%`, background: goalPct >= 100 ? 'var(--success)' : 'var(--accent)' }} />
        </div>
        <div className="flex justify-between text-xs" style={{ color: 'var(--muted)' }}>
          <span>Markmið: {formatISK(monthGoal)}</span>
          <button onClick={() => {
            const g = prompt('Settu mánaðarmarkmið (ISK):', monthGoal)
            if (g && !isNaN(Number(g))) setMonthGoal(Number(g))
          }} className="text-xs" style={{ color: 'var(--accent)' }}>Breyta</button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'Virkt', value: activeRentals.length, color: 'var(--accent)' },
          { label: 'Skilað', value: returnedRentals.length, color: 'var(--success)' },
          { label: 'Hlutir', value: inventory.length, color: 'var(--accent2)' },
        ].map(({ label, value, color }) => (
          <div key={label} className="card flex flex-col items-center gap-1 py-3">
            <span className="text-2xl font-bold" style={{ color }}>{value}</span>
            <span className="text-xs" style={{ color: 'var(--muted)' }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Add rental form */}
      {showForm && (
        <AddRentalForm inventory={inventory} onAdd={addRental} onClose={() => setShowForm(false)} />
      )}

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'var(--surface)' }}>
        {[
          ['active', `🟡 Virkt (${activeRentals.length})`],
          ['returned', `✅ Skilað (${returnedRentals.length})`],
          ['all', `📋 Allt (${rentals.length})`],
        ].map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)}
            className="flex-1 py-1.5 rounded-lg text-xs font-medium transition-all"
            style={{
              background: tab === t ? 'var(--surface2)' : 'transparent',
              color: tab === t ? 'var(--text)' : 'var(--muted)',
            }}>{l}</button>
        ))}
      </div>

      {/* Rental list */}
      <div className="flex flex-col gap-2">
        {displayRentals.length === 0 ? (
          <div className="card text-center py-8" style={{ color: 'var(--muted)' }}>
            <Package size={32} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm">Engar leigur {tab === 'active' ? 'í gangi' : tab === 'returned' ? 'skráðar' : 'til staðar'}</p>
            {tab === 'active' && <p className="text-xs mt-1">Ýttu á "Leiga" til að skrá nýja</p>}
          </div>
        ) : (
          displayRentals.map(r => (
            <RentalCard key={r.id} rental={r} onReturn={returnRental} onDelete={deleteRental} />
          ))
        )}
      </div>

      {/* Inventory */}
      <div className="card flex flex-col gap-3">
        <h3 className="font-semibold text-sm">Birgðir</h3>
        <div className="flex flex-col gap-2">
          {inventory.map(inv => (
            <div key={inv.id} className="flex items-center gap-3 p-2.5 rounded-xl" style={{ background: 'var(--surface2)' }}>
              <span className="text-lg">{inv.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium leading-tight">{inv.name}</div>
                <div className="text-xs" style={{ color: 'var(--muted)' }}>{inv.quantity} stk · {formatShortISK(inv.pricePerDay)}/dag</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
