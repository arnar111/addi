import { useState } from 'react'
import { useSubscriptions } from '../hooks/useSubscriptions'
import { formatISK, formatShortISK } from '../utils/currency'
import { Plus, X, AlertCircle, CheckCircle, XCircle, ChevronDown, Trash2 } from 'lucide-react'

const STATUS_CONFIG = {
  active:    { label: 'Virk',       color: 'var(--success)',  icon: CheckCircle,   bg: 'rgba(34,197,94,0.12)'  },
  failing:   { label: 'Vandamál',   color: 'var(--danger)',   icon: AlertCircle,   bg: 'rgba(239,68,68,0.12)'  },
  cancelled: { label: 'Hætt við',   color: 'var(--muted)',    icon: XCircle,       bg: 'rgba(100,116,139,0.12)' },
}

const CURRENCIES = ['USD', 'EUR', 'GBP', 'ISK']
const PERIODS = [['monthly', 'Mánaðarlegt'], ['yearly', 'Árlegt']]
const CATEGORY_ICONS = {
  'Afþreying': '🎬', 'AI': '🤖', 'Nám': '📚', 'Hugbúnaður': '🖥️',
  'Þróun': '🚀', 'Leikir': '🎮', 'Heilsa': '💪', 'Annað': '📦',
}
const CATEGORIES = Object.keys(CATEGORY_ICONS)

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status]
  const Icon = cfg.icon
  return (
    <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium"
          style={{ background: cfg.bg, color: cfg.color }}>
      <Icon size={10} />
      {cfg.label}
    </span>
  )
}

