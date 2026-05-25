import { useLocalStorage } from './useLocalStorage'

const DEFAULT_SUBS = [
  { id: '1', name: 'The Athletic', icon: '⚽', color: '#f97316', amount: 1400, cycle: 'monthly', url: 'https://theathletic.com', active: true, category: 'sport' },
  { id: '2', name: 'iCloud+', icon: '☁️', color: '#3b82f6', amount: 420, cycle: 'monthly', url: 'https://icloud.com', active: true, category: 'tech' },
  { id: '3', name: 'Patreon · Popcorn in Bed', icon: '🎬', color: '#ec4899', amount: 1000, cycle: 'monthly', url: 'https://patreon.com', active: true, category: 'entertainment' },
  { id: '4', name: 'GrowIt', icon: '🌱', color: '#22c55e', amount: 467, cycle: 'monthly', url: 'https://growit.com', active: true, category: 'health' },
  { id: '5', name: 'Nicco', icon: '⚡', color: '#8b5cf6', amount: 4500, cycle: 'monthly', url: 'https://mynicco.com', active: true, category: 'other' },
]

export function useSubscriptions() {
  const [subs, setSubs] = useLocalStorage('addi_subs', DEFAULT_SUBS)

  const add = (sub) => {
    setSubs(prev => [...prev, { ...sub, id: Date.now().toString() }])
  }

  const remove = (id) => setSubs(prev => prev.filter(s => s.id !== id))

  const toggle = (id) => setSubs(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s))

  const update = (id, data) => setSubs(prev => prev.map(s => s.id === id ? { ...s, ...data } : s))

  const activeSubs = subs.filter(s => s.active)

  const monthlyTotal = activeSubs.reduce((sum, s) => {
    if (s.cycle === 'yearly') return sum + Math.round(s.amount / 12)
    if (s.cycle === 'weekly') return sum + s.amount * 4
    return sum + s.amount
  }, 0)

  const yearlyTotal = activeSubs.reduce((sum, s) => {
    if (s.cycle === 'yearly') return sum + s.amount
    if (s.cycle === 'weekly') return sum + s.amount * 52
    return sum + s.amount * 12
  }, 0)

  return { subs, activeSubs, add, remove, toggle, update, monthlyTotal, yearlyTotal }
}
