import { useState } from 'react'
import { useJobs, JOB_STATUSES } from '../hooks/useJobs'
import { Plus, Trash2, ExternalLink, ChevronDown, ChevronUp, Edit2, Check } from 'lucide-react'

const STATUS_ORDER = ['wishlist', 'applied', 'interview', 'offer', 'rejected']

export default function Jobs() {
  const { jobs, byStatus, addJob, updateJob, removeJob, setStatus } = useJobs()
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({ title: '', company: '', location: 'Reykjavík', salary: '', url: '', status: 'wishlist' })
  const [expandedId, setExpandedId] = useState(null)
  const [editingId, setEditingId] = useState(null)

  function handleAdd(e) {
    e.preventDefault()
    if (!form.title || !form.company) return
    addJob(form)
    setForm({ title: '', company: '', location: 'Reykjavík', salary: '', url: '', status: 'wishlist' })
    setAdding(false)
  }

  const activeJobs = jobs.filter(j => j.status !== 'rejected')
  const rejectedJobs = jobs.filter(j => j.status === 'rejected')

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      {/* Header */}
      <div className="px-1 pt-2 flex items-center justify-between">
        <div>
          <div className="text-xl font-bold">💼 Starf</div>
          <div className="text-sm" style={{ color: 'var(--muted)' }}>{jobs.length} starf skráð</div>
        </div>
        <div className="flex gap-2">
          <a
            href="https://alfred.is"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost text-xs"
            style={{ padding: '6px 10px' }}
          >
            Alfred.is <ExternalLink size={11} />
          </a>
          <button
            onClick={() => setAdding(a => !a)}
            className="btn btn-primary text-xs"
            style={{ padding: '6px 12px' }}
          >
            <Plus size={14} /> Bæta við
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-2">
        {['applied', 'interview', 'offer', 'rejected'].map(s => {
          const info = JOB_STATUSES[s]
          const count = byStatus[s]?.length || 0
          return (
            <div key={s} className="card-sm text-center" style={{ padding: '10px 8px' }}>
              <div className="text-lg">{info.emoji}</div>
              <div className="text-lg font-bold" style={{ color: info.color }}>{count}</div>
              <div className="text-xs" style={{ color: 'var(--muted)' }}>{info.label}</div>
            </div>
          )
        })}
      </div>

      {/* Quick links */}
      <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {[
          { label: 'Alfred.is 🇮🇸', url: 'https://alfred.is' },
          { label: 'LinkedIn 💼', url: 'https://linkedin.com/jobs' },
          { label: 'HHR.is', url: 'https://hhr.is' },
          { label: 'Starfatorg', url: 'https://starfatorg.is' },
        ].map(l => (
          <a key={l.label} href={l.url} target="_blank" rel="noopener noreferrer"
             className="shrink-0 text-xs px-3 py-1.5 rounded-xl"
             style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--muted)', whiteSpace: 'nowrap' }}>
            {l.label}
          </a>
        ))}
      </div>

      {/* Add form */}
      {adding && (
        <div className="card">
          <div className="text-sm font-semibold mb-3">Nýtt starf</div>
          <form onSubmit={handleAdd} className="flex flex-col gap-2">
            <input className="input" placeholder="Starfstitill *" value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
            <input className="input" placeholder="Fyrirtæki *" value={form.company}
              onChange={e => setForm(f => ({ ...f, company: e.target.value }))} required />
            <div className="grid grid-cols-2 gap-2">
              <input className="input" placeholder="Staðsetning" value={form.location}
                onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
              <input className="input" placeholder="Laun (kr/£)" value={form.salary}
                onChange={e => setForm(f => ({ ...f, salary: e.target.value }))} />
            </div>
            <input className="input" placeholder="Hlekkur (valfrjálst)" value={form.url}
              onChange={e => setForm(f => ({ ...f, url: e.target.value }))} type="url" />
            <select className="input" value={form.status}
              onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
              {STATUS_ORDER.filter(s => s !== 'rejected').map(s => (
                <option key={s} value={s}>{JOB_STATUSES[s].emoji} {JOB_STATUSES[s].label}</option>
              ))}
            </select>
            <div className="flex gap-2 mt-1">
              <button type="submit" className="btn btn-primary flex-1">Vista</button>
              <button type="button" className="btn btn-ghost" onClick={() => setAdding(false)}>Hætta við</button>
            </div>
          </form>
        </div>
      )}

      {/* Empty state */}
      {jobs.length === 0 && !adding && (
        <div className="card text-center py-8">
          <div className="text-4xl mb-3">🎯</div>
          <div className="font-semibold mb-1">Byrjaðu að rekja starfsumsóknir</div>
          <div className="text-sm" style={{ color: 'var(--muted)' }}>
            Haltu utan um öll störf á einum stað
          </div>
          <button onClick={() => setAdding(true)} className="btn btn-primary mt-4">
            <Plus size={14} /> Bæta við starfi
          </button>
        </div>
      )}

      {/* Active jobs */}
      {STATUS_ORDER.filter(s => s !== 'rejected').map(status => {
        const statusJobs = byStatus[status] || []
        if (statusJobs.length === 0) return null
        const info = JOB_STATUSES[status]
        return (
          <div key={status}>
            <div className="flex items-center gap-2 mb-2 px-1">
              <span>{info.emoji}</span>
              <span className="text-sm font-semibold">{info.label}</span>
              <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: info.color + '22', color: info.color }}>
                {statusJobs.length}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              {statusJobs.map(job => (
                <JobCard
                  key={job.id}
                  job={job}
                  expanded={expandedId === job.id}
                  editing={editingId === job.id}
                  onToggle={() => setExpandedId(id => id === job.id ? null : job.id)}
                  onEdit={() => setEditingId(id => id === job.id ? null : job.id)}
                  onUpdate={updates => { updateJob(job.id, updates); setEditingId(null) }}
                  onRemove={() => removeJob(job.id)}
                  onStatus={s => setStatus(job.id, s)}
                />
              ))}
            </div>
          </div>
        )
      })}

      {/* Rejected (collapsed) */}
      {rejectedJobs.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2 px-1">
            <span>❌</span>
            <span className="text-sm font-semibold">Hafnað</span>
            <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: '#ef444422', color: '#ef4444' }}>
              {rejectedJobs.length}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            {rejectedJobs.map(job => (
              <JobCard
                key={job.id}
                job={job}
                expanded={expandedId === job.id}
                editing={editingId === job.id}
                onToggle={() => setExpandedId(id => id === job.id ? null : job.id)}
                onEdit={() => setEditingId(id => id === job.id ? null : job.id)}
                onUpdate={updates => { updateJob(job.id, updates); setEditingId(null) }}
                onRemove={() => removeJob(job.id)}
                onStatus={s => setStatus(job.id, s)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function JobCard({ job, expanded, editing, onToggle, onEdit, onUpdate, onRemove, onStatus }) {
  const [notes, setNotes] = useState(job.notes || '')
  const info = JOB_STATUSES[job.status]

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      {/* Main row */}
      <div className="flex items-center gap-3 px-4 py-3" onClick={onToggle} style={{ cursor: 'pointer' }}>
        <span className="text-lg shrink-0">{info.emoji}</span>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold truncate">{job.title}</div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>
            {job.company} {job.location ? `· ${job.location}` : ''} {job.salary ? `· ${job.salary}` : ''}
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {job.url && (
            <a href={job.url} target="_blank" rel="noopener noreferrer"
               onClick={e => e.stopPropagation()}
               className="p-1 rounded-lg" style={{ color: 'var(--muted)' }}>
              <ExternalLink size={13} />
            </a>
          )}
          {expanded ? <ChevronUp size={14} style={{ color: 'var(--muted)' }} /> : <ChevronDown size={14} style={{ color: 'var(--muted)' }} />}
        </div>
      </div>

      {/* Expanded */}
      {expanded && (
        <div style={{ borderTop: '1px solid var(--border)' }}>
          {/* Status buttons */}
          <div className="flex flex-wrap gap-1.5 px-4 py-3">
            {STATUS_ORDER.map(s => {
              const si = JOB_STATUSES[s]
              const active = job.status === s
              return (
                <button
                  key={s}
                  onClick={() => onStatus(s)}
                  className="text-xs px-2.5 py-1 rounded-lg transition-all"
                  style={{
                    background: active ? si.color + '25' : 'var(--surface2)',
                    color: active ? si.color : 'var(--muted)',
                    border: `1px solid ${active ? si.color + '50' : 'transparent'}`,
                  }}
                >
                  {si.emoji} {si.label}
                </button>
              )
            })}
          </div>

          {/* Notes */}
          <div className="px-4 pb-3">
            <textarea
              className="input resize-none text-xs"
              rows={3}
              placeholder="Minnisblöð um þetta starf..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              onBlur={() => onUpdate({ notes })}
              style={{ fontSize: 12, lineHeight: 1.5 }}
            />
          </div>

          {/* Delete */}
          <div className="px-4 pb-3 flex justify-end">
            <button onClick={onRemove} className="btn btn-danger" style={{ fontSize: 12, padding: '6px 12px' }}>
              <Trash2 size={12} /> Eyða
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
