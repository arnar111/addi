import { useState } from 'react'
import { useProjects } from '../hooks/useProjects'
import { Plus, X, Trash2, Check, ChevronDown, ChevronUp, Calendar } from 'lucide-react'

const STATUS = {
  active: { label: 'Í gangi', color: '#00d4aa', bg: 'rgba(0,212,170,0.12)' },
  paused: { label: 'Í bið', color: '#f97316', bg: 'rgba(249,115,22,0.12)' },
  done: { label: 'Lokið', color: '#22c55e', bg: 'rgba(34,197,94,0.12)' },
}

const ICONS = ['🏢', '🚀', '💡', '📁', '🎯', '⚡', '🛠️', '🎨', '📊', '🔬']
const COLORS = ['#00d4aa', '#8b5cf6', '#f97316', '#3b82f6', '#ec4899', '#22c55e']

function ProjectCard({ project, onUpdate, onRemove, onAddMilestone, onToggleMilestone, onRemoveMilestone }) {
  const [expanded, setExpanded] = useState(false)
  const [newMs, setNewMs] = useState('')
  const [newMsDate, setNewMsDate] = useState('')

  const total = project.milestones.length
  const done = project.milestones.filter(m => m.done).length
  const pct = total ? Math.round((done / total) * 100) : 0
  const status = STATUS[project.status] || STATUS.active

  const handleAddMs = (e) => {
    e.preventDefault()
    if (!newMs.trim()) return
    onAddMilestone(project.id, newMs.trim(), newMsDate || null)
    setNewMs('')
    setNewMsDate('')
  }

  const formatDate = (d) => {
    if (!d) return null
    try {
      return new Date(d).toLocaleDateString('is-IS', { day: 'numeric', month: 'short' })
    } catch {
      return d
    }
  }

  return (
    <div className="card flex flex-col gap-3">
      <button onClick={() => setExpanded(e => !e)} className="flex items-start gap-3 text-left">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
             style={{ background: `${project.color}22`, border: `1px solid ${project.color}44` }}>
          {project.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm">{project.name}</span>
            <span className="badge" style={{ background: status.bg, color: status.color }}>{status.label}</span>
          </div>
          {project.description && (
            <p className="text-xs mt-0.5 line-clamp-2" style={{ color: 'var(--muted)' }}>{project.description}</p>
          )}
          <div className="flex items-center gap-2 mt-2">
            <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--surface2)' }}>
              <div className="h-full rounded-full transition-all"
                   style={{ width: `${pct}%`, background: project.color }} />
            </div>
            <span className="text-xs font-medium" style={{ color: 'var(--muted)' }}>{done}/{total}</span>
          </div>
        </div>
        <div className="shrink-0" style={{ color: 'var(--muted)' }}>
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>

      {expanded && (
        <div className="flex flex-col gap-3 pt-2" style={{ borderTop: '1px solid var(--border)' }}>
          {/* Status selector */}
          <div className="flex gap-1.5">
            {Object.entries(STATUS).map(([key, val]) => (
              <button key={key} onClick={() => onUpdate(project.id, { status: key })}
                className="btn text-xs flex-1 justify-center"
                style={{
                  background: project.status === key ? val.bg : 'var(--surface2)',
                  color: project.status === key ? val.color : 'var(--muted)',
                  border: `1px solid ${project.status === key ? val.color + '55' : 'var(--border)'}`,
                  padding: '6px 8px',
                }}>
                {val.label}
              </button>
            ))}
          </div>

          {/* Milestones list */}
          <div className="flex flex-col gap-1.5">
            <div className="text-xs font-semibold" style={{ color: 'var(--muted)' }}>Áfangar</div>
            {project.milestones.length === 0 && (
              <div className="text-xs py-2" style={{ color: 'var(--muted)' }}>Engir áfangar ennþá</div>
            )}
            {project.milestones.map(m => (
              <div key={m.id} className="flex items-center gap-2 p-2 rounded-lg"
                   style={{ background: 'var(--surface2)' }}>
                <button onClick={() => onToggleMilestone(project.id, m.id)}
                  className="w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-all"
                  style={{
                    background: m.done ? project.color : 'transparent',
                    border: `1.5px solid ${m.done ? project.color : 'var(--border)'}`,
                  }}>
                  {m.done && <Check size={12} color="#000" strokeWidth={3} />}
                </button>
                <div className="flex-1 min-w-0">
                  <div className="text-xs" style={{
                    color: m.done ? 'var(--muted)' : 'var(--text)',
                    textDecoration: m.done ? 'line-through' : 'none',
                  }}>{m.text}</div>
                  {m.dueDate && (
                    <div className="flex items-center gap-1 text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                      <Calendar size={10} /> {formatDate(m.dueDate)}
                    </div>
                  )}
                </div>
                <button onClick={() => onRemoveMilestone(project.id, m.id)}
                  style={{ color: 'var(--muted)' }}>
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>

          {/* Add milestone form */}
          <form onSubmit={handleAddMs} className="flex flex-col gap-2">
            <input className="input text-sm" placeholder="Nýr áfangi..."
              value={newMs} onChange={e => setNewMs(e.target.value)} />
            <div className="flex gap-2">
              <input className="input text-sm flex-1" type="date"
                value={newMsDate} onChange={e => setNewMsDate(e.target.value)} />
              <button type="submit" className="btn btn-primary">
                <Plus size={14} /> Bæta við
              </button>
            </div>
          </form>

          {/* Notes */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold" style={{ color: 'var(--muted)' }}>Athugasemdir</label>
            <textarea className="input text-sm" rows={3}
              placeholder="Skrifa athugasemdir um verkefnið..."
              value={project.notes}
              onChange={e => onUpdate(project.id, { notes: e.target.value })} />
          </div>

          {/* Delete project */}
          <button onClick={() => {
              if (confirm(`Eyða verkefninu "${project.name}"?`)) onRemove(project.id)
            }} className="btn btn-danger w-full justify-center">
            <Trash2 size={14} /> Eyða verkefni
          </button>
        </div>
      )}
    </div>
  )
}

export default function Projects() {
  const { projects, add, update, remove, addMilestone, toggleMilestone, removeMilestone, active } = useProjects()
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [icon, setIcon] = useState('📁')
  const [color, setColor] = useState('#00d4aa')

  const handleAdd = (e) => {
    e.preventDefault()
    if (!name.trim()) return
    add(name.trim(), description.trim(), color, icon)
    setName('')
    setDescription('')
    setIcon('📁')
    setColor('#00d4aa')
    setShowForm(false)
  }

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold">Verkefni</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            {active.length} í gangi · {projects.length} alls
          </p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          <Plus size={16} /> Nýtt
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="card flex flex-col gap-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Nýtt verkefni</h3>
            <button type="button" onClick={() => setShowForm(false)}>
              <X size={16} style={{ color: 'var(--muted)' }} />
            </button>
          </div>
          <input className="input" placeholder="Heiti verkefnis" autoFocus
            value={name} onChange={e => setName(e.target.value)} />
          <input className="input" placeholder="Lýsing (valkvæmt)"
            value={description} onChange={e => setDescription(e.target.value)} />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs" style={{ color: 'var(--muted)' }}>Tákn</label>
            <div className="grid grid-cols-5 gap-1.5">
              {ICONS.map(i => (
                <button key={i} type="button" onClick={() => setIcon(i)}
                  className="aspect-square rounded-xl text-lg transition-all flex items-center justify-center"
                  style={{
                    background: icon === i ? `${color}22` : 'var(--surface2)',
                    border: `1px solid ${icon === i ? color + '55' : 'transparent'}`,
                  }}>{i}</button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs" style={{ color: 'var(--muted)' }}>Litur</label>
            <div className="flex gap-2">
              {COLORS.map(c => (
                <button key={c} type="button" onClick={() => setColor(c)}
                  className="w-8 h-8 rounded-full transition-all"
                  style={{
                    background: c,
                    border: `2px solid ${color === c ? '#fff' : 'transparent'}`,
                  }} />
              ))}
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-full justify-center">
            Búa til
          </button>
        </form>
      )}

      {projects.length === 0 ? (
        <div className="card text-center py-12" style={{ color: 'var(--muted)' }}>
          <div className="text-3xl mb-2">📁</div>
          <div className="text-sm">Engin verkefni ennþá</div>
          <div className="text-xs mt-1">Smelltu á "Nýtt" til að byrja</div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {projects.map(p => (
            <ProjectCard key={p.id} project={p}
              onUpdate={update}
              onRemove={remove}
              onAddMilestone={addMilestone}
              onToggleMilestone={toggleMilestone}
              onRemoveMilestone={removeMilestone} />
          ))}
        </div>
      )}
    </div>
  )
}
