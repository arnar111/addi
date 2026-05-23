import { useState } from 'react'
import { useJobs, JOB_STATUSES } from '../hooks/useJobs'
import { Plus, X, ExternalLink, Trash2, Edit2, Check, Briefcase } from 'lucide-react'

const QUICK_LINKS = [
  { label: 'LinkedIn', url: 'https://linkedin.com/jobs', icon: '💼' },
  { label: 'Alfred.is', url: 'https://alfred.is', icon: '🇮🇸' },
  { label: 'Starfatorg', url: 'https://starfatorg.is', icon: '🏢' },
  { label: 'Adecco', url: 'https://adecco.is', icon: '🔍' },
]

function StatusPill({ statusId, onClick, active }) {
  const st = JOB_STATUSES.find(s => s.id === statusId)
  if (!st) return null
  return (
    <button onClick={onClick}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
      style={{
        background: active ? `${st.color}22` : 'var(--surface2)',
        color: active ? st.color : 'var(--muted)',
        border: `1px solid ${active ? st.color + '55' : 'transparent'}`,
      }}>
      {st.icon} {st.label}
    </button>
  )
}

function JobCard({ job, onUpdate, onRemove }) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ ...job })
  const st = JOB_STATUSES.find(s => s.id === job.status)

  const save = () => {
    onUpdate(job.id, form)
    setEditing(false)
  }

  if (editing) {
    return (
      <div className="card flex flex-col gap-3 animate-slide-up">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold">Breyta</span>
          <button onClick={() => setEditing(false)}><X size={15} style={{ color: 'var(--muted)' }} /></button>
        </div>
        <input className="input text-sm" placeholder="Fyrirtæki *" value={form.company}
               onChange={e => setForm(f => ({ ...f, company: e.target.value }))} />
        <input className="input text-sm" placeholder="Starf *" value={form.title}
               onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
        <input className="input text-sm" placeholder="Laun (t.d. 750.000 kr/mán)" value={form.salary}
               onChange={e => setForm(f => ({ ...f, salary: e.target.value }))} />
        <input className="input text-sm" placeholder="Tengill (slóð á auglýsingu)" value={form.link}
               onChange={e => setForm(f => ({ ...f, link: e.target.value }))} />
        <div className="flex flex-wrap gap-1.5">
          {JOB_STATUSES.map(s => (
            <StatusPill key={s.id} statusId={s.id} active={form.status === s.id}
                        onClick={() => setForm(f => ({ ...f, status: s.id }))} />
          ))}
        </div>
        <textarea className="input text-sm resize-none" rows={2} placeholder="Athugasemdir..."
                  value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
        <button onClick={save} className="btn btn-primary justify-center">
          <Check size={14} /> Vista
        </button>
      </div>
    )
  }

  return (
    <div className="card" style={{
      border: `1px solid ${st?.color ? st.color + '33' : 'var(--border)'}`,
    }}>
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
             style={{ background: st ? `${st.color}18` : 'var(--surface2)' }}>
          {st?.icon || '📄'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold">{job.company}</span>
            <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{ background: st ? `${st.color}18` : 'var(--surface2)', color: st?.color || 'var(--muted)' }}>
              {st?.label}
            </span>
          </div>
          <p className="text-sm mt-0.5" style={{ color: 'var(--muted)' }}>{job.title}</p>
          {job.salary && (
            <p className="text-xs mt-0.5 font-medium" style={{ color: 'var(--accent)' }}>{job.salary}</p>
          )}
          {job.notes && (
            <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--muted)' }}>{job.notes}</p>
          )}
          <p className="text-xs mt-1.5" style={{ color: 'var(--muted)' }}>
            {new Date(job.updatedAt).toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })}
          </p>
        </div>
        <div className="flex flex-col gap-1 shrink-0">
          {job.link && (
            <a href={job.link} target="_blank" rel="noopener noreferrer"
               className="p-1.5 rounded-lg" style={{ color: 'var(--accent)', background: 'rgba(0,212,170,0.1)' }}>
              <ExternalLink size={13} />
            </a>
          )}
          <button onClick={() => setEditing(true)} className="p-1.5 rounded-lg"
                  style={{ color: 'var(--muted)', background: 'var(--surface2)' }}>
            <Edit2 size={13} />
          </button>
          <button onClick={() => onRemove(job.id)} className="p-1.5 rounded-lg"
                  style={{ color: 'var(--danger)', background: 'rgba(239,68,68,0.1)' }}>
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  )
}

