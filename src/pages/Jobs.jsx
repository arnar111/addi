import { useState } from 'react'
import { useJobs, JOB_STATUSES } from '../hooks/useJobs'
import { Plus, Trash2, X, ExternalLink, ChevronDown, ChevronUp, Edit2 } from 'lucide-react'

function StatusBadge({ status }) {
  const meta = JOB_STATUSES.find(s => s.id === status)
  if (!meta) return null
  return (
    <span className="badge" style={{ background: `${meta.color}22`, color: meta.color, border: `1px solid ${meta.color}33` }}>
      {meta.label}
    </span>
  )
}

function JobCard({ job, onStatusUpdate, onRemove }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="card flex flex-col gap-2 py-3">
      <div className="flex items-start gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold">{job.company}</span>
            <StatusBadge status={job.status} />
          </div>
          <div className="text-sm mt-0.5" style={{ color: 'var(--muted)' }}>{job.role}</div>
          <div className="flex items-center gap-3 mt-1 text-xs" style={{ color: 'var(--muted)' }}>
            {job.location && <span>📍 {job.location}</span>}
            <span>📅 {new Date(job.appliedDate).toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {job.link && (
            <a href={job.link} target="_blank" rel="noopener noreferrer"
               className="p-1.5 rounded-lg transition-all" style={{ color: 'var(--muted)' }}
               title="Opna auglýsingu">
              <ExternalLink size={14} />
            </a>
          )}
          <button onClick={() => setExpanded(!expanded)} style={{ color: 'var(--muted)', padding: '6px' }}>
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="flex flex-col gap-3 pt-2 animate-slide-up" style={{ borderTop: '1px solid var(--border)' }}>
          {job.notes && (
            <p className="text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>{job.notes}</p>
          )}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium" style={{ color: 'var(--muted)' }}>Uppfæra stöðu</label>
            <div className="flex flex-wrap gap-1.5">
              {JOB_STATUSES.map(s => (
                <button key={s.id} onClick={() => onStatusUpdate(job.id, s.id)}
                  className="text-xs py-1 px-2.5 rounded-lg transition-all"
                  style={{
                    background: job.status === s.id ? `${s.color}22` : 'var(--surface2)',
                    color: job.status === s.id ? s.color : 'var(--muted)',
                    border: `1px solid ${job.status === s.id ? s.color + '44' : 'transparent'}`,
                    fontWeight: job.status === s.id ? 600 : 400,
                  }}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>
          <button onClick={() => onRemove(job.id)}
            className="btn btn-danger self-start text-xs py-1.5 px-3">
            <Trash2 size={12} /> Eyða
          </button>
        </div>
      )}
    </div>
  )
}

export default function Jobs() {
  const { jobs, add, updateStatus, remove, byStatus, active } = useJobs()
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState('all')

  const [company, setCompany] = useState('')
  const [role, setRole] = useState('')
  const [location, setLocation] = useState('')
  const [link, setLink] = useState('')
  const [notes, setNotes] = useState('')
  const [appliedDate, setAppliedDate] = useState(new Date().toISOString().split('T')[0])

  const handleAdd = (e) => {
    e.preventDefault()
    if (!company.trim() || !role.trim()) return
    add({ company: company.trim(), role: role.trim(), location, link, notes, appliedDate })
    setCompany('')
    setRole('')
    setLocation('')
    setLink('')
    setNotes('')
    setShowForm(false)
  }

  const filtered = filter === 'all' ? jobs
    : filter === 'active' ? active
    : byStatus(filter)

  const counts = JOB_STATUSES.reduce((acc, s) => {
    acc[s.id] = byStatus(s.id).length
    return acc
  }, {})

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold">💼 Starf</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            {active.length} virkar umsóknir · {jobs.length} samtals
          </p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          <Plus size={16} /> Bæta við
        </button>
      </div>

      {/* Funnel stats */}
      <div className="grid grid-cols-4 gap-2">
        {JOB_STATUSES.slice(0, 4).map(s => (
          <div key={s.id} className="card-sm flex flex-col items-center gap-1 py-3"
               style={{ borderColor: counts[s.id] > 0 ? `${s.color}33` : 'var(--border)' }}>
            <span className="text-xl font-bold" style={{ color: counts[s.id] > 0 ? s.color : 'var(--muted)' }}>
              {counts[s.id]}
            </span>
            <span className="text-xs text-center leading-tight" style={{ color: 'var(--muted)' }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Add form */}
      {showForm && (
        <form onSubmit={handleAdd} className="card flex flex-col gap-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Ný umsókn</h3>
            <button type="button" onClick={() => setShowForm(false)}><X size={16} style={{ color: 'var(--muted)' }} /></button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <label className="text-xs" style={{ color: 'var(--muted)' }}>Fyrirtæki *</label>
              <input className="input text-sm" placeholder="Nafn fyrirtækis" value={company} onChange={e => setCompany(e.target.value)} required autoFocus />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs" style={{ color: 'var(--muted)' }}>Starf *</label>
              <input className="input text-sm" placeholder="Starfsheiti" value={role} onChange={e => setRole(e.target.value)} required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <label className="text-xs" style={{ color: 'var(--muted)' }}>Staðsetning</label>
              <input className="input text-sm" placeholder="Reykjavík..." value={location} onChange={e => setLocation(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs" style={{ color: 'var(--muted)' }}>Dagsetning</label>
              <input className="input text-sm" type="date" value={appliedDate} onChange={e => setAppliedDate(e.target.value)} />
            </div>
          </div>
          <input className="input text-sm" placeholder="Hlekkur á auglýsingu (valkvæmt)" value={link} onChange={e => setLink(e.target.value)} />
          <textarea className="input text-sm resize-none" rows={2} placeholder="Athugasemdir..." value={notes} onChange={e => setNotes(e.target.value)} />
          <div className="flex gap-2">
            <button type="submit" className="btn btn-primary flex-1">Bæta við</button>
            <button type="button" onClick={() => setShowForm(false)} className="btn btn-ghost"><X size={16} /></button>
          </div>
        </form>
      )}

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        <button onClick={() => setFilter('all')} className="btn shrink-0 text-xs py-1.5"
          style={{ background: filter === 'all' ? 'rgba(0,212,170,0.15)' : 'var(--surface)', color: filter === 'all' ? 'var(--accent)' : 'var(--muted)', border: `1px solid ${filter === 'all' ? 'rgba(0,212,170,0.3)' : 'var(--border)'}` }}>
          Allt ({jobs.length})
        </button>
        <button onClick={() => setFilter('active')} className="btn shrink-0 text-xs py-1.5"
          style={{ background: filter === 'active' ? 'rgba(0,212,170,0.15)' : 'var(--surface)', color: filter === 'active' ? 'var(--accent)' : 'var(--muted)', border: `1px solid ${filter === 'active' ? 'rgba(0,212,170,0.3)' : 'var(--border)'}` }}>
          Virkt ({active.length})
        </button>
        {JOB_STATUSES.map(s => counts[s.id] > 0 && (
          <button key={s.id} onClick={() => setFilter(s.id)} className="btn shrink-0 text-xs py-1.5"
            style={{ background: filter === s.id ? `${s.color}22` : 'var(--surface)', color: filter === s.id ? s.color : 'var(--muted)', border: `1px solid ${filter === s.id ? s.color + '44' : 'var(--border)'}` }}>
            {s.label} ({counts[s.id]})
          </button>
        ))}
      </div>

      {/* Job list */}
      <div className="flex flex-col gap-2">
        {filtered.length === 0 ? (
          <div className="card text-center py-8" style={{ color: 'var(--muted)' }}>
            {jobs.length === 0 ? 'Engar umsóknir ennþá — byrjaðu á að bæta við!' : 'Engar umsóknir í þessum flokki'}
          </div>
        ) : filtered.map(j => (
          <JobCard key={j.id} job={j} onStatusUpdate={updateStatus} onRemove={remove} />
        ))}
      </div>
    </div>
  )
}
