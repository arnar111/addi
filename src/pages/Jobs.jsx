import { useState } from 'react'
import { useJobs, JOB_STATUSES } from '../hooks/useJobs'
import { Plus, X, Trash2, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react'

function StatusBadge({ status }) {
  const s = JOB_STATUSES.find(j => j.id === status) || JOB_STATUSES[0]
  return (
    <span className="badge text-xs"
          style={{ background: `${s.color}22`, color: s.color, border: `1px solid ${s.color}44` }}>
      {s.icon} {s.label}
    </span>
  )
}

function AppCard({ app, onStatusChange, onRemove }) {
  const [expanded, setExpanded] = useState(false)
  const daysAgo = Math.floor((Date.now() - new Date(app.appliedAt)) / 86400000)

  return (
    <div className="card py-3 flex flex-col gap-2">
      <div className="flex items-start gap-2">
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm truncate">{app.company}</div>
          <div className="text-xs truncate" style={{ color: 'var(--muted)' }}>{app.role}</div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {app.url && (
            <a href={app.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--muted)' }}>
              <ExternalLink size={13} />
            </a>
          )}
          <button onClick={() => setExpanded(!expanded)} style={{ color: 'var(--muted)' }}>
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          <button onClick={() => onRemove(app.id)} style={{ color: 'var(--muted)' }}>
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <StatusBadge status={app.status} />
        <span className="text-xs" style={{ color: 'var(--muted)' }}>
          {daysAgo === 0 ? 'Í dag' : daysAgo === 1 ? 'Í gær' : `${daysAgo} dagar`}
        </span>
      </div>

      {expanded && (
        <div className="flex flex-col gap-2 pt-1" style={{ borderTop: '1px solid var(--border)' }}>
          {app.notes && (
            <p className="text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>{app.notes}</p>
          )}
          <div className="flex flex-wrap gap-1.5">
            {JOB_STATUSES.map(s => (
              <button key={s.id} onClick={() => onStatusChange(app.id, s.id)}
                className="text-xs px-2.5 py-1 rounded-lg transition-all"
                style={{
                  background: app.status === s.id ? `${s.color}22` : 'var(--surface2)',
                  color: app.status === s.id ? s.color : 'var(--muted)',
                  border: `1px solid ${app.status === s.id ? s.color + '44' : 'transparent'}`,
                }}>
                {s.icon} {s.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function Jobs() {
  const { applications, add, updateStatus, remove, stats } = useJobs()
  const [showForm, setShowForm] = useState(false)
  const [company, setCompany] = useState('')
  const [role, setRole] = useState('')
  const [url, setUrl] = useState('')
  const [notes, setNotes] = useState('')
  const [filter, setFilter] = useState('all')

  const handleAdd = e => {
    e.preventDefault()
    if (!company.trim() || !role.trim()) return
    add(company.trim(), role.trim(), url.trim(), notes.trim())
    setCompany('')
    setRole('')
    setUrl('')
    setNotes('')
    setShowForm(false)
  }

  const filtered = filter === 'all' ? applications : applications.filter(a => a.status === filter)
  const active = applications.filter(a => a.status !== 'rejected').length

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold">💼 Umsóknir</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            {active} virk{active === 1 ? '' : 'ar'} · {applications.length} samtals
          </p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          <Plus size={16} /> Ný
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2">
        {JOB_STATUSES.map(s => (
          <div key={s.id} className="card-sm flex flex-col items-center gap-0.5 py-3"
               style={{ borderColor: stats[s.id] > 0 ? `${s.color}44` : 'var(--border)' }}>
            <span className="text-lg">{s.icon}</span>
            <span className="text-xl font-bold" style={{ color: stats[s.id] > 0 ? s.color : 'var(--muted)' }}>
              {stats[s.id]}
            </span>
            <span className="text-xs text-center leading-tight" style={{ color: 'var(--muted)', fontSize: 10 }}>
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {/* Add form */}
      {showForm && (
        <form onSubmit={handleAdd} className="card flex flex-col gap-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Ný umsókn</h3>
            <button type="button" onClick={() => setShowForm(false)}>
              <X size={16} style={{ color: 'var(--muted)' }} />
            </button>
          </div>
          <input className="input" placeholder="Fyrirtæki *" value={company}
            onChange={e => setCompany(e.target.value)} autoFocus required />
          <input className="input" placeholder="Starfstitill *" value={role}
            onChange={e => setRole(e.target.value)} required />
          <input className="input" placeholder="Hlekkur (valkvæmt)" value={url}
            onChange={e => setUrl(e.target.value)} type="url" />
          <textarea className="input resize-none" rows={2} placeholder="Athugasemdir (valkvæmt)"
            value={notes} onChange={e => setNotes(e.target.value)} />
          <button type="submit" className="btn btn-primary w-full justify-center">Vista umsókn</button>
        </form>
      )}

      {/* Filter */}
      <div className="flex gap-1.5 overflow-x-auto pb-0.5" style={{ scrollbarWidth: 'none' }}>
        <button onClick={() => setFilter('all')}
          className="btn text-xs shrink-0 justify-center"
          style={{
            background: filter === 'all' ? 'rgba(0,212,170,0.12)' : 'var(--surface)',
            color: filter === 'all' ? 'var(--accent)' : 'var(--muted)',
            border: `1px solid ${filter === 'all' ? 'rgba(0,212,170,0.25)' : 'var(--border)'}`,
            padding: '6px 12px',
          }}>
          Allt ({applications.length})
        </button>
        {JOB_STATUSES.map(s => (
          <button key={s.id} onClick={() => setFilter(s.id)}
            className="btn text-xs shrink-0 justify-center"
            style={{
              background: filter === s.id ? `${s.color}22` : 'var(--surface)',
              color: filter === s.id ? s.color : 'var(--muted)',
              border: `1px solid ${filter === s.id ? s.color + '44' : 'var(--border)'}`,
              padding: '6px 12px',
            }}>
            {s.icon} {s.label} {stats[s.id] > 0 ? `(${stats[s.id]})` : ''}
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="card text-center py-10 flex flex-col items-center gap-2">
          <span className="text-4xl">💼</span>
          <div className="font-medium">Engar umsóknir</div>
          <div className="text-sm" style={{ color: 'var(--muted)' }}>
            {filter === 'all' ? 'Smelltu á "Ný" til að bæta við fyrstu umsókninni' : 'Engar umsóknir með þennan stöðu'}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map(app => (
            <AppCard key={app.id} app={app} onStatusChange={updateStatus} onRemove={remove} />
          ))}
        </div>
      )}
    </div>
  )
}
