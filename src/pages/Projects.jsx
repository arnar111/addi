import { useState } from 'react'
import { useProjects } from '../hooks/useProjects'
import { Plus, X, Check, Trash2, ChevronDown, ChevronUp, Pencil } from 'lucide-react'

const STATUS_MAP = {
  active: { label: 'Virkt', color: 'var(--accent)' },
  paused: { label: 'Hlé', color: '#f97316' },
  done: { label: 'Lokið', color: 'var(--success)' },
}

const PRESET_COLORS = ['#9945FF', '#00d4aa', '#f97316', '#ef4444', '#3b82f6', '#ec4899', '#eab308', '#8b5cf6']
const PRESET_ICONS = ['⚡', '🏠', '🏆', '🚀', '💡', '🎯', '🔧', '📱', '💰', '🌍', '📊', '🎨']

function ProgressSlider({ value, onChange, color }) {
  return (
    <div className="flex items-center gap-3">
      <input type="range" min={0} max={100} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="flex-1" style={{ accentColor: color }} />
      <span className="text-sm font-semibold w-10 text-right" style={{ color }}>{value}%</span>
    </div>
  )
}

function ProjectCard({ project, onUpdate, onRemove, onToggleTask, onAddTask, onRemoveTask }) {
  const [expanded, setExpanded] = useState(false)
  const [editing, setEditing] = useState(false)
  const [taskInput, setTaskInput] = useState('')
  const [editName, setEditName] = useState(project.name)
  const [editDesc, setEditDesc] = useState(project.description)
  const [editProgress, setEditProgress] = useState(project.progress)
  const [editStatus, setEditStatus] = useState(project.status)

  const doneTasks = project.tasks.filter(t => t.done).length
  const totalTasks = project.tasks.length
  const pct = project.progress
  const st = STATUS_MAP[project.status] || STATUS_MAP.active

  const saveEdit = () => {
    onUpdate(project.id, {
      name: editName,
      description: editDesc,
      progress: editProgress,
      status: editStatus,
    })
    setEditing(false)
  }

  const handleAddTask = (e) => {
    e.preventDefault()
    onAddTask(project.id, taskInput)
    setTaskInput('')
  }

  return (
    <div className="card" style={{ borderColor: expanded ? project.color + '44' : 'var(--border)' }}>
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
             style={{ background: project.color + '22' }}>
          {project.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-sm">{project.name}</span>
            <span className="badge text-xs" style={{ background: st.color + '22', color: st.color }}>{st.label}</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--surface2)' }}>
              <div className="h-full rounded-full transition-all"
                   style={{ width: `${pct}%`, background: project.color }} />
            </div>
            <span className="text-xs font-semibold shrink-0" style={{ color: project.color }}>{pct}%</span>
            {totalTasks > 0 && (
              <span className="text-xs shrink-0" style={{ color: 'var(--muted)' }}>{doneTasks}/{totalTasks}</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button onClick={() => { setEditing(!editing); setExpanded(true) }}
            style={{ color: 'var(--muted)', padding: 6 }}>
            <Pencil size={14} />
          </button>
          <button onClick={() => setExpanded(!expanded)} style={{ color: 'var(--muted)', padding: 6 }}>
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {/* Expanded */}
      {expanded && (
        <div className="mt-3 flex flex-col gap-3">
          {editing ? (
            <div className="flex flex-col gap-3 p-3 rounded-xl" style={{ background: 'var(--surface2)' }}>
              <input className="input text-sm" value={editName} onChange={e => setEditName(e.target.value)} placeholder="Nafn" />
              <textarea className="input text-sm resize-none" rows={2} value={editDesc}
                onChange={e => setEditDesc(e.target.value)} placeholder="Lýsing..." />
              <div className="flex flex-col gap-1">
                <label className="text-xs" style={{ color: 'var(--muted)' }}>Framvinda</label>
                <ProgressSlider value={editProgress} onChange={setEditProgress} color={project.color} />
              </div>
              <div className="flex gap-2">
                {Object.entries(STATUS_MAP).map(([k, v]) => (
                  <button key={k} onClick={() => setEditStatus(k)}
                    className="flex-1 py-1.5 rounded-lg text-xs font-medium transition-all"
                    style={{
                      background: editStatus === k ? v.color + '22' : 'var(--surface)',
                      color: editStatus === k ? v.color : 'var(--muted)',
                      border: `1px solid ${editStatus === k ? v.color + '55' : 'transparent'}`,
                    }}>{v.label}</button>
                ))}
              </div>
              <div className="flex gap-2">
                <button onClick={saveEdit} className="btn btn-primary flex-1 justify-center text-sm">Vista</button>
                <button onClick={() => setEditing(false)} className="btn btn-ghost">
                  <X size={14} />
                </button>
                <button onClick={() => onRemove(project.id)} className="btn btn-danger">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ) : (
            project.description && (
              <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
                {project.description}
              </p>
            )
          )}

          {/* Tasks */}
          <div className="flex flex-col gap-2">
            <form onSubmit={handleAddTask} className="flex gap-2">
              <input className="input text-sm" placeholder="Bæta við lið..."
                value={taskInput} onChange={e => setTaskInput(e.target.value)} />
              <button type="submit" className="btn btn-primary shrink-0" style={{ padding: '8px 12px' }}>
                <Plus size={15} />
              </button>
            </form>
            {project.tasks.length > 0 && (
              <div className="flex flex-col gap-1.5">
                {project.tasks.map(t => (
                  <div key={t.id} className="flex items-center gap-2.5 py-1.5 px-2 rounded-xl"
                       style={{ background: 'var(--surface2)', opacity: t.done ? 0.6 : 1 }}>
                    <button onClick={() => onToggleTask(project.id, t.id)}
                      className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all"
                      style={{
                        borderColor: t.done ? 'var(--success)' : project.color,
                        background: t.done ? 'var(--success)' : 'transparent',
                      }}>
                      {t.done && <Check size={10} color="#000" />}
                    </button>
                    <span className="text-sm flex-1"
                          style={{ textDecoration: t.done ? 'line-through' : 'none' }}>
                      {t.text}
                    </span>
                    <button onClick={() => onRemoveTask(project.id, t.id)} style={{ color: 'var(--muted)' }}>
                      <X size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default function Projects() {
  const { projects, active, paused, done, addProject, updateProject, removeProject, toggleTask, addTask, removeTask } = useProjects()
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState('active')
  const [newName, setNewName] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [newIcon, setNewIcon] = useState('📁')
  const [newColor, setNewColor] = useState('#8b5cf6')

  const handleAdd = (e) => {
    e.preventDefault()
    if (!newName.trim()) return
    addProject(newName.trim(), newIcon, newColor, newDesc.trim())
    setNewName('')
    setNewDesc('')
    setNewIcon('📁')
    setNewColor('#8b5cf6')
    setShowForm(false)
  }

  const filtered = filter === 'active' ? active
    : filter === 'paused' ? paused
    : filter === 'done' ? done
    : projects

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold">Verkefni</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            {active.length} virk · {done.length} lokið
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
          <input className="input" placeholder="Heiti verkefnis..." value={newName}
            onChange={e => setNewName(e.target.value)} autoFocus />
          <textarea className="input resize-none text-sm" rows={2}
            placeholder="Stutt lýsing (valkvæmt)..."
            value={newDesc} onChange={e => setNewDesc(e.target.value)} />
          <div>
            <div className="text-xs mb-2" style={{ color: 'var(--muted)' }}>Tákn</div>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_ICONS.map(icon => (
                <button key={icon} type="button" onClick={() => setNewIcon(icon)}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-all"
                  style={{
                    background: newIcon === icon ? 'var(--surface2)' : 'transparent',
                    border: `1px solid ${newIcon === icon ? 'var(--accent)' : 'var(--border)'}`,
                  }}>
                  {icon}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs mb-2" style={{ color: 'var(--muted)' }}>Litur</div>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_COLORS.map(c => (
                <button key={c} type="button" onClick={() => setNewColor(c)}
                  className="w-7 h-7 rounded-full transition-all"
                  style={{
                    background: c,
                    border: `2px solid ${newColor === c ? 'var(--text)' : 'transparent'}`,
                    transform: newColor === c ? 'scale(1.15)' : 'scale(1)',
                  }} />
              ))}
            </div>
          </div>
          <button type="submit" className="btn btn-primary w-full justify-center">Búa til verkefni</button>
        </form>
      )}

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {[['active', `Virk (${active.length})`], ['paused', `Hlé (${paused.length})`], ['done', `Lokið (${done.length})`], ['all', 'Allt']].map(([f, l]) => (
          <button key={f} onClick={() => setFilter(f)}
            className="btn shrink-0 text-xs py-1.5"
            style={{
              background: filter === f ? 'rgba(0,212,170,0.15)' : 'var(--surface)',
              color: filter === f ? 'var(--accent)' : 'var(--muted)',
              border: `1px solid ${filter === f ? 'rgba(0,212,170,0.3)' : 'var(--border)'}`,
            }}>{l}</button>
        ))}
      </div>

      {/* Project cards */}
      <div className="flex flex-col gap-3">
        {filtered.length === 0 ? (
          <div className="card text-center py-10" style={{ color: 'var(--muted)' }}>
            {filter === 'done' ? 'Engin lokið verkefni' : 'Engin verkefni'}
          </div>
        ) : filtered.map(p => (
          <ProjectCard key={p.id} project={p}
            onUpdate={updateProject}
            onRemove={removeProject}
            onToggleTask={toggleTask}
            onAddTask={addTask}
            onRemoveTask={removeTask} />
        ))}
      </div>
    </div>
  )
}
