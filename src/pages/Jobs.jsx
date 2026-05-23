import { useState } from 'react'
import { useJobs, STATUSES, STATUS_LABEL, STATUS_COLOR } from '../hooks/useJobs'
import { Plus, X, ExternalLink, Trash2, ChevronDown, Briefcase } from 'lucide-react'

function JobCard({ job, onStatusChange, onRemove }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="card" style={{ borderLeft: `3px solid ${STATUS_COLOR[job.status]}` }}>
      <div className="flex items-start gap-3">
        <button className="flex-1 min-w-0 text-left" onClick={() => setOpen(o => !o)}>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-sm">{job.company}</span>
            <span className="badge text-xs"
                  style={{ background: `${STATUS_COLOR[job.status]}20`, color: STATUS_COLOR[job.status] }}>
              {STATUS_LABEL[job.status]}
            </span>
          </div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
            {job.role} · {new Date(job.date).toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })}
          </div>
        </button>
        <button onClick={() => setOpen(o => !o)} style={{ color: 'var(--muted)', padding: 4, shrink: 0 }}>
          <ChevronDown size={16}
            style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }} />
        </button>
      </div>

      {open && (
        <div className="mt-3 flex flex-col gap-3 animate-slide-up">
          {job.notes && (
            <p className="text-xs leading-relaxed px-3 py-2 rounded-xl"
               style={{ background: 'var(--surface2)', color: 'var(--muted)' }}>
              {job.notes}
            </p>
          )}
          <div>
            <div className="text-xs mb-2" style={{ color: 'var(--muted)' }}>Breyta stöðu:</div>
            <div className="flex gap-1.5 flex-wrap">
              {STATUSES.map(s => (
                <button key={s} onClick={() => onStatusChange(job.id, s)}
                  className="btn text-xs py-1 px-2.5"
                  style={{
                    background: job.status === s ? `${STATUS_COLOR[s]}22` : 'var(--surface2)',
                    color: job.status === s ? STATUS_COLOR[s] : 'var(--muted)',
                    border: `1px solid ${job.status === s ? STATUS_COLOR[s] + '55' : 'transparent'}`,
                  }}>
                  {STATUS_LABEL[s]}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 pt-1" style={{ borderTop: '1px solid var(--border)' }}>
            {job.url && (
              <a href={job.url} target="_blank" rel="noopener noreferrer"
                 className="btn btn-ghost text-xs flex-1 justify-center">
                <ExternalLink size={12} /> Opna auglýsingu
              </a>
            )}
            <button onClick={() => onRemove(job.id)} className="btn btn-danger text-xs">
              <Trash2 size={12} />
            </button>
          </div>
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
  const [url, setUrl] = useState('')
  const [notes, setNotes] = useState('')

  const handleAdd = (e) => {
    e.preventDefault()
    if (!company.trim() || !role.trim()) return
    add(company, role, url, notes)
    setCompany('')
    setRole('')
    setUrl('')
    setNotes('')
    setShowForm(false)
  }

  const counts = STATUSES.reduce((acc, s) => ({ ...acc, [s]: byStatus(s).length }), {})

  const filtered = filter === 'all' ? jobs
    : filter === 'active' ? active
    : byStatus(filter)

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold">Starfsleit</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            {active.length} virk · {counts.interview || 0} viðtal · {counts.offer || 0} boð
          </p>
        </div>
        <button onClick={() => setShowForm(s => !s)} className="btn btn-primary">
          <Plus size={16} /> Bæta við
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-2">
        {STATUSES.slice(0, 4).map(s => (
          <div key={s} className="card-sm flex flex-col items-center gap-1 py-2.5"
               style={{ border: `1px solid ${STATUS_COLOR[s]}28` }}>
            <span className="text-xl font-bold tabular-nums" style={{ color: STATUS_COLOR[s] }}>
              {counts[s] || 0}
            </span>
            <span style={{ fontSize: 10, color: 'var(--muted)', lineHeight: 1.2, textAlign: 'center' }}>
              {STATUS_LABEL[s]}
            </span>
          </div>
        ))}
      </div>

      {/* Add form */}
      {showForm && (
        <form onSubmit={handleAdd} className="card flex flex-col gap-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-sm">Ný umsókn</span>
            <button type="button" onClick={() => setShowForm(false)}>
              <X size={16} style={{ color: 'var(--muted)' }} />
            </button>
          </div>
          <input className="input" placeholder="Fyrirtæki *" value={company}
            onChange={e => setCompany(e.target.value)} autoFocus required />
          <input className="input" placeholder="Starfsheiti *" value={role}
            onChange={e => setRole(e.target.value)} required />
          <input className="input" placeholder="Slóð á auglýsingu (valkvæmt)" value={url}
            onChange={e => setUrl(e.target.value)} type="url" />
          <textarea className="input resize-none text-sm" rows={2}
            placeholder="Athugasemdir..." value={notes}
            onChange={e => setNotes(e.target.value)} />
          <button type="submit" className="btn btn-primary w-full justify-center">Vista umsókn</button>
        </form>
      )}

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {[
          ['all', 'Allt'],
          ['active', 'Virkar'],
          ...STATUSES.map(s => [s, STATUS_LABEL[s]]),
        ].map(([f, l]) => (
          <button key={f} onClick={() => setFilter(f)}
            className="btn shrink-0 text-xs py-1.5"
            style={{
              background: filter === f ? 'rgba(0,212,170,0.15)' : 'var(--surface)',
              color: filter === f ? 'var(--accent)' : 'var(--muted)',
              border: `1px solid ${filter === f ? 'rgba(0,212,170,0.3)' : 'var(--border)'}`,
            }}>
            {l}
          </button>
        ))}
      </div>

      {/* Job list */}
      {filtered.length === 0 ? (
        <div className="card text-center py-12 flex flex-col items-center gap-3">
          <Briefcase size={36} style={{ color: 'var(--border)' }} />
          <div>
            <p className="text-sm font-medium">Engar umsóknir ennþá</p>
            <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
              Byrjaðu að fylgjast með starfsumsóknum þínum hér
            </p>
          </div>
          <button onClick={() => setShowForm(true)} className="btn btn-primary">
            <Plus size={14} /> Bæta við fyrstu umsókninni
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map(job => (
            <JobCard key={job.id} job={job} onStatusChange={updateStatus} onRemove={remove} />
          ))}
        </div>
      )}
    </div>
  )
}
