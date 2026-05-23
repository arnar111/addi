import { useState } from 'react'
import { Plus, Trash2, X, ExternalLink } from 'lucide-react'
import { useJobs, JOB_STATUSES, STATUS_COLORS } from '../hooks/useJobs'

function JobCard({ job, onRemove, onStatusChange }) {
  const date = new Date(job.createdAt)
  const dateStr = date.toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })
  const color = STATUS_COLORS[job.status]
  return (
    <div className="card flex flex-col gap-2 py-3">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-base font-bold"
             style={{ background: `${color}22`, color }}>
          {(job.company || 'C')[0].toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-semibold truncate">{job.title}</span>
            <span className="badge shrink-0 text-xs"
                  style={{ background: `${color}22`, color }}>
              {job.status}
            </span>
          </div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
            {job.company}{job.location ? ` · ${job.location}` : ''} · Sótt {dateStr}
          </div>
        </div>
      </div>

      {job.notes && (
        <div className="text-xs px-1" style={{ color: 'var(--muted)' }}>
          {job.notes}
        </div>
      )}

      <div className="flex items-center gap-2 flex-wrap pt-1" style={{ borderTop: '1px solid var(--border)' }}>
        {JOB_STATUSES.filter(s => s !== job.status).map(s => (
          <button key={s} onClick={() => onStatusChange(job.id, s)}
            className="text-xs px-2.5 py-1 rounded-lg"
            style={{ background: `${STATUS_COLORS[s]}15`, color: STATUS_COLORS[s] }}>
            → {s}
          </button>
        ))}
        {job.url && (
          <a href={job.url} target="_blank" rel="noopener noreferrer"
             className="text-xs px-2.5 py-1 rounded-lg flex items-center gap-1 ml-auto"
             style={{ background: 'var(--surface2)', color: 'var(--muted)', textDecoration: 'none' }}>
            <ExternalLink size={11} /> Opna
          </a>
        )}
        <button onClick={() => onRemove(job.id)} className="p-1" style={{ color: 'var(--muted)' }}>
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  )
}

export default function Jobs() {
  const { jobs, addJob, removeJob, updateStatus, byStatus, active, interviews } = useJobs()
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState('all')
  const [form, setForm] = useState({
    title: '', company: '', location: '', status: 'Sótt um', url: '', notes: '',
  })

  const statusGroups = byStatus()
  const handleAdd = (e) => {
    e.preventDefault()
    if (!form.title || !form.company) return
    addJob(form)
    setForm({ title: '', company: '', location: '', status: 'Sótt um', url: '', notes: '' })
    setShowForm(false)
  }

  const displayed = filter === 'all' ? jobs.filter(j => j.status !== 'Hafnað')
    : filter === 'Hafnað' ? jobs.filter(j => j.status === 'Hafnað')
    : jobs.filter(j => j.status === filter)

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold">Starf</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            {active.length} virk umsókn{active.length !== 1 ? 'ir' : ''} · {interviews.length} viðtöl
          </p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          <Plus size={16} /> Umsókn
        </button>
      </div>

      {/* Pipeline stats */}
      <div className="grid grid-cols-4 gap-2">
        {JOB_STATUSES.slice(0, 4).map(s => (
          <div key={s} className="flex flex-col items-center gap-1 py-3 rounded-2xl"
               style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <span className="text-xl font-bold" style={{ color: STATUS_COLORS[s] }}>
              {statusGroups[s]?.length || 0}
            </span>
            <span style={{ color: 'var(--muted)', fontSize: 9, textAlign: 'center' }}>{s}</span>
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
          <input className="input" placeholder="Titill starfs *" value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))} autoFocus required />
          <div className="grid grid-cols-2 gap-2">
            <input className="input" placeholder="Fyrirtæki *" value={form.company}
              onChange={e => setForm(f => ({ ...f, company: e.target.value }))} required />
            <input className="input" placeholder="Staðsetning" value={form.location}
              onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
          </div>
          <input className="input" placeholder="Hlekkur á auglýsingu" value={form.url}
            onChange={e => setForm(f => ({ ...f, url: e.target.value }))} />

          <div>
            <label className="text-xs mb-1.5 block" style={{ color: 'var(--muted)' }}>Staða</label>
            <div className="flex gap-1.5 flex-wrap">
              {JOB_STATUSES.map(s => (
                <button key={s} type="button" onClick={() => setForm(f => ({ ...f, status: s }))}
                  className="px-3 py-1.5 rounded-lg text-xs"
                  style={{
                    background: form.status === s ? `${STATUS_COLORS[s]}20` : 'var(--surface2)',
                    color: form.status === s ? STATUS_COLORS[s] : 'var(--muted)',
                    border: `1px solid ${form.status === s ? STATUS_COLORS[s] + '44' : 'transparent'}`,
                  }}>{s}</button>
              ))}
            </div>
          </div>

          <textarea className="input resize-none text-sm" rows={2} placeholder="Athugasemdir..."
            value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />

          <button type="submit" className="btn btn-primary w-full justify-center">Vista umsókn</button>
        </form>
      )}

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        <button onClick={() => setFilter('all')} className="btn shrink-0 text-xs py-1.5"
          style={{
            background: filter === 'all' ? 'rgba(0,212,170,0.15)' : 'var(--surface)',
            color: filter === 'all' ? 'var(--accent)' : 'var(--muted)',
            border: `1px solid ${filter === 'all' ? 'rgba(0,212,170,0.3)' : 'var(--border)'}`,
          }}>Virkar</button>
        {JOB_STATUSES.map(s => (
          <button key={s} onClick={() => setFilter(s)} className="btn shrink-0 text-xs py-1.5"
            style={{
              background: filter === s ? `${STATUS_COLORS[s]}20` : 'var(--surface)',
              color: filter === s ? STATUS_COLORS[s] : 'var(--muted)',
              border: `1px solid ${filter === s ? STATUS_COLORS[s] + '44' : 'var(--border)'}`,
            }}>
            {s} {statusGroups[s]?.length > 0 && `(${statusGroups[s].length})`}
          </button>
        ))}
      </div>

      {/* Job list */}
      <div className="flex flex-col gap-2">
        {displayed.length === 0 ? (
          <div className="card text-center py-8" style={{ color: 'var(--muted)' }}>
            Engar umsóknir enn 💼<br />
            <span style={{ fontSize: 12 }}>Bættu við fyrstu umsókninni!</span>
          </div>
        ) : displayed.map(j => (
          <JobCard key={j.id} job={j} onRemove={removeJob} onStatusChange={updateStatus} />
        ))}
      </div>

      {/* Quick links */}
      <div className="card flex flex-col gap-2">
        <h3 className="text-sm font-semibold mb-1">Leita að starfi</h3>
        {[
          { label: 'alfred.is', url: 'https://alfred.is', icon: '🇮🇸' },
          { label: 'LinkedIn Jobs', url: 'https://www.linkedin.com/jobs/', icon: '💼' },
          { label: 'Víðsjá', url: 'https://vidsja.is', icon: '🔍' },
        ].map(({ label, url, icon }) => (
          <a key={url} href={url} target="_blank" rel="noopener noreferrer"
             className="flex items-center gap-3 py-2 px-1"
             style={{ borderBottom: '1px solid var(--border)', textDecoration: 'none', color: 'var(--text)' }}>
            <span className="text-base">{icon}</span>
            <span className="flex-1 text-sm">{label}</span>
            <ExternalLink size={13} style={{ color: 'var(--muted)' }} />
          </a>
        ))}
      </div>
    </div>
  )
}
