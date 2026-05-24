import { useLocalStorage } from './useLocalStorage'

export const SUB_STATUSES = {
  active:    { label: 'Virk',                 color: '#22c55e' },
  paused:    { label: 'Í bið',                color: '#f97316' },
  failed:    { label: 'Greiðsla mistókst',    color: '#ef4444' },
  cancelled: { label: 'Afskráð',              color: '#64748b' },
}

export const SUB_CATEGORIES = [
  { id: 'tech',          label: 'Tækni',        icon: '💻' },
  { id: 'entertainment', label: 'Afþreying',    icon: '🎬' },
  { id: 'sports',        label: 'Íþróttir',     icon: '⚽' },
  { id: 'education',     label: 'Menntun',      icon: '📚' },
  { id: 'health',        label: 'Heilsa',       icon: '🥦' },
  { id: 'productivity',  label: 'Framleiðni',   icon: '⚡' },
  { id: 'other',         label: 'Annað',        icon: '📦' },
]

const DEFAULT_SUBS = [
  {
    id: 's1', name: 'Claude Pro', icon: '🤖', amount: 2800, cycle: 'monthly',
    status: 'active', nextBilling: '2026-06-17', category: 'tech', color: '#f97316',
    note: 'Anthropic Ireland',
  },
  {
    id: 's2', name: 'Netlify', icon: '🌐', amount: 2800, cycle: 'monthly',
    status: 'failed', nextBilling: '2026-06-23', category: 'tech', color: '#00d4aa',
    note: 'Greiðslukort útrunnið — uppfæra',
  },
  {
    id: 's3', name: 'Netflix', icon: '🎬', amount: 2400, cycle: 'monthly',
    status: 'failed', nextBilling: '2026-05-30', category: 'entertainment', color: '#e50914',
    note: 'Greiðslumál — uppfæra kort',
  },
  {
    id: 's4', name: 'Paramount+', icon: '⭐', amount: 1200, cycle: 'monthly',
    status: 'paused', nextBilling: '2026-06-01', category: 'entertainment', color: '#0284c7',
    note: 'Í bið á Prime Video',
  },
  {
    id: 's5', name: 'Audible', icon: '🎧', amount: 2100, cycle: 'monthly',
    status: 'active', nextBilling: '2026-06-10', category: 'education', color: '#f59e0b',
  },
  {
    id: 's6', name: 'Moonshot AI', icon: '🌙', amount: 2800, cycle: 'monthly',
    status: 'active', nextBilling: '2026-06-18', category: 'tech', color: '#8b5cf6',
  },
  {
    id: 's7', name: 'The Athletic', icon: '⚽', amount: 1400, cycle: 'monthly',
    status: 'active', nextBilling: '2026-06-05', category: 'sports', color: '#00d4aa',
  },
  {
    id: 's8', name: 'Chegg', icon: '📚', amount: 2100, cycle: 'monthly',
    status: 'failed', nextBilling: '2026-05-25', category: 'education', color: '#f97316',
    note: 'Greiðsla mistókst',
  },
  {
    id: 's9', name: 'Driver Booster', icon: '💻', amount: 5600, cycle: 'annual',
    status: 'failed', nextBilling: '2026-05-16', category: 'tech', color: '#3b82f6',
    note: 'Útrunnið — endurnýja eða hætta',
  },
  {
    id: 's10', name: 'GOLF+', icon: '⛳', amount: 1200, cycle: 'monthly',
    status: 'active', nextBilling: '2026-06-20', category: 'sports', color: '#22c55e',
  },
]

export function useSubscriptions() {
  const [subs, setSubs] = useLocalStorage('addi_subs', DEFAULT_SUBS)

  const add = (sub) => {
    setSubs(prev => [...prev, { ...sub, id: Date.now().toString() }])
  }

  const update = (id, updates) => {
    setSubs(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s))
  }

  const remove = (id) => {
    setSubs(prev => prev.filter(s => s.id !== id))
  }

  const active = subs.filter(s => s.status !== 'cancelled')
  const failed = subs.filter(s => s.status === 'failed')

  const monthlyTotal = active
    .filter(s => s.status === 'active' || s.status === 'paused')
    .reduce((sum, s) => {
      return sum + (s.cycle === 'annual' ? Math.round(s.amount / 12) : s.amount)
    }, 0)

  const annualTotal = active
    .filter(s => s.status === 'active' || s.status === 'paused')
    .reduce((sum, s) => {
      return sum + (s.cycle === 'annual' ? s.amount : s.amount * 12)
    }, 0)

  const upcomingSoon = active.filter(s => {
    if (!s.nextBilling) return false
    const days = Math.ceil((new Date(s.nextBilling) - new Date()) / (1000 * 60 * 60 * 24))
    return days >= 0 && days <= 7 && s.status !== 'failed'
  })

  return {
    subs, active, failed, monthlyTotal, annualTotal, upcomingSoon,
    add, update, remove,
  }
}
