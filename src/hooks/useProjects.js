import { useLocalStorage } from './useLocalStorage'

export function useProjects() {
  const [projects, setProjects] = useLocalStorage('addi_projects', [
    {
      id: '1',
      name: 'Lendó',
      description: 'Startup — tekju og gjaldaáætlun',
      status: 'active',
      color: '#00d4aa',
      icon: '🏢',
      milestones: [
        { id: '1', text: 'Tekjuáætlun send til fjárfesta', done: true, dueDate: '2026-05-12' },
        { id: '2', text: 'Svar frá digido / Höllu', done: false, dueDate: '2026-06-01' },
        { id: '3', text: 'MVP smíði', done: false, dueDate: '2026-07-01' },
        { id: '4', text: 'Beta launch', done: false, dueDate: '2026-08-01' },
      ],
      notes: '',
      createdAt: new Date().toISOString(),
    },
  ])

  const add = (name, description = '', color = '#00d4aa', icon = '📁') => {
    setProjects(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        name,
        description,
        color,
        icon,
        status: 'active',
        milestones: [],
        notes: '',
        createdAt: new Date().toISOString(),
      },
    ])
  }

  const update = (id, updates) =>
    setProjects(prev => prev.map(p => (p.id === id ? { ...p, ...updates } : p)))

  const remove = (id) => setProjects(prev => prev.filter(p => p.id !== id))

  const addMilestone = (projectId, text, dueDate = null) => {
    setProjects(prev =>
      prev.map(p => {
        if (p.id !== projectId) return p
        return {
          ...p,
          milestones: [
            ...p.milestones,
            { id: Date.now().toString(), text, done: false, dueDate },
          ],
        }
      })
    )
  }

  const toggleMilestone = (projectId, milestoneId) => {
    setProjects(prev =>
      prev.map(p => {
        if (p.id !== projectId) return p
        return {
          ...p,
          milestones: p.milestones.map(m =>
            m.id === milestoneId ? { ...m, done: !m.done } : m
          ),
        }
      })
    )
  }

  const removeMilestone = (projectId, milestoneId) => {
    setProjects(prev =>
      prev.map(p => {
        if (p.id !== projectId) return p
        return { ...p, milestones: p.milestones.filter(m => m.id !== milestoneId) }
      })
    )
  }

  const active = projects.filter(p => p.status === 'active')

  return {
    projects,
    add,
    update,
    remove,
    addMilestone,
    toggleMilestone,
    removeMilestone,
    active,
  }
}
