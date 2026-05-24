import { useState } from 'react'
import { usePackages, PACKAGE_STATUSES } from '../../hooks/usePackages'
import { Package, X, ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react'

export default function PackageWidget() {
  const { active, delivered, add, updateStatus, remove, packages } = usePackages()
  const [expanded, setExpanded] = useState(false)
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ name: '', tracking: '', carrier: '', note: '' })

  if (active.length === 0 && !showAdd) {
    return (
      <div className="card flex items-center gap-3 py-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
             style={{ background: 'rgba(59,130,246,0.1)' }}>
          <Package size={16} style={{ color: '#3b82f6' }} />
        </div>
        <div className="flex-1 text-sm" style={{ color: 'var(--muted)' }}>Engar sendingar í bið</div>
        <button onClick={() => setShowAdd(true)} className="text-xs" style={{ color: 'var(--accent)' }}>
          + Bæta við
        </button>
      </div>
    )
  }

  const handleAdd = (e) => {
    e.preventDefault()
    if (!form.name.trim()) return
    add(form.name, form.tracking, form.carrier, form.note)
    setForm({ name: '', tracking: '', carrier: '', note: '' })
    setShowAdd(false)
  }

  return (
    <div className="card flex flex-col gap-3">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-3 w-full text-left"
      >
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
             style={{ background: 'rgba(59,130,246,0.15)' }}>
          <Package size={16} style={{ color: '#3b82f6' }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium">
            {active.length} {active.length === 1 ? 'sending' : 'sendingar'} á leiðinni
          </div>
          <div className="text-xs truncate" style={{ color: 'var(--muted)' }}>
            {active[0]?.name}{active.length > 1 ? ` +${active.length - 1}` : ''}
          </div>
        </div>
        {expanded ? <ChevronUp size={16} style={{ color: 'var(--muted)' }} /> : <ChevronDown size={16} style={{ color: 'var(--muted)' }} />}
      </button>

      {expanded && (
        <div className="flex flex-col gap-2 animate-slide-up">
          {packages.map(pkg => {
            const status = PACKAGE_STATUSES.find(s => s.id === pkg.status) || PACKAGE_STATUSES[0]
            const isDone = pkg.status === 'delivered'
            return (
              <div key={pkg.id}
                   className="p-3 rounded-xl flex flex-col gap-2"
                   style={{ background: 'var(--surface2)', opacity: isDone ? 0.6 : 1 }}>
                <div className="flex items-start gap-2">
                  <span className="text-base mt-0.5">{status.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{pkg.name}</div>
                    {pkg.note && <div className="text-xs" style={{ color: 'var(--muted)' }}>{pkg.note}</div>}
                    {pkg.tracking && (
                      <div className="text-xs font-mono mt-0.5 truncate" style={{ color: 'var(--muted)' }}>
                        {pkg.carrier && `${pkg.carrier}: `}{pkg.tracking.slice(0, 20)}...
                      </div>
                    )}
                  </div>
                  <button onClick={() => remove(pkg.id)} style={{ color: 'var(--muted)', padding: 4 }}>
                    <Trash2 size={13} />
                  </button>
                </div>
                <div className="flex gap-1 flex-wrap">
                  {PACKAGE_STATUSES.map(s => (
                    <button key={s.id}
                      onClick={() => updateStatus(pkg.id, s.id)}
                      className="text-xs px-2 py-0.5 rounded-full transition-all"
                      style={{
                        background: pkg.status === s.id ? `${s.color}22` : 'var(--surface)',
                        color: pkg.status === s.id ? s.color : 'var(--muted)',
                        border: `1px solid ${pkg.status === s.id ? s.color + '44' : 'transparent'}`,
                        fontSize: 10,
                      }}>
                      {s.emoji} {s.label}
                    </button>
                  ))}
                </div>
              </div>
            )
          })}

          {showAdd ? (
            <form onSubmit={handleAdd} className="flex flex-col gap-2 p-3 rounded-xl" style={{ background: 'var(--surface2)' }}>
              <input className="input text-sm" placeholder="Nafn pöntunar..." value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))} autoFocus />
              <div className="grid grid-cols-2 gap-2">
                <input className="input text-xs" placeholder="Tracking #" value={form.tracking}
                  onChange={e => setForm(f => ({ ...f, tracking: e.target.value }))} />
                <input className="input text-xs" placeholder="Flutningsaðili" value={form.carrier}
                  onChange={e => setForm(f => ({ ...f, carrier: e.target.value }))} />
              </div>
              <input className="input text-xs" placeholder="Athugasemd (valkvæmt)" value={form.note}
                onChange={e => setForm(f => ({ ...f, note: e.target.value }))} />
              <div className="flex gap-2">
                <button type="submit" className="btn btn-primary flex-1 text-xs justify-center">Vista</button>
                <button type="button" onClick={() => setShowAdd(false)} className="btn btn-ghost text-xs px-3">
                  <X size={13} />
                </button>
              </div>
            </form>
          ) : (
            <button onClick={() => setShowAdd(true)}
              className="flex items-center gap-2 text-xs py-2 justify-center rounded-xl transition-all"
              style={{ background: 'var(--surface2)', color: 'var(--accent)' }}>
              <Plus size={13} /> Bæta við sendingu
            </button>
          )}
        </div>
      )}
    </div>
  )
}
