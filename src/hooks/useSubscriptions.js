import { useLocalStorage } from './useLocalStorage'

const DEFAULT_SUBS = [
  { id: '1', name: 'Spotify', icon: '🎵', amount: 2990, period: 'monthly', color: '#1db954', active: true, url: 'https://spotify.com' },
  { id: '2', name: 'The Athletic', icon: '⚽', amount: 1890, period: 'monthly', color: '#e4002b', active: true, url: 'https://theathletic.com' },
  { id: '3', name: 'Patreon', icon: '🎬', amount: 1400, period: 'monthly', color: '#ff424d', active: true, url: 'https://patreon.com' },
  { id: '4', name: 'Netlify', icon: '🌐', amount: 3500, period: 'monthly', color: '#00ad9f', active: true, url: 'https://netlify.com' },
  { id: '5', name: 'mynicco', icon: '💨', amount: 4900, period: 'monthly', color: '#8b5cf6', active: true, url: 'https://mynicco.com' },
  { id: '6', name: 'GrowIt (Apple)', icon: '🌱', amount: 5600, period: 'yearly', color: '#22c55e', active: true, url: '' },
  { id: '7', name: 'Námslán', icon: '🎓', amount: 25000, period: 'monthly', color: '#f97316', active: true, url: '' },
]

export function useSubscriptions() {
  const [subs, setSubs] = useLocalStorage('addi_subs', DEFAULT_SUBS)

  const add = (name, icon, amount, period, color = '#00d4aa', url = '') => {
    setSubs(prev => [...prev, {
      id: Date.now().toString(),
      name, icon, amount: Number(amount), period, color, active: true, url,
    }])
  }

  const remove = (id) => setSubs(prev => prev.filter(s => s.id !== id))

  const toggle = (id) => setSubs(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s))

  const update = (id, updates) => setSubs(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s))

  const monthlyTotal = subs
    .filter(s => s.active)
    .reduce((sum, s) => sum + (s.period === 'yearly' ? Math.round(s.amount / 12) : s.amount), 0)

  const yearlyTotal = subs
    .filter(s => s.active)
    .reduce((sum, s) => sum + (s.period === 'yearly' ? s.amount : s.amount * 12), 0)

  return { subs, add, remove, toggle, update, monthlyTotal, yearlyTotal }
}
