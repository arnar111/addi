import { useLocalStorage } from './useLocalStorage'

const DEFAULT_PROJECTS = [
  {
    id: 'takkarena',
    name: 'Takkarena',
    description: 'Fantasy íþróttaapp fyrir Íslendinga',
    status: 'active',
    netlify: 'https://takkmvp.netlify.app',
    github: 'https://github.com/arnar111/takkarena-mvp',
    color: '#00d4aa',
    icon: '⚽',
    notes: '',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'spira',
    name: 'Spira',
    description: 'Piparræktun og gróðurskráning',
    status: 'active',
    netlify: 'https://spiran.netlify.app',
    github: 'https://github.com/arnar111/spira',
    color: '#22c55e',
    icon: '🌶️',
    notes: '',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'lendo',
    name: 'Lendó',
    description: 'P2P leigumarkaður á Íslandi',
    status: 'active',
    netlify: 'https://lendoapp.netlify.app',
    github: 'https://github.com/arnar111/lendo',
    color: '#f97316',
    icon: '🏠',
    notes: '',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'eign',
    name: 'Eign',
    description: 'Fasteigna- og eignastýring',
    status: 'building',
    netlify: '',
    github: 'https://github.com/arnar111/Eign',
    color: '#3b82f6',
    icon: '🏦',
    notes: '',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'claudecodecourse',
    name: 'Claude Code Course',
    description: 'Íslenskt námskeið í Claude Code',
    status: 'active',
    netlify: 'https://claudenamskeid.netlify.app',
    github: 'https://github.com/arnar111/claudecodecourse',
    color: '#8b5cf6',
    icon: '🤖',
    notes: '',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'draumakaup',
    name: 'Draumakaup',
    description: 'Manchester United millifærsluapp',
    status: 'paused',
    netlify: 'https://draumakaup.netlify.app',
    github: 'https://github.com/arnar111/draumakaup',
    color: '#ef4444',
    icon: '👔',
    notes: '',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'addi',
    name: 'Addi',
    description: 'Persónulegt daglegt OS',
    status: 'active',
    netlify: 'https://addidashboard.netlify.app',
    github: 'https://github.com/arnar111/addi',
    color: '#e2e8f0',
    icon: '⚡',
    notes: '',
    updatedAt: new Date().toISOString(),
  },
]

export const STATUS_CONFIG = {
  active:   { label: 'Virkt',     color: '#22c55e', bg: 'rgba(34,197,94,0.12)' },
  building: { label: 'Í smíðum', color: '#f97316', bg: 'rgba(249,115,22,0.12)' },
  paused:   { label: 'Í bið',    color: '#64748b', bg: 'rgba(100,116,139,0.12)' },
  idea:     { label: 'Hugmynd',  color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)' },
}

export function useProjects() {
  const [projects, setProjects] = useLocalStorage('addi_projects', DEFAULT_PROJECTS)

  const update = (id, patch) => {
    setProjects(prev => prev.map(p =>
      p.id === id ? { ...p, ...patch, updatedAt: new Date().toISOString() } : p
    ))
  }

  const add = (project) => {
    setProjects(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        name: '',
        description: '',
        status: 'idea',
        netlify: '',
        github: '',
        color: '#00d4aa',
        icon: '🚀',
        notes: '',
        updatedAt: new Date().toISOString(),
        ...project,
      },
    ])
  }

  const remove = (id) => {
    setProjects(prev => prev.filter(p => p.id !== id))
  }

  const activeCount = projects.filter(p => p.status === 'active').length

  return { projects, update, add, remove, activeCount }
}
