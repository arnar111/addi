import { useState } from 'react'
import { useSubscriptions, SUB_CATEGORIES } from '../hooks/useSubscriptions'
import { formatISK, formatShortISK } from '../utils/currency'
import { Plus, Trash2, X, AlertCircle, TrendingDown, ToggleLeft, ToggleRight, ChevronDown } from 'lucide-react'

const CYCLE_LABEL = { monthly: 'á mánuði', yearly: 'á ári' }

function SubCard({ sub, onRemove, onToggle, daysUntilNext }) {
  const days = daysUntilNext(sub.nextDate)
  const isUrgent = days !== null && days <= 3 && sub.active && sub.amount > 0
  const cat = SUB_CATEGORIES[sub.category] || SUB_CATEGORIES.other

  return (
    <div className="card flex items-center gap-3 py-3"
         style={{ opacity: sub.active ? 1 : 0.5, border: isUrgent ? '1px solid rgba(239,68,68,0.3)' : undefined }}>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
           style={{ background: `${sub.color}22` }}>
        {sub.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{sub.name}</span>
          <span className="text-xs px-1.5 py-0.5 rounded-lg" style={{ background: `${cat.color}22`, color: cat.color }}>
            {cat.label}
          </span>
          {isUrgent && <AlertCircle size={12} style={{ color: 'var(--danger)' }} />}
        </div>
        {sub.note && <div className="text-xs mt-0.5 truncate" style={{ color: 'var(--muted)' }}>{sub.note}</div>}
        {sub.nextDate && sub.amount > 0 && (
          <div className="text-xs mt-0.5" style={{ color: isUrgent ? 'var(--danger)' : 'var(--muted)' }}>
            {days === 0 ? '⚠️ Gjalddagi í dag' : days === 1 ? '⏰ Á morgun' : days !== null ? `Næst: ${days} dagar` : ''}
          </div>
        )}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <div className="text-right">
          <div className="text-sm font-semibold">{sub.amount > 0 ? formatShortISK(sub.amount) : 'Gjaldfrjáls'}</div>
          {sub.amount > 0 && <div className="text-xs" style={{ color: 'var(--muted)' }}>{CYCLE_LABEL[sub.cycle]}</div>}
        </div>
        <button onClick={() => onToggle(sub.id)} style={{ color: sub.active ? 'var(--accent)' : 'var(--muted)' }}>
          {sub.active ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
        </button>
        <button onClick={() => onRemove(sub.id)} style={{ color: 'var(--muted)' }}>
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  )
}

export default function Subscriptions() {
  const { subs, add, remove, toggleActive, monthlyTotal, yearlyTotal, upcoming, daysUntilNext, paidCount } = useSubscriptions()
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [cycle, setCycle] = useState('monthly')
  const [category, setCategory] = useState('entertainment')
  const [icon, setIcon] = useState('💳')
  const [nextDate, setNextDate] = useState('')
  const [note, setNote] = useState('')
  const [tab, setTab] = useState('all')

  const handleAdd = (e) => {
    e.preventDefault()
    if (!name.trim()) return
    add({
      name: name.trim(),
      icon,
      color: SUB_CATEGORIES[category]?.color || '#8b5cf6',
      amount: Number(amount) || 0,
      cycle,
      category,
      nextDate: nextDate || null,
      note: note.trim() || undefined,
      active: true,
    })
    setName('')
    setAmount('')
    setCycle('monthly')
    setCategory('entertainment')
    setIcon('💳')
    setNextDate('')
    setNote('')
    setShowForm(false)
  }

  const filtered = tab === 'upcoming' ? subs.filter(s => s.nextDate && s.amount > 0) : subs

  const huelFailed = subs.find(s => s.id === 'huel' && s.note?.includes('misheppnaðist'))

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold">Áskriftir</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>{paidCount} greiddar · {subs.length} samtals</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          <Plus size={16} /> Bæta við
        </button>
      </div>

      {/* Huel alert */}
      {huelFailed && (
        <div className="card flex items-center gap-3" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)' }}>
          <AlertCircle size={18} style={{ color: 'var(--danger)', flexShrink: 0 }} />
          <div>
            <div className="text-sm font-semibold" style={{ color: 'var(--danger)' }}>Huel greiðsla misheppnaðist!</div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>Uppfærðu kortaupplýsingar á huel.com til að koma í veg fyrir truflun.</div>
          </div>
        </div>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="card text-center py-3">
          <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Á mánuði</div>
          <div className="text-xl font-bold" style={{ color: 'var(--accent)' }}>{formatShortISK(monthlyTotal)}</div>
        </div>
        <div className="card text-center py-3">
          <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Á ári</div>
          <div className="text-xl font-bold" style={{ color: 'var(--accent2)' }}>{formatShortISK(yearlyTotal)}</div>
        </div>
      </div>

      {/* Upcoming payments */}
      {upcoming.length > 0 && (
        <div className="card" style={{ background: 'linear-gradient(135deg, rgba(249,115,22,0.06), rgba(239,68,68,0.04))' }}>
          <div className="text-xs font-semibold mb-3" style={{ color: 'var(--muted)' }}>NÆSTU GREIÐSLUR</div>
          <div className="flex flex-col gap-2">
            {upcoming.map(sub => {
              const days = daysUntilNext(sub.nextDate)
              const isUrgent = days !== null && days <= 3
              return (
                <div key={sub.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{sub.icon}</span>
                    <span className="text-sm">{sub.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{formatShortISK(sub.amount)}</span>
                    <span className="text-xs px-2 py-0.5 rounded-xl"
                          style={{
                            background: isUrgent ? 'rgba(239,68,68,0.15)' : 'var(--surface2)',
                            color: isUrgent ? 'var(--danger)' : 'var(--muted)',
                          }}>
                      {days === 0 ? 'Í dag' : days === 1 ? 'Á morgun' : `${days}d`}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Add form */}
      {showForm && (
        <form onSubmit={handleAdd} className="card flex flex-col gap-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Ný áskrift</h3>
            <button type="button" onClick={() => setShowForm(false)}><X size={16} style={{ color: 'var(--muted)' }} /></button>
          </div>
          <div className="flex gap-2">
            <input className="input w-12 text-center text-xl" value={icon} onChange={e => setIcon(e.target.value)} placeholder="💳" style={{ padding: '8px 4px' }} />
            <input className="input flex-1" placeholder="Nafn áskriftar" value={name} onChange={e => setName(e.target.value)} autoFocus />
          </div>
          <div className="flex gap-2">
            <input className="input flex-1" type="number" placeholder="Upphæð (ISK)" value={amount} onChange={e => setAmount(e.target.value)} />
            <select className="input w-32" value={cycle} onChange={e => setCycle(e.target.value)}>
              <option value="monthly">Mánaðarlega</option>
              <option value="yearly">Árlega</option>
            </select>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {Object.entries(SUB_CATEGORIES).map(([id, cat]) => (
              <button key={id} type="button" onClick={() => setCategory(id)}
                className="py-1.5 rounded-lg text-xs transition-all"
                style={{
                  background: category === id ? `${cat.color}22` : 'var(--surface2)',
                  color: category === id ? cat.color : 'var(--muted)',
                  border: `1px solid ${category === id ? cat.color + '44' : 'transparent'}`,
                }}>
                {cat.label}
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs" style={{ color: 'var(--muted)' }}>Næsti gjalddagi</label>
            <input type="date" className="input text-sm" value={nextDate} onChange={e => setNextDate(e.target.value)} />
          </div>
          <input className="input" placeholder="Athugasemd (valkvæmt)" value={note} onChange={e => setNote(e.target.value)} />
          <button type="submit" className="btn btn-primary w-full justify-center">Bæta við</button>
        </form>
      )}

      {/* Tabs */}
      <div className="flex gap-2">
        {[['all', 'Allar'], ['upcoming', 'Næstar greiðslur']].map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)}
            className="btn text-sm flex-1 justify-center"
            style={{
              background: tab === t ? 'rgba(0,212,170,0.12)' : 'var(--surface)',
              color: tab === t ? 'var(--accent)' : 'var(--muted)',
              border: `1px solid ${tab === t ? 'rgba(0,212,170,0.25)' : 'var(--border)'}`,
            }}>{l}</button>
        ))}
      </div>

      {/* List */}
      <div className="flex flex-col gap-2">
        {filtered.map(sub => (
          <SubCard key={sub.id} sub={sub} onRemove={remove} onToggle={toggleActive} daysUntilNext={daysUntilNext} />
        ))}
      </div>
    </div>
  )
}
