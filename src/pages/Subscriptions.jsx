import { useState } from 'react'
import { useSubscriptions, SUB_CATEGORIES, ISK_RATES } from '../hooks/useSubscriptions'
import { formatISK, formatShortISK } from '../utils/currency'
import { Plus, Trash2, X, AlertTriangle, ChevronDown, ChevronUp, CreditCard } from 'lucide-react'

const STATUS_CFG = {
  active:  { label: 'Virkt',            bg: 'rgba(34,197,94,0.12)',  color: '#22c55e', dot: '#22c55e' },
  warning: { label: 'Vandamál',         bg: 'rgba(239,68,68,0.12)',  color: '#ef4444', dot: '#ef4444' },
  paused:  { label: 'Í bið',            bg: 'rgba(100,116,139,0.12)',color: '#64748b', dot: '#64748b' },
}

const CURRENCIES = ['ISK', 'USD', 'EUR', 'GBP']
const CYCLES     = [['monthly', 'Mánaðarlega'], ['yearly', 'Árlega']]

function daysUntil(dateStr) {
  const d = new Date(dateStr)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  d.setHours(0, 0, 0, 0)
  return Math.ceil((d - today) / 86400000)
}

function DaysChip({ dateStr }) {
  const n = daysUntil(dateStr)
  if (n < 0) return <span className="text-xs" style={{ color: 'var(--muted)' }}>Liðið</span>
  if (n === 0) return <span className="text-xs font-semibold" style={{ color: 'var(--danger)' }}>Í dag!</span>
  if (n <= 3)  return <span className="text-xs font-semibold" style={{ color: 'var(--danger)' }}>+{n}d</span>
  if (n <= 7)  return <span className="text-xs font-semibold" style={{ color: '#f97316' }}>+{n}d</span>
  return <span className="text-xs" style={{ color: 'var(--muted)' }}>+{n}d</span>
}

