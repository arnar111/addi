import { useState } from 'react'
import { useJobs, JOB_STATUSES } from '../hooks/useJobs'
import { formatISK } from '../utils/currency'
import { Plus, Trash2, X, ExternalLink, ChevronDown } from 'lucide-react'

function StatusBadge({ status }) {
  const s = JOB_STATUSES.find(x => x.id === status) || JOB_STATUSES[0]
  return (
    <span className="badge" style={{ background: `${s.color}22`, color: s.color, border: `1px solid ${s.color}44` }}>
      {s.icon} {s.label}
    </span>
  )
}

function JobCard({ job, onStatusChange, onRemove }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="card flex flex-col gap-2">
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-sm">{job.company}</span>
            <StatusBadge status={job.status} />
          </div>
          <div className="text-sm mt-0.5" style={{ color: 'var(--muted)' }}>{job.role}</div>
          {job.salary && (
            <div className="text-xs mt-0.5" style={{ color: 'var(--accent)' }}>{formatISK(job.salary)}/mán</div>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {job.link && (
            <a href={job.link} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--muted)' }}>
              <ExternalLink size={14} />
            </a>
          )}
          <button onClick={() => setExpanded(!expanded)} style={{ color: 'var(--muted)' }}>
            <ChevronDown size={16} style={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--muted)' }}>
        {job.location && <span>📍 {job.location} · </span>}
        <span>{new Date(job.appliedAt).toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })}</span>
      </div>

      {expanded && (
        <div className="flex flex-col gap-3 pt-2 animate-slide-up" style={{ borderTop: '1px solid var(--border)' }}>
          {job.notes && (
            <p className="text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>{job.notes}</p>
          )}
          <div className="flex flex-wrap gap-1.5">
            {JOB_STATUSES.filter(s => s.id !== job.status).map(s => (
              <button key={s.id} onClick={() => onStatusChange(job.id, s.id)}
                className="btn text-xs py-1"
                style={{
                  background: `${s.color}15`,
                  color: s.color,
                  border: `1px solid ${s.color}33`,
                }}>
                {s.icon} {s.label}
              </button>
            ))}
          </div>
          <button onClick={() => onRemove(job.id)} className="btn btn-danger text-xs py-1.5 w-fit">
            <Trash2 size={12} /> Eyða
          </button>
        </div>
      )}
    </div>
  )
}

export default function Jobs() {
  const { jobs, add, updateStatus, remove, byStatus } = useJobs()
  const [showForm, setShowForm] = useState(false)
  const [tab, setTab] = useState('active')
  const [form, setForm] = useState({ company: '', role: '', salary: '', location: '', link: '', notes: '', status: 'sent' })

  const handleAdd = (e) => {
    e.preventDefault()
    if (!form.company.trim() || !form.role.trim()) return
    add(form)
    setForm({ company: '', role: '', salary: '', location: '', link: '', notes: '', status: 'sent' })
    setShowForm(false)
  }

  const sent = byStatus('sent')
  const interview = byStatus('interview')
  const offered = byStatus('offered')
  const rejected = byStatus('rejected')
  const archived = byStatus('archived')

  const displayed = tab === 'active'
    ? [...offered, ...interview, ...sent]
    : tab === 'rejected' ? rejected
    : archived

  const stats = [
    { label: 'Sent', count: sent.length, color: '#3b82f6' },
    { label: 'Viðtal', count: interview.length, color: '#f97316' },
    { label: 'Boð', count: offered.length, color: '#22c55e' },
    { label: 'Synjað', count: rejected.length, color: '#ef4444' },
  ]

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold">Starfsleit</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            {sent.length + interview.length + offered.length} virkar umsóknir
          </p>
        </div>
        <div className="flex gap-2">
          <a href="https://alfred.is" target="_blank" rel="noopener noreferrer"
            className="btn btn-ghost text-xs py-1.5">
            Alfred.is <ExternalLink size={12} />
          </a>
          <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
            <Plus size={16} /> Ný
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2">
        {stats.map(s => (
          <div key={s.label} className="card-sm flex flex-col items-center gap-0.5 py-3">
            <span className="text-xl font-bold" style={{ color: s.color }}>{s.count}</span>
            <span className="text-xs" style={{ color: 'var(--muted)' }}>{s.label}</span>
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
            <input className="input text-sm" placeholder="Fyrirtæki *" value={form.company}
              onChange={e => setForm(f => ({ ...f, company: e.target.value }))} autoFocus />
            <input className="input text-sm" placeholder="Starf *" value={form.role}
              onChange={e => setForm(f => ({ ...f, role: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input className="input text-sm" type="number" placeholder="Mánaðarlaun (ISK)" value={form.salary}
              onChange={e => setForm(f => ({ ...f, salary: e.target.value }))} />
            <input className="input text-sm" placeholder="Staður" value={form.location}
              onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
          </div>
          <input className="input text-sm" placeholder="Tengill (Alfred.is o.fl.)" value={form.link}
            onChange={e => setForm(f => ({ ...f, link: e.target.value }))} />
          <textarea className="input text-sm resize-none" rows={2} placeholder="Minnispunktar..."
            value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
          <div className="flex flex-wrap gap-1.5">
            {JOB_STATUSES.slice(0, 3).map(s => (
              <button key={s.id} type="button" onClick={() => setForm(f => ({ ...f, status: s.id }))}
                className="btn text-xs py-1"
                style={{
                  background: form.status === s.id ? `${s.color}22` : 'var(--surface2)',
                  color: form.status === s.id ? s.color : 'var(--muted)',
                  border: `1px solid ${form.status === s.id ? s.color + '44' : 'transparent'}`,
                }}>
                {s.icon} {s.label}
              </button>
            ))}
          </div>
          <button type="submit" className="btn btn-primary w-full justify-center">Skrá umsókn</button>
        </form>
      )}

      {/* Tabs */}
      <div className="flex gap-2">
        {[['active', 'Virkar'], ['rejected', 'Synjað'], ['archived', 'Geymt']].map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)}
            className="btn text-sm flex-1 justify-center"
            style={{
              background: tab === t ? 'rgba(0,212,170,0.12)' : 'var(--surface)',
              color: tab === t ? 'var(--accent)' : 'var(--muted)',
              border: `1px solid ${tab === t ? 'rgba(0,212,170,0.25)' : 'var(--border)'}`,
            }}>{l}</button>
        ))}
      </div>

      {/* Job list */}
      <div className="flex flex-col gap-3">
        {displayed.length === 0 ? (
          <div className="card text-center py-10" style={{ color: 'var(--muted)' }}>
            {tab === 'active' ? (
              <>
                <div className="text-3xl mb-2">💼</div>
                <div className="text-sm">Engar virkar umsóknir</div>
                <div className="text-xs mt-1">Farðu á Alfred.is til að finna störf</div>
              </>
            ) : 'Engar umsóknir hér'}
          </div>
        ) : displayed.map(j => (
          <JobCard key={j.id} job={j} onStatusChange={updateStatus} onRemove={remove} />
        ))}
      </div>
    </div>
  )
}
