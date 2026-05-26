import { useLocalStorage } from './useLocalStorage'

const DEFAULT_SUBS = [
  { id: '1', name: 'Netflix', icon: '🎬', costISK: 1990, cycle: 'monthly', color: '#ef4444', url: 'https://netflix.com', active: true, dueDay: 1 },
  { id: '2', name: 'Spotify', icon: '🎵', costISK: 1590, cycle: 'monthly', color: '#1db954', url: 'https://spotify.com', active: true, dueDay: 15 },
  { id: '3', name: 'indó', icon: '🛒', costISK: 0, cycle: 'monthly', color: '#f97316', url: 'https://indo.is', active: true, dueDay: 1, note: 'BNPL - breytileg greiðsla' },
  { id: '4', name: 'Moonshot AI', icon: '🌙', costISK: 1500, cycle: 'monthly', color: '#8b5cf6', url: 'https://kimi.ai', active: true, dueDay: 26 },
  { id: '5', name: 'The Athletic', icon: '🏟️', costISK: 1200, cycle: 'monthly', color: '#00d4aa', url: 'https://theathletic.com', active: true, dueDay: 10 },
  { id: '6', name: 'Patreon', icon: '🎙️', costISK: 800, cycle: 'monthly', color: '#ff424d', url: 'https://patreon.com', active: true, dueDay: 5 },
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

  const monthlyTotal = subs.filter(s => s.active).reduce((sum, s) => sum + (s.costISK || 0), 0)

  const nextDue = () => {
    const today = new Date().getDate()
    const sorted = subs
      .filter(s => s.active && s.dueDay)
      .map(s => ({
        ...s,
        daysUntil: s.dueDay >= today ? s.dueDay - today : 30 - today + s.dueDay,
      }))
      .sort((a, b) => a.daysUntil - b.daysUntil)
    return sorted[0] || null
  }

  return { subs, add, remove, toggle, update, monthlyTotal, nextDue }
}
