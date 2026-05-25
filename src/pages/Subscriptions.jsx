import { useState } from 'react'
import { useSubscriptions } from '../hooks/useSubscriptions'
import { formatISK } from '../utils/currency'
import { Plus, Trash2, X, ToggleLeft, ToggleRight, Bell } from 'lucide-react'

const CATEGORIES = [
  { id: 'streaming', label: 'Streymi', icon: '🎬' },
  { id: 'music', label: 'Tónlist', icon: '🎵' },
  { id: 'news', label: 'Fréttir', icon: '📰' },
  { id: 'tech', label: 'Tækni', icon: '💻' },
  { id: 'gaming', label: 'Leikir', icon: '🎮' },
  { id: 'health', label: 'Heilsa', icon: '🏥' },
  { id: 'other', label: 'Annað', icon: '📦' },
]

const CYCLES = [
  { id: 'monthly', label: 'Mánaðarlegt' },
  { id: 'annual', label: 'Árlegt' },
]

const EMPTY_FORM = { name: '', icon: '📦', amount: '', cycle: 'monthly', category: 'other', color: '#00d4aa', nextDue: '' }

export default function Subscriptions() {
  const { subs, add, remove, toggleActive, totalMonthly, totalAnnual, upcomingRenewals, daysUntil, monthlyAmount } = useSubscriptions()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [filter, setFilter] = useState('all')

  const upcoming7 = upcomingRenewals(7)
  const upcoming30 = upcomingRenewals(30)

  const handleAdd = (e) => {
    e.preventDefault()
    if (!form.name || !form.amount) return
    add({ ...form, amount: Number(form.amount) })
    setForm(EMPTY_FORM)
    setShowForm(false)
  }

  const filtered = filter === 'active' ? subs.filter(s => s.active)
    : filter === 'inactive' ? subs.filter(s => !s.active)
    : subs

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold">Áskriftir</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>{subs.filter(s => s.active).length} virkar · {formatISK(totalMonthly)}/mán</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          <Plus size={16} /> Ný
        </button>
      </div>

      {/* Cost overview */}
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.08), rgba(0,212,170,0.08))' }}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Mánaðarlegt</div>
            <div className="text-2xl font-semibold">{formatISK(totalMonthly)}</div>
          </div>
          <div>
            <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Árlegt</div>
            <div className="text-2xl font-semibold">{formatISK(totalAnnual)}</div>
          </div>
        </div>
        {upcoming7.length > 0 && (
          <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
            <div className="flex items-center gap-1.5 text-xs font-medium mb-2" style={{ color: '#f97316' }}>
              <Bell size={12} /> {upcoming7.length} áskrift kemur upp á næstu 7 dögum
            </div>
            {upcoming7.map(s => (
              <div key={s.id} className="flex items-center justify-between text-xs py-1">
                <span>{s.icon} {s.name}</span>
                <span style={{ color: daysUntil(s.nextDue) <= 2 ? 'var(--danger)' : 'var(--muted)' }}>
                  {daysUntil(s.nextDue) === 0 ? 'Í dag' : daysUntil(s.nextDue) === 1 ? 'Á morgun' : `${daysUntil(s.nextDue)} dagar`}
                  {' · '}{formatISK(s.amount)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add form */}
      {showForm && (
        <form onSubmit={handleAdd} className="card flex flex-col gap-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Ný áskrift</h3>
            <button type="button" onClick={() => setShowForm(false)}><X size={16} style={{ color: 'var(--muted)' }} /></button>
          </div>
          <div className="grid grid-cols-4 gap-2">
            <input className="input col-span-1 text-center text-xl" placeholder="🎯"
              value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} />
            <input className="input col-span-3" placeholder="Nafn áskriftar"
              value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} autoFocus />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input className="input" type="number" placeholder="Upphæð (ISK)"
              value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} />
            <select className="input" value={form.cycle} onChange={e => setForm(f => ({ ...f, cycle: e.target.value }))}>
              {CYCLES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {CATEGORIES.map(c => (
              <button key={c.id} type="button" onClick={() => setForm(f => ({ ...f, category: c.id }))}
                className="flex flex-col items-center gap-0.5 py-2 rounded-xl text-xs transition-all"
                style={{
                  background: form.category === c.id ? 'rgba(0,212,170,0.12)' : 'var(--surface2)',
                  border: `1px solid ${form.category === c.id ? 'rgba(0,212,170,0.3)' : 'transparent'}`,
                  color: form.category === c.id ? 'var(--accent)' : 'var(--muted)',
                }}>
                <span>{c.icon}</span>
                <span style={{ fontSize: 9 }}>{c.label}</span>
              </button>
            ))}
          </div>
          <div>
            <label className="text-xs mb-1 block" style={{ color: 'var(--muted)' }}>Næsta endurnýjun</label>
            <input type="date" className="input text-sm" value={form.nextDue}
              onChange={e => setForm(f => ({ ...f, nextDue: e.target.value }))} />
          </div>
          <button type="submit" className="btn btn-primary w-full justify-center">Bæta við</button>
        </form>
      )}

      {/* Filters */}
      <div className="flex gap-2">
        {[['all', 'Allar'], ['active', 'Virkar'], ['inactive', 'Óvirkar']].map(([f, l]) => (
          <button key={f} onClick={() => setFilter(f)}
            className="btn text-xs flex-1 justify-center py-1.5"
            style={{
              background: filter === f ? 'rgba(0,212,170,0.12)' : 'var(--surface)',
              color: filter === f ? 'var(--accent)' : 'var(--muted)',
              border: `1px solid ${filter === f ? 'rgba(0,212,170,0.25)' : 'var(--border)'}`,
            }}>{l}</button>
        ))}
      </div>

      {/* Subscriptions list */}
      <div className="flex flex-col gap-2">
        {filtered.length === 0 ? (
          <div className="card text-center py-8" style={{ color: 'var(--muted)' }}>Engar áskriftir</div>
        ) : filtered.map(s => {
          const days = s.nextDue ? daysUntil(s.nextDue) : null
          const isUrgent = days !== null && days <= 3 && s.active
          return (
            <div key={s.id} className="card flex items-center gap-3"
                 style={{ opacity: s.active ? 1 : 0.55 }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                   style={{ background: `${s.color}22` }}>{s.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{s.name}</span>
                  <span className="badge text-xs"
                        style={{ background: 'var(--surface2)', color: 'var(--muted)' }}>
                    {CATEGORIES.find(c => c.id === s.category)?.label}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs font-semibold" style={{ color: s.active ? s.color : 'var(--muted)' }}>
                    {formatISK(s.amount)}/{s.cycle === 'annual' ? 'ár' : 'mán'}
                  </span>
                  {s.nextDue && (
                    <span className="text-xs" style={{ color: isUrgent ? '#f97316' : 'var(--muted)' }}>
                      {isUrgent ? '⚠️ ' : ''}{days === 0 ? 'Í dag!' : days === 1 ? 'Á morgun' : `${days}d`}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => toggleActive(s.id)} style={{ color: s.active ? 'var(--accent)' : 'var(--muted)' }}>
                  {s.active ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                </button>
                <button onClick={() => remove(s.id)} style={{ color: 'var(--muted)', padding: 4 }}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Category breakdown */}
      <div className="card">
        <h3 className="font-semibold text-sm mb-3">Eftir flokkum</h3>
        <div className="flex flex-col gap-2">
          {CATEGORIES.map(c => {
            const catTotal = subs.filter(s => s.active && s.category === c.id).reduce((acc, s) => acc + monthlyAmount(s), 0)
            if (!catTotal) return null
            const pct = totalMonthly ? Math.round((catTotal / totalMonthly) * 100) : 0
            return (
              <div key={c.id} className="flex flex-col gap-1">
                <div className="flex justify-between text-xs">
                  <span>{c.icon} {c.label}</span>
                  <span style={{ color: 'var(--muted)' }}>{formatISK(catTotal)}/mán · {pct}%</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--surface2)' }}>
                  <div className="h-full rounded-full" style={{ width: `${pct}%`, background: 'var(--accent)' }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
