import { useState } from 'react'
import { useSubscriptions, SUB_STATUSES } from '../hooks/useSubscriptions'
import { formatISK, formatShortISK } from '../utils/currency'
import { Plus, Trash2, AlertTriangle, X, ChevronDown, ChevronUp } from 'lucide-react'

const CATEGORIES = ['streaming', 'sports', 'gaming', 'software', 'learning', 'tech', 'other']
const STATUS_OPTS = ['active', 'paused', 'failed', 'cancelled']

function SubCard({ sub, onRemove, onUpdate }) {
  const [expanded, setExpanded] = useState(false)
  const status = SUB_STATUSES[sub.status] || SUB_STATUSES.active
  const monthlyCost = sub.period === 'yearly' ? Math.round(sub.cost / 12) : sub.cost
  const isAlert = ['failed', 'paused', 'warning'].includes(sub.status)

  return (
    <div className="card flex flex-col gap-0"
         style={{ borderColor: isAlert ? `${status.color}44` : 'var(--border)', padding: 0, overflow: 'hidden' }}>
      <button onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-3 p-4 w-full text-left">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
             style={{ background: `${sub.color}18` }}>
          {sub.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{sub.name}</span>
            <span className="badge text-xs shrink-0"
                  style={{ background: `${status.color}18`, color: status.color }}>
              {status.label}
            </span>
          </div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
            {formatShortISK(monthlyCost)}/mán · endurnýjast dag {sub.renewDay}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="text-right">
            <div className="text-sm font-semibold">{formatShortISK(sub.cost)}</div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>/{sub.period === 'yearly' ? 'ár' : 'mán'}</div>
          </div>
          {expanded ? <ChevronUp size={15} style={{ color: 'var(--muted)' }} /> : <ChevronDown size={15} style={{ color: 'var(--muted)' }} />}
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 flex flex-col gap-3" style={{ borderTop: '1px solid var(--border)' }}>
          {sub.note && (
            <p className="text-xs pt-3 leading-relaxed" style={{ color: isAlert ? status.color : 'var(--muted)' }}>
              {sub.note}
            </p>
          )}
          <div className="flex gap-2 pt-1">
            <select className="input text-xs py-1.5 flex-1"
                    value={sub.status}
                    onChange={e => onUpdate(sub.id, { status: e.target.value })}>
              {STATUS_OPTS.map(s => (
                <option key={s} value={s}>{SUB_STATUSES[s]?.label || s}</option>
              ))}
            </select>
            <button onClick={() => onRemove(sub.id)}
                    className="btn btn-danger text-xs py-1.5 px-3 shrink-0">
              <Trash2 size={13} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function Subscriptions() {
  const { subs, add, remove, update, monthlyTotal, yearlyTotal, alertSubs, activeCount } = useSubscriptions()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    name: '', icon: '📱', cost: '', period: 'monthly',
    status: 'active', renewDay: 1, color: '#00d4aa', category: 'other', note: '',
  })

  const handleAdd = (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.cost) return
    add({ ...form, cost: Number(form.cost) })
    setForm({ name: '', icon: '📱', cost: '', period: 'monthly', status: 'active', renewDay: 1, color: '#00d4aa', category: 'other', note: '' })
    setShowForm(false)
  }

  const f = v => setForm(p => ({ ...p, ...v }))

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold">Áskriftir</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>{activeCount} virkar</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          <Plus size={16} /> Bæta við
        </button>
      </div>

      {/* Cost summary */}
      <div className="card"
           style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.06), rgba(139,92,246,0.06))' }}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Á mánuði</div>
            <div className="text-2xl font-semibold">{formatShortISK(monthlyTotal)}</div>
          </div>
          <div>
            <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Á ári</div>
            <div className="text-2xl font-semibold">{formatShortISK(yearlyTotal)}</div>
          </div>
        </div>
        <div className="mt-3 h-1.5 rounded-full" style={{ background: 'var(--surface2)' }}>
          <div className="h-full rounded-full" style={{ width: '100%', background: 'var(--accent)' }} />
        </div>
        <div className="text-xs mt-1.5" style={{ color: 'var(--muted)' }}>
          {subs.length} áskriftir samtals · {alertSubs.length} þarfnast athygli
        </div>
      </div>

      {/* Alerts */}
      {alertSubs.length > 0 && (
        <div className="card flex flex-col gap-2"
             style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.25)' }}>
          <div className="flex items-center gap-2">
            <AlertTriangle size={15} style={{ color: 'var(--danger)' }} />
            <span className="font-semibold text-sm" style={{ color: 'var(--danger)' }}>Þarf athygli</span>
          </div>
          {alertSubs.map(s => {
            const st = SUB_STATUSES[s.status]
            return (
              <div key={s.id} className="flex items-center gap-2.5">
                <span className="text-base">{s.icon}</span>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium">{s.name}</span>
                  <span className="text-xs ml-2" style={{ color: st?.color }}>{st?.label}</span>
                </div>
              </div>
            )
          })}
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
          <div className="grid grid-cols-4 gap-2">
            <input className="input col-span-1 text-center text-xl py-2" placeholder="📱"
                   value={form.icon} onChange={e => f({ icon: e.target.value })} />
            <input className="input col-span-3 text-sm" placeholder="Nafn áskriftar..."
                   value={form.name} onChange={e => f({ name: e.target.value })} required />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs mb-1 block" style={{ color: 'var(--muted)' }}>Kostnaður (ISK)</label>
              <input className="input text-sm" type="number" placeholder="2490"
                     value={form.cost} onChange={e => f({ cost: e.target.value })} required />
            </div>
            <div>
              <label className="text-xs mb-1 block" style={{ color: 'var(--muted)' }}>Tímabil</label>
              <select className="input text-sm" value={form.period} onChange={e => f({ period: e.target.value })}>
                <option value="monthly">Mánaðarlegt</option>
                <option value="yearly">Árlegt</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs mb-1 block" style={{ color: 'var(--muted)' }}>Endurnýjunardagur</label>
              <input className="input text-sm" type="number" min="1" max="31"
                     value={form.renewDay} onChange={e => f({ renewDay: Number(e.target.value) })} />
            </div>
            <div>
              <label className="text-xs mb-1 block" style={{ color: 'var(--muted)' }}>Flokkur</label>
              <select className="input text-sm" value={form.category} onChange={e => f({ category: e.target.value })}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <input className="input text-sm" placeholder="Skýring (valkvæmt)"
                 value={form.note} onChange={e => f({ note: e.target.value })} />
          <button type="submit" className="btn btn-primary w-full justify-center">Bæta við áskrift</button>
        </form>
      )}

      {/* Sub list */}
      {['warning', 'failed', 'paused', 'active', 'cancelled'].map(status => {
        const group = subs.filter(s => s.status === status)
        if (group.length === 0) return null
        const st = SUB_STATUSES[status]
        return (
          <div key={status} className="flex flex-col gap-2">
            <div className="flex items-center gap-2 px-1">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: st.color }} />
              <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: st.color }}>
                {st.label}
              </span>
            </div>
            {group.map(s => <SubCard key={s.id} sub={s} onRemove={remove} onUpdate={update} />)}
          </div>
        )
      })}
    </div>
  )
}
