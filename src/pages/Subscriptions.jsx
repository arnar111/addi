import { useState } from 'react'
import { useSubscriptions } from '../hooks/useSubscriptions'
import { formatISK, formatShortISK } from '../utils/currency'
import { Plus, Trash2, X, ToggleLeft, ToggleRight } from 'lucide-react'

function SubCard({ sub, onToggle, onRemove }) {
  return (
    <div className="card flex items-center gap-3 py-3"
         style={{ opacity: sub.active ? 1 : 0.5 }}>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
           style={{ background: `${sub.color}22` }}>
        {sub.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">{sub.name}</span>
          {!sub.active && (
            <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: 'var(--surface2)', color: 'var(--muted)' }}>
              Óvirkt
            </span>
          )}
        </div>
        <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
          {sub.costISK > 0 ? formatISK(sub.costISK) : 'Breytileg'} / mán
          {sub.dueDay ? ` · gjalddagi ${sub.dueDay}.` : ''}
        </div>
        {sub.note && <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{sub.note}</div>}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {sub.url && (
          <a href={sub.url} target="_blank" rel="noopener noreferrer"
             className="text-xs" style={{ color: 'var(--accent)' }}>Opna</a>
        )}
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
  const { subs, add, remove, toggle, monthlyTotal } = useSubscriptions()
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [icon, setIcon] = useState('📱')
  const [cost, setCost] = useState('')
  const [dueDay, setDueDay] = useState('')
  const [url, setUrl] = useState('')
  const [color, setColor] = useState('#00d4aa')

  const handleAdd = (e) => {
    e.preventDefault()
    if (!name.trim()) return
    add({ name: name.trim(), icon, costISK: Number(cost) || 0, cycle: 'monthly', color, url, active: true, dueDay: Number(dueDay) || null })
    setName(''); setIcon('📱'); setCost(''); setDueDay(''); setUrl(''); setColor('#00d4aa')
    setShowForm(false)
  }

  const yearlyTotal = monthlyTotal * 12
  const activeSubs = subs.filter(s => s.active)

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold">Áskriftir</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>{activeSubs.length} virkar áskriftir</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          <Plus size={16} /> Bæta við
        </button>
      </div>

      {/* Summary card */}
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.08), rgba(0,212,170,0.08))' }}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Mánaðarleg kostnaður</div>
            <div className="text-2xl font-bold">{formatShortISK(monthlyTotal)}</div>
          </div>
          <div>
            <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Árlegt</div>
            <div className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>{formatShortISK(yearlyTotal)}</div>
          </div>
        </div>
        <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>
            {activeSubs.filter(s => s.costISK > 0).sort((a, b) => b.costISK - a.costISK).slice(0, 3).map(s => s.name).join(' · ')}
          </div>
        </div>
      </div>

      {/* Add form */}
      {showForm && (
        <form onSubmit={handleAdd} className="card flex flex-col gap-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Ný áskrift</h3>
            <button type="button" onClick={() => setShowForm(false)}><X size={16} style={{ color: 'var(--muted)' }} /></button>
          </div>
          <div className="flex gap-2">
            <input className="input w-16 text-center text-xl" value={icon} onChange={e => setIcon(e.target.value)} placeholder="📱" maxLength={2} />
            <input className="input flex-1" placeholder="Nafn (t.d. Netflix)" value={name} onChange={e => setName(e.target.value)} autoFocus />
          </div>
          <input className="input" type="number" placeholder="Kostnaður (ISK/mán)" value={cost} onChange={e => setCost(e.target.value)} />
          <input className="input" type="number" placeholder="Gjalddagi (dagur mánaðar 1-31)" value={dueDay} onChange={e => setDueDay(e.target.value)} min={1} max={31} />
          <input className="input" type="url" placeholder="Slóð (https://...)" value={url} onChange={e => setUrl(e.target.value)} />
          <div className="flex items-center gap-2">
            <label className="text-xs shrink-0" style={{ color: 'var(--muted)' }}>Litur:</label>
            <input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-10 h-8 rounded cursor-pointer border-0" style={{ background: 'none' }} />
            <span className="text-xs" style={{ color: 'var(--muted)' }}>{color}</span>
          </div>
          <button type="submit" className="btn btn-primary w-full justify-center">Bæta við áskrift</button>
        </form>
      )}

      {/* Sub list */}
      <div className="flex flex-col gap-2">
        {subs.length === 0 ? (
          <div className="card text-center py-8" style={{ color: 'var(--muted)' }}>Engar áskriftir skráðar</div>
        ) : (
          <>
            {subs.filter(s => s.active).map(s => (
              <SubCard key={s.id} sub={s} onToggle={toggle} onRemove={remove} />
            ))}
            {subs.some(s => !s.active) && (
              <>
                <div className="text-xs font-semibold uppercase tracking-wider px-1 mt-2"
                     style={{ color: 'var(--muted)' }}>Óvirkar</div>
                {subs.filter(s => !s.active).map(s => (
                  <SubCard key={s.id} sub={s} onToggle={toggle} onRemove={remove} />
                ))}
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}
