import { useState } from 'react'
import { useJobs, JOB_STATUSES, JOB_SOURCES } from '../hooks/useJobs'
import { Plus, Trash2, X, ExternalLink, ChevronDown, ChevronUp, Edit2 } from 'lucide-react'

function JobCard({ job, onStatusChange, onRemove, onEditNote }) {
  const [expanded, setExpanded] = useState(false)
  const [editingNote, setEditingNote] = useState(false)
  const [noteText, setNoteText] = useState(job.notes)
  const status = JOB_STATUSES.find(s => s.id === job.status)

  const saveNote = () => {
    onEditNote(job.id, noteText)
    setEditingNote(false)
  }

  return (
    <div className="card flex flex-col gap-2"
         style={{ borderLeft: `3px solid ${status?.color || 'var(--border)'}` }}>
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm leading-tight">{job.title}</div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
            {job.company} · {job.source}
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{ background: `${status?.color}22`, color: status?.color }}>
            {status?.icon} {status?.label}
          </span>
        </div>
      </div>

      {/* Status pipeline */}
      <div className="flex gap-1 flex-wrap">
        {JOB_STATUSES.map(s => (
          <button key={s.id} onClick={() => onStatusChange(job.id, s.id)}
            className="text-xs px-2 py-0.5 rounded-lg transition-all"
            style={{
              background: job.status === s.id ? `${s.color}22` : 'var(--surface2)',
              color: job.status === s.id ? s.color : 'var(--muted)',
              border: `1px solid ${job.status === s.id ? s.color + '44' : 'transparent'}`,
              fontWeight: job.status === s.id ? 600 : 400,
            }}>{s.icon} {s.label}</button>
        ))}
      </div>

      {/* Expand for details */}
      <button onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1 text-xs"
        style={{ color: 'var(--muted)' }}>
        {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        {expanded ? 'Fela' : 'Nánar'}
        {job.notes && !expanded && (
          <span className="ml-1 truncate max-w-32" style={{ color: 'var(--muted)' }}>· {job.notes}</span>
        )}
      </button>

      {expanded && (
        <div className="flex flex-col gap-2 pt-1" style={{ borderTop: '1px solid var(--border)' }}>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>
            Sótt um {new Date(job.appliedAt).toLocaleDateString('is-IS', { month: 'long', day: 'numeric' })}
          </div>

          {editingNote ? (
            <div className="flex flex-col gap-2">
              <textarea className="input resize-none text-sm" rows={3}
                value={noteText} onChange={e => setNoteText(e.target.value)} autoFocus />
              <div className="flex gap-2">
                <button onClick={saveNote} className="btn btn-primary text-xs py-1.5 flex-1 justify-center">Vista</button>
                <button onClick={() => setEditingNote(false)} className="btn btn-ghost text-xs py-1.5"><X size={13} /></button>
              </div>
            </div>
          ) : (
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm flex-1" style={{ color: job.notes ? 'var(--text)' : 'var(--muted)' }}>
                {job.notes || 'Engar glósur ennþá...'}
              </p>
              <button onClick={() => setEditingNote(true)} style={{ color: 'var(--muted)' }}><Edit2 size={13} /></button>
            </div>
          )}

          <div className="flex items-center justify-between">
            {job.link ? (
              <a href={job.link} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs" style={{ color: 'var(--accent)' }}>
                <ExternalLink size={12} /> Opna auglýsingu
              </a>
            ) : <span />}
            <button onClick={() => onRemove(job.id)} className="btn btn-ghost text-xs py-1 px-2"
                    style={{ color: 'var(--danger)' }}>
              <Trash2 size={12} /> Eyða
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function Jobs() {
  const { jobs, add, updateStatus, updateNotes, remove, byStatus, active } = useJobs()
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState('active')
  const [form, setForm] = useState({ title: '', company: '', source: 'Alfred.is', link: '', notes: '', status: 'applied' })

  const handleAdd = (e) => {
    e.preventDefault()
    if (!form.title.trim() || !form.company.trim()) return
    add(form)
    setForm({ title: '', company: '', source: 'Alfred.is', link: '', notes: '', status: 'applied' })
    setShowForm(false)
  }

  const displayJobs = filter === 'active' ? active
    : filter === 'rejected' ? byStatus('rejected')
    : jobs

  const pipeline = JOB_STATUSES.filter(s => s.id !== 'rejected')
    .map(s => ({ ...s, count: byStatus(s.id).length }))

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold">Starfsleit</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            {active.length} virk umsókn{active.length !== 1 ? 'ir' : ''}
          </p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          <Plus size={16} /> Umsókn
        </button>
      </div>

      {/* Pipeline overview */}
      <div className="grid grid-cols-4 gap-2">
        {pipeline.map(s => (
          <div key={s.id} className="card py-3 flex flex-col items-center gap-1"
               style={{ borderColor: s.count > 0 ? s.color + '44' : 'var(--border)' }}>
            <span className="text-xl">{s.icon}</span>
            <span className="text-xl font-bold" style={{ color: s.count > 0 ? s.color : 'var(--muted)' }}>{s.count}</span>
            <span className="text-xs text-center leading-tight" style={{ color: 'var(--muted)' }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {[
          { label: 'Alfred.is', url: 'https://alfred.is', flag: '🇮🇸' },
          { label: 'LinkedIn', url: 'https://linkedin.com/jobs', flag: '💼' },
          { label: 'Glassdoor', url: 'https://glassdoor.com', flag: '🚪' },
        ].map(l => (
          <a key={l.label} href={l.url} target="_blank" rel="noopener noreferrer"
            className="btn btn-ghost text-xs py-1.5 shrink-0">
            {l.flag} {l.label} <ExternalLink size={11} />
          </a>
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
            <div>
              <label className="text-xs mb-1 block" style={{ color: 'var(--muted)' }}>Starfsheiti *</label>
              <input className="input text-sm" placeholder="t.d. Marketing Manager" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} autoFocus />
            </div>
            <div>
              <label className="text-xs mb-1 block" style={{ color: 'var(--muted)' }}>Fyrirtæki *</label>
              <input className="input text-sm" placeholder="t.d. Vodafone" value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} />
            </div>
          </div>

          <div>
            <label className="text-xs mb-1 block" style={{ color: 'var(--muted)' }}>Uppspretta</label>
            <div className="flex gap-1.5 flex-wrap">
              {JOB_SOURCES.map(s => (
                <button key={s} type="button" onClick={() => setForm(f => ({ ...f, source: s }))}
                  className="px-2.5 py-1 rounded-lg text-xs transition-all"
                  style={{
                    background: form.source === s ? 'rgba(0,212,170,0.15)' : 'var(--surface2)',
                    color: form.source === s ? 'var(--accent)' : 'var(--muted)',
                    border: `1px solid ${form.source === s ? 'rgba(0,212,170,0.3)' : 'transparent'}`,
                  }}>{s}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs mb-1 block" style={{ color: 'var(--muted)' }}>Hlekkur á auglýsingu</label>
            <input className="input text-sm" placeholder="https://..." value={form.link} onChange={e => setForm(f => ({ ...f, link: e.target.value }))} />
          </div>

          <div>
            <label className="text-xs mb-1 block" style={{ color: 'var(--muted)' }}>Glósur</label>
            <textarea className="input resize-none text-sm" rows={2} placeholder="Athugasemdir, umsagnarferli..." value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
          </div>

          <button type="submit" className="btn btn-primary w-full justify-center">Bæta við</button>
        </form>
      )}

      {/* Filter */}
      <div className="flex gap-2">
        {[['active', 'Virkar'], ['all', 'Allar'], ['rejected', 'Hafnað']].map(([f, l]) => (
          <button key={f} onClick={() => setFilter(f)}
            className="btn text-xs flex-1 justify-center py-1.5"
            style={{
              background: filter === f ? 'rgba(0,212,170,0.12)' : 'var(--surface)',
              color: filter === f ? 'var(--accent)' : 'var(--muted)',
              border: `1px solid ${filter === f ? 'rgba(0,212,170,0.25)' : 'var(--border)'}`,
            }}>{l}</button>
        ))}
      </div>

      {/* Job list */}
      <div className="flex flex-col gap-2">
        {displayJobs.length === 0 ? (
          <div className="card text-center py-8" style={{ color: 'var(--muted)' }}>
            {filter === 'rejected' ? 'Engar hafnaðar umsóknir' : 'Engar umsóknir ennþá'}
            <div className="text-xs mt-1">Bættu við fyrstu umsókninni þinni!</div>
          </div>
        ) : displayJobs.map(job => (
          <JobCard key={job.id} job={job} onStatusChange={updateStatus} onRemove={remove} onEditNote={updateNotes} />
        ))}
      </div>
    </div>
  )
}
