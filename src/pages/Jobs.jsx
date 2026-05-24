import { useState } from 'react'
import { useJobs, JOB_STATUSES } from '../hooks/useJobs'
import { Plus, X, Trash2, ExternalLink, ChevronDown, ChevronUp, Edit2, Check } from 'lucide-react'

function JobCard({ job, onUpdate, onRemove }) {
  const [expanded, setExpanded] = useState(false)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ ...job })

  const status = JOB_STATUSES.find(s => s.id === job.status) || JOB_STATUSES[0]

  const save = () => {
    onUpdate(job.id, form)
    setEditing(false)
  }

  if (editing) {
    return (
      <div className="card flex flex-col gap-3 animate-slide-up">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm">Breyta umsókn</h3>
          <button onClick={() => setEditing(false)}><X size={16} style={{ color: 'var(--muted)' }} /></button>
        </div>
        <input className="input text-sm" placeholder="Fyrirtæki" value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} />
        <input className="input text-sm" placeholder="Titill" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
        <input className="input text-sm" placeholder="Laun (valkvæmt)" value={form.salary} onChange={e => setForm(f => ({ ...f, salary: e.target.value }))} />
        <input className="input text-sm" placeholder="Hlekkur á auglýsingu" value={form.url} onChange={e => setForm(f => ({ ...f, url: e.target.value }))} />
        <textarea className="input text-sm resize-none" rows={3} placeholder="Athugasemdir..." value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
        <div className="grid grid-cols-3 gap-2">
          {JOB_STATUSES.map(s => (
            <button key={s.id} type="button" onClick={() => setForm(f => ({ ...f, status: s.id }))}
              className="py-1.5 rounded-xl text-xs font-medium transition-all"
              style={{
                background: form.status === s.id ? `${s.color}22` : 'var(--surface2)',
                color: form.status === s.id ? s.color : 'var(--muted)',
                border: `1px solid ${form.status === s.id ? s.color + '55' : 'transparent'}`,
              }}>
              {s.icon} {s.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button onClick={save} className="btn btn-primary flex-1"><Check size={14} /> Vista</button>
          <button onClick={() => setEditing(false)} className="btn btn-ghost"><X size={14} /></button>
        </div>
      </div>
    )
  }

  return (
    <div className="card" style={{ borderColor: status.id === 'offer' ? 'rgba(34,197,94,0.4)' : 'var(--border)' }}>
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
             style={{ background: `${status.color}18` }}>
          {status.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm">{job.company}</div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{job.title}</div>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="badge text-xs" style={{ background: `${status.color}18`, color: status.color }}>
              {status.label}
            </span>
            <span className="text-xs" style={{ color: 'var(--muted)' }}>
              {new Date(job.date).toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })}
            </span>
            {job.salary && (
              <span className="text-xs" style={{ color: 'var(--success)' }}>💰 {job.salary}</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {job.url && (
            <a href={job.url} target="_blank" rel="noopener noreferrer"
               className="p-1.5 rounded-lg" style={{ color: 'var(--accent)' }}>
              <ExternalLink size={14} />
            </a>
          )}
          <button onClick={() => setEditing(true)} className="p-1.5 rounded-lg" style={{ color: 'var(--muted)' }}>
            <Edit2 size={14} />
          </button>
          <button onClick={() => setExpanded(!expanded)} className="p-1.5 rounded-lg" style={{ color: 'var(--muted)' }}>
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
      </div>

      {expanded && job.notes && (
        <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>{job.notes}</p>
        </div>
      )}

      {/* Status pipeline */}
      {expanded && (
        <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
          <div className="text-xs mb-2" style={{ color: 'var(--muted)' }}>Breyta stöðu:</div>
          <div className="flex gap-1.5 flex-wrap">
            {JOB_STATUSES.map(s => (
              <button key={s.id} onClick={() => onUpdate(job.id, { status: s.id })}
                className="text-xs py-1 px-2.5 rounded-lg transition-all"
                style={{
                  background: job.status === s.id ? `${s.color}22` : 'var(--surface2)',
                  color: job.status === s.id ? s.color : 'var(--muted)',
                  border: `1px solid ${job.status === s.id ? s.color + '44' : 'transparent'}`,
                }}>
                {s.icon} {s.label}
              </button>
            ))}
            <button onClick={() => onRemove(job.id)}
              className="text-xs py-1 px-2.5 rounded-lg ml-auto"
              style={{ color: 'var(--danger)', background: 'rgba(239,68,68,0.08)' }}>
              <Trash2 size={11} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function Jobs() {
  const { jobs, add, update, remove, byStatus, activeCount } = useJobs()
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState('all')
  const [form, setForm] = useState({ company: '', title: '', url: '', notes: '', salary: '', status: 'applied' })

  const statusMap = byStatus()

  const handleAdd = (e) => {
    e.preventDefault()
    if (!form.company.trim() || !form.title.trim()) return
    add(form.company, form.title, form.status, form.url, form.notes, form.salary)
    setForm({ company: '', title: '', url: '', notes: '', salary: '', status: 'applied' })
    setShowForm(false)
  }

  const filtered = filter === 'all'
    ? jobs.filter(j => j.status !== 'rejected')
    : jobs.filter(j => j.status === filter)

  const rejectedCount = jobs.filter(j => j.status === 'rejected').length

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold">Atvinnuleit</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>{activeCount} virkar umsóknir</p>
        </div>
        <div className="flex gap-2">
          <a href="https://alfred.is" target="_blank" rel="noopener noreferrer"
             className="btn btn-ghost text-xs py-2">
            <ExternalLink size={13} /> Alfred.is
          </a>
          <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
            <Plus size={16} /> Sækja um
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2">
        {JOB_STATUSES.map(s => (
          <div key={s.id} className="card-sm flex flex-col items-center gap-1 cursor-pointer"
               onClick={() => setFilter(s.id)}
               style={{ borderColor: filter === s.id ? `${s.color}44` : 'var(--border)' }}>
            <span className="text-lg">{s.icon}</span>
            <span className="text-lg font-bold" style={{ color: s.color }}>
              {(statusMap[s.id] || []).length}
            </span>
            <span className="text-center leading-tight" style={{ fontSize: 9, color: 'var(--muted)' }}>{s.label}</span>
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
            <input className="input text-sm" placeholder="Starfsheiti *" value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input className="input text-sm" placeholder="Laun (valkvæmt)" value={form.salary}
              onChange={e => setForm(f => ({ ...f, salary: e.target.value }))} />
            <input className="input text-sm" placeholder="Hlekkur á auglýsingu" value={form.url}
              onChange={e => setForm(f => ({ ...f, url: e.target.value }))} />
          </div>
          <textarea className="input text-sm resize-none" rows={2} placeholder="Athugasemdir..."
            value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
          <div className="grid grid-cols-3 gap-2">
            {JOB_STATUSES.slice(0, 3).map(s => (
              <button key={s.id} type="button" onClick={() => setForm(f => ({ ...f, status: s.id }))}
                className="py-1.5 rounded-xl text-xs font-medium"
                style={{
                  background: form.status === s.id ? `${s.color}22` : 'var(--surface2)',
                  color: form.status === s.id ? s.color : 'var(--muted)',
                  border: `1px solid ${form.status === s.id ? s.color + '55' : 'transparent'}`,
                }}>
                {s.icon} {s.label}
              </button>
            ))}
          </div>
          <button type="submit" className="btn btn-primary w-full justify-center">Bæta við umsókn</button>
        </form>
      )}

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        <button onClick={() => setFilter('all')} className="btn shrink-0 text-xs py-1.5"
          style={{ background: filter === 'all' ? 'rgba(0,212,170,0.15)' : 'var(--surface)', color: filter === 'all' ? 'var(--accent)' : 'var(--muted)', border: `1px solid ${filter === 'all' ? 'rgba(0,212,170,0.3)' : 'var(--border)'}` }}>
          Allt ({jobs.filter(j => j.status !== 'rejected').length})
        </button>
        {JOB_STATUSES.map(s => (
          <button key={s.id} onClick={() => setFilter(s.id)} className="btn shrink-0 text-xs py-1.5"
            style={{ background: filter === s.id ? `${s.color}18` : 'var(--surface)', color: filter === s.id ? s.color : 'var(--muted)', border: `1px solid ${filter === s.id ? s.color + '44' : 'var(--border)'}` }}>
            {s.icon} {s.label} ({(statusMap[s.id] || []).length})
          </button>
        ))}
      </div>

      {/* Job list */}
      <div className="flex flex-col gap-3">
        {filtered.length === 0 ? (
          <div className="card text-center py-8" style={{ color: 'var(--muted)' }}>
            <div className="text-2xl mb-2">💼</div>
            <div className="text-sm">Engar umsóknir í þessum flokki</div>
            <div className="text-xs mt-1">Skoðaðu Alfred.is og LinkedIn!</div>
          </div>
        ) : filtered.map(job => (
          <JobCard key={job.id} job={job} onUpdate={update} onRemove={remove} />
        ))}
      </div>

      {rejectedCount > 0 && filter === 'all' && (
        <button onClick={() => setFilter('rejected')} className="text-xs text-center py-2" style={{ color: 'var(--muted)' }}>
          {rejectedCount} hafnað umsóknir
        </button>
      )}

      {/* Tips */}
      <div className="card-sm" style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.2)' }}>
        <div className="text-xs font-semibold mb-2" style={{ color: '#8b5cf6' }}>💡 Leitarráð</div>
        <div className="flex flex-col gap-1.5">
          {[
            ['alfred.is', 'alfred.is', 'Íslensk störf'],
            ['linkedin.com/jobs', 'linkedin.com/jobs', 'LinkedIn Jobs'],
            ['glassdoor.com', 'glassdoor.com', 'Glassdoor – launaupplýsingar'],
          ].map(([href, label, desc]) => (
            <a key={href} href={`https://${href}`} target="_blank" rel="noopener noreferrer"
               className="flex items-center gap-2 text-xs">
              <span style={{ color: '#8b5cf6' }}>{label}</span>
              <span style={{ color: 'var(--muted)' }}>— {desc}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
