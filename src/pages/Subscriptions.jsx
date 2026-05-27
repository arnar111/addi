import { useState } from 'react'
import { useSubscriptions } from '../hooks/useSubscriptions'
import { Plus, X, ExternalLink, AlertTriangle, CheckCircle, PauseCircle, TrendingDown } from 'lucide-react'
import { formatISK } from '../utils/currency'

const CATEGORIES = {
  entertainment: { label: 'Skemmtun', icon: '🎬', color: '#ef4444' },
  dev: { label: 'Þróun', icon: '💻', color: '#8b5cf6' },
  health: { label: 'Heilsa', icon: '💪', color: '#22c55e' },
  education: { label: 'Menntun', icon: '📚', color: '#f97316' },
  sports: { label: 'Íþróttir', icon: '⚽', color: '#00d4aa' },
  ai: { label: 'AI', icon: '🤖', color: '#6366f1' },
  storage: { label: 'Geymsla', icon: '☁️', color: '#0ea5e9' },
  other: { label: 'Annað', icon: '📦', color: '#64748b' },
}

const STATUS_CONFIG = {
  active: { label: 'Virkt', icon: CheckCircle, color: 'var(--success)', bg: 'rgba(34,197,94,0.1)' },
  failed: { label: 'Mistókst', icon: AlertTriangle, color: 'var(--danger)', bg: 'rgba(239,68,68,0.1)' },
  paused: { label: 'Í bið', icon: PauseCircle, color: 'var(--muted)', bg: 'var(--surface2)' },
}

function SubCard({ sub, onToggle, onRemove }) {
  const cat = CATEGORIES[sub.category] || CATEGORIES.other
  const st = STATUS_CONFIG[sub.status] || STATUS_CONFIG.active

  return (
    <div className="card flex items-center gap-3 py-3 group"
         style={{ borderColor: sub.status === 'failed' ? 'rgba(239,68,68,0.35)' : 'var(--border)' }}>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-xl"
           style={{ background: `${cat.color}18` }}>
        {sub.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="font-medium text-sm">{sub.name}</span>
          {sub.status === 'failed' && <AlertTriangle size={12} style={{ color: 'var(--danger)' }} />}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs px-1.5 py-0.5 rounded-md"
                style={{ background: st.bg, color: st.color }}>
            {st.label}
          </span>
          <span className="text-xs" style={{ color: 'var(--muted)' }}>
            {cat.icon} {cat.label}
          </span>
          {sub.dueDay && (
            <span className="text-xs" style={{ color: 'var(--muted)' }}>· {sub.dueDay}. hvers mánaðar</span>
          )}
        </div>
      </div>
      <div className="flex flex-col items-end gap-1 shrink-0">
        <span className="text-sm font-semibold">{formatISK(sub.amount)}</span>
        <span className="text-xs" style={{ color: 'var(--muted)' }}>/mán</span>
      </div>
      <div className="flex flex-col gap-1 shrink-0">
        {sub.url && (
          <button onClick={() => window.open(sub.url, '_blank')}
                  className="p-1.5 rounded-lg" style={{ color: 'var(--muted)' }}>
            <ExternalLink size={13} />
          </button>
        )}
        <button onClick={() => onRemove(sub.id)}
                className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ color: 'var(--danger)' }}>
          <X size={13} />
        </button>
      </div>
    </div>
  )
}

const EMPTY_FORM = { name: '', icon: '📦', amount: '', currency: 'ISK', cycle: 'monthly', category: 'other', dueDay: 1, url: '' }

