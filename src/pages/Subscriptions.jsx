import { useState } from 'react'
import { useSubscriptions, SUB_CATEGORIES } from '../hooks/useSubscriptions'
import { formatISK, formatShortISK } from '../utils/currency'
import { Plus, Trash2, X, TrendingDown, ToggleLeft, ToggleRight } from 'lucide-react'

const PRESET_ICONS = ['🎵', '🎬', '🎭', '▶️', '☁️', '🎮', '📰', '💼', '🏋️', '🎓', '📧', '🔒', '🎙️', '📱', '🌐', '⚡']

export default function Subscriptions() {
  const { subs, add, remove, toggleActive, monthlyTotal, yearlyTotal } = useSubscriptions()
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [icon, setIcon] = useState('📦')
  const [amount, setAmount] = useState('')
  const [cycle, setCycle] = useState('monthly')
  const [category, setCategory] = useState('entertainment')

  const handleAdd = (e) => {
    e.preventDefault()
    if (!name.trim() || !amount) return
    add({ name: name.trim(), icon, amount, cycle, category, color: SUB_CATEGORIES.find(c => c.id === category)?.color || '#64748b' })
    setName(''); setAmount(''); setIcon('📦'); setCycle('monthly'); setCategory('entertainment')
    setShowForm(false)
  }

  const sorted = [...subs].sort((a, b) => {
    const am = a.cycle === 'yearly' ? a.amount / 12 : a.amount
    const bm = b.cycle === 'yearly' ? b.amount / 12 : b.amount
    return bm - am
  })

  const activeSubs = subs.filter(s => s.active)
  const inactiveSubs = subs.filter(s => !s.active)

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold">Áskriftir</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>{activeSubs.length} virkar · {subs.length} samtals</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          <Plus size={16} /> Ný
        </button>
      </div>

      {/* Summary card */}
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.06), rgba(139,92,246,0.06))' }}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Mánaðarlegar áskriftir</div>
            <div className="text-4xl font-semibold">{formatShortISK(monthlyTotal)}</div>
            <div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>á mánuði</div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className="text-xs" style={{ color: 'var(--muted)' }}>Á ári</div>
            <div className="text-xl font-semibold" style={{ color: '#ec4899' }}>{formatShortISK(yearlyTotal)}</div>
          </div>
        </div>

        {/* Category breakdown */}
        <div className="flex flex-col gap-2">
          {SUB_CATEGORIES.map(cat => {
            const catSubs = activeSubs.filter(s => s.category === cat.id)
            if (catSubs.length === 0) return null
            const catTotal = catSubs.reduce((s, sub) => s + (sub.cycle === 'yearly' ? sub.amount / 12 : sub.amount), 0)
            return (
              <div key={cat.id} className="flex items-center justify-between text-xs">
                <span style={{ color: 'var(--muted)' }}>{cat.icon} {cat.label}</span>
                <span style={{ color: cat.color }}>{formatShortISK(Math.round(catTotal))}/mán</span>
              </div>
            )
          })}
        </div>
      </div>

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
            <div className="relative">
              <input type="text" className="input w-14 text-center text-xl px-2" value={icon}
                onChange={e => setIcon(e.target.value)} maxLength={2} />
            </div>
            <input className="input flex-1" placeholder="Nafn þjónustu..." value={name} onChange={e => setName(e.target.value)} autoFocus />
          </div>

          {/* Icon presets */}
          <div className="flex flex-wrap gap-1.5">
            {PRESET_ICONS.map(em => (
              <button key={em} type="button" onClick={() => setIcon(em)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-base transition-all"
                style={{ background: icon === em ? 'rgba(0,212,170,0.2)' : 'var(--surface2)', border: `1px solid ${icon === em ? 'var(--accent)' : 'transparent'}` }}>
                {em}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <input className="input flex-1" type="number" placeholder="Upphæð (ISK)" value={amount} onChange={e => setAmount(e.target.value)} />
            <div className="flex gap-1">
              {[['monthly', 'Mán'], ['yearly', 'Ár']].map(([v, l]) => (
                <button key={v} type="button" onClick={() => setCycle(v)}
                  className="btn text-xs py-2 px-3"
                  style={{
                    background: cycle === v ? 'rgba(0,212,170,0.15)' : 'var(--surface2)',
                    color: cycle === v ? 'var(--accent)' : 'var(--muted)',
                    border: `1px solid ${cycle === v ? 'rgba(0,212,170,0.3)' : 'var(--border)'}`,
                  }}>{l}</button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            {SUB_CATEGORIES.map(c => (
              <button key={c.id} type="button" onClick={() => setCategory(c.id)}
                className="flex items-center gap-1.5 py-2 px-2 rounded-xl text-xs transition-all"
                style={{
                  background: category === c.id ? `${c.color}22` : 'var(--surface2)',
                  border: `1px solid ${category === c.id ? c.color + '55' : 'transparent'}`,
                  color: category === c.id ? c.color : 'var(--muted)',
                }}>
                {c.icon} {c.label}
              </button>
            ))}
          </div>

          <button type="submit" className="btn btn-primary w-full justify-center">Bæta við</button>
        </form>
      )}

      {/* Active subscriptions */}
      <div className="flex flex-col gap-2">
        {sorted.filter(s => s.active).map(sub => {
          const monthly = sub.cycle === 'yearly' ? Math.round(sub.amount / 12) : sub.amount
          const cat = SUB_CATEGORIES.find(c => c.id === sub.category)
          return (
            <div key={sub.id} className="card flex items-center gap-3 py-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                   style={{ background: `${cat?.color || '#64748b'}22` }}>
                {sub.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm">{sub.name}</div>
                <div className="text-xs flex items-center gap-1.5 mt-0.5" style={{ color: 'var(--muted)' }}>
                  <span style={{ color: cat?.color }}>{cat?.icon} {cat?.label}</span>
                  {sub.cycle === 'yearly' && <span>· {formatShortISK(sub.amount)}/ár</span>}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <div className="text-right">
                  <div className="text-sm font-semibold">{formatShortISK(monthly)}</div>
                  <div className="text-xs" style={{ color: 'var(--muted)' }}>/mán</div>
                </div>
                <button onClick={() => toggleActive(sub.id)} style={{ color: 'var(--accent)' }}>
                  <ToggleRight size={20} />
                </button>
                <button onClick={() => remove(sub.id)} style={{ color: 'var(--muted)' }}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Inactive subscriptions */}
      {inactiveSubs.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="text-xs px-1" style={{ color: 'var(--muted)' }}>Óvirkar áskriftir</div>
          {inactiveSubs.map(sub => (
            <div key={sub.id} className="card flex items-center gap-3 py-3" style={{ opacity: 0.5 }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                   style={{ background: 'var(--surface2)' }}>
                {sub.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm">{sub.name}</div>
                <div className="text-xs" style={{ color: 'var(--muted)' }}>Óvirk</div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <div className="text-sm font-semibold">{formatShortISK(sub.cycle === 'yearly' ? Math.round(sub.amount / 12) : sub.amount)}</div>
                <button onClick={() => toggleActive(sub.id)} style={{ color: 'var(--muted)' }}>
                  <ToggleLeft size={20} />
                </button>
                <button onClick={() => remove(sub.id)} style={{ color: 'var(--muted)' }}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {subs.length === 0 && (
        <div className="card text-center py-10" style={{ color: 'var(--muted)' }}>
          <div className="text-4xl mb-3">📦</div>
          <p className="font-medium mb-1">Engar áskriftir skráðar</p>
          <p className="text-xs">Bættu við fyrstu áskriftinni þinni</p>
        </div>
      )}
    </div>
  )
}
