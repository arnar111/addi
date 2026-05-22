import { useLocalStorage } from './useLocalStorage'

const DEFAULTS = [
  {
    id: 'takk',
    name: 'Takk',
    icon: '🎙️',
    color: '#00d4aa',
    desc: 'Debate platform — CEO',
    status: 'active',
    repo: 'arnar111/takkarena-mvp',
    url: 'https://takkmvp.netlify.app',
    notes: '',
  },
  {
    id: 'eign',
    name: 'Eign',
    icon: '🏠',
    color: '#8b5cf6',
    desc: 'Property app',
    status: 'ci-fail',
    repo: 'arnar111/Eign',
    url: null,
    notes: 'CI failing — no jobs run',
  },
  {
    id: 'lendo',
    name: 'Lendó',
    icon: '🪑',
    color: '#f97316',
    desc: 'Party equipment rental',
    status: 'building',
    repo: null,
    url: null,
    notes: '7.000 kr/dag · borð + stólar',
  },
  {
    id: 'spira',
    name: 'Spira',
    icon: '🌶️',
    color: '#ef4444',
    desc: 'Pepper grow manager',
    status: 'active',
    repo: 'arnar111/spira',
    url: 'https://spiran.netlify.app',
    notes: '',
  },
  {
    id: 'draumakaup',
    name: 'Draumakaup',
    icon: '⚽',
    color: '#c8102e',
    desc: 'Man United transfer app',
    status: 'active',
    repo: 'arnar111/draumakaup',
    url: 'https://draumakaup.netlify.app',
    notes: '',
  },
]

export const STATUS = {
  active:   { label: 'Virkt',      color: '#22c55e' },
  building: { label: 'Í smíðum',   color: '#f97316' },
  'ci-fail':{ label: 'CI brotið',  color: '#ef4444' },
  paused:   { label: 'Í bið',      color: '#64748b' },
  done:     { label: 'Lokið',      color: '#00d4aa' },
}

export function useProjects() {
  const [projects, setProjects] = useLocalStorage('addi_projects', DEFAULTS)

  const setStatus = (id, status) =>
    setProjects(prev => prev.map(p => p.id === id ? { ...p, status } : p))

  const setNotes = (id, notes) =>
    setProjects(prev => prev.map(p => p.id === id ? { ...p, notes } : p))

  return { projects, setStatus, setNotes, STATUS }
}
