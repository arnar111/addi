import { useLocalStorage } from './useLocalStorage'

export const POPULAR_SUBS = [
  { name: 'Spotify', amount: 2490, icon: '🎵', color: '#1db954' },
  { name: 'Netflix', amount: 2590, icon: '🎬', color: '#e50914' },
  { name: 'Prime Video', amount: 1290, icon: '📺', color: '#00a8e0' },
  { name: 'Paramount+', amount: 1790, icon: '🎬', color: '#0064ff' },
  { name: 'The Athletic', amount: 1490, icon: '⚽', color: '#f97316' },
  { name: 'GOLF+', amount: 990, icon: '⛳', color: '#22c55e' },
  { name: 'iCloud+', amount: 490, icon: '☁️', color: '#3b82f6' },
  { name: 'YouTube Premium', amount: 1590, icon: '▶️', color: '#ff0000' },
  { name: 'Disney+', amount: 1990, icon: '✨', color: '#113ccf' },
  { name: 'GitHub Pro', amount: 1200, icon: '💻', color: '#6e5494' },
  { name: 'ChatGPT Plus', amount: 2790, icon: '🤖', color: '#10a37f' },
  { name: 'Adobe CC', amount: 8990, icon: '🎨', color: '#ff0000' },
  { name: 'Headspace', amount: 990, icon: '🧘', color: '#f97316' },
]

const DEFAULTS = [
  { id: '1', name: 'Spotify', icon: '🎵', amount: 2490, color: '#1db954', active: true },
  { id: '2', name: 'Prime Video', icon: '📺', amount: 1290, color: '#00a8e0', active: true },
  { id: '3', name: 'Paramount+', icon: '🎬', amount: 1790, color: '#0064ff', active: true },
  { id: '4', name: 'The Athletic', icon: '⚽', amount: 1490, color: '#f97316', active: true },
  { id: '5', name: 'GOLF+', icon: '⛳', amount: 990, color: '#22c55e', active: true },
  { id: '6', name: 'iCloud+', icon: '☁️', amount: 490, color: '#3b82f6', active: true },
]

export function useSubscriptions() {
  const [subs, setSubs] = useLocalStorage('addi_subscriptions', DEFAULTS)

  const add = ({ name, icon, amount, color } = {}) => {
    setSubs(prev => [...prev, {
      id: Date.now().toString(),
      name: name || 'Ný áskrift',
      icon: icon || '💳',
      amount: Number(amount) || 0,
      color: color || '#64748b',
      active: true,
    }])
  }

  const remove = (id) => setSubs(prev => prev.filter(s => s.id !== id))

  const toggle = (id) => setSubs(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s))
  const toggleActive = toggle

  const update = (id, changes) => setSubs(prev => prev.map(s => s.id === id ? { ...s, ...changes } : s))

  const monthlyTotal = subs.filter(s => s.active).reduce((t, s) => t + s.amount, 0)
  const yearlyTotal = monthlyTotal * 12

  return { subs, add, remove, toggle, toggleActive, update, monthlyTotal, yearlyTotal }
}