export default function Subscriptions() {
  const { subs, add, remove, update, toISK, monthlyISK, warnings, upcoming } = useSubscriptions()
  const [showForm, setShowForm] = useState(false)
  const [expandedId, setExpandedId] = useState(null)
  const [filterCat, setFilterCat] = useState('all')

  const [form, setForm] = useState({
    name: '', icon: '💳', amount: '', currency: 'USD',
    cycle: 'monthly', nextDate: '', status: 'active',
    category: 'other', notes: '',
  })

  const monthly = monthlyISK()
  const warns   = warnings()
  const soon    = upcoming(7)

  const filtered = filterCat === 'all'
    ? subs
    : filterCat === 'warning'
      ? subs.filter(s => s.status === 'warning')
      : subs.filter(s => s.category === filterCat)

  const handleAdd = (e) => {
    e.preventDefault()
    if (!form.name || !form.amount) return
    add({ ...form, amount: Number(form.amount) })
    setForm({ name: '', icon: '💳', amount: '', currency: 'USD', cycle: 'monthly', nextDate: '', status: 'active', category: 'other', notes: '' })
    setShowForm(false)
  }

  const cycleLabel = (c) => c === 'yearly' ? 'Á ári' : 'Á mánuði'

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold">Áskriftir</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            {subs.filter(s => s.status !== 'paused').length} virkar · {formatShortISK(monthly)}/mán
          </p>
        </div>
        <button onClick={() => setShowForm(v => !v)} className="btn btn-primary">
          <Plus size={16} /> Bæta við
        </button>
      </div>

      {/* Monthly total card */}
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.08), rgba(139,92,246,0.08))' }}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Mánaðarleg heildarkostnaður</div>
            <div className="text-3xl font-semibold">{formatISK(monthly)}</div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
              ≈ {formatISK(monthly * 12)} á ári
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="text-3xl">💳</div>
            {warns.length > 0 && (
              <div className="flex items-center gap-1 px-2 py-1 rounded-lg" style={{ background: 'rgba(239,68,68,0.12)' }}>
                <AlertTriangle size={12} style={{ color: 'var(--danger)' }} />
                <span className="text-xs font-semibold" style={{ color: 'var(--danger)' }}>{warns.length} vandamál</span>
              </div>
            )}
          </div>
        </div>

        {/* Category breakdown mini */}
        <div className="flex flex-wrap gap-1.5">
          {Object.entries(SUB_CATEGORIES)
            .map(([key, cat]) => {
              const total = subs.filter(s => s.category === key && s.status !== 'paused')
                .reduce((sum, s) => sum + (s.cycle === 'yearly' ? Math.round(toISK(s.amount, s.currency) / 12) : toISK(s.amount, s.currency)), 0)
              if (!total) return null
              return (
                <div key={key} className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs"
                     style={{ background: 'var(--surface2)' }}>
                  <span>{cat.icon}</span>
                  <span style={{ color: 'var(--muted)' }}>{formatShortISK(total)}</span>
                </div>
              )
            })}
        </div>
      </div>

      {/* Warning banner */}
      {warns.length > 0 && (
        <div className="card flex flex-col gap-2" style={{ border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.06)' }}>
          <div className="flex items-center gap-2">
            <AlertTriangle size={15} style={{ color: 'var(--danger)' }} />
            <span className="font-semibold text-sm" style={{ color: 'var(--danger)' }}>
              Greiðsluvandamál – Þarfnast athygli
            </span>
          </div>
          {warns.map(s => (
            <div key={s.id} className="flex items-center gap-2 text-sm">
              <span>{s.icon}</span>
              <span className="flex-1">{s.name}</span>
              <span className="text-xs" style={{ color: 'var(--danger)' }}>
                {formatShortISK(s.cycle === 'yearly' ? Math.round(toISK(s.amount, s.currency) / 12) : toISK(s.amount, s.currency))}/mán
              </span>
              <button onClick={() => update(s.id, { status: 'active' })}
                className="text-xs px-2 py-0.5 rounded-lg" style={{ background: 'rgba(34,197,94,0.15)', color: 'var(--success)' }}>
                Leyst
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upcoming renewals */}
      {soon.length > 0 && (
        <div className="card flex flex-col gap-2">
          <div className="text-sm font-semibold mb-1">Endurnýjun þessa viku</div>
          {soon.map(s => (
            <div key={s.id} className="flex items-center gap-3">
              <span className="text-xl">{s.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium">{s.name}</div>
                <div className="text-xs" style={{ color: 'var(--muted)' }}>
                  {new Date(s.nextDate).toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })}
                </div>
              </div>
              <div className="flex flex-col items-end gap-0.5">
                <DaysChip dateStr={s.nextDate} />
                <span className="text-xs font-medium">
                  {formatShortISK(s.cycle === 'yearly' ? toISK(s.amount, s.currency) : toISK(s.amount, s.currency))}
                </span>
              </div>
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
            <input className="input w-12 text-center px-1 text-lg" value={form.icon}
              onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} maxLength={2} />
            <input className="input flex-1" placeholder="Nafn áskriftar..." value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))} autoFocus />
          </div>
          <div className="flex gap-2">
            <input className="input flex-1" type="number" placeholder="Upphæð" value={form.amount}
              onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} />
            <select className="input w-24" value={form.currency}
              onChange={e => setForm(f => ({ ...f, currency: e.target.value }))}>
              {CURRENCIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex gap-2">
            {CYCLES.map(([val, lbl]) => (
              <button key={val} type="button" onClick={() => setForm(f => ({ ...f, cycle: val }))}
                className="flex-1 py-1.5 rounded-lg text-xs font-medium"
                style={{
                  background: form.cycle === val ? 'rgba(0,212,170,0.15)' : 'var(--surface2)',
                  color: form.cycle === val ? 'var(--accent)' : 'var(--muted)',
                  border: `1px solid ${form.cycle === val ? 'rgba(0,212,170,0.3)' : 'transparent'}`,
                }}>{lbl}</button>
            ))}
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs" style={{ color: 'var(--muted)' }}>Næsta endurnýjun</label>
            <input className="input text-sm" type="date" value={form.nextDate}
              onChange={e => setForm(f => ({ ...f, nextDate: e.target.value }))} />
          </div>
          <div className="grid grid-cols-5 gap-1">
            {Object.entries(SUB_CATEGORIES).map(([key, cat]) => (
              <button key={key} type="button" onClick={() => setForm(f => ({ ...f, category: key }))}
                className="flex flex-col items-center gap-0.5 py-1.5 rounded-xl text-xs"
                style={{
                  background: form.category === key ? `${cat.color}22` : 'var(--surface2)',
                  border: `1px solid ${form.category === key ? cat.color + '55' : 'transparent'}`,
                }}>
                <span>{cat.icon}</span>
                <span style={{ color: form.category === key ? cat.color : 'var(--muted)', fontSize: 9 }}>
                  {cat.label.slice(0, 5)}
                </span>
              </button>
            ))}
          </div>
          <input className="input text-sm" placeholder="Athugasemd (valkvæmt)" value={form.notes}
            onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
          <button type="submit" className="btn btn-primary w-full justify-center">Bæta við áskrift</button>
        </form>
      )}

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {[['all', 'Allt'], ['warning', '⚠️ Vandamál'], ...Object.entries(SUB_CATEGORIES).map(([k, c]) => [k, `${c.icon} ${c.label}`])].map(([key, lbl]) => (
          <button key={key} onClick={() => setFilterCat(key)}
            className="btn shrink-0 text-xs py-1.5"
            style={{
              background: filterCat === key ? 'rgba(0,212,170,0.15)' : 'var(--surface)',
              color: filterCat === key ? 'var(--accent)' : 'var(--muted)',
              border: `1px solid ${filterCat === key ? 'rgba(0,212,170,0.3)' : 'var(--border)'}`,
            }}>{lbl}</button>
        ))}
      </div>

      {/* Subscription list */}
      <div className="flex flex-col gap-2">
        {filtered.length === 0 && (
          <div className="card text-center py-8" style={{ color: 'var(--muted)' }}>Engar áskriftir</div>
        )}
        {filtered.map(s => {
          const cfg = STATUS_CFG[s.status] || STATUS_CFG.active
          const cat = SUB_CATEGORIES[s.category] || SUB_CATEGORIES.other
          const iskAmt = toISK(s.amount, s.currency)
          const monthlyAmt = s.cycle === 'yearly' ? Math.round(iskAmt / 12) : iskAmt
          const isExpanded = expandedId === s.id

          return (
            <div key={s.id} className="card flex flex-col gap-0" style={{ padding: 0, overflow: 'hidden' }}>
              <button
                onClick={() => setExpandedId(isExpanded ? null : s.id)}
                className="flex items-center gap-3 w-full text-left"
                style={{ padding: '14px 16px' }}>
                <div className="text-2xl shrink-0">{s.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{s.name}</span>
                    <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: cfg.bg, color: cfg.color }}>
                      {cfg.label}
                    </span>
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                    {cat.icon} {cat.label} · {cycleLabel(s.cycle)}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-0.5 shrink-0">
                  <span className="text-sm font-semibold">{formatShortISK(monthlyAmt)}<span className="font-normal text-xs" style={{ color: 'var(--muted)' }}>/mán</span></span>
                  <DaysChip dateStr={s.nextDate} />
                </div>
                <div style={{ color: 'var(--muted)', marginLeft: 4 }}>
                  {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </div>
              </button>

              {isExpanded && (
                <div className="flex flex-col gap-2 animate-slide-up"
                     style={{ borderTop: '1px solid var(--border)', padding: '12px 16px', background: 'var(--surface2)' }}>
                  {s.notes && (
                    <div className="text-xs" style={{ color: 'var(--muted)' }}>{s.notes}</div>
                  )}
                  <div className="flex gap-2 text-xs" style={{ color: 'var(--muted)' }}>
                    <span>{s.amount} {s.currency}</span>
                    <span>·</span>
                    <span>{new Date(s.nextDate).toLocaleDateString('is-IS', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <div className="flex gap-2 mt-1">
                    {(['active', 'warning', 'paused']).map(st => (
                      <button key={st} onClick={() => update(s.id, { status: st })}
                        className="flex-1 py-1 rounded-lg text-xs"
                        style={{
                          background: s.status === st ? `${STATUS_CFG[st].bg}` : 'var(--surface)',
                          color: s.status === st ? STATUS_CFG[st].color : 'var(--muted)',
                          border: `1px solid ${s.status === st ? STATUS_CFG[st].color + '44' : 'var(--border)'}`,
                        }}>
                        {STATUS_CFG[st].label}
                      </button>
                    ))}
                    <button onClick={() => remove(s.id)}
                      className="px-3 py-1 rounded-lg text-xs"
                      style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--danger)' }}>
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