export default function Subscriptions() {
  const { subs, addSub, removeSub, toggleStatus, totalMonthly, failedSubs, activeSubs, byCategory } = useSubscriptions()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [tab, setTab] = useState('all')

  const handleAdd = (e) => {
    e.preventDefault()
    if (!form.name || !form.amount) return
    addSub({ ...form, amount: Number(form.amount), status: 'active' })
    setForm(EMPTY_FORM)
    setShowForm(false)
  }

  const displayed = tab === 'failed' ? failedSubs
    : tab === 'active' ? activeSubs
    : subs

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold">Áskriftir 💳</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>{subs.length} áskriftir skráðar</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          <Plus size={16} /> Bæta við
        </button>
      </div>

      {failedSubs.length > 0 && (
        <div className="card" style={{ background: 'rgba(239,68,68,0.08)', borderColor: 'rgba(239,68,68,0.4)' }}>
          <div className="flex items-start gap-3">
            <AlertTriangle size={20} style={{ color: 'var(--danger)', flexShrink: 0, marginTop: 1 }} />
            <div>
              <div className="font-semibold text-sm" style={{ color: 'var(--danger)' }}>
                {failedSubs.length} greiðsla{failedSubs.length > 1 ? 'r' : ''} mistókst!
              </div>
              <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                {failedSubs.map(s => s.name).join(', ')} — uppfærðu kortaupplýsingar þínar
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.06), rgba(139,92,246,0.06))' }}>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Mánaðarlegt</div>
            <div className="text-2xl font-bold">{formatISK(totalMonthly)}</div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
              {activeSubs.length} virkar · {failedSubs.length} misteknar
            </div>
          </div>
          <div>
            <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Árslegt</div>
            <div className="text-2xl font-bold">{formatISK(totalMonthly * 12)}</div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
              á ári
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-xs font-medium mb-1" style={{ color: 'var(--muted)' }}>Eftir flokkum</div>
          {Object.entries(byCategory).sort(([, a], [, b]) => b - a).map(([cat, amt]) => {
            const c = CATEGORIES[cat] || CATEGORIES.other
            const pct = Math.round((amt / totalMonthly) * 100)
            return (
              <div key={cat} className="flex items-center gap-2">
                <span style={{ fontSize: 13 }}>{c.icon}</span>
                <div className="flex-1">
                  <div className="flex justify-between text-xs mb-0.5">
                    <span style={{ color: 'var(--muted)' }}>{c.label}</span>
                    <span>{formatISK(amt)}</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--surface2)' }}>
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: c.color }} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {totalMonthly > 20000 && (
        <div className="card flex items-start gap-3"
             style={{ background: 'rgba(249,115,22,0.06)', borderColor: 'rgba(249,115,22,0.25)' }}>
          <TrendingDown size={18} style={{ color: 'var(--accent3)', flexShrink: 0, marginTop: 1 }} />
          <div>
            <div className="text-sm font-medium" style={{ color: 'var(--accent3)' }}>Sparnaðarráð 💡</div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
              Þú eyðir {formatISK(totalMonthly)}/mán í áskriftir ({formatISK(totalMonthly * 12)}/ár).
              Íhugaðu að fella niður áskriftir sem þú notar minna.
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleAdd} className="card flex flex-col gap-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Ný áskrift</h3>
            <button type="button" onClick={() => setShowForm(false)}>
              <X size={16} style={{ color: 'var(--muted)' }} />
            </button>
          </div>
          <div className="flex gap-2">
            <input className="input" style={{ flex: '0 0 56px', textAlign: 'center', fontSize: 20, padding: '8px' }}
                   placeholder="🔖" value={form.icon}
                   onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} />
            <input className="input" placeholder="Nafn á áskrift" value={form.name} autoFocus
                   onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          </div>
          <div className="flex gap-2">
            <input className="input" type="number" placeholder="Upphæð (ISK)" value={form.amount}
                   onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} />
            <input className="input" type="number" placeholder="Dagur" style={{ flex: '0 0 80px' }}
                   value={form.dueDay} min={1} max={31}
                   onChange={e => setForm(f => ({ ...f, dueDay: Number(e.target.value) }))} />
          </div>
          <input className="input text-sm" placeholder="Vefslóð (valkvæmt)" value={form.url}
                 onChange={e => setForm(f => ({ ...f, url: e.target.value }))} />
          <div className="grid grid-cols-4 gap-1.5">
            {Object.entries(CATEGORIES).map(([id, cat]) => (
              <button key={id} type="button" onClick={() => setForm(f => ({ ...f, category: id }))}
                className="flex flex-col items-center gap-0.5 py-2 rounded-xl text-xs transition-all"
                style={{
                  background: form.category === id ? `${cat.color}22` : 'var(--surface2)',
                  border: `1px solid ${form.category === id ? cat.color + '55' : 'transparent'}`,
                }}>
                <span>{cat.icon}</span>
                <span style={{ color: form.category === id ? cat.color : 'var(--muted)', fontSize: 10 }}>{cat.label}</span>
              </button>
            ))}
          </div>
          <button type="submit" className="btn btn-primary w-full justify-center">Bæta við</button>
        </form>
      )}

      <div className="flex gap-2">
        {[['all', `Allt (${subs.length})`], ['active', `Virkt (${activeSubs.length})`], ['failed', `⚠️ (${failedSubs.length})`]].map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)} className="btn text-xs flex-1 justify-center"
            style={{
              background: tab === t ? (t === 'failed' ? 'rgba(239,68,68,0.12)' : 'rgba(0,212,170,0.12)') : 'var(--surface)',
              color: tab === t ? (t === 'failed' ? 'var(--danger)' : 'var(--accent)') : 'var(--muted)',
              border: `1px solid ${tab === t ? (t === 'failed' ? 'rgba(239,68,68,0.25)' : 'rgba(0,212,170,0.25)') : 'var(--border)'}`,
            }}>{l}</button>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        {displayed.length === 0 ? (
          <div className="card text-center py-8" style={{ color: 'var(--muted)' }}>Engar áskriftir fundust</div>
        ) : displayed.map(sub => (
          <SubCard key={sub.id} sub={sub} onToggle={toggleStatus} onRemove={removeSub} />
        ))}
      </div>
    </div>
  )
}
