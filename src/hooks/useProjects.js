import { useLocalStorage } from './useLocalStorage'

const DEFAULT_PROJECTS = [
  {
    id: '1',
    name: 'Solana Bot',
    icon: '⚡',
    color: '#9945FF',
    status: 'active',
    description: 'Pre-release sent to beta testers. Collecting feedback before v1.0.',
    progress: 75,
    tasks: [
      { id: 't1', text: 'Collect beta feedback', done: false },
      { id: 't2', text: 'Fix pre-release bugs', done: false },
      { id: 't3', text: 'Write docs', done: false },
      { id: 't4', text: 'Launch v1.0', done: false },
    ],
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Lendó',
    icon: '🏠',
    color: '#00d4aa',
    status: 'active',
    description: 'P2P rental marketplace for Iceland – party equipment, tools, furniture.',
    progress: 35,
    tasks: [
      { id: 't1', text: 'Listing page UI', done: false },
      { id: 't2', text: 'Booking flow', done: false },
      { id: 't3', text: 'Payment integration', done: false },
      { id: 't4', text: 'Reykjavík soft launch', done: false },
    ],
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Þraukarinn S50',
    icon: '🏆',
    color: '#f97316',
    status: 'active',
    description: 'Fantasy Survivor league – Season 50. 40+ players registered.',
    progress: 60,
    tasks: [
      { id: 't1', text: 'Update leaderboard', done: false },
      { id: 't2', text: 'Process this week\'s elimination', done: false },
      { id: 't3', text: 'Send weekly digest email', done: false },
    ],
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
]

export function useProjects() {
  const [projects, setProjects] = useLocalStorage('addi_projects', DEFAULT_PROJECTS)

  const addProject = (name, icon = '📁', color = '#8b5cf6', description = '') => {
    setProjects(prev => [...prev, {
      id: Date.now().toString(),
      name, icon, color,
      status: 'active',
      description,
      progress: 0,
      tasks: [],
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    }])
  }

  const updateProject = (id, updates) => {
    setProjects(prev => prev.map(p =>
      p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
    ))
  }

  const removeProject = (id) => {
    setProjects(prev => prev.filter(p => p.id !== id))
  }

  const toggleTask = (projectId, taskId) => {
    setProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p
      return {
        ...p,
        tasks: p.tasks.map(t => t.id === taskId ? { ...t, done: !t.done } : t),
        updatedAt: new Date().toISOString(),
      }
    }))
  }

  const addTask = (projectId, text) => {
    if (!text.trim()) return
    setProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p
      return {
        ...p,
        tasks: [...p.tasks, { id: Date.now().toString(), text: text.trim(), done: false }],
        updatedAt: new Date().toISOString(),
      }
    }))
  }

  const removeTask = (projectId, taskId) => {
    setProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p
      return { ...p, tasks: p.tasks.filter(t => t.id !== taskId), updatedAt: new Date().toISOString() }
    }))
  }

  const active = projects.filter(p => p.status === 'active')
  const paused = projects.filter(p => p.status === 'paused')
  const done = projects.filter(p => p.status === 'done')

  return { projects, active, paused, done, addProject, updateProject, removeProject, toggleTask, addTask, removeTask }
}
