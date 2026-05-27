import { useLocalStorage } from './useLocalStorage'

export const SUBSCRIPTION_CATEGORIES = [
  { id: 'streaming', label: 'Streymi', icon: '🎬', color: '#e50914' },
  { id: 'music', label: 'Tónlist', icon: '🎵', color: '#1db954' },
  { id: 'food', label: 'Matur/Heilsa', icon: '🥤', color: '#00d4aa' },
  { id: 'gaming', label: 'Leikir', icon: '🎮', color: '#107c10' },
  { id: 'learning', label: 'Nám', icon: '📚', color: '#8b5cf6' },
  { id: 'work', label: 'Vinna/Tækni', icon: '💻', color: '#3b82f6' },
  { id: 'news', label: 'Fréttir', icon: '📰', color: '#f97316' },
  { id: 'other', label: 'Annað', icon: '💳', color: '#64748b' },
]

const DEFAULT_SUBS = [
  { id: '1', name: 'Spotify', icon: '🎵', category: 'music', amount: 2190, billing: 'monthly', color: '#1db954', active: true, renewDay: 1 },
  { id: '2', name: 'Netflix', icon: '🎬', category: 'streaming', amount: 3490, billing: 'monthly', color: '#e50914', active: true, renewDay: 15 },
  { id: '3', name: 'Huel', icon: '🥤', category: 'food', amount: 14990, billing: 'monthly', color: '#00d4aa', active: true, renewDay: 5 },
  { id: '4', name: 'Audible', icon: '🎧', category: 'learning', amount: 2390, billing: 'monthly', color: '#f97316', active: true, renewDay: 26 },
  { id: '5', name: 'Duolingo Plus', icon: '🦜', category: 'learning', amount: 1990, billing: 'monthly', color: '#58cc02', active: true, renewDay: 27 },
  { id: '6', name: 'Xbox Game Pass', icon: '🎮', category: 'gaming', amount: 2390, billing: 'monthly', color: '#107c10', active: true, renewDay: 10 },
  { id: '7', name: 'ElevenLabs', icon: '🔊', category: 'work', amount: 2990, billing: 'monthly', color: '#8b5cf6', active: true, renewDay: 16 },
  { id: '8', name: 'The Athletic', icon: '⚽', category: 'news', amount: 1490, billing: 'monthly', color: '#3b82f6', active: true, renewDay: 26 },
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

  const activeSubs = subs.filter(s => s.active)
  const monthlyTotal = activeSubs.reduce((sum, s) => sum + s.amount, 0)
  const yearlyTotal = monthlyTotal * 12

  // Days until next renewal
  const daysUntilRenewal = (renewDay) => {
    const today = new Date()
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), renewDay)
    if (thisMonth < today) {
      thisMonth.setMonth(thisMonth.getMonth() + 1)
    }
    return Math.ceil((thisMonth - today) / (1000 * 60 * 60 * 24))
  }

  const upcomingRenewals = activeSubs
    .map(s => ({ ...s, daysUntil: daysUntilRenewal(s.renewDay || 1) }))
    .filter(s => s.daysUntil <= 7)
    .sort((a, b) => a.daysUntil - b.daysUntil)

  return { subs, activeSubs, add, remove, toggle, update, monthlyTotal, yearlyTotal, upcomingRenewals, daysUntilRenewal }
}
