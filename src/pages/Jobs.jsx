import { useState } from 'react'
import { useJobs, JOB_STATUSES } from '../hooks/useJobs'
import { Plus, X, Trash2, ExternalLink, ChevronDown, Edit2, Check } from 'lucide-react'

const JOB_SITES = [
  { label: 'Alfred.is', url: 'https://alfred.is', emoji: '🇮🇸' },
  { label: 'LinkedIn', url: 'https://linkedin.com/jobs', emoji: '💼' },
  { label: 'Glassdoor', url: 'https://glassdoor.com/Job', emoji: '🚪' },
  { label: 'Alvotech', url: 'https://www.alvotech.com/careers', emoji: '🔬' },
]

function StatusBadge({ statusId }) {
  const s = JOB_STATUSES.find(s => s.id === statusId) || JOB_STATUSES[0]
  return (
    <span className="badge text-xs" style={{ background: `${s.color}22`, color: s.color }}>
      {s.label}
    </span>
  )
}

function JobCard({ job, onRemove, onUpdate }) {
  const [expanded, setExpanded] = useState(false)
  const [editingNotes, setEditingNotes] = useState(false)
  const [notes, setNotes] = useState(job.notes)

  const saveNotes = () => {
    onUpdate(job.id, { notes })
    setEditingNotes(false)
  }

  const daysSince = Math.floor((Date.now() - new Date(job.appliedAt)) / 86400000)

  return (
    <div className="card py-3 flex flex-col gap-2">
      <div className="flex items-start gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-sm">{job.company}</span>
            <StatusBadge statusId={job.status} />
          </div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{job.role}</div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
            Sótt fyrir {daysSince === 0 ? 'í dag' : `${daysSince} dögum`}
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {job.url && (
            <a href={job.url} target="_blank" rel="noopener noreferrer"
               className="p-1.5 rounded-lg" style={{ color: 'var(--muted)' }}>
              <ExternalLink size={13} />
            </a>
          )}
          <button onClick={() => setExpanded(!expanded)} className="p-1.5 rounded-lg" style={{ color: 'var(--muted)' }}>
            <ChevronDown size={13} style={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
          </button>
          <button onClick={() => onRemove(job.id)} className="p-1.5 rounded-lg" style={{ color: 'var(--muted)' }}>
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="flex flex-col gap-3 pt-2" style={{ borderTop: '1px solid var(--border)' }}>
          <div>
            <div className="text-xs mb-1.5 font-medium" style={{ color: 'var(--muted)' }}>Staða umsóknar</div>
            <div className="flex flex-wrap gap-1.5">
              {JOB_STATUSES.map(s => (
                <button key={s.id} onClick={() => onUpdate(job.id, { status: s.id })}
                        className="text-xs px-2.5 py-1 rounded-full transition-all"
                        style={{
                          background: job.status === s.id ? `${s.color}22` : 'var(--surface2)',
                          color: job.status === s.id ? s.color : 'var(--muted)',
                          border: `1px solid ${job.status === s.id ? s.color + '44' : 'transparent'}`,
                        }}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="text-xs font-medium" style={{ color: 'var(--muted)' }}>Athugasemdir</div>
              {!editingNotes && (
                <button onClick={() => setEditingNotes(true)} style={{ color: 'var(--accent)' }}>
                  <Edit2 size={11} />
                </button>
              )}
            </div>
            {editingNotes ? (
              <div className="flex flex-col gap-2">
                <textarea className="input text-xs resize-none" rows={3} value={notes}
                          onChange={e => setNotes(e.target.value)} autoFocus />
                <div className="flex gap-2">
                  <button onClick={saveNotes} className="btn btn-primary text-xs py-1.5 flex-1 justify-center">
                    <Check size={11} /> Vista
                  </button>
                  <button onClick={() => { setNotes(job.notes); setEditingNotes(false) }}
                          className="btn btn-ghost text-xs py-1.5"><X size={11} /></button>
                </div>
              </div>
            ) : (
              <p className="text-xs leading-relaxed" style={{ color: notes ? 'var(--text)' : 'var(--muted)' }}>
                {notes || 'Engar athugasemdir...'}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default function Jobs() {
  const { jobs, add, update, remove, stats } = useJobs()
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState('all')
  const [form, setForm] = useState({ company: '', role: '', url: '', notes: '' })

  const handleAdd = (e) => {
    e.preventDefault()
    if (!form.company || !form.role) return
    add(form.company, form.role, form.url, form.notes)
    setForm({ company: '', role: '', url: '', notes: '' })
    setShowForm(false)
  }

  const filtered = jobs.filter(j => {
    if (filter === 'active') return ['applied', 'screening', 'interview'].includes(j.status)
    if (filter === 'offer') return j.status === 'offer'
    if (filter === 'rejected') return j.status === 'rejected'
    return true
  })

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold">Starfsleit</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            {stats.total} umsóknir · {stats.active} í vinnslu
          </p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          <Plus size={16} /> Sækja
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { label: 'Sótt', value: stats.applied, color: '#3b82f6' },
          { label: 'Í vinnslu', value: stats.active, color: '#8b5cf6' },
          { label: 'Tilboð', value: stats.offers, color: '#22c55e' },
          { label: 'Hafnað', value: stats.rejected, color: '#ef4444' },
        ].map(s => (
          <div key={s.label} className="card text-center py-2.5 px-1">
            <div className="text-xl font-bold" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <div className="card">
        <h3 className="text-xs font-semibold mb-2.5" style={{ color: 'var(--muted)' }}>SKJÓTAR TENGLAR</h3>
        <div className="grid grid-cols-2 gap-2">
          {JOB_SITES.map(site => (
            <a key={site.label} href={site.url} target="_blank" rel="noopener noreferrer"
               className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
               style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text)' }}>
              <span>{site.emoji}</span>
              <span>{site.label}</span>
              <ExternalLink size={11} className="ml-auto" style={{ color: 'var(--muted)' }} />
            </a>
          ))}
        </div>
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
          <input className="input text-sm" placeholder="Fyrirtæki *" required
                 value={form.company} onChange={e => setForm(p => ({ ...p, company: e.target.value }))} />
          <input className="input text-sm" placeholder="Starfsheiti *" required
                 value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))} />
          <input className="input text-sm" placeholder="Slóð á auglýsingu (valkvæmt)"
                 type="url" value={form.url} onChange={e => setForm(p => ({ ...p, url: e.target.value }))} />
          <textarea className="input text-sm resize-none" rows={2} placeholder="Athugasemdir (valkvæmt)"
                    value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} />
          <button type="submit" className="btn btn-primary w-full justify-center">Bæta við umsókn</button>
        </form>
      )}

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {[
          ['all', 'Allt'],
          ['active', '🟣 Í vinnslu'],
          ['offer', '🟢 Tilboð'],
          ['rejected', '🔴 Hafnað'],
        ].map(([f, l]) => (
          <button key={f} onClick={() => setFilter(f)}
            className="btn shrink-0 text-xs py-1.5"
            style={{
              background: filter === f ? 'rgba(0,212,170,0.15)' : 'var(--surface)',
              color: filter === f ? 'var(--accent)' : 'var(--muted)',
              border: `1px solid ${filter === f ? 'rgba(0,212,170,0.3)' : 'var(--border)'}`,
            }}>{l}</button>
        ))}
      </div>

      {/* Job list */}
      {filtered.length === 0 ? (
        <div className="card text-center py-8" style={{ color: 'var(--muted)' }}>
          <div className="text-2xl mb-2">💼</div>
          <div className="text-sm">
            {jobs.length === 0 ? 'Engar umsóknir ennþá' : 'Engar umsóknir í þessum flokki'}
          </div>
          {jobs.length === 0 && (
            <div className="text-xs mt-1">Byrjaðu með því að bæta við fyrstu umsókn þinni</div>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map(j => (
            <JobCard key={j.id} job={j} onRemove={remove} onUpdate={update} />
          ))}
        </div>
      )}
    </div>
  )
}
