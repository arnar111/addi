import { useState } from 'react'
import { useJobs, JOB_STATUSES } from '../hooks/useJobs'
import { Plus, X, Trash2, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react'

function JobCard({ job, onUpdateStatus, onUpdateNotes, onRemove }) {
  const [expanded, setExpanded] = useState(false)
  const [editingNotes, setEditingNotes] = useState(false)
  const [notesVal, setNotesVal] = useState(job.notes)
  const st = JOB_STATUSES.find(s => s.id === job.status) || JOB_STATUSES[1]
  const initial = job.company.charAt(0).toUpperCase()

  const saveNotes = () => {
    onUpdateNotes(job.id, notesVal)
    setEditingNotes(false)
  }

  return (
    <div className="card flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0"
          style={{ background: `${st.color}22`, color: st.color }}>
          {initial}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium truncate">{job.role}</div>
          <div className="text-xs flex items-center gap-1.5" style={{ color: 'var(--muted)' }}>
            <span className="truncate">{job.company}</span>
            {job.location && <><span>·</span><span className="truncate">{job.location}</span></>}
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {job.url && (
            <a href={job.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--muted)' }}>
              <ExternalLink size={13} />
            </a>
          )}
          <button onClick={() => setExpanded(!expanded)} style={{ color: 'var(--muted)' }}>
            {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>
          <button onClick={() => onRemove(job.id)} style={{ color: 'var(--muted)' }}>
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Status pills */}
      <div className="flex gap-1 flex-wrap">
        {JOB_STATUSES.map(s => (
          <button key={s.id} onClick={() => onUpdateStatus(job.id, s.id)}
            className="px-2 py-0.5 rounded-full text-xs font-medium transition-all"
            style={{
              background: job.status === s.id ? `${s.color}22` : 'var(--surface2)',
              color: job.status === s.id ? s.color : 'var(--muted)',
              border: `1px solid ${job.status === s.id ? s.color + '44' : 'transparent'}`,
            }}>
            {s.emoji} {s.label}
          </button>
        ))}
      </div>

      {expanded && (
        <div className="flex flex-col gap-2 pt-1 border-t" style={{ borderColor: 'var(--border)' }}>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>
            Sótt um: {new Date(job.appliedDate).toLocaleDateString('is-IS', { month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
          {editingNotes ? (
            <div className="flex flex-col gap-2">
              <textarea className="input text-xs resize-none" rows={3}
                value={notesVal} onChange={e => setNotesVal(e.target.value)}
                placeholder="Minnisblöð um þessa umsókn..." />
              <div className="flex gap-2">
                <button onClick={saveNotes} className="btn btn-primary text-xs py-1.5 px-3">Vista</button>
                <button onClick={() => { setNotesVal(job.notes); setEditingNotes(false) }}
                  className="btn btn-ghost text-xs py-1.5 px-3">Hætta við</button>
              </div>
            </div>
          ) : (
            <button onClick={() => setEditingNotes(true)} className="text-left"
              style={{ color: job.notes ? 'var(--text)' : 'var(--muted)' }}>
              <span className="text-xs">{job.notes || '+ Bæta við minnisblöðum...'}</span>
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default function Jobs() {
  const { jobs, addJob, updateStatus, updateNotes, removeJob, byStatus, stats } = useJobs()
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState('all')
  const [form, setForm] = useState({
    company: '', role: '', url: '', location: '', notes: '', status: 'applied',
  })

  const s = stats()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.company.trim() || !form.role.trim()) return
    addJob({
      company: form.company.trim(),
      role: form.role.trim(),
      url: form.url.trim(),
      location: form.location.trim(),
      notes: form.notes.trim(),
      status: form.status,
    })
    setForm({ company: '', role: '', url: '', location: '', notes: '', status: 'applied' })
    setShowForm(false)
  }

  const displayed = filter === 'all'
    ? jobs.filter(j => j.status !== 'rejected')
    : filter === 'rejected'
    ? byStatus('rejected')
    : byStatus(filter)

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold">Starfsleit</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            {s.active} virkar umsóknir
          </p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          <Plus size={16} /> Umsókn
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { label: 'Sótt um', val: byStatus('applied').length, color: '#3b82f6' },
          { label: 'Viðtal', val: s.interviews, color: '#f97316' },
          { label: 'Tilboð', val: s.offers, color: '#22c55e' },
          { label: 'Hafnað', val: s.rejected, color: '#ef4444' },
        ].map(stat => (
          <div key={stat.label} className="card-sm text-center">
            <div className="text-xl font-bold" style={{ color: stat.color }}>{stat.val}</div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Add form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="card flex flex-col gap-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Ný umsókn</h3>
            <button type="button" onClick={() => setShowForm(false)}><X size={16} style={{ color: 'var(--muted)' }} /></button>
          </div>
          <input className="input" placeholder="Fyrirtæki *" value={form.company}
            onChange={e => setForm(f => ({ ...f, company: e.target.value }))} autoFocus />
          <input className="input" placeholder="Starf / Titill *" value={form.role}
            onChange={e => setForm(f => ({ ...f, role: e.target.value }))} />
          <div className="flex gap-2">
            <input className="input flex-1" placeholder="Staðsetning" value={form.location}
              onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
          </div>
          <input className="input text-sm" placeholder="Slóð á auglýsingu (valkvæmt)" value={form.url}
            onChange={e => setForm(f => ({ ...f, url: e.target.value }))} />
          <div className="flex gap-1.5 flex-wrap">
            {JOB_STATUSES.filter(s => s.id !== 'rejected').map(s => (
              <button key={s.id} type="button" onClick={() => setForm(f => ({ ...f, status: s.id }))}
                className="px-3 py-1.5 rounded-xl text-xs font-medium transition-all"
                style={{
                  background: form.status === s.id ? `${s.color}22` : 'var(--surface2)',
                  color: form.status === s.id ? s.color : 'var(--muted)',
                  border: `1px solid ${form.status === s.id ? s.color + '44' : 'transparent'}`,
                }}>
                {s.emoji} {s.label}
              </button>
            ))}
          </div>
          <textarea className="input text-sm resize-none" rows={2}
            placeholder="Minnisblöð (valkvæmt)"
            value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
          <button type="submit" className="btn btn-primary w-full justify-center">Skrá umsókn</button>
        </form>
      )}

      {/* Filter */}
      <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {[
          ['all', 'Allt virkt'],
          ...JOB_STATUSES.map(s => [s.id, `${s.emoji} ${s.label}`]),
        ].map(([f, l]) => (
          <button key={f} onClick={() => setFilter(f)}
            className="btn shrink-0 text-xs py-1.5"
            style={{
              background: filter === f ? 'rgba(139,92,246,0.15)' : 'var(--surface)',
              color: filter === f ? 'var(--accent2)' : 'var(--muted)',
              border: `1px solid ${filter === f ? 'rgba(139,92,246,0.3)' : 'var(--border)'}`,
            }}>{l}</button>
        ))}
      </div>

      {/* Job list */}
      {displayed.length === 0 ? (
        <div className="card text-center py-10" style={{ color: 'var(--muted)' }}>
          <div className="text-3xl mb-2">💼</div>
          <div className="text-sm">Engar umsóknir enn</div>
          <button onClick={() => setShowForm(true)} className="btn btn-primary mt-4 mx-auto">
            <Plus size={14} /> Skrá umsókn
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {displayed.map(j => (
            <JobCard key={j.id} job={j}
              onUpdateStatus={updateStatus}
              onUpdateNotes={updateNotes}
              onRemove={removeJob} />
          ))}
        </div>
      )}
    </div>
  )
}
