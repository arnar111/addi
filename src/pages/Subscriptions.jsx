import { useState } from 'react'
import { useSubscriptions } from '../hooks/useSubscriptions'
import { formatISK, formatShortISK } from '../utils/currency'
import { Plus, Trash2, X, Bell } from 'lucide-react'

const CYCLES = [['monthly', 'Mánaðarlegt'], ['yearly', 'Árlegt']]

export default function Subscriptions() {
  const { subs, add, remove, toggle, monthlyTotal, renewingSoon } = useSubscriptions()
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [icon, setIcon] = useState('💳')
  const [amount, setAmount] = useState('')
  const [cycle, setCycle] = useState('monthly')
  const [nextDate, setNextDate] = useState('')

  const renewing = renewingSoon()

  const handleAdd = (e) => {
    e.preventDefault()
    if (!name || !amount) return
    add(name, icon, amount, cycle, nextDate || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0])
    setName(''); setIcon('💳'); setAmount(''); setNextDate(''); setShowForm(false)
  }

  const daysUntil = (dateStr) => {
    const diff = new Date(dateStr) - new Date()
    return Math.ceil(diff / 86400000)
  }

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold">Áskriftir</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            {formatISK(monthlyTotal)} á mánuði
          </p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          <Plus size={16} /> Bæta við
        </button>
      </div>

      {/* Monthly cost */}
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.08), rgba(0,212,170,0.05))' }}>
        <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Heildarkostnaður á mánuði</div>
        <div className="text-3xl font-bold">{formatISK(monthlyTotal)}</div>
        <div className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
          {formatISK(monthlyTotal * 12)} á ári
        </div>
      </div>

      {/* Renewing soon alert */}
      {renewing.length > 0 && (
        <div className="card flex flex-col gap-2"
             style={{ background: 'rgba(249,115,22,0.07)', border: '1px solid rgba(249,115,22,0.2)' }}>
          <div className="flex items-center gap-2">
            <Bell size={14} style={{ color: '#f97316' }} />
            <span className="text-sm font-semibold" style={{ color: '#f97316' }}>Endurnýjast fljótlega</span>
          </div>
          {renewing.map(s => (
            <div key={s.id} className="flex items-center justify-between text-sm">
              <span>{s.icon} {s.name}</span>
              <span style={{ color: '#f97316' }}>{daysUntil(s.nextDate)} dagar · {formatISK(s.amount)}</span>
            </div>
          ))}
        </div>
      )}

      {/* Add form */}
      {showForm && (
        <form onSubmit={handleAdd} className="card flex flex-col gap-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Ný áskrift</h3>
            <button type="button" onClick={() => setShowForm(false)}>
              <X size={16} style={{ color: 'var(--muted)' }} />
            </button>
          </div>
          <div className="flex gap-2">
            <input className="input w-16 text-center text-xl" value={icon}
              onChange={e => setIcon(e.target.value)} placeholder="💳" />
            <input className="input flex-1" placeholder="Nafn (t.d. Spotify)" value={name}
              onChange={e => setName(e.target.value)} autoFocus />
          </div>
          <input className="input" type="number" placeholder="Upphæð (ISK)" value={amount}
            onChange={e => setAmount(e.target.value)} />
          <div className="flex gap-2">
            {CYCLES.map(([v, l]) => (
              <button key={v} type="button" onClick={() => setCycle(v)}
                className="flex-1 py-2 rounded-xl text-sm font-medium transition-all"
                style={{
                  background: cycle === v ? 'rgba(0,212,170,0.12)' : 'var(--surface2)',
                  color: cycle === v ? 'var(--accent)' : 'var(--muted)',
                  border: `1px solid ${cycle === v ? 'var(--accent)' : 'transparent'}`,
                }}>{l}</button>
            ))}
          </div>
          <div>
            <label className="text-xs mb-1 block" style={{ color: 'var(--muted)' }}>Næsta endurnýjun</label>
            <input type="date" className="input" value={nextDate} onChange={e => setNextDate(e.target.value)} />
          </div>
          <button type="submit" className="btn btn-primary w-full justify-center">Vista</button>
        </form>
      )}

      {/* Sub list */}
      <div className="flex flex-col gap-2">
        {subs.map(s => {
          const days = daysUntil(s.nextDate)
          const isRenewingSoon = days <= 7 && days >= 0
          return (
            <div key={s.id} className="card flex items-center gap-3 py-3"
                 style={{ opacity: s.active ? 1 : 0.5 }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-xl"
                   style={{ background: `${s.color}20` }}>{s.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">{s.name}</span>
                  {isRenewingSoon && <span className="text-xs px-1.5 py-0.5 rounded-full"
                    style={{ background: 'rgba(249,115,22,0.15)', color: '#f97316' }}>
                    {days}d
                  </span>}
                </div>
                <div className="text-xs" style={{ color: 'var(--muted)' }}>
                  {formatISK(s.amount)}/{s.cycle === 'monthly' ? 'mán' : 'ár'}
                  {s.nextDate ? ` · endurnýjast ${new Date(s.nextDate).toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })}` : ''}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => toggle(s.id)}
                  className="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                  style={{ borderColor: s.active ? s.color : 'var(--border)', background: s.active ? s.color : 'transparent' }}>
                  {s.active && <span style={{ fontSize: 10, color: '#000' }}>✓</span>}
                </button>
                <button onClick={() => remove(s.id)} style={{ color: 'var(--muted)' }}>
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
