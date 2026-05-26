import { useLocalStorage } from './useLocalStorage'

const DEFAULT_SUBS = [
  { id: '1', name: 'Netflix', icon: '🎬', color: '#e50914', amount: 2190, billing: 'monthly', active: true, url: 'https://netflix.com' },
  { id: '2', name: 'Spotify', icon: '🎵', color: '#1db954', amount: 1690, billing: 'monthly', active: true, url: 'https://spotify.com' },
  { id: '3', name: 'Wolt Pass', icon: '🛵', color: '#00c2e0', amount: 4490, billing: 'monthly', active: true, url: 'https://wolt.com' },
  { id: '4', name: 'iCloud+', icon: '☁️', color: '#007aff', amount: 890, billing: 'monthly', active: true, url: 'https://icloud.com' },
]

export function useSubscriptions() {
  const [subs, setSubs] = useLocalStorage('addi_subscriptions', DEFAULT_SUBS)

  const add = (sub) => {
    setSubs(prev => [...prev, { ...sub, id: Date.now().toString() }])
  }

  const remove = (id) => {
    setSubs(prev => prev.filter(s => s.id !== id))
  }

  const toggle = (id) => {
    setSubs(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s))
  }

  const update = (id, updates) => {
    setSubs(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s))
  }

  const monthlyTotal = subs.filter(s => s.active).reduce((sum, s) => sum + s.amount, 0)
  const activeSubs = subs.filter(s => s.active)

  return { subs, add, remove, toggle, update, monthlyTotal, activeSubs }
}
