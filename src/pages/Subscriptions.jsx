import { useState } from 'react'
import { useSubscriptions, SUB_STATUS } from '../hooks/useSubscriptions'
import { formatISK, formatShortISK } from '../utils/currency'
import { Plus, X, AlertCircle, CheckCircle, PauseCircle, XCircle, Trash2 } from 'lucide-react'

function StatusIcon({ status }) {
  if (status === 'active') return <CheckCircle size={13} style={{ color: 'var(--success)', flexShrink: 0 }} />
  if (status === 'paused') return <PauseCircle size={13} style={{ color: '#f97316', flexShrink: 0 }} />
  if (status === 'failed') return <AlertCircle size={13} style={{ color: 'var(--danger)', flexShrink: 0 }} />
  if (status === 'warning') return <AlertCircle size={13} style={{ color: '#eab308', flexShrink: 0 }} />
  if (status === 'cancelled') return <XCircle size={13} style={{ color: 'var(--muted)', flexShrink: 0 }} />
  return null
}

export default function Subscriptions() {
  const { subs, add, remove, update, monthlyTotal, problematic } = useSubscriptions()
  const [tab, setTab] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [day, setDay] = useState('1')

  const handleAdd = (e) => {
    e.preventDefault()
    if (!name.trim() || !price) return
    add({
      name: name.trim(),
      icon: '📱',
      price: Number(price),
      billing: 'monthly',
      status: 'active',
      color: '#00d4aa',
      day: Number(day),
      note: '',
    })
    setName('')
    setPrice('')
    setDay('1')
    setShowForm(false)
  }

  const filtered = tab === 'active'
    ? subs.filter(s => s.status === 'active')
    : tab === 'problem'
    ? subs.filter(s => ['failed', 'paused', 'warning'].includes(s.status))
    : subs

  const yearlyTotal = monthlyTotal * 12

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold">Áskriftir</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            {formatShortISK(monthlyTotal)}/mán · {formatShortISK(yearlyTotal)}/ár
          </p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          <Plus size={16} /> Ný
        </button>
      </div>

      {/* Problem alert */}
      {problematic.length > 0 && (
        <div className="card flex flex-col gap-3"
             style={{ border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.05)' }}>
          <div className="flex items-center gap-2">
            <AlertCircle size={15} style={{ color: 'var(--danger)' }} />
            <span className="text-sm font-semibold" style={{ color: 'var(--danger)' }}>
              {problematic.length} áskrift þarf athygli
            </span>
          </div>
          <div className="flex flex-col gap-2">
            {problematic.map(s => (
              <div key={s.id} className="flex items-center justify-between">
                <span className="text-xs">{s.icon} {s.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs" style={{ color: SUB_STATUS[s.status]?.color }}>
                    {SUB_STATUS[s.status]?.label}
                  </span>
                  <button
                    onClick={() => update(s.id, { status: 'active', note: '' })}
                    className="text-xs px-2 py-0.5 rounded-lg"
                    style={{ background: 'rgba(0,212,170,0.15)', color: 'var(--accent)' }}>
                    Laga
                  </button>
                </div>
              </div>
            ))}
          </div>
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
          <input
            className="input text-sm"
            placeholder="Heiti (t.d. Netflix)"
            value={name}
            onChange={e => setName(e.target.value)}
            autoFocus
          />
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <label className="text-xs" style={{ color: 'var(--muted)' }}>Verð (ISK/mán)</label>
              <input
                className="input text-sm"
                type="number"
                placeholder="2500"
                value={price}
                onChange={e => setPrice(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs" style={{ color: 'var(--muted)' }}>Gjalddagi (dagur)</label>
              <input
                className="input text-sm"
                type="number"
                min={1}
                max={31}
                value={day}
                onChange={e => setDay(e.target.value)}
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary w-full justify-center">Bæta við</button>
        </form>
      )}

      {/* Summary */}
      <div className="card"
           style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.06), rgba(139,92,246,0.06))' }}>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <div className="text-xl font-semibold">{subs.filter(s => s.status === 'active').length}</div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>Virkar</div>
          </div>
          <div>
            <div className="text-xl font-semibold" style={{ color: problematic.length > 0 ? 'var(--danger)' : 'var(--text)' }}>
              {problematic.length}
            </div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>Vandamál</div>
          </div>
          <div>
            <div className="text-xl font-semibold">{formatShortISK(monthlyTotal)}</div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>á mánuði</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {[['all', 'Allar'], ['active', 'Virkar'], ['problem', '⚠️ Vandamál']].map(([t, l]) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="btn text-xs flex-1 justify-center"
            style={{
              background: tab === t ? 'rgba(0,212,170,0.12)' : 'var(--surface)',
              color: tab === t ? 'var(--accent)' : 'var(--muted)',
              border: `1px solid ${tab === t ? 'rgba(0,212,170,0.25)' : 'var(--border)'}`,
            }}>
            {l}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="flex flex-col gap-2">
        {filtered.length === 0 && (
          <div className="card text-center py-8" style={{ color: 'var(--muted)' }}>Engar áskriftir</div>
        )}
        {filtered.map(s => (
          <div
            key={s.id}
            className="card flex items-center gap-3 py-3"
            style={{ opacity: s.status === 'cancelled' ? 0.55 : 1 }}
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-base"
              style={{ background: `${s.color}22` }}
            >
              {s.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <StatusIcon status={s.status} />
                <span className="text-sm font-medium truncate">{s.name}</span>
              </div>
              <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                {formatISK(s.price)}/{s.billing === 'monthly' ? 'mán' : 'ár'}
                {s.day ? ` · ${s.day}. hvers mán.` : ''}
                {s.note ? ` · ${s.note}` : ''}
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <select
                value={s.status}
                onChange={e => update(s.id, { status: e.target.value })}
                style={{
                  background: 'var(--surface2)',
                  color: SUB_STATUS[s.status]?.color || 'var(--text)',
                  borderColor: 'var(--border)',
                  borderWidth: 1,
                  borderStyle: 'solid',
                  borderRadius: 8,
                  padding: '3px 6px',
                  fontSize: 11,
                  cursor: 'pointer',
                }}
              >
                {Object.entries(SUB_STATUS).map(([v, { label }]) => (
                  <option key={v} value={v}>{label}</option>
                ))}
              </select>
              <button onClick={() => remove(s.id)} style={{ color: 'var(--muted)' }}>
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
