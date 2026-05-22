import { useState } from 'react'
import { useJobs, JOB_STATUSES, STATUS_META } from '../hooks/useJobs'
import { Plus, Trash2, X, ExternalLink, ChevronDown } from 'lucide-react'

function StatusPill({ status, onClick }) {
  const m = STATUS_META[status] || STATUS_META['Sótt']
  return (
    <button onClick={onClick}
      className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium transition-all"
      style={{ background: m.bg, color: m.color }}>
      {m.icon} {status} <ChevronDown size={10} />
    </button>
  )
}

function JobCard({ job, onStatusChange, onRemove }) {
  const [showStatuses, setShowStatuses] = useState(false)
  const m = STATUS_META[job.status] || STATUS_META['Sótt']
  const daysAgo = Math.floor((Date.now() - new Date(job.appliedAt)) / (1000 * 60 * 60 * 24))

  return (
    <div className="card flex flex-col gap-2.5"
         style={{ borderLeft: `3px solid ${m.color}` }}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold">{job.role}</h3>
            {job.url && (
              <a href={job.url} target="_blank" rel="noopener noreferrer"
                 style={{ color: 'var(--muted)' }}>
                <ExternalLink size={12} />
              </a>
            )}
          </div>
          <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
            {job.company}
            {job.platform ? ` · ${job.platform}` : ''}
            {' · '}{daysAgo === 0 ? 'í dag' : `${daysAgo}d síðan`}
          </p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <div className="relative">
            <StatusPill status={job.status} onClick={() => setShowStatuses(v => !v)} />
            {showStatuses && (
              <div className="absolute right-0 top-full mt-1 z-20 rounded-xl overflow-hidden shadow-xl"
                   style={{ background: 'var(--surface)', border: '1px solid var(--border)', minWidth: 120 }}>
                {JOB_STATUSES.map(s => {
                  const sm = STATUS_META[s]
                  return (
                    <button key={s} onClick={() => { onStatusChange(job.id, s); setShowStatuses(false) }}
                      className="flex items-center gap-2 w-full px-3 py-2 text-xs text-left transition-all"
                      style={{
                        background: job.status === s ? sm.bg : 'transparent',
                        color: sm.color,
                      }}>
                      {sm.icon} {s}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
          <button onClick={() => onRemove(job.id)} style={{ color: 'var(--muted)', padding: 4 }}>
            <Trash2 size={13} />
          </button>
        </div>
      </div>
      {job.note && (
        <p className="text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>{job.note}</p>
      )}
    </div>
  )
}

export default function Jobs() {
  const { jobs, add, updateStatus, remove, active, archived, countByStatus } = useJobs()
  const [showForm, setShowForm] = useState(false)
  const [showArchived, setShowArchived] = useState(false)
  const [form, setForm] = useState({ company: '', role: '', url: '', platform: 'LinkedIn', note: '' })
  const [tab, setTab] = useState('active')

  const handleAdd = (e) => {
    e.preventDefault()
    if (!form.company.trim() || !form.role.trim()) return
    add(form)
    setForm({ company: '', role: '', url: '', platform: 'LinkedIn', note: '' })
    setShowForm(false)
  }

  const pipeline = JOB_STATUSES.filter(s => !['Hafnað', 'Samþykkt'].includes(s))

  return (
    <div className="flex flex-col gap-4 pb-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold">💼 Starfsleit</h1>
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
        {pipeline.map(s => {
          const m = STATUS_META[s]
          const count = countByStatus(s)
          return (
            <div key={s} className="card-sm flex flex-col items-center gap-1.5"
                 style={{ borderTop: `2px solid ${count > 0 ? m.color : 'var(--border)'}` }}>
              <span className="text-base">{m.icon}</span>
              <span className="text-lg font-bold" style={{ color: count > 0 ? m.color : 'var(--muted)' }}>
                {count}
              </span>
              <span className="text-xs text-center leading-tight" style={{ color: 'var(--muted)' }}>{s}</span>
            </div>
          )
        })}
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
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs" style={{ color: 'var(--muted)' }}>Fyrirtæki</label>
              <input className="input text-sm" placeholder="t.d. Alvotech" autoFocus
                value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs" style={{ color: 'var(--muted)' }}>Starf</label>
              <input className="input text-sm" placeholder="t.d. Þróunarfræðingur"
                value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs" style={{ color: 'var(--muted)' }}>Vettvangur</label>
              <select className="input text-sm"
                value={form.platform} onChange={e => setForm(f => ({ ...f, platform: e.target.value }))}>
                {['LinkedIn', 'Alfred.is', 'Starfsmannatorg', 'Visir.is', 'Annað'].map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs" style={{ color: 'var(--muted)' }}>Slóð (valkvæmt)</label>
              <input className="input text-sm" placeholder="https://..."
                value={form.url} onChange={e => setForm(f => ({ ...f, url: e.target.value }))} />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs" style={{ color: 'var(--muted)' }}>Minnismiði</label>
            <textarea className="input text-sm resize-none" rows={2} placeholder="Athugasemdir..."
              value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} />
          </div>
          <button type="submit" className="btn btn-primary w-full justify-center">
            <Plus size={16} /> Bæta við
          </button>
        </form>
      )}

      {/* Tabs */}
      <div className="flex gap-2">
        {[['active', `Virkar (${active.length})`], ['archived', `Skjalasafn (${archived.length})`]].map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)}
            className="btn text-sm flex-1 justify-center"
            style={{
              background: tab === t ? 'rgba(0,212,170,0.12)' : 'var(--surface)',
              color: tab === t ? 'var(--accent)' : 'var(--muted)',
              border: `1px solid ${tab === t ? 'rgba(0,212,170,0.3)' : 'var(--border)'}`,
            }}>{l}</button>
        ))}
      </div>

      {/* Job list */}
      <div className="flex flex-col gap-3">
        {tab === 'active' && (
          active.length === 0 ? (
            <div className="card text-center py-10" style={{ color: 'var(--muted)' }}>
              <div className="text-3xl mb-2">💼</div>
              <p className="text-sm">Engar virkar umsóknir</p>
              <p className="text-xs mt-1">Bættu við þinni fyrstu umsókn</p>
            </div>
          ) : active.map(j => (
            <JobCard key={j.id} job={j} onStatusChange={updateStatus} onRemove={remove} />
          ))
        )}
        {tab === 'archived' && (
          archived.length === 0 ? (
            <div className="card text-center py-10" style={{ color: 'var(--muted)' }}>
              <p className="text-sm" style={{ color: 'var(--muted)' }}>Ekkert í skjalasafni</p>
            </div>
          ) : archived.map(j => (
            <JobCard key={j.id} job={j} onStatusChange={updateStatus} onRemove={remove} />
          ))
        )}
      </div>
    </div>
  )
}