function AddJobForm({ onAdd, onClose }) {
  const [form, setForm] = useState({ company: '', title: '', link: '', salary: '', status: 'applied', notes: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.company.trim() || !form.title.trim()) return
    onAdd(form)
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="card flex flex-col gap-3 animate-slide-up">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-sm">Ný umsókn</span>
        <button type="button" onClick={onClose}><X size={15} style={{ color: 'var(--muted)' }} /></button>
      </div>
      <input className="input text-sm" placeholder="Fyrirtæki *" value={form.company}
             onChange={e => setForm(f => ({ ...f, company: e.target.value }))} autoFocus />
      <input className="input text-sm" placeholder="Starf *" value={form.title}
             onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
      <input className="input text-sm" placeholder="Laun (t.d. 750.000 kr/mán)" value={form.salary}
             onChange={e => setForm(f => ({ ...f, salary: e.target.value }))} />
      <input className="input text-sm" placeholder="Tengill á auglýsingu" value={form.link}
             onChange={e => setForm(f => ({ ...f, link: e.target.value }))} />
      <div>
        <p className="text-xs mb-2" style={{ color: 'var(--muted)' }}>Staða</p>
        <div className="flex flex-wrap gap-1.5">
          {JOB_STATUSES.map(s => (
            <StatusPill key={s.id} statusId={s.id} active={form.status === s.id}
                        onClick={() => setForm(f => ({ ...f, status: s.id }))} />
          ))}
        </div>
      </div>
      <textarea className="input text-sm resize-none" rows={2} placeholder="Athugasemdir (valkvæmt)"
                value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
      <button type="submit" className="btn btn-primary w-full justify-center">
        <Plus size={15} /> Bæta við
      </button>
    </form>
  )
}

export default function Jobs() {
  const { jobs, add, update, remove, stats } = useJobs()
  const [showForm, setShowForm] = useState(false)
  const [filterStatus, setFilterStatus] = useState('all')

  const filtered = filterStatus === 'all' ? jobs : jobs.filter(j => j.status === filterStatus)
  const totalActive = ['saved', 'applied', 'interview', 'offer'].reduce((s, id) => s + (stats[id] || 0), 0)

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold">Störf</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            {totalActive} virk umsókn{totalActive !== 1 ? 'ir' : ''}
          </p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          <Plus size={16} /> Ný
        </button>
      </div>

      {showForm && <AddJobForm onAdd={add} onClose={() => setShowForm(false)} />}

      {/* Stats row */}
      <div className="grid grid-cols-5 gap-1.5">
        {JOB_STATUSES.map(s => (
          <div key={s.id}
            className="flex flex-col items-center gap-0.5 py-2.5 rounded-xl cursor-pointer transition-all"
            onClick={() => setFilterStatus(filterStatus === s.id ? 'all' : s.id)}
            style={{
              background: filterStatus === s.id ? `${s.color}22` : stats[s.id] > 0 ? `${s.color}10` : 'var(--surface2)',
              border: `1px solid ${filterStatus === s.id ? s.color + '55' : 'transparent'}`,
            }}>
            <span style={{ fontSize: 16 }}>{s.icon}</span>
            <span className="text-sm font-bold" style={{ color: stats[s.id] > 0 ? s.color : 'var(--muted)' }}>
              {stats[s.id] || 0}
            </span>
            <span style={{ fontSize: 9, color: 'var(--muted)' }} className="text-center leading-tight px-0.5">
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {filterStatus !== 'all' && (
        <button onClick={() => setFilterStatus('all')} className="text-xs self-start" style={{ color: 'var(--accent)' }}>
          ← Allar umsóknir
        </button>
      )}

      {filtered.length === 0 ? (
        <div className="card text-center py-10">
          <Briefcase size={28} className="mx-auto mb-2" style={{ color: 'var(--muted)' }} />
          <p className="text-sm mb-1" style={{ color: 'var(--muted)' }}>
            {jobs.length === 0 ? 'Engar umsóknir ennþá' : 'Engar umsóknir með þessa stöðu'}
          </p>
          {jobs.length === 0 && (
            <button onClick={() => setShowForm(true)} className="btn btn-primary text-sm mt-2">
              <Plus size={14} /> Bæta við fyrstu umsókn
            </button>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map(j => (
            <JobCard key={j.id} job={j} onUpdate={update} onRemove={remove} />
          ))}
        </div>
      )}

      {/* Quick links */}
      <div className="flex flex-col gap-2 mt-2">
        <div className="text-xs font-semibold px-1" style={{ color: 'var(--muted)' }}>LEITA AÐ STÖRFUM</div>
        <div className="grid grid-cols-2 gap-2">
          {QUICK_LINKS.map(link => (
            <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer"
               className="card flex items-center gap-2 py-3 no-underline"
               style={{ textDecoration: 'none' }}>
              <span className="text-xl">{link.icon}</span>
              <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>{link.label}</span>
              <ExternalLink size={11} className="ml-auto shrink-0" style={{ color: 'var(--muted)' }} />
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
