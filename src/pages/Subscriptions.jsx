import { useState } from 'react'
import { useSubscriptions, SUB_CATEGORIES, toISK } from '../hooks/useSubscriptions'
import { formatISK, formatShortISK } from '../utils/currency'
import { Plus, Trash2, X, AlertTriangle, ToggleLeft, ToggleRight, TrendingDown } from 'lucide-react'

const CURRENCIES = ['ISK', 'USD', 'EUR', 'GBP', 'DKK']
const PERIODS = [
  { id: 'monthly', label: 'Mánaðarlegt' },
  { id: 'annual', label: 'Árlegt' },
]

function SubCard({ sub, onToggle, onRemove }) {
  const cat = SUB_CATEGORIES.find(c => c.id === sub.category) || SUB_CATEGORIES[7]
  const monthlyISK = toISK(sub.period === 'annual' ? sub.amount / 12 : sub.amount, sub.currency)

  return (
    <div className="card flex flex-col gap-2 py-3"
         style={{
           opacity: sub.active ? 1 : 0.55,
           borderColor: sub.alert ? 'rgba(239,68,68,0.35)' : 'var(--border)',
         }}>
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0"
             style={{ background: `${cat.color}1a` }}>
          {sub.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold truncate">{sub.name}</span>
            {!sub.active && (
              <span className="text-xs px-1.5 py-0.5 rounded shrink-0"
                    style={{ background: 'var(--surface2)', color: 'var(--muted)' }}>óvirk</span>
            )}
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-xs px-1.5 py-0.5 rounded-full"
                  style={{ background: `${cat.color}18`, color: cat.color }}>
              {cat.icon} {cat.label}
            </span>
            <span className="text-xs" style={{ color: 'var(--muted)' }}>
              {sub.amount > 0 ? `${sub.period === 'annual' ? sub.amount : sub.amount} ${sub.currency}/${sub.period === 'annual' ? 'ár' : 'mán'}` : 'Breytileg'}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <div className="text-sm font-bold" style={{ color: sub.active ? 'var(--text)' : 'var(--muted)' }}>
            {sub.amount > 0 ? formatShortISK(monthlyISK) : '—'}
          </div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>á mán</div>
        </div>
      </div>

      {sub.alert && (
        <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg"
             style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
          <AlertTriangle size={12} style={{ color: 'var(--danger)', shrink: 0 }} />
          <span className="text-xs" style={{ color: 'var(--danger)' }}>{sub.alert}</span>
        </div>
      )}

      {sub.note && (
        <div className="text-xs" style={{ color: 'var(--muted)' }}>{sub.note}</div>
      )}

      <div className="flex items-center gap-2 pt-1" style={{ borderTop: '1px solid var(--border)' }}>
        <button onClick={() => onToggle(sub.id)} className="flex items-center gap-1.5 text-xs flex-1"
                style={{ color: sub.active ? 'var(--success)' : 'var(--muted)' }}>
          {sub.active
            ? <ToggleRight size={16} style={{ color: 'var(--success)' }} />
            : <ToggleLeft size={16} style={{ color: 'var(--muted)' }} />}
          {sub.active ? 'Virk' : 'Óvirk'}
        </button>
        <button onClick={() => onRemove(sub.id)} className="p-1" style={{ color: 'var(--muted)' }}>
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  )
}

export default function Subscriptions() {
  const { subs, add, remove, toggle, monthlyISK, annualISK, alerts, byCategoryISK } = useSubscriptions()
  const [showForm, setShowForm] = useState(false)
  const [tab, setTab] = useState('list')
  const [form, setForm] = useState({
    name: '', icon: '📦', category: 'other',
    amount: '', currency: 'USD', period: 'monthly',
    note: '',
  })

  const monthly = monthlyISK()
  const annual = annualISK()
  const catISK = byCategoryISK()

  const handleAdd = (e) => {
    e.preventDefault()
    if (!form.name.trim() || isNaN(Number(form.amount))) return
    add({ ...form, amount: Number(form.amount) })
    setForm({ name: '', icon: '📦', category: 'other', amount: '', currency: 'USD', period: 'monthly', note: '' })
    setShowForm(false)
  }

  const activeSubs = subs.filter(s => s.active)
  const inactiveSubs = subs.filter(s => !s.active)

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold">Áskriftir</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            {activeSubs.length} virkar · {formatShortISK(monthly)}/mán
          </p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          <Plus size={16} /> Bæta við
        </button>
      </div>

      {/* Cost overview */}
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.08), rgba(0,212,170,0.06))' }}>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Mánaðarlegt</div>
            <div className="text-3xl font-semibold">{formatShortISK(monthly)}</div>
          </div>
          <div className="text-right">
            <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Árlegt</div>
            <div className="text-xl font-semibold" style={{ color: 'var(--accent2)' }}>{formatShortISK(annual)}</div>
          </div>
        </div>

        {/* Category breakdown */}
        {Object.keys(catISK).length > 0 && (
          <div className="flex flex-col gap-2">
            {SUB_CATEGORIES.filter(c => catISK[c.id] > 0).map(cat => {
              const pct = Math.round((catISK[cat.id] / monthly) * 100)
              return (
                <div key={cat.id} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-xs">
                    <span>{cat.icon} {cat.label}</span>
                    <span style={{ color: 'var(--muted)' }}>{formatShortISK(catISK[cat.id])} ({pct}%)</span>
                  </div>
                  <div className="h-1 rounded-full overflow-hidden" style={{ background: 'var(--surface2)' }}>
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: cat.color }} />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="card flex flex-col gap-2"
             style={{ border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.05)' }}>
          <div className="flex items-center gap-2">
            <AlertTriangle size={15} style={{ color: 'var(--danger)' }} />
            <span className="font-semibold text-sm" style={{ color: 'var(--danger)' }}>
              {alerts.length} viðvörun{alerts.length > 1 ? 'ar' : ''}
            </span>
          </div>
          {alerts.map(s => (
            <div key={s.id} className="flex items-center gap-2 text-sm">
              <span>{s.icon}</span>
              <span className="font-medium">{s.name}</span>
              <span className="text-xs" style={{ color: 'var(--muted)' }}>— {s.alert}</span>
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
            <input className="input text-sm" style={{ width: 48, padding: '10px 8px', textAlign: 'center' }}
                   placeholder="🎵" value={form.icon}
                   onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} />
            <input className="input text-sm flex-1" placeholder="Nafn áskriftar"
                   value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} autoFocus />
          </div>
          <div className="grid grid-cols-3 gap-2">
            {SUB_CATEGORIES.map(c => (
              <button key={c.id} type="button" onClick={() => setForm(f => ({ ...f, category: c.id }))}
                      className="flex flex-col items-center gap-0.5 py-2 rounded-xl text-xs transition-all"
                      style={{
                        background: form.category === c.id ? `${c.color}22` : 'var(--surface2)',
                        border: `1px solid ${form.category === c.id ? c.color + '55' : 'transparent'}`,
                        color: form.category === c.id ? c.color : 'var(--muted)',
                      }}>
                <span>{c.icon}</span>
                <span style={{ fontSize: 10 }}>{c.label}</span>
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input className="input text-sm flex-1" type="number" placeholder="Upphæð"
                   value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} />
            <select className="input text-sm" style={{ width: 80 }}
                    value={form.currency} onChange={e => setForm(f => ({ ...f, currency: e.target.value }))}>
              {CURRENCIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex gap-2">
            {PERIODS.map(p => (
              <button key={p.id} type="button" onClick={() => setForm(f => ({ ...f, period: p.id }))}
                      className="flex-1 py-2 rounded-xl text-xs font-medium transition-all"
                      style={{
                        background: form.period === p.id ? 'rgba(0,212,170,0.15)' : 'var(--surface2)',
                        color: form.period === p.id ? 'var(--accent)' : 'var(--muted)',
                        border: `1px solid ${form.period === p.id ? 'rgba(0,212,170,0.3)' : 'transparent'}`,
                      }}>
                {p.label}
              </button>
            ))}
          </div>
          <input className="input text-sm" placeholder="Athugasemd (valkvæmt)"
                 value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} />
          <button type="submit" className="btn btn-primary w-full justify-center">Bæta við</button>
        </form>
      )}

      {/* Tabs */}
      <div className="flex gap-2">
        {[['list', `Virkar (${activeSubs.length})`], ['inactive', `Óvirkar (${inactiveSubs.length})`]].map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)}
            className="btn text-sm flex-1 justify-center"
            style={{
              background: tab === t ? 'rgba(139,92,246,0.12)' : 'var(--surface)',
              color: tab === t ? 'var(--accent2)' : 'var(--muted)',
              border: `1px solid ${tab === t ? 'rgba(139,92,246,0.25)' : 'var(--border)'}`,
            }}>{l}</button>
        ))}
      </div>

      {/* List */}
      <div className="flex flex-col gap-3">
        {(tab === 'list' ? activeSubs : inactiveSubs).map(s => (
          <SubCard key={s.id} sub={s} onToggle={toggle} onRemove={remove} />
        ))}
        {(tab === 'list' ? activeSubs : inactiveSubs).length === 0 && (
          <div className="card text-center py-8" style={{ color: 'var(--muted)' }}>
            {tab === 'list' ? 'Engar virkar áskriftir' : 'Engar óvirkar áskriftir'}
          </div>
        )}
      </div>

      {/* Savings tip */}
      {inactiveSubs.length > 0 && tab === 'list' && (
        <div className="card flex items-start gap-3"
             style={{ background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.2)' }}>
          <TrendingDown size={16} style={{ color: 'var(--success)', marginTop: 2 }} />
          <div>
            <div className="text-sm font-semibold" style={{ color: 'var(--success)' }}>Sparnaðarábending</div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
              Þú hefur {inactiveSubs.length} óvirk{inactiveSubs.length > 1 ? 'ar' : 'a'} áskrift{inactiveSubs.length > 1 ? 'ir' : ''}.
              {' '}Ígrundaðu hvort þú þurfir þær. Smelltu á "Óvirkar" til að yfirfara.
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