function SubCard({ sub, toMonthlyISK, setStatus, remove }) {
  const [open, setOpen] = useState(false)
  const isk = toMonthlyISK(sub)
  const cfg = STATUS_CONFIG[sub.status]

  return (
    <div className="card flex flex-col gap-0 overflow-hidden"
         style={{ borderColor: sub.status === 'failing' ? 'rgba(239,68,68,0.3)' : 'var(--border)', padding: 0 }}>
      <button className="flex items-center gap-3 p-4 w-full text-left" onClick={() => setOpen(o => !o)}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-lg"
             style={{ background: `${sub.color}22` }}>
          {sub.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-sm">{sub.name}</span>
            <StatusBadge status={sub.status} />
          </div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
            {sub.category} · {sub.period === 'yearly' ? 'Árlegt' : 'Mánaðarlegt'}
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="text-sm font-semibold">{formatShortISK(isk)}<span className="text-xs font-normal" style={{ color: 'var(--muted)' }}>/mán</span></div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>
            {sub.amount} {sub.currency}
          </div>
        </div>
        <ChevronDown size={14} style={{ color: 'var(--muted)', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>

      {open && (
        <div className="flex flex-col gap-2 px-4 pb-4 pt-0 animate-slide-up" style={{ borderTop: '1px solid var(--border)' }}>
          <div className="text-xs mt-3 mb-1 font-medium" style={{ color: 'var(--muted)' }}>Breyta stöðu</div>
          <div className="flex gap-2 flex-wrap">
            {Object.entries(STATUS_CONFIG).map(([s, cfg]) => (
              <button key={s} onClick={() => setStatus(sub.id, s)}
                className="btn text-xs py-1.5 px-3"
                style={{
                  background: sub.status === s ? cfg.bg : 'var(--surface2)',
                  color: sub.status === s ? cfg.color : 'var(--muted)',
                  border: `1px solid ${sub.status === s ? cfg.color + '44' : 'transparent'}`,
                }}>
                {cfg.label}
              </button>
            ))}
          </div>
          <button onClick={() => remove(sub.id)}
                  className="btn text-xs py-1.5 mt-1 justify-center"
                  style={{ background: 'rgba(239,68,68,0.08)', color: 'var(--danger)', border: '1px solid rgba(239,68,68,0.2)' }}>
            <Trash2 size={12} /> Eyða áskrift
          </button>
        </div>
      )}
    </div>
  )
}

export default function Subscriptions() {
  const { subs, failing, active, cancelled, monthlyISK, failingISK, toMonthlyISK, setStatus, add, remove } = useSubscriptions()
  const [showForm, setShowForm] = useState(false)
  const [tab, setTab] = useState('all')
  const [form, setForm] = useState({ name: '', icon: '📱', amount: '', currency: 'USD', period: 'monthly', status: 'active', category: 'Annað', color: '#00d4aa', renewDay: 1 })

  const handleAdd = (e) => {
    e.preventDefault()
    if (!form.name || !form.amount) return
    add({ ...form, amount: Number(form.amount) })
    setForm({ name: '', icon: '📱', amount: '', currency: 'USD', period: 'monthly', status: 'active', category: 'Annað', color: '#00d4aa', renewDay: 1 })
    setShowForm(false)
  }

  const displayed = tab === 'failing' ? failing : tab === 'active' ? active : tab === 'cancelled' ? cancelled : subs
  const yearlyISK = monthlyISK * 12

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold">Áskriftir</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>{subs.filter(s => s.status !== 'cancelled').length} virkar · {formatShortISK(monthlyISK)}/mán</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          <Plus size={16} /> Bæta við
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-2">
        <div className="card-sm flex flex-col gap-0.5" style={{ textAlign: 'center' }}>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>Á mánuði</div>
          <div className="text-base font-bold" style={{ color: 'var(--accent)' }}>{formatShortISK(monthlyISK)}</div>
        </div>
        <div className="card-sm flex flex-col gap-0.5" style={{ textAlign: 'center' }}>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>Á ári</div>
          <div className="text-base font-bold">{formatShortISK(yearlyISK)}</div>
        </div>
        <div className="card-sm flex flex-col gap-0.5" style={{ textAlign: 'center' }}>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>Vandamál</div>
          <div className="text-base font-bold" style={{ color: failing.length > 0 ? 'var(--danger)' : 'var(--success)' }}>
            {failing.length}
          </div>
        </div>
      </div>

      {/* Failing alert banner */}
      {failing.length > 0 && (
        <div className="card flex items-start gap-3 animate-slide-up"
             style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.25)' }}>
          <AlertCircle size={18} style={{ color: 'var(--danger)', shrink: 0, marginTop: 2 }} />
          <div>
            <div className="text-sm font-semibold" style={{ color: 'var(--danger)' }}>
              {failing.length} áskrift með greiðsluvandamál
            </div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
              {formatShortISK(failingISK)}/mán í hættu · Uppfærðu greiðslumáta
            </div>
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
            <input className="input text-sm" style={{ width: 52, textAlign: 'center', padding: '10px 4px', flexShrink: 0 }}
              placeholder="📱" value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} maxLength={2} />
            <input className="input text-sm flex-1" placeholder="Nafn á áskrift" value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))} autoFocus />
          </div>
          <div className="flex gap-2">
            <input className="input text-sm flex-1" type="number" placeholder="Upphæð" value={form.amount}
              onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} />
            <select className="input text-sm" style={{ width: 80, flexShrink: 0 }} value={form.currency}
              onChange={e => setForm(f => ({ ...f, currency: e.target.value }))}>
              {CURRENCIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex gap-2">
            {PERIODS.map(([val, lbl]) => (
              <button key={val} type="button" onClick={() => setForm(f => ({ ...f, period: val }))}
                className="btn flex-1 text-xs py-2 justify-center"
                style={{
                  background: form.period === val ? 'rgba(0,212,170,0.12)' : 'var(--surface2)',
                  color: form.period === val ? 'var(--accent)' : 'var(--muted)',
                  border: `1px solid ${form.period === val ? 'rgba(0,212,170,0.3)' : 'transparent'}`,
                }}>{lbl}</button>
            ))}
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {CATEGORIES.map(cat => (
              <button key={cat} type="button" onClick={() => setForm(f => ({ ...f, category: cat }))}
                className="flex flex-col items-center gap-0.5 py-2 rounded-xl text-xs transition-all"
                style={{
                  background: form.category === cat ? 'rgba(0,212,170,0.12)' : 'var(--surface2)',
                  border: `1px solid ${form.category === cat ? 'rgba(0,212,170,0.3)' : 'transparent'}`,
                }}>
                <span>{CATEGORY_ICONS[cat]}</span>
                <span style={{ color: form.category === cat ? 'var(--accent)' : 'var(--muted)', fontSize: 9 }}>{cat}</span>
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            {Object.entries(STATUS_CONFIG).map(([s, cfg]) => (
              <button key={s} type="button" onClick={() => setForm(f => ({ ...f, status: s }))}
                className="btn flex-1 text-xs py-1.5 justify-center"
                style={{
                  background: form.status === s ? cfg.bg : 'var(--surface2)',
                  color: form.status === s ? cfg.color : 'var(--muted)',
                  border: `1px solid ${form.status === s ? cfg.color + '44' : 'transparent'}`,
                }}>{cfg.label}</button>
            ))}
          </div>
          <button type="submit" className="btn btn-primary w-full justify-center">Bæta við áskrift</button>
        </form>
      )}

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {[
          ['all', `Allt (${subs.length})`],
          ['failing', `⚠️ Vandamál (${failing.length})`],
          ['active', `✓ Virkar (${active.length})`],
          ['cancelled', `Hætt (${cancelled.length})`],
        ].map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)}
            className="btn shrink-0 text-xs py-1.5"
            style={{
              background: tab === t ? 'rgba(0,212,170,0.15)' : 'var(--surface)',
              color: tab === t ? 'var(--accent)' : 'var(--muted)',
              border: `1px solid ${tab === t ? 'rgba(0,212,170,0.3)' : 'var(--border)'}`,
            }}>{l}</button>
        ))}
      </div>

      {/* Sub list */}
      <div className="flex flex-col gap-2">
        {displayed.length === 0 ? (
          <div className="card text-center py-8" style={{ color: 'var(--muted)' }}>Engar áskriftir</div>
        ) : (
          displayed.map(s => (
            <SubCard key={s.id} sub={s} toMonthlyISK={toMonthlyISK} setStatus={setStatus} remove={remove} />
          ))
        )}
      </div>

      {/* Category breakdown */}
      {subs.filter(s => s.status !== 'cancelled').length > 0 && (
        <div className="card flex flex-col gap-3">
          <h3 className="font-semibold text-sm">Eftir flokkum</h3>
          {(() => {
            const byCategory = {}
            subs.filter(s => s.status !== 'cancelled').forEach(s => {
              if (!byCategory[s.category]) byCategory[s.category] = 0
              byCategory[s.category] += toMonthlyISK(s)
            })
            return Object.entries(byCategory)
              .sort((a, b) => b[1] - a[1])
              .map(([cat, isk]) => {
                const pct = Math.round((isk / monthlyISK) * 100)
                return (
                  <div key={cat} className="flex flex-col gap-1">
                    <div className="flex items-center justify-between text-xs">
                      <span>{CATEGORY_ICONS[cat] || '📦'} {cat}</span>
                      <span style={{ color: 'var(--muted)' }}>{formatShortISK(isk)}/mán</span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--surface2)' }}>
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: 'var(--accent)' }} />
                    </div>
                  </div>
                )
              })
          })()}
        </div>
      )}
    </div>
  )
}
