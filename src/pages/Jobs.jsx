import { useState } from 'react'
import { useJobs, JOB_STATUS_CONFIG, JOB_SOURCE_CONFIG } from '../hooks/useJobs'
import { Plus, Trash2, X, ExternalLink, ChevronDown, ChevronUp, Briefcase } from 'lucide-react'

function JobCard({ job, onRemove, onUpdateStatus, onUpdate }) {
  const [expanded, setExpanded] = useState(false)
  const [editNotes, setEditNotes] = useState(job.notes || '')
  const status = JOB_STATUS_CONFIG[job.status] || JOB_STATUS_CONFIG.sent
  const source = JOB_SOURCE_CONFIG[job.source] || JOB_SOURCE_CONFIG.other

  const initial = job.company ? job.company.charAt(0).toUpperCase() : '?'

  return (
    <div className="card flex flex-col gap-0" style={{ padding: 0, overflow: 'hidden' }}>
      <div className="flex items-start gap-3 p-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-bold text-base"
             style={{ background: `${status.color}18`, color: status.color }}>
          {initial}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm leading-tight">{job.role}</div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{job.company}</div>
          <div className="flex items-center gap-1.5 mt-2 flex-wrap">
            <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                  style={{ background: status.bg, color: status.color }}>
              {status.label}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{ background: `${source.color}18`, color: source.color }}>
              {source.label}
            </span>
            {job.salary && (
              <span className="text-xs" style={{ color: 'var(--muted)' }}>{job.salary}</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-0.5 shrink-0">
          {job.url && (
            <a href={job.url} target="_blank" rel="noopener noreferrer"
               className="p-2 rounded-lg transition-all" style={{ color: 'var(--muted)' }}
               onClick={e => e.stopPropagation()}>
              <ExternalLink size={14} />
            </a>
          )}
          <button onClick={() => setExpanded(!expanded)}
            className="p-2 rounded-lg transition-all" style={{ color: 'var(--muted)' }}>
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="flex flex-col gap-3 px-4 pb-4 animate-slide-up"
             style={{ borderTop: '1px solid var(--border)' }}>
          <div className="pt-3">
            <div className="text-xs font-semibold mb-2" style={{ color: 'var(--muted)' }}>Breyta stöðu</div>
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(JOB_STATUS_CONFIG).map(([id, s]) => (
                <button key={id} onClick={() => onUpdateStatus(job.id, id)}
                  className="text-xs px-2.5 py-1 rounded-lg font-medium transition-all"
                  style={{
                    background: job.status === id ? s.bg : 'var(--surface2)',
                    color: job.status === id ? s.color : 'var(--muted)',
                    border: `1px solid ${job.status === id ? s.color + '55' : 'transparent'}`,
                  }}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold mb-1.5" style={{ color: 'var(--muted)' }}>Minnisblöð</div>
            <textarea
              className="input text-xs resize-none"
              rows={2}
              value={editNotes}
              onChange={e => setEditNotes(e.target.value)}
              onBlur={() => onUpdate(job.id, { notes: editNotes })}
              placeholder="Bættu við minnisblöðum..."
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs" style={{ color: 'var(--muted)' }}>
              Sótt {new Date(job.appliedAt).toLocaleDateString('is-IS', { month: 'long', day: 'numeric' })}
            </span>
            <button onClick={() => onRemove(job.id)}
              className="flex items-center gap-1 text-xs py-1 px-2 rounded-lg"
              style={{ color: 'var(--danger)', background: 'rgba(239,68,68,0.08)' }}>
              <Trash2 size={11} /> Eyða
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

const FILTERS = [
  ['all', 'Allt'],
  ['sent', 'Sent'],
  ['interview', 'Viðtal'],
  ['offer', 'Tilboð'],
  ['rejected', 'Hafnað'],
]

const EMPTY_FORM = { company: '', role: '', source: 'linkedin', salary: '', url: '', notes: '' }

export default function Jobs() {
  const { jobs, add, update, updateStatus, remove, stats } = useJobs()
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState('all')
  const [form, setForm] = useState(EMPTY_FORM)

  const handleAdd = (e) => {
    e.preventDefault()
    if (!form.company.trim() || !form.role.trim()) return
    add(form)
    setForm(EMPTY_FORM)
    setShowForm(false)
  }

  const filtered = filter === 'all' ? jobs : jobs.filter(j => j.status === filter)

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold">Störf</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            {stats.active} virk · {stats.interviews} viðtöl · {stats.offers} tilboð
          </p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          <Plus size={16} /> Bæta við
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2">
        {[
          ['Samtals',  stats.total,      'var(--accent)'],
          ['Virk',     stats.active,     '#3b82f6'],
          ['Viðtöl',   stats.interviews, '#f97316'],
          ['Tilboð',   stats.offers,     '#22c55e'],
        ].map(([label, val, color]) => (
          <div key={label} className="card-sm flex flex-col items-center justify-center gap-0.5 py-3">
            <span className="text-2xl font-bold tabular-nums" style={{ color }}>{val}</span>
            <span className="text-xs" style={{ color: 'var(--muted)' }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Add form */}
      {showForm && (
        <form onSubmit={handleAdd} className="card flex flex-col gap-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-sm flex items-center gap-2">
              <Briefcase size={15} style={{ color: 'var(--accent)' }} /> Nýtt starf
            </span>
            <button type="button" onClick={() => setShowForm(false)}>
              <X size={16} style={{ color: 'var(--muted)' }} />
            </button>
          </div>
          <input className="input" placeholder="Fyrirtæki *"
            value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} autoFocus />
          <input className="input" placeholder="Starfsheiti *"
            value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} />
          <div className="grid grid-cols-2 gap-2">
            <input className="input text-sm" placeholder="Laun (valkvæmt)"
              value={form.salary} onChange={e => setForm(f => ({ ...f, salary: e.target.value }))} />
            <input className="input text-sm" placeholder="Slóð (valkvæmt)"
              value={form.url} onChange={e => setForm(f => ({ ...f, url: e.target.value }))} />
          </div>
          <div>
            <div className="text-xs mb-1.5 font-medium" style={{ color: 'var(--muted)' }}>Uppspretta</div>
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(JOB_SOURCE_CONFIG).map(([id, s]) => (
                <button key={id} type="button" onClick={() => setForm(f => ({ ...f, source: id }))}
                  className="text-xs px-2.5 py-1 rounded-lg font-medium transition-all"
                  style={{
                    background: form.source === id ? `${s.color}20` : 'var(--surface2)',
                    color: form.source === id ? s.color : 'var(--muted)',
                    border: `1px solid ${form.source === id ? s.color + '55' : 'transparent'}`,
                  }}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>
          <textarea className="input text-sm resize-none" rows={2}
            placeholder="Minnisblöð (valkvæmt)"
            value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
          <button type="submit" className="btn btn-primary w-full justify-center">Bæta við</button>
        </form>
      )}

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {FILTERS.map(([f, l]) => (
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

      {/* List */}
      <div className="flex flex-col gap-3">
        {filtered.length === 0 ? (
          <div className="card text-center py-10 flex flex-col items-center gap-3">
            <Briefcase size={32} style={{ color: 'var(--muted)', opacity: 0.4 }} />
            <div style={{ color: 'var(--muted)' }}>
              {jobs.length === 0
                ? 'Skráðu fyrstu umsóknina þína!'
                : 'Engar niðurstöður í þessum flokki'}
            </div>
          </div>
        ) : filtered.map(job => (
          <JobCard
            key={job.id}
            job={job}
            onRemove={remove}
            onUpdateStatus={updateStatus}
            onUpdate={update}
          />
        ))}
      </div>
    </div>
  )
}
