import { useState } from 'react'
import { Plus, X, Trash2, ExternalLink, ChevronDown, Briefcase, TrendingUp } from 'lucide-react'
import { useJobs, JOB_STATUSES } from '../hooks/useJobs'

const EMPTY_FORM = { company: '', role: '', location: 'Reykjavík', salary: '', status: 'spotted', notes: '', url: '' }

function StatusBadge({ status }) {
  const s = JOB_STATUSES.find(x => x.id === status) || JOB_STATUSES[0]
  return (
    <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
          style={{ background: s.bg, color: s.color }}>
      {s.label}
    </span>
  )
}

function JobCard({ job, onUpdate, onRemove }) {
  const [expanded, setExpanded] = useState(false)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState(job)

  const save = () => { onUpdate(job.id, form); setEditing(false) }

  return (
    <div className="card" style={{ border: '1px solid var(--border)' }}>
      <div className="flex items-start gap-3 cursor-pointer" onClick={() => !editing && setExpanded(e => !e)}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
             style={{ background: 'var(--surface2)' }}>
          🏢
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-sm">{job.role || 'Role?'}</span>
            <StatusBadge status={job.status} />
          </div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
            {job.company} · {job.location}
            {job.salary && <> · <span style={{ color: 'var(--accent)' }}>{job.salary}</span></>}
          </div>
        </div>
        <ChevronDown size={16} style={{ color: 'var(--muted)', transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }} />
      </div>

      {expanded && !editing && (
        <div className="mt-3 pt-3 flex flex-col gap-3" style={{ borderTop: '1px solid var(--border)' }}>
          {job.notes && (
            <p className="text-sm" style={{ color: 'var(--muted)' }}>{job.notes}</p>
          )}
          <div className="flex items-center gap-2">
            <select className="input text-xs py-1.5 flex-1"
                    value={job.status}
                    onChange={e => onUpdate(job.id, { status: e.target.value })}
                    onClick={e => e.stopPropagation()}>
              {JOB_STATUSES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
            <button className="btn btn-ghost text-xs py-1.5"
                    onClick={e => { e.stopPropagation(); setEditing(true) }}>
              Breyta
            </button>
            {job.url && (
              <a href={job.url} target="_blank" rel="noreferrer"
                 className="btn btn-ghost text-xs py-1.5"
                 onClick={e => e.stopPropagation()}>
                <ExternalLink size={12} />
              </a>
            )}
            <button onClick={e => { e.stopPropagation(); onRemove(job.id) }}
                    className="p-2 rounded-xl transition-colors"
                    style={{ color: 'var(--muted)' }}>
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      )}

      {editing && (
        <div className="mt-3 pt-3 flex flex-col gap-2" style={{ borderTop: '1px solid var(--border)' }}
             onClick={e => e.stopPropagation()}>
          <input className="input text-sm" placeholder="Fyrirtæki" value={form.company}
                 onChange={e => setForm(f => ({ ...f, company: e.target.value }))} />
          <input className="input text-sm" placeholder="Starfsheiti" value={form.role}
                 onChange={e => setForm(f => ({ ...f, role: e.target.value }))} />
          <div className="grid grid-cols-2 gap-2">
            <input className="input text-sm" placeholder="Staðsetning" value={form.location}
                   onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
            <input className="input text-sm" placeholder="Laun" value={form.salary}
                   onChange={e => setForm(f => ({ ...f, salary: e.target.value }))} />
          </div>
          <textarea className="input text-sm" placeholder="Athugasemdir..." rows={2} value={form.notes}
                    onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
          <input className="input text-sm" placeholder="Slóð (LinkedIn, osfrv.)" value={form.url}
                 onChange={e => setForm(f => ({ ...f, url: e.target.value }))} />
          <div className="flex gap-2">
            <button className="btn btn-primary flex-1 justify-center text-sm" onClick={save}>Vista</button>
            <button className="btn btn-ghost text-sm" onClick={() => setEditing(false)}>Hætta við</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function Jobs() {
  const { jobs, add, update, remove, stats } = useJobs()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [filterStatus, setFilterStatus] = useState('all')

  const handleAdd = (e) => {
    e.preventDefault()
    if (!form.company && !form.role) return
    add(form)
    setForm(EMPTY_FORM)
    setShowForm(false)
  }

  const filtered = filterStatus === 'all' ? jobs : jobs.filter(j => j.status === filterStatus)

  const pipeline = JOB_STATUSES.filter(s => s.id !== 'rejected').map(s => ({
    ...s,
    count: jobs.filter(j => j.status === s.id).length,
  }))

  return (
    <div className="flex flex-col gap-4 pb-6 animate-slide-up">
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold flex items-center gap-2">
            <Briefcase size={20} style={{ color: 'var(--accent)' }} /> Starf
          </h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>{stats.active} virkar umsóknir</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          <Plus size={16} /> Bæta við
        </button>
      </div>

      {/* Pipeline stats */}
      <div className="grid grid-cols-4 gap-2">
        {pipeline.map(s => (
          <div key={s.id} className="card py-3 flex flex-col items-center gap-1 cursor-pointer transition-all"
               onClick={() => setFilterStatus(filterStatus === s.id ? 'all' : s.id)}
               style={{
                 background: filterStatus === s.id ? s.bg : 'var(--surface)',
                 border: filterStatus === s.id ? `1px solid ${s.color}44` : '1px solid var(--border)',
               }}>
            <div className="text-xl font-bold tabular-nums" style={{ color: s.color }}>{s.count}</div>
            <div className="text-xs text-center leading-tight" style={{ color: 'var(--muted)', fontSize: 10 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Interview/offer highlight */}
      {stats.interviews > 0 && (
        <div className="card flex items-center gap-3"
             style={{ background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.2)' }}>
          <TrendingUp size={18} style={{ color: '#f97316', flexShrink: 0 }} />
          <div className="text-sm">
            <span className="font-semibold" style={{ color: '#f97316' }}>{stats.interviews} viðtal</span>
            <span style={{ color: 'var(--muted)' }}> í gangi — haltu áfram! 💪</span>
          </div>
        </div>
      )}
      {stats.offers > 0 && (
        <div className="card flex items-center gap-3"
             style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)' }}>
          <span className="text-xl">🎉</span>
          <div className="text-sm">
            <span className="font-semibold" style={{ color: 'var(--success)' }}>{stats.offers} tilboð</span>
            <span style={{ color: 'var(--muted)' }}> — frábært! Þú ert að spara tíma.</span>
          </div>
        </div>
      )}

      {/* Add form */}
      {showForm && (
        <form onSubmit={handleAdd} className="card flex flex-col gap-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Nýtt starf</h3>
            <button type="button" onClick={() => setShowForm(false)}><X size={16} style={{ color: 'var(--muted)' }} /></button>
          </div>
          <input className="input" placeholder="Fyrirtæki *" value={form.company}
                 onChange={e => setForm(f => ({ ...f, company: e.target.value }))} autoFocus />
          <input className="input" placeholder="Starfsheiti *" value={form.role}
                 onChange={e => setForm(f => ({ ...f, role: e.target.value }))} />
          <div className="grid grid-cols-2 gap-2">
            <input className="input text-sm" placeholder="Staðsetning" value={form.location}
                   onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
            <input className="input text-sm" placeholder="Laun" value={form.salary}
                   onChange={e => setForm(f => ({ ...f, salary: e.target.value }))} />
          </div>
          <select className="input text-sm" value={form.status}
                  onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
            {JOB_STATUSES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
          <textarea className="input text-sm" placeholder="Athugasemdir..." rows={2} value={form.notes}
                    onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
          <input className="input text-sm" placeholder="Slóð (valkvæmt)" value={form.url}
                 onChange={e => setForm(f => ({ ...f, url: e.target.value }))} />
          <button type="submit" className="btn btn-primary w-full justify-center">Bæta við</button>
        </form>
      )}

      {/* Filter chips */}
      <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        <button onClick={() => setFilterStatus('all')}
          className="btn shrink-0 text-xs"
          style={{
            background: filterStatus === 'all' ? 'rgba(0,212,170,0.12)' : 'var(--surface)',
            color: filterStatus === 'all' ? 'var(--accent)' : 'var(--muted)',
            border: `1px solid ${filterStatus === 'all' ? 'rgba(0,212,170,0.25)' : 'var(--border)'}`,
          }}>
          Allt ({jobs.length})
        </button>
        {JOB_STATUSES.map(s => (
          <button key={s.id} onClick={() => setFilterStatus(filterStatus === s.id ? 'all' : s.id)}
            className="btn shrink-0 text-xs"
            style={{
              background: filterStatus === s.id ? s.bg : 'var(--surface)',
              color: filterStatus === s.id ? s.color : 'var(--muted)',
              border: `1px solid ${filterStatus === s.id ? s.color + '44' : 'var(--border)'}`,
            }}>
            {s.label} ({jobs.filter(j => j.status === s.id).length})
          </button>
        ))}
      </div>

      {/* Job cards */}
      <div className="flex flex-col gap-3">
        {filtered.length === 0 ? (
          <div className="card text-center py-10 flex flex-col items-center gap-3">
            <div className="text-4xl">💼</div>
            <div className="text-sm" style={{ color: 'var(--muted)' }}>Engar umsóknir ennþá</div>
            <button onClick={() => setShowForm(true)} className="btn btn-primary text-sm">
              <Plus size={14} /> Bæta við fyrsta starfi
            </button>
          </div>
        ) : (
          filtered.map(j => (
            <JobCard key={j.id} job={j} onUpdate={update} onRemove={remove} />
          ))
        )}
      </div>
    </div>
  )
}
