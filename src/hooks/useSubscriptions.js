import { useLocalStorage } from './useLocalStorage'

const DEFAULT_SUBS = [
  { id: '1', name: 'Netflix', icon: '🎬', amount: 2490, cycle: 'monthly', color: '#e50914', active: true },
  { id: '2', name: 'Spotify', icon: '🎵', amount: 1990, cycle: 'monthly', color: '#1db954', active: true },
  { id: '3', name: 'iCloud+ 200GB', icon: '☁️', amount: 399, cycle: 'monthly', color: '#007aff', active: true },
  { id: '4', name: 'Max (HBO)', icon: '📺', amount: 2190, cycle: 'monthly', color: '#741db4', active: false },
  { id: '5', name: 'Disney+', icon: '🏰', amount: 2190, cycle: 'monthly', color: '#0063e5', active: false },
  { id: '6', name: 'YouTube Premium', icon: '▶️', amount: 1990, cycle: 'monthly', color: '#ff0000', active: false },
]

export function useSubscriptions() {
  const [subs, setSubs] = useLocalStorage('addi_subs', DEFAULT_SUBS)

  const add = (sub) => setSubs(prev => [...prev, {
    id: Date.now().toString(),
    active: true,
    cycle: 'monthly',
    color: '#00d4aa',
    ...sub,
  }])
  const remove = (id) => setSubs(prev => prev.filter(s => s.id !== id))
  const toggle = (id) => setSubs(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s))
  const update = (id, updates) => setSubs(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s))

  const monthlyTotal = subs.reduce((sum, s) => {
    if (!s.active) return sum
    return sum + (s.cycle === 'annual' ? Math.round(s.amount / 12) : s.amount)
  }, 0)

  return { subs, add, remove, toggle, update, monthlyTotal, annualTotal: monthlyTotal * 12 }
}
