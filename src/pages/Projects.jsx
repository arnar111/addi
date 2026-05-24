import { useState } from 'react'
import { useProjects, STATUS_CONFIG } from '../hooks/useProjects'
import {
  Plus, ExternalLink, Edit2, Check, X, Trash2,
  Globe, Code2,
} from 'lucide-react'

const STATUS_ORDER = ['active', 'building', 'paused', 'idea']

function ProjectCard({ project, onUpdate, onRemove }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(project)
  const status = STATUS_CONFIG[project.status] || STATUS_CONFIG.idea

  const save = () => {
    onUpdate(project.id, draft)
    setEditing(false)
  }

  const cancel = () => {
    setDraft(project)
    setEditing(false)
  }

  if (editing) {
    return (
      <div className="card flex flex-col gap-3 animate-slide-up">
        <div className="flex items-center gap-2">
          <input className="input text-sm w-12 text-center px-1" value={draft.icon}
            onChange={e => setDraft(d => ({ ...d, icon: e.target.value }))} placeholder="🚀" />
          <input className="input text-sm flex-1" value={draft.name}
            onChange={e => setDraft(d => ({ ...d, name: e.target.value }))} placeholder="Nafn verkefnis" autoFocus />
        </div>
        <input className="input text-sm" value={draft.description}
          onChange={e => setDraft(d => ({ ...d, description: e.target.value }))} placeholder="Lýsing" />
        <div className="grid grid-cols-2 gap-2">
          {STATUS_ORDER.map(s => {
            const sc = STATUS_CONFIG[s]
            return (
              <button key={s} type="button" onClick={() => setDraft(d => ({ ...d, status: s }))}
                className="py-1.5 rounded-lg text-xs font-medium transition-all"
                style={{
                  background: draft.status === s ? sc.bg : 'var(--surface2)',
                  color: draft.status === s ? sc.color : 'var(--muted)',
                  border: `1px solid ${draft.status === s ? sc.color + '44' : 'transparent'}`,
                }}>{sc.label}</button>
            )
          })}
        </div>
        <input className="input text-xs" value={draft.netlify}
          onChange={e => setDraft(d => ({ ...d, netlify: e.target.value }))} placeholder="Netlify URL" />
        <input className="input text-xs" value={draft.github}
          onChange={e => setDraft(d => ({ ...d, github: e.target.value }))} placeholder="GitHub URL" />
        <textarea className="input text-xs resize-none" rows={2} value={draft.notes}
          onChange={e => setDraft(d => ({ ...d, notes: e.target.value }))} placeholder="Minnisblað..." />
        <div className="flex gap-2">
          <button onClick={save} className="btn btn-primary flex-1 justify-center text-sm">
            <Check size={14} /> Vista
          </button>
          <button onClick={cancel} className="btn btn-ghost">
            <X size={14} />
          </button>
          <button onClick={() => onRemove(project.id)} className="btn btn-danger">
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="card flex flex-col gap-3" style={{ borderLeft: `3px solid ${project.color}` }}>
      <div className="flex items-start gap-3">
        <div className="text-2xl shrink-0 mt-0.5">{project.icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-sm">{project.name}</span>
            <span className="badge text-xs"
              style={{ background: status.bg, color: status.color }}>
              {status.label}
            </span>
          </div>
          <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{project.description}</p>
        </div>
        <button onClick={() => setEditing(true)} className="shrink-0 p-1" style={{ color: 'var(--muted)' }}>
          <Edit2 size={14} />
        </button>
      </div>

      {project.notes && (
        <p className="text-xs px-1 leading-relaxed" style={{ color: 'var(--muted)', borderLeft: '2px solid var(--border)', paddingLeft: 8 }}>
          {project.notes}
        </p>
      )}

      <div className="flex gap-2 flex-wrap">
        {project.netlify && (
          <a href={project.netlify} target="_blank" rel="noopener noreferrer"
             className="btn btn-ghost text-xs py-1.5 gap-1.5">
            <Globe size={12} style={{ color: '#00d4aa' }} /> Live
          </a>
        )}
        {project.github && (
          <a href={project.github} target="_blank" rel="noopener noreferrer"
             className="btn btn-ghost text-xs py-1.5 gap-1.5">
            <Code2 size={12} style={{ color: 'var(--muted)' }} /> GitHub
          </a>
        )}
      </div>
    </div>
  )
}

export default function Projects() {
  const { projects, update, add, remove, activeCount } = useProjects()
  const [filter, setFilter] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [newName, setNewName] = useState('')

  const filtered = filter === 'all' ? projects : projects.filter(p => p.status === filter)

  const handleAdd = (e) => {
    e.preventDefault()
    if (!newName.trim()) return
    add({ name: newName.trim(), status: 'idea' })
    setNewName('')
    setShowForm(false)
  }

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold">Forrit & Verkefni</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            {activeCount} virk · {projects.length} alls
          </p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          <Plus size={16} /> Nýtt
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="card flex gap-2 animate-slide-up">
          <input className="input text-sm flex-1" autoFocus placeholder="Nafn nýs verkefnis..."
            value={newName} onChange={e => setNewName(e.target.value)} />
          <button type="submit" className="btn btn-primary"><Check size={16} /></button>
          <button type="button" onClick={() => setShowForm(false)} className="btn btn-ghost"><X size={16} /></button>
        </form>
      )}

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2">
        {STATUS_ORDER.map(s => {
          const sc = STATUS_CONFIG[s]
          const count = projects.filter(p => p.status === s).length
          return (
            <button key={s} onClick={() => setFilter(filter === s ? 'all' : s)}
              className="card-sm flex flex-col items-center gap-1 transition-all"
              style={{
                background: filter === s ? sc.bg : 'var(--surface)',
                border: `1px solid ${filter === s ? sc.color + '44' : 'var(--border)'}`,
              }}>
              <span className="text-lg font-bold" style={{ color: sc.color }}>{count}</span>
              <span style={{ fontSize: 10, color: filter === s ? sc.color : 'var(--muted)' }}>{sc.label}</span>
            </button>
          )
        })}
      </div>

      {/* Project list */}
      <div className="flex flex-col gap-3">
        {filtered.length === 0 ? (
          <div className="card text-center py-8" style={{ color: 'var(--muted)' }}>
            Engin verkefni í þessum flokki
          </div>
        ) : filtered.map(p => (
          <ProjectCard key={p.id} project={p} onUpdate={update} onRemove={remove} />
        ))}
      </div>
    </div>
  )
}
