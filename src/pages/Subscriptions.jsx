import { useState } from 'react'
import { useSubscriptions } from '../hooks/useSubscriptions'
import { formatISK, formatShortISK } from '../utils/currency'
import { Plus, Trash2, X, ExternalLink, ToggleLeft, ToggleRight } from 'lucide-react'

const ICONS = ['🎵', '⚽', '🎬', '🌐', '💨', '🌱', '🎓', '📺', '🎮', '💊', '📰', '🛍️', '☁️', '🏋️', '📱', '⭐']
const COLORS = ['#1db954', '#e4002b', '#ff424d', '#00ad9f', '#8b5cf6', '#22c55e', '#f97316', '#3b82f6', '#ec4899', '#eab308', '#00d4aa', '#64748b']

export default function Subscriptions() {
  const { subs, add, remove, toggle, monthlyTotal, yearlyTotal } = useSubscriptions()
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [period, setPeriod] = useState('monthly')
  const [icon, setIcon] = useState('⭐')
  const [color, setColor] = useState('#00d4aa')
  const [url, setUrl] = useState('')

  const handleAdd = (e) => {
    e.preventDefault()
    if (!name.trim() || !amount) return
    add(name.trim(), icon, amount, period, color, url)
    setName(''); setAmount(''); setPeriod('monthly'); setIcon('⭐'); setColor('#00d4aa'); setUrl('')
    setShowForm(false)
  }

  const active = subs.filter(s => s.active)
  const inactive = subs.filter(s => !s.active)

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold">Áskriftir</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>{active.length} virkar</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          <Plus size={16} /> Ný
        </button>
      </div>

      {/* Summary card */}
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.06), rgba(139,92,246,0.06))' }}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Mánaðarlegt</div>
            <div className="text-2xl font-semibold">{formatShortISK(monthlyTotal)}</div>
          </div>
          <div>
            <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Árlegt</div>
            <div className="text-2xl font-semibold">{formatShortISK(yearlyTotal)}</div>
          </div>
        </div>
        <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
          <div className="flex gap-1 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
            {active.map(s => (
              <div key={s.id} className="flex flex-col items-center shrink-0 px-2 py-1.5 rounded-xl"
                   style={{ background: `${s.color}18`, minWidth: 48 }}>
                <span className="text-base">{s.icon}</span>
                <span className="text-xs font-medium mt-0.5" style={{ color: s.color, fontSize: 10 }}>
                  {formatShortISK(s.period === 'yearly' ? Math.round(s.amount / 12) : s.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add form */}
      {showForm && (
        <form onSubmit={handleAdd} className="card flex flex-col gap-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-sm">Ný áskrift</span>
            <button type="button" onClick={() => setShowForm(false)}><X size={16} style={{ color: 'var(--muted)' }} /></button>
          </div>
          <input className="input" placeholder="Nafn áskriftar" value={name} onChange={e => setName(e.target.value)} autoFocus />
          <div className="flex gap-2">
            <input className="input flex-1" type="number" placeholder="Upphæð (ISK)" value={amount} onChange={e => setAmount(e.target.value)} />
            <div className="flex rounded-xl overflow-hidden shrink-0" style={{ border: '1px solid var(--border)' }}>
              {['monthly', 'yearly'].map(p => (
                <button key={p} type="button" onClick={() => setPeriod(p)}
                  className="px-3 py-2 text-xs font-medium transition-all"
                  style={{ background: period === p ? 'var(--accent)' : 'var(--surface2)', color: period === p ? '#000' : 'var(--muted)' }}>
                  {p === 'monthly' ? 'Mán' : 'Ár'}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs mb-2" style={{ color: 'var(--muted)' }}>Tákn</div>
            <div className="flex flex-wrap gap-1.5">
              {ICONS.map(i => (
                <button key={i} type="button" onClick={() => setIcon(i)}
                  className="w-9 h-9 rounded-xl text-lg flex items-center justify-center transition-all"
                  style={{ background: icon === i ? 'rgba(0,212,170,0.2)' : 'var(--surface2)', border: `1px solid ${icon === i ? 'var(--accent)' : 'transparent'}` }}>
                  {i}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs mb-2" style={{ color: 'var(--muted)' }}>Litur</div>
            <div className="flex flex-wrap gap-1.5">
              {COLORS.map(c => (
                <button key={c} type="button" onClick={() => setColor(c)}
                  className="w-6 h-6 rounded-full transition-all"
                  style={{ background: c, outline: color === c ? `2px solid ${c}` : 'none', outlineOffset: 2 }} />
              ))}
            </div>
          </div>
          <input className="input text-sm" placeholder="Vefslóð (valkvæmt)" value={url} onChange={e => setUrl(e.target.value)} />
          <button type="submit" className="btn btn-primary w-full justify-center">Bæta við</button>
        </form>
      )}

      {/* Active subscriptions */}
      <div className="flex flex-col gap-2">
        {active.map(s => (
          <div key={s.id} className="card flex items-center gap-3 py-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
                 style={{ background: `${s.color}20` }}>
              {s.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium">{s.name}</div>
              <div className="text-xs" style={{ color: 'var(--muted)' }}>
                {formatISK(s.amount)} / {s.period === 'monthly' ? 'mánuður' : 'ár'}
                {s.period === 'yearly' && (
                  <span> · {formatShortISK(Math.round(s.amount / 12))}/mán</span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              {s.url && (
                <a href={s.url} target="_blank" rel="noopener noreferrer"
                   className="p-1.5 rounded-lg" style={{ color: 'var(--muted)' }}>
                  <ExternalLink size={13} />
                </a>
              )}
              <button onClick={() => toggle(s.id)} className="p-1.5 rounded-lg" style={{ color: s.color }}>
                <ToggleRight size={18} />
              </button>
              <button onClick={() => remove(s.id)} className="p-1.5 rounded-lg" style={{ color: 'var(--muted)' }}>
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {inactive.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="text-xs px-1" style={{ color: 'var(--muted)' }}>ÓVIRKAR ({inactive.length})</div>
          {inactive.map(s => (
            <div key={s.id} className="card flex items-center gap-3 py-3" style={{ opacity: 0.5 }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
                   style={{ background: 'var(--surface2)' }}>{s.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="text-sm">{s.name}</div>
                <div className="text-xs" style={{ color: 'var(--muted)' }}>
                  {formatISK(s.amount)} / {s.period === 'monthly' ? 'mánuður' : 'ár'}
                </div>
              </div>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => toggle(s.id)} className="p-1.5 rounded-lg" style={{ color: 'var(--muted)' }}>
                  <ToggleLeft size={18} />
                </button>
                <button onClick={() => remove(s.id)} className="p-1.5 rounded-lg" style={{ color: 'var(--muted)' }}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
