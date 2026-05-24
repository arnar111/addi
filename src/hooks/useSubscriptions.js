import { useLocalStorage } from './useLocalStorage'

export const DEFAULT_SUBS = [
  { id: 's1', name: 'The Athletic', amount: 2490, cycle: 'monthly', category: 'sport', icon: '📰', active: true },
  { id: 's2', name: 'iCloud+', amount: 990, cycle: 'monthly', category: 'tech', icon: '☁️', active: true },
  { id: 's3', name: 'Huel', amount: 7900, cycle: 'monthly', category: 'health', icon: '🥤', active: true },
  { id: 's4', name: 'Patreon', amount: 1490, cycle: 'monthly', category: 'entertainment', icon: '🎬', active: true },
  { id: 's5', name: 'Netlify', amount: 3200, cycle: 'monthly', category: 'tech', icon: '🚀', active: true },
  { id: 's6', name: 'Nicco', amount: 2900, cycle: 'monthly', category: 'other', icon: '📦', active: true },
  { id: 's7', name: 'GrowIt', amount: 1100, cycle: 'monthly', category: 'health', icon: '🌱', active: true },
  { id: 's8', name: 'SeatGeek', amount: 0, cycle: 'monthly', category: 'entertainment', icon: '🎟️', active: false },
]

const SUB_CATEGORIES = {
  sport: { label: 'Íþróttir', color: '#f97316' },
  tech: { label: 'Tækni', color: '#3b82f6' },
  health: { label: 'Heilsa', color: '#22c55e' },
  entertainment: { label: 'Afþreying', color: '#ec4899' },
  other: { label: 'Annað', color: '#64748b' },
}

export function useSubscriptions() {
  const [subs, setSubs] = useLocalStorage('addi_subscriptions', DEFAULT_SUBS)

  const add = (sub) => setSubs(prev => [...prev, { ...sub, id: Date.now().toString() }])
  const remove = (id) => setSubs(prev => prev.filter(s => s.id !== id))
  const toggle = (id) => setSubs(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s))
  const update = (id, changes) => setSubs(prev => prev.map(s => s.id === id ? { ...s, ...changes } : s))

  const monthlyTotal = () =>
    subs.filter(s => s.active).reduce((t, s) => {
      if (s.cycle === 'monthly') return t + s.amount
      if (s.cycle === 'yearly') return t + Math.round(s.amount / 12)
      return t
    }, 0)

  const yearlyTotal = () => monthlyTotal() * 12

  return { subs, add, remove, toggle, update, monthlyTotal, yearlyTotal, SUB_CATEGORIES }
}
