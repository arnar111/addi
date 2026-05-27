import { useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { ExternalLink, Plus, X, CheckCircle2, Circle, Zap, GitBranch } from 'lucide-react'

const DEFAULT_PROJECTS = [
  {
    id: 'lendo',
    name: 'Lendó',
    icon: '🪑',
    desc: 'Leigumarkaður fyrir húsgögn og búnað — borð, stólar, tjald og fleira',
    url: '',
    github: '',
    netlify: '',
    status: 'active',
    color: '#00d4aa',
    tags: ['Marketplace', 'ISK', 'Leiga'],
  },
  {
    id: 'takkarena',
    name: 'Takkarena',
    icon: '🏪',
    desc: 'MVP sölurakningakerfi með daglegum gögnum og leiguliðaskýrslum',
    url: 'https://takkmvp.netlify.app',
    github: 'https://github.com/arnar111/takkarena-mvp',
    netlify: 'https://app.netlify.com/projects/takkmvp',
    status: 'active',
    color: '#8b5cf6',
    tags: ['POS', 'Analytics'],
  },
  {
    id: 'spira',
    name: 'Spira',
    icon: '🌶️',
    desc: 'Piparræktunarkerfið með fjölda afbrigða og vaxtarstjórnun',
    url: 'https://spiran.netlify.app',
    github: 'https://github.com/arnar111/spira',
    netlify: 'https://app.netlify.com/projects/spiran',
    status: 'active',
    color: '#ef4444',
    tags: ['Gardening', 'Tracking'],
  },
  {
    id: 'draumakaup',
    name: 'Draumakaup',
    icon: '⚽',
    desc: 'Félagskaup og millifærslurakningaapp — spáðu í næstu millifærslur',
    url: 'https://draumakaup.netlify.app',
    github: 'https://github.com/arnar111/draumakaup',
    netlify: 'https://app.netlify.com/projects/draumakaup',
    status: 'active',
    color: '#f97316',
    tags: ['Football', 'Transfers'],
  },
  {
    id: 'addi',
    name: 'Addi',
    icon: '✦',
    desc: 'Persónulegt mælaborð — þetta app!',
    url: 'https://addi.netlify.app',
    github: 'https://github.com/arnar111/addi',
    netlify: 'https://app.netlify.com/projects/addi',
    status: 'active',
    color: '#00d4aa',
    tags: ['Dashboard', 'Personal'],
  },
]

const STATUS_LABELS = {
  active: { label: 'Virkt', color: '#22c55e' },
  wip: { label: 'Í vinnslu', color: '#f97316' },
  paused: { label: 'Í bið', color: '#64748b' },
  idea: { label: 'Hugmynd', color: '#8b5cf6' },
}

const TODOS_KEY = 'addi_project_todos'

export default function Projects() {
  const [projects] = useState(DEFAULT_PROJECTS)
  const [todos, setTodos] = useLocalStorage(TODOS_KEY, {})
  const [activeProject, setActiveProject] = useState(null)
  const [newTodo, setNewTodo] = useState('')
  const [showAddTodo, setShowAddTodo] = useState(false)

  const projectTodos = (id) => todos[id] || []

  const addTodo = (projectId, text) => {
    if (!text.trim()) return
    setTodos(prev => ({
      ...prev,
      [projectId]: [...(prev[projectId] || []), { id: Date.now().toString(), text: text.trim(), done: false }]
    }))
    setNewTodo('')
    setShowAddTodo(false)
  }

  const toggleTodo = (projectId, todoId) => {
    setTodos(prev => ({
      ...prev,
      [projectId]: (prev[projectId] || []).map(t => t.id === todoId ? { ...t, done: !t.done } : t)
    }))
  }

  const removeTodo = (projectId, todoId) => {
    setTodos(prev => ({
      ...prev,
      [projectId]: (prev[projectId] || []).filter(t => t.id !== todoId)
    }))
  }

  const selected = activeProject ? projects.find(p => p.id === activeProject) : null
  const selTodos = activeProject ? projectTodos(activeProject) : []

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="px-1 pt-2">
        <h1 className="text-xl font-semibold">Verkefni</h1>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>{projects.filter(p => p.status === 'active').length} virk verkefni</p>
      </div>

      {/* Project cards */}
      <div className="flex flex-col gap-3">
        {projects.map(project => {
          const ptodos = projectTodos(project.id)
          const done = ptodos.filter(t => t.done).length
          const isActive = activeProject === project.id
          const statusInfo = STATUS_LABELS[project.status] || STATUS_LABELS.idea

          return (
            <div
              key={project.id}
              className="card"
              style={{
                border: isActive ? `1px solid ${project.color}55` : '1px solid var(--border)',
                transition: 'border-color 0.2s',
                background: isActive ? `linear-gradient(135deg, ${project.color}08, transparent)` : 'var(--surface)',
              }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                  style={{ background: project.color + '20' }}
                >
                  {project.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-semibold">{project.name}</span>
                    <span
                      className="text-xs px-1.5 py-0.5 rounded-full font-medium"
                      style={{ background: statusInfo.color + '20', color: statusInfo.color }}
                    >
                      {statusInfo.label}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>{project.desc}</p>
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {project.tags.map(tag => (
                      <span key={tag} className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: 'var(--surface2)', color: 'var(--muted)' }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Links row */}
              <div className="flex gap-2 mt-3">
                {project.url && (
                  <a href={project.url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost text-xs py-1 px-2 flex items-center gap-1" style={{ fontSize: 11 }}>
                    <ExternalLink size={11} /> Opna
                  </a>
                )}
                {project.github && (
                  <a href={project.github} target="_blank" rel="noopener noreferrer" className="btn btn-ghost text-xs py-1 px-2 flex items-center gap-1" style={{ fontSize: 11 }}>
                    <GitBranch size={11} /> GitHub
                  </a>
                )}
                <button
                  onClick={() => setActiveProject(isActive ? null : project.id)}
                  className="btn btn-ghost text-xs py-1 px-2 ml-auto flex items-center gap-1"
                  style={{ fontSize: 11, color: isActive ? project.color : 'var(--muted)' }}
                >
                  <Zap size={11} />
                  {ptodos.length > 0 ? `${done}/${ptodos.length} lokið` : 'To-do'}
                </button>
              </div>

              {/* Inline todos */}
              {isActive && (
                <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
                  <div className="flex flex-col gap-1.5">
                    {selTodos.length === 0 && !showAddTodo && (
                      <p className="text-xs py-2 text-center" style={{ color: 'var(--muted)' }}>Engin verkefni. Bættu við!</p>
                    )}
                    {selTodos.map(todo => (
                      <div key={todo.id} className="flex items-center gap-2 group">
                        <button onClick={() => toggleTodo(project.id, todo.id)}>
                          {todo.done
                            ? <CheckCircle2 size={15} style={{ color: 'var(--accent)' }} />
                            : <Circle size={15} style={{ color: 'var(--muted)' }} />
                          }
                        </button>
                        <span
                          className="flex-1 text-xs"
                          style={{
                            textDecoration: todo.done ? 'line-through' : 'none',
                            color: todo.done ? 'var(--muted)' : 'var(--text)',
                          }}
                        >
                          {todo.text}
                        </span>
                        <button onClick={() => removeTodo(project.id, todo.id)} className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <X size={12} style={{ color: 'var(--muted)' }} />
                        </button>
                      </div>
                    ))}
                    {showAddTodo ? (
                      <form
                        className="flex gap-2 mt-1"
                        onSubmit={e => { e.preventDefault(); addTodo(project.id, newTodo) }}
                      >
                        <input
                          autoFocus
                          className="input text-xs py-1.5 flex-1"
                          placeholder="Nýtt verkefni..."
                          value={newTodo}
                          onChange={e => setNewTodo(e.target.value)}
                        />
                        <button type="submit" className="btn btn-primary text-xs py-1.5 px-3">Bæta</button>
                        <button type="button" onClick={() => setShowAddTodo(false)} className="btn btn-ghost text-xs py-1.5 px-2">
                          <X size={12} />
                        </button>
                      </form>
                    ) : (
                      <button
                        onClick={() => setShowAddTodo(true)}
                        className="flex items-center gap-1 text-xs mt-1"
                        style={{ color: project.color }}
                      >
                        <Plus size={12} /> Bæta við verkefni
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
